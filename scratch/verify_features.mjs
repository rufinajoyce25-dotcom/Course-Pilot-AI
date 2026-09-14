// scratch/verify_features.mjs
const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("==================================================");
  console.log("   COURSEPILOT AI - VERIFICATION SUITE           ");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // 1. Check Active Student Profile (Switch to default Joyce Chen first)
    console.log("\n--- Test 1: Active Student Profile & Avatar ---");
    await fetch(`${BASE_URL}/api/v1/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "switch_active", studentId: "STU-2024-8841" })
    });
    const stuRes = await fetch(`${BASE_URL}/api/v1/students/active`);
    assert(stuRes.ok, "GET /api/v1/students/active returns 200 OK");
    const student = await stuRes.json();
    assert(student.id === "STU-2024-8841", `Active student ID is ${student.id}`);
    assert(student.name.includes("Joyce"), `Active student name contains Joyce: ${student.name}`);
    assert(student.avatar === "" || typeof student.avatar === "string", "Student avatar is string (supports empty string for initials badge)");
    assert(Array.isArray(student.currentEnrollments) && student.currentEnrollments.length >= 2, `Current enrollments: ${student.currentEnrollments?.join(", ")}`);

    // 2. Check Learning API & Video Curricula
    console.log("\n--- Test 2: Course Curricula & Videos ---");
    const learnRes = await fetch(`${BASE_URL}/api/v1/learning?studentId=${student.id}`);
    assert(learnRes.ok, "GET /api/v1/learning returns 200 OK");
    const learnData = await learnRes.json();
    assert(Array.isArray(learnData.enrolledCourses) && learnData.enrolledCourses.length >= 2, `Enrolled courses list returned (${learnData.enrolledCourses.length} courses)`);
    
    // Check CS401 Curriculum
    const cs401Res = await fetch(`${BASE_URL}/api/v1/learning?courseCode=CS401`);
    assert(cs401Res.ok, "GET /api/v1/learning?courseCode=CS401 returns 200 OK");
    const cs401Data = await cs401Res.json();
    assert(cs401Data.curriculum && cs401Data.curriculum.videos.length >= 5, `CS401 has ${cs401Data.curriculum?.videos?.length} curated video lessons (meets 5-10 videos requirement)`);
    
    const sampleVideo = cs401Data.curriculum.videos[0];
    assert(sampleVideo.youtubeId && sampleVideo.youtubeEmbedUrl, `Video 1 has valid YouTube ID (${sampleVideo.youtubeId}) and embed URL`);
    assert(sampleVideo.thumbnail && sampleVideo.thumbnail.includes("youtube.com"), "Video has high-res YouTube thumbnail");

    // 3. Test Toggling Video Progress
    console.log("\n--- Test 3: Video Watch Progress Tracking ---");
    const toggleRes = await fetch(`${BASE_URL}/api/v1/learning`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "TOGGLE_VIDEO",
        studentId: student.id,
        courseCode: "CS401",
        videoId: sampleVideo.id
      })
    });
    assert(toggleRes.ok, "POST /api/v1/learning TOGGLE_VIDEO returns 200 OK");
    const toggleData = await toggleRes.json();
    assert(toggleData.progress && toggleData.progress.courseCode === "CS401", "Updated progress returned for CS401");
    assert(typeof toggleData.progress.progressPercentage === "number", `Progress percentage updated to ${toggleData.progress.progressPercentage}%`);

    // 4. Test 100% Completion & Certificate Issuance
    console.log("\n--- Test 4: 100% Completion & Certificate Issuance ---");
    // Ensure all videos for CS401 are toggled on
    for (const vid of cs401Data.curriculum.videos) {
      const curProgRes = await fetch(`${BASE_URL}/api/v1/learning?studentId=${student.id}&courseCode=CS401`);
      const curProg = await curProgRes.json();
      if (!curProg.progress?.completedVideoIds.includes(vid.id)) {
        await fetch(`${BASE_URL}/api/v1/learning`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "TOGGLE_VIDEO",
            studentId: student.id,
            courseCode: "CS401",
            videoId: vid.id
          })
        });
      }
    }

    // Check certificate issuance
    const certCheckRes = await fetch(`${BASE_URL}/api/v1/learning?studentId=${student.id}&courseCode=CS401`);
    const certCheckData = await certCheckRes.json();
    assert(certCheckData.progress && certCheckData.progress.progressPercentage === 100, "CS401 progress reached 100%");
    assert(certCheckData.certificate !== null, "Official Certificate of Completion automatically issued at 100%");
    assert(certCheckData.certificate?.verificationCode?.startsWith("VERIFY-"), `Certificate has tamper-evident verification code: ${certCheckData.certificate?.verificationCode}`);

    // 5. Test Profile Photo Update & Fallback Initials
    console.log("\n--- Test 5: Profile Photo Management & Library ---");
    const testAvatarDataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    const updatePhotoRes = await fetch(`${BASE_URL}/api/v1/students/active`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatar: testAvatarDataUrl })
    });
    assert(updatePhotoRes.ok, "PATCH /api/v1/students/active updates avatar");
    const photoUpdated = await updatePhotoRes.json();
    assert(photoUpdated.student.avatar === testAvatarDataUrl, "Student avatar updated to custom image");

    // Remove photo test (setting to "")
    const removePhotoRes = await fetch(`${BASE_URL}/api/v1/students/active`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatar: "" })
    });
    assert(removePhotoRes.ok, "PATCH /api/v1/students/active supports removing avatar");
    const photoRemoved = await removePhotoRes.json();
    assert(photoRemoved.student.avatar === "", "Student avatar cleared for dynamic initials badge fallback");

    // 6. Test Multi-Turn Real-Time Agent Reasoning
    console.log("\n--- Test 6: Multi-Turn AI Agent Reasoning ---");
    const agentQueryRes = await fetch(`${BASE_URL}/api/agent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Please register me for CS320",
        studentId: student.id
      })
    });
    assert(agentQueryRes.ok, "POST /api/agent returns 200 OK");
    const agentData = await agentQueryRes.json();
    assert(agentData.message && agentData.steps?.length > 0, "Agent returned structured reasoning steps and explanation");
    assert(agentData.requiresConfirmation === true, "Agent flagged confirmation required for course registration");

    console.log("\n==================================================");
    console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
    console.log("==================================================");

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error("Test execution error:", err);
    process.exit(1);
  }
}

runTests();

