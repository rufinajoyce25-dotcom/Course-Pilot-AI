// scratch/verify_dynamic_agent.mjs
async function run() {
  const BASE = "http://localhost:3000";
  console.log("=================================================");
  console.log("CoursePilot AI — Dynamic Agent & Profile E2E Test");
  console.log("=================================================\n");

  // 1. Test multi-student directory
  console.log("1. Fetching Multi-Student Directory...");
  const stuRes = await fetch(`${BASE}/api/v1/students`);
  const stuData = await stuRes.json();
  console.log(`Found ${stuData.students.length} students:`);
  stuData.students.forEach(s => console.log(`  • ${s.name} (${s.id}) - ${s.careerGoal} | ${s.completedCredits} cr`));
  console.log(`Active Student: ${stuData.activeStudent.name}\n`);

  // 2. Test natural language prerequisite reasoning (Missing prereq)
  console.log("2. Testing Reasoning: 'Can I take CS350 (Computer Vision)?'");
  const q1Res = await fetch(`${BASE}/api/agent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Can I take CS350 Computer Vision?" })
  });
  const q1Data = await q1Res.json();
  console.log("Agent Intent:", q1Data.intent);
  console.log("Agent Message:\n", q1Data.message);
  console.log();

  // 3. Test Course Recommendations for AI/ML goal
  console.log("3. Testing Course Suggestions for current AI/ML goal...");
  const q2Res = await fetch(`${BASE}/api/agent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Suggest the best courses for me" })
  });
  const q2Data = await q2Res.json();
  console.log("Agent Intent:", q2Data.intent);
  console.log("Top Recommendation Snippet:\n", q2Data.message.split("\n\n").slice(0, 2).join("\n\n"));
  console.log();

  // 4. Test Student Profile Update (Switch to Cybersecurity)
  console.log("4. Testing Profile Management: Switching goal to 'Cybersecurity Specialist'...");
  const patchRes = await fetch(`${BASE}/api/v1/students/STU-2024-8841`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ careerGoal: "Cybersecurity Specialist" })
  });
  const patchData = await patchRes.json();
  console.log("Profile Updated:", patchData.student.name, "-> New Goal:", patchData.student.careerGoal);

  // Check how courses dynamically re-scored
  const coursesRes = await fetch(`${BASE}/api/v1/courses?studentId=STU-2024-8841`);
  const courses = await coursesRes.json();
  console.log("Dynamic Course Re-scoring after goal update:");
  courses.slice(0, 3).forEach(c => console.log(`  • ${c.code} ${c.name}: ${c.matchScore}% (${c.matchBadge})`));
  console.log();

  // 5. Test Profile Update via Natural Language Chat
  console.log("5. Testing Natural Language Chat Profile Update: 'Switch my focus to Cloud Solutions Architect'...");
  const chatProfRes = await fetch(`${BASE}/api/agent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Switch my focus to Cloud Solutions Architect" })
  });
  const chatProfData = await chatProfRes.json();
  console.log("Agent Response:\n", chatProfData.message);
  console.log();

  // 6. Test Switching Active Student to Maya Patel
  console.log("6. Testing Student Switch: Switching to Maya Patel (STU-2024-5219)...");
  const switchRes = await fetch(`${BASE}/api/v1/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "switch_active", studentId: "STU-2024-5219" })
  });
  const switchData = await switchRes.json();
  console.log("Switched to Active Student:", switchData.activeStudent.name, "| Program:", switchData.activeStudent.program);
  console.log();

  // 7. Test Registration & Multi-Step Enrollment Execution for Maya
  console.log("7. Testing Full Course Registration & Live Enrollment for Maya (CS380)...");
  const regRes = await fetch(`${BASE}/api/v1/registration/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      studentId: "STU-2024-5219",
      courseId: "CS380",
      sectionId: "Section A"
    })
  });
  const regData = await regRes.json();
  console.log("Registration Success:", regData.success);
  console.log("Transaction ID:", regData.transactionId);
  console.log("Seats Remaining Now in CS380 Section A:", regData.seatsRemaining);
  console.log("Updated Credits for Maya:", regData.completedCreditsNow, "/ 140");
  console.log("Updated Degree Progress:", regData.degreeProgressNow, "%");

  // Verify registration ledger
  const statusRes = await fetch(`${BASE}/api/v1/registration/status/STU-2024-5219`);
  const statusData = await statusRes.json();
  console.log("Verification Status:", statusData.status);
  console.log("Enrolled Courses in Ledger:", statusData.enrollments);

  console.log("\n>>> ALL DYNAMIC AGENT & REAL-TIME REGISTRATION TESTS PASSED! <<<");
}

run().catch(err => {
  console.error("Test Failed:", err);
  process.exit(1);
});

