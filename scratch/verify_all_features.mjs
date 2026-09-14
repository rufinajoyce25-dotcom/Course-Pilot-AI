// Verification script for all requested features

const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("=== COURSE PILOT AI COMPREHENSIVE VERIFICATION ===");
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  // Test 1: Fetch active student
  console.log("\n[TEST 1] Fetching active student profile...");
  const stuRes = await fetch(`${BASE_URL}/api/v1/students/STU-2024-8841`);
  const stuData = await stuRes.json();
  assert(stuData.id === "STU-2024-8841", "Fetched active student STU-2024-8841");
  const student = stuData;

  // Test 2: Dynamic Course Registration for CS320 (Cloud Computing)
  console.log("\n[TEST 2] Testing Dynamic Course Registration for CS320 (Cloud Computing)...");
  await fetch(`${BASE_URL}/api/registration`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "drop", studentId: "STU-2024-8841", courseCode: "CS320" })
  }).catch(() => {});

  const regRes = await fetch(`${BASE_URL}/api/registration`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "confirm",
      studentId: "STU-2024-8841",
      courseCode: "CS320",
      sectionId: "Section A"
    })
  });
  const regData = await regRes.json();
  assert(regRes.ok, "Registration API returned 200 OK");
  assert(regData.courseCode === "CS320", `Registration returned courseCode CS320 (Got: ${regData.courseCode})`);
  assert(regData.courseName && regData.courseName.toLowerCase().includes("cloud"), `Registration returned accurate courseName '${regData.courseName}' (NOT CS401 Machine Learning)`);
  assert(regData.transactionId && regData.transactionId.startsWith("TXN-"), `Generated valid transaction ID: ${regData.transactionId}`);

  // Test 3: Strict Single Enrollment Rule - Attempt duplicate registration for CS320
  console.log("\n[TEST 3] Testing Strict Single Enrollment Guard (One course, one enrollment per student)...");
  const dupRes = await fetch(`${BASE_URL}/api/registration`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "confirm",
      studentId: "STU-2024-8841",
      courseCode: "CS320",
      sectionId: "Section A"
    })
  });
  const dupData = await dupRes.json();
  assert(dupRes.status === 409, `Duplicate registration rejected with HTTP 409 Conflict (Got: ${dupRes.status})`);
  assert(dupData.error && dupData.error.includes("already enrolled"), `Helpful error message returned: "${dupData.error}"`);

  // Test 4: AI Agent Chat Orchestrator duplicate enrollment response
  console.log("\n[TEST 4] Testing AI Agent natural language registration intent for enrolled course...");
  const agentRes = await fetch(`${BASE_URL}/api/agent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Can I register for CS320 Cloud Computing?",
      studentId: "STU-2024-8841"
    })
  });
  const agentData = await agentRes.json();
  assert(agentRes.ok, "AI Agent API returned 200 OK");
  assert(agentData.intent === "CHECK_ELIGIBILITY" || agentData.intent === "ALREADY_ENROLLED", `Intent classified: ${agentData.intent}`);
  assert(agentData.message.includes("already enrolled") || agentData.message.includes("lifelong access"), "Agent informs student of existing lifelong access");

  // Test 5: Learning Curriculum API & Anti-Cheat Video Verification
  console.log("\n[TEST 5] Testing Anti-Cheat Video Playback Verification for CS305...");
  const curRes = await fetch(`${BASE_URL}/api/v1/learning?studentId=STU-2024-8841&courseCode=CS305`);
  const curData = await curRes.json();
  assert(curData.success && curData.curriculum, "Curriculum retrieved for CS305");
  assert(curData.curriculum.videos.length >= 5, `Curriculum has ${curData.curriculum.videos.length} videos (5-10 videos per course)`);
  assert(curData.curriculum.labs && curData.curriculum.labs.length === 3, "Curriculum contains 3 hands-on practical labs");
  assert(curData.curriculum.quiz && curData.curriculum.quiz.totalMarks === 20, "Curriculum contains 20-mark final assessment quiz");
  assert(curData.curriculum.quiz.questions.length === 20, `Quiz has exactly 20 comprehensive questions (Got: ${curData.curriculum.quiz.questions.length})`);

  const video1 = curData.curriculum.videos[0];

  // Attempt partial watch (e.g. only 30 seconds of 600)
  const cheatWatchRes = await fetch(`${BASE_URL}/api/v1/learning`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "VERIFY_VIDEO_WATCH",
      studentId: "STU-2024-8841",
      courseCode: "CS305",
      videoId: video1.id,
      watchedSeconds: 30,
      totalDurationSeconds: 600
    })
  });
  const cheatData = await cheatWatchRes.json();
  assert(cheatData.verified === false, "Partial video watch (30s / 600s) correctly REJECTED from completion credit");

  // Legitimate full watch till the last second (600s of 600s)
  const fullWatchRes = await fetch(`${BASE_URL}/api/v1/learning`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "VERIFY_VIDEO_WATCH",
      studentId: "STU-2024-8841",
      courseCode: "CS305",
      videoId: video1.id,
      watchedSeconds: 600,
      totalDurationSeconds: 600
    })
  });
  const fullWatchData = await fullWatchRes.json();
  assert(fullWatchData.verified === true, "Full video watch till end VERIFIED and marked complete");
  assert(fullWatchData.progress.completedVideoIds.includes(video1.id), `Video ${video1.id} recorded in completedVideoIds`);

  // Complete all remaining videos for CS305 to test certificate unlock
  console.log("\n[TEST 6] Completing all video lessons for CS305...");
  for (const v of curData.curriculum.videos) {
    await fetch(`${BASE_URL}/api/v1/learning`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "VERIFY_VIDEO_WATCH",
        studentId: "STU-2024-8841",
        courseCode: "CS305",
        videoId: v.id,
        watchedSeconds: 600,
        totalDurationSeconds: 600
      })
    });
  }

  // Test 7: Hands-On Labs Validation (Blank / pass rejected, real code accepted)
  console.log("\n[TEST 7] Testing Hands-On Lab validation (reject empty, accept implemented)...");
  const lab1 = curData.curriculum.labs[0];
  
  // 7a. Submit unmodified / pass code -> Should be REJECTED
  const badLabRes = await fetch(`${BASE_URL}/api/v1/learning`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "SUBMIT_LAB",
      studentId: "STU-2024-8841",
      courseCode: "CS305",
      labId: lab1.id,
      code: "def solution():\n    pass\n"
    })
  });
  assert(badLabRes.status === 400, "Unimplemented/pass lab code correctly REJECTED with 400 Bad Request");
  const badLabData = await badLabRes.json();
  assert(badLabData.success === false, "Server flagged lab success = false for placeholder code");

  // 7b. Submit genuine implementation code -> Should SUCCEED
  const goodLabRes = await fetch(`${BASE_URL}/api/v1/learning`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "SUBMIT_LAB",
      studentId: "STU-2024-8841",
      courseCode: "CS305",
      labId: lab1.id,
      code: "SELECT s.name, s.score, DENSE_RANK() OVER (PARTITION BY s.department_id ORDER BY s.score DESC) as rank FROM students s;"
    })
  });
  const goodLabData = await goodLabRes.json();
  assert(goodLabRes.ok && goodLabData.progress.completedLabIds.includes(lab1.id), `Lab ${lab1.id} successfully accepted and verified with real code`);

  // Complete remaining 2 labs with custom code
  for (const l of curData.curriculum.labs.slice(1)) {
    await fetch(`${BASE_URL}/api/v1/learning`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "SUBMIT_LAB",
        studentId: "STU-2024-8841",
        courseCode: "CS305",
        labId: l.id,
        code: "CREATE INDEX idx_tenant_status ON accounts(tenant_id, status, created_at DESC);"
      })
    });
  }

  // Test 8: Final Assessment Quiz - 20 Questions, Attempt 1 Failing (< 12 marks)
  console.log("\n[TEST 8] Testing Final Assessment Quiz with score < 12 marks (Should FAIL & allow reattempt)...");
  const failingAnswers = {};
  curData.curriculum.quiz.questions.forEach((q) => {
    failingAnswers[q.id] = (q.correctAnswerIndex + 1) % 4; // All wrong
  });

  const failQuizRes = await fetch(`${BASE_URL}/api/v1/learning`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "SUBMIT_QUIZ",
      studentId: "STU-2024-8841",
      courseCode: "CS305",
      answers: failingAnswers
    })
  });
  const failQuizData = await failQuizRes.json();
  assert(failQuizData.passed === false, `Failing quiz correctly marked passed=false (Score: ${failQuizData.score}/20)`);
  assert(failQuizData.certificateIssued === false, "No certificate issued when quiz score < 12 marks");
  assert(failQuizData.attemptsUsed === 1, "Attempt 1 recorded");
  assert(failQuizData.canReattempt === true, "Reattempt permitted (attempts < 3)");

  // Test 9: Final Assessment Quiz - Passing score (>= 12 marks on Attempt 2) -> Unlocks Certificate!
  console.log("\n[TEST 9] Testing Final Assessment Quiz with score >= 12 marks (Should PASS on Attempt 2 & Issue Certificate)...");
  const passingAnswers = {};
  curData.curriculum.quiz.questions.forEach((q) => {
    passingAnswers[q.id] = q.correctAnswerIndex; // 20/20 correct = 20 marks
  });

  const passQuizRes = await fetch(`${BASE_URL}/api/v1/learning`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "SUBMIT_QUIZ",
      studentId: "STU-2024-8841",
      courseCode: "CS305",
      answers: passingAnswers
    })
  });
  const passQuizData = await passQuizRes.json();
  assert(passQuizData.passed === true, `Passing quiz correctly marked passed=true (Score: ${passQuizData.score}/20)`);
  assert(passQuizData.score >= 12, `Quiz score satisfies passing threshold (Score: ${passQuizData.score} >= 12)`);
  assert(passQuizData.attemptsUsed === 2, `Recorded as Attempt 2 of 3 (Got: ${passQuizData.attemptsUsed})`);
  assert(passQuizData.certificateIssued === true, "Certificate successfully issued upon 100% videos + labs + quiz passed!");
  assert(passQuizData.certificate && passQuizData.certificate.certificateId, `Certificate generated with ID: ${passQuizData.certificate?.certificateId}`);
  assert(passQuizData.certificate.courseCode === "CS305", `Certificate accurately generated for CS305`);
  assert(passQuizData.certificate.quizScore === 20, `Certificate records quiz score of 20/20 Marks`);

  console.log("\n==================================================");
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error("Test error:", e);
  process.exit(1);
});

