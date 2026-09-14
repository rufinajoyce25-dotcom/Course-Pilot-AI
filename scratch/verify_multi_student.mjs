// scratch/verify_multi_student.mjs
const BASE_URL = "http://localhost:3000";

async function runMultiStudentTests() {
  console.log("==================================================");
  console.log("   COURSEPILOT AI - MULTI-STUDENT VERIFICATION   ");
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
    // 1. Directory Listing & Pre-existing Profiles
    console.log("\n--- Test 1: University Directory of Student Profiles ---");
    const dirRes = await fetch(`${BASE_URL}/api/v1/students`);
    assert(dirRes.ok, "GET /api/v1/students returns 200 OK");
    const dirData = await dirRes.json();
    assert(Array.isArray(dirData.students) && dirData.students.length >= 3, `Found ${dirData.students?.length} registered students in SIS`);
    
    // Verify each student has their own profile data & enrollments
    for (const stu of dirData.students) {
      console.log(`Checking profile: ${stu.name} (${stu.id}) - ${stu.program}`);
      assert(stu.id && stu.name && stu.program, `Student ${stu.name} has complete profile`);
      assert(Array.isArray(stu.currentEnrollments) && stu.currentEnrollments.length > 0, `${stu.name} has enrolled courses: ${stu.currentEnrollments.join(", ")}`);
      
      // Verify learning endpoint works for this student
      const learnRes = await fetch(`${BASE_URL}/api/v1/learning?studentId=${stu.id}`);
      assert(learnRes.ok, `GET /api/v1/learning?studentId=${stu.id} returns 200 OK`);
      const learnData = await learnRes.json();
      assert(Array.isArray(learnData.enrolledCourses) && learnData.enrolledCourses.length > 0, `${stu.name} has learning progress initialized for all enrolled courses`);
    }

    // 2. Create New Student Profile
    console.log("\n--- Test 2: Create New Student Profile ---");
    const testId = Math.floor(1000 + Math.random() * 9000);
    const testStudentName = `Alex Thorne ${testId}`;
    const testStudentId = `STU-2026-${testId}`;

    const newStudentPayload = {
      action: "create_student",
      id: testStudentId,
      name: testStudentName,
      program: "Data Science & Analytics",
      department: "School of Computing & Data Science",
      semester: 3,
      cgpa: 8.92,
      careerGoal: "Data Scientist & AI Researcher",
      avatar: "", // Initials badge fallback
      completedCourses: ["CS101", "CS102", "MATH201", "MATH202"],
      currentEnrollments: ["CS401", "CS350"]
    };

    const createRes = await fetch(`${BASE_URL}/api/v1/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStudentPayload)
    });

    assert(createRes.status === 201, `POST /api/v1/students (create_student) returned 201 Created (got ${createRes.status})`);
    const createData = await createRes.json();
    assert(createData.student && createData.student.name === testStudentName, `New student '${testStudentName}' successfully registered`);
    assert(createData.student.id === testStudentId, `Student ID ${testStudentId} verified`);
    assert(createData.student.currentEnrollments.includes("CS401") && createData.student.currentEnrollments.includes("CS350"), "Starter enrollments assigned (CS401, CS350)");

    // 3. Test "One Student Should Have Only One Student Profile" Rule
    console.log("\n--- Test 3: Enforcing Single Profile Constraint (Duplicate Prevention) ---");
    // Attempt A: Duplicate Name (case-insensitive)
    const dupNameRes = await fetch(`${BASE_URL}/api/v1/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create_student",
        name: testStudentName.toLowerCase(), // lowercase check
        program: "Computer Science",
        semester: 1
      })
    });
    assert(dupNameRes.status === 409, `Duplicate student name was rejected with HTTP 409 Conflict (got ${dupNameRes.status})`);
    const dupNameData = await dupNameRes.json();
    assert(dupNameData.isDuplicate === true, "Server flagged isDuplicate = true");
    assert(dupNameData.error && dupNameData.error.includes(testStudentName), `Rejection reason: ${dupNameData.error}`);

    // Attempt B: Duplicate Student ID
    const dupIdRes = await fetch(`${BASE_URL}/api/v1/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create_student",
        id: testStudentId,
        name: `Different Student Name ${testId}`,
        program: "Computer Science",
        semester: 1
      })
    });
    assert(dupIdRes.status === 409, `Duplicate student ID was rejected with HTTP 409 Conflict (got ${dupIdRes.status})`);

    // 4. Learning Hub & Video Progress for Newly Created Student
    console.log("\n--- Test 4: Learning Hub & Video Progress for New Student ---");
    const newStudentLearnRes = await fetch(`${BASE_URL}/api/v1/learning?studentId=${testStudentId}`);
    assert(newStudentLearnRes.ok, "GET /api/v1/learning for new student returns 200 OK");
    const newStudentLearnData = await newStudentLearnRes.json();
    assert(newStudentLearnData.enrolledCourses.length === 2, `${testStudentName} has 2 active courses with progress: ${newStudentLearnData.enrolledCourses.map(c => c.courseCode).join(", ")}`);
    assert(newStudentLearnData.enrolledCourses[0].progressPercentage === 0, "Progress initially 0%");

    // Toggle video for new student
    const toggleLiamRes = await fetch(`${BASE_URL}/api/v1/learning`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "TOGGLE_VIDEO",
        studentId: testStudentId,
        courseCode: "CS401",
        videoId: "cs401-v1"
      })
    });
    assert(toggleLiamRes.ok, "Toggled video for new student profile returns 200 OK");
    const toggleLiamData = await toggleLiamRes.json();
    assert(toggleLiamData.progress.completedVideoIds.includes("cs401-v1"), "Video marked completed specifically for new student profile");

    // 5. Verify Student Profile Switching
    console.log("\n--- Test 5: Switching Active Student Profile ---");
    const switchRes = await fetch(`${BASE_URL}/api/v1/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "switch_active",
        studentId: "STU-2024-5219" // Maya Patel
      })
    });
    assert(switchRes.ok, "Switched active student to Maya Patel");
    const switchData = await switchRes.json();
    assert(switchData.activeStudent.id === "STU-2024-5219" && switchData.activeStudent.name === "Maya Patel", "Active student is now Maya Patel");

    // Check that active student endpoint returns Maya Patel
    const activeCheckRes = await fetch(`${BASE_URL}/api/v1/students/active`);
    const activeCheckData = await activeCheckRes.json();
    assert(activeCheckData.id === "STU-2024-5219", "GET /api/v1/students/active verifies current active student is Maya Patel");

    console.log("\n==================================================");
    console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
    console.log("==================================================");

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error("Test execution failed:", err);
    process.exit(1);
  }
}

runMultiStudentTests();

