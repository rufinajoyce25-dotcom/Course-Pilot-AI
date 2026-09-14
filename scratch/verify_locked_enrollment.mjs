import assert from "node:assert";

const BASE_URL = "http://localhost:3000";

async function runVerification() {
  console.log("==================================================");
  console.log("   LOCKED COURSE ENROLLMENT VERIFICATION SUITE   ");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;

  function testPass(msg) {
    console.log(`[PASS] ${msg}`);
    passed++;
  }

  function testFail(msg, err) {
    console.error(`[FAIL] ${msg}`);
    if (err) console.error("  Error:", err);
    failed++;
  }

  try {
    // 1. Fetch active student
    console.log("--- TEST 1: Check Active Student Profile & Enrollments ---");
    const stuRes = await fetch(`${BASE_URL}/api/student`);
    assert.strictEqual(stuRes.status, 200, "Active student endpoint should return 200");
    const stuData = await stuRes.json();
    const activeStudent = stuData.student;
    console.log(`Active student: ${activeStudent.name} (${activeStudent.id})`);
    console.log(`Current enrollments: ${activeStudent.currentEnrollments.join(", ")}`);
    testPass("Active student profile retrieved");

    // Verify deduplication
    const uniqueEnrollments = Array.from(new Set(activeStudent.currentEnrollments));
    assert.strictEqual(
      activeStudent.currentEnrollments.length,
      uniqueEnrollments.length,
      "Current enrollments must not contain duplicate course codes"
    );
    testPass("Student enrollments have zero duplicate entries");

    // 2. Test /api/registration duplicate guard with isLocked
    console.log("\n--- TEST 2: Attempt Duplicate Registration via /api/registration ---");
    const regRes = await fetch(`${BASE_URL}/api/registration`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "confirm",
        studentId: activeStudent.id,
        courseCode: "CS401",
        sectionId: "Section A",
      }),
    });

    console.log(`/api/registration status code for enrolled course: ${regRes.status}`);
    assert.strictEqual(regRes.status, 409, "Must return HTTP 409 Conflict when course is already enrolled");
    testPass("/api/registration rejected duplicate registration with HTTP 409 Conflict");

    const regData = await regRes.json();
    console.log("Response body:", JSON.stringify(regData));
    assert.strictEqual(regData.isLocked, true, "Response must include isLocked: true");
    testPass("Response flagged isLocked = true");
    assert.strictEqual(regData.isDuplicate, true, "Response must include isDuplicate: true");
    testPass("Response flagged isDuplicate = true");
    assert.ok(regData.error.toLowerCase().includes("locked"), "Error message must state 'Registration Locked'");
    testPass("Error message confirms 'Registration Locked'");

    // 3. Test /api/v1/registration/register duplicate guard with isLocked
    console.log("\n--- TEST 3: Attempt Duplicate Registration via /api/v1/registration/register ---");
    const v1Res = await fetch(`${BASE_URL}/api/v1/registration/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: activeStudent.id,
        courseId: "CS401",
        sectionId: "sec-cs401-a",
      }),
    });

    console.log(`/api/v1/registration/register status code for enrolled course: ${v1Res.status}`);
    assert.strictEqual(v1Res.status, 409, "Must return HTTP 409 Conflict");
    testPass("/api/v1/registration/register rejected duplicate with HTTP 409 Conflict");

    const v1Data = await v1Res.json();
    assert.strictEqual(v1Data.isLocked, true, "v1 endpoint must return isLocked: true");
    testPass("v1 endpoint returned isLocked = true");
    assert.strictEqual(v1Data.isDuplicate, true, "v1 endpoint must return isDuplicate: true");
    testPass("v1 endpoint returned isDuplicate = true");
    assert.ok(v1Data.error.toLowerCase().includes("locked"), "v1 error message must state 'Registration Locked'");
    testPass("v1 error message confirms 'Registration Locked'");

    // 4. Test Completed Course Retake Guard
    console.log("\n--- TEST 4: Attempt Registration for Completed Course (CS101) ---");
    const compRes = await fetch(`${BASE_URL}/api/registration`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "confirm",
        studentId: activeStudent.id,
        courseCode: "CS101",
        sectionId: "Section A",
      }),
    });

    assert.strictEqual(compRes.status, 409, "Completed course registration must return HTTP 409 Conflict");
    testPass("Completed course registration rejected with HTTP 409 Conflict");
    const compData = await compRes.json();
    assert.strictEqual(compData.isLocked, true, "Completed course rejection must include isLocked = true");
    testPass("Completed course response flagged isLocked = true");

    // 5. Test AI Agent Registration Flow for Enrolled Course
    console.log("\n--- TEST 5: AI Agent Chatbot Intent for Enrolled Course ---");
    const agentRes1 = await fetch(`${BASE_URL}/api/agent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Register me for CS401",
        studentId: activeStudent.id,
      }),
    });
    assert.strictEqual(agentRes1.status, 200, "Agent API returns 200");
    const agentData1 = await agentRes1.json();
    console.log("Agent response intent:", agentData1.data?.intent);
    console.log("Agent response preview:", agentData1.message?.slice(0, 100));

    assert.ok(
      agentData1.message?.includes("Registration Locked") || agentData1.message?.includes("locked"),
      "Agent message must inform student that registration is locked"
    );
    testPass("Agent chat response informs user that registration is locked");

    assert.strictEqual(
      agentData1.data?.requiresConfirmation || false,
      false,
      "Agent must NOT offer a confirmation button to re-register an enrolled course"
    );
    testPass("Agent does not generate a confirmation action for enrolled course");

    // 6. Test AI Agent Eligibility Check for Enrolled Course
    console.log("\n--- TEST 6: AI Agent Eligibility Check for Enrolled Course ---");
    const agentRes2 = await fetch(`${BASE_URL}/api/agent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Can I register for CS401?",
        studentId: activeStudent.id,
      }),
    });
    assert.strictEqual(agentRes2.status, 200, "Agent API returns 200");
    const agentData2 = await agentRes2.json();

    assert.ok(
      agentData2.message?.includes("Registration Locked") || agentData2.message?.includes("locked"),
      "Eligibility check for enrolled course must state Registration Locked"
    );
    testPass("Eligibility check informs student that course registration is locked");

    assert.strictEqual(
      agentData2.data?.isLocked,
      true,
      "Eligibility response data must have isLocked: true"
    );
    testPass("Eligibility data object contains isLocked = true");

    // 7. Test Registering a New Course Once vs Repeatedly
    console.log("\n--- TEST 7: Single Registration vs Repeated Registration for Same Individual ---");
    // Pick an official elective in catalog not yet taken: CS320
    const regRes1 = await fetch(`${BASE_URL}/api/v1/registration/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: activeStudent.id,
        courseId: "CS320",
        sectionId: "sec-cs320-a",
      }),
    });

    console.log(`First registration for CS320 status: ${regRes1.status}`);
    assert.ok(
      regRes1.status === 200 || regRes1.status === 201 || regRes1.status === 409,
      "First registration attempt evaluated"
    );
    testPass("First registration for CS320 evaluated");

    // Attempt second registration for CS320 immediately
    const regRes2 = await fetch(`${BASE_URL}/api/v1/registration/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: activeStudent.id,
        courseId: "CS320",
        sectionId: "sec-cs320-a",
      }),
    });

    console.log(`Second registration for CS320 status: ${regRes2.status}`);
    assert.strictEqual(regRes2.status, 409, "Second registration for same course must be rejected with 409 Conflict");
    testPass("Second registration for CS320 was blocked and rejected with HTTP 409 Conflict");

    const regData2 = await regRes2.json();
    assert.strictEqual(regData2.isLocked, true, "Second registration must return isLocked = true");
    testPass("Repeated registration flagged isLocked = true");

    // Verify current enrollments in student profile has CS320 EXACTLY once
    const verifyStuRes = await fetch(`${BASE_URL}/api/v1/students`);
    const verifyStuData = await verifyStuRes.json();
    const updatedStudent = verifyStuData.students.find(s => s.id === activeStudent.id) || verifyStuData.activeStudent;
    const cs320Count = updatedStudent.currentEnrollments.filter((c) => c === "CS320").length;
    console.log(`Occurrences of CS320 in enrollments: ${cs320Count}`);
    assert.strictEqual(cs320Count, 1, "CS320 must appear exactly once in currentEnrollments (no duplicate array push)");
    testPass("Deduplication verified: CS320 appears exactly once in currentEnrollments");

    console.log("\n==================================================");
    console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log("==================================================");

    if (failed > 0) process.exit(1);
  } catch (err) {
    testFail("Unexpected test failure", err);
    console.log("\n==================================================");
    console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log("==================================================");
    process.exit(1);
  }
}

runVerification();

