// scratch/test_all_conversational_inputs.mjs
const BASE_URL = 'http://localhost:3000';

const testPrompts = [
  "Hello! What can you help me with today?",
  "Who is teaching Database Systems and what is their student rating?",
  "Do CS401 and CS380 have any timetable conflict?",
  "How many credits do I need to graduate and what is my degree completion percentage?",
  "What is the university policy on maximum credit load per semester?",
  "Can I take CS305 Database Systems right now? Check prerequisites.",
  "Compare CS401 and CS305 in terms of workload and career value.",
  "Where and when does CS320 Cloud Computing meet?",
  "What are the best courses for someone who wants to become a Cloud Solutions Architect?",
  "I want to register for CS401 Section A."
];

async function runTests() {
  console.log("=================================================");
  console.log("CoursePilot AI — Universal Chat Stress Testing");
  console.log("=================================================\n");

  let passed = 0;
  for (let i = 0; i < testPrompts.length; i++) {
    const prompt = testPrompts[i];
    console.log(`[Test ${i + 1}/${testPrompts.length}] Input: "${prompt}"`);
    
    try {
      const res = await fetch(`${BASE_URL}/api/agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: 'STU-2024-8841',
          message: prompt,
          conversationHistory: []
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      }

      const data = await res.json();
      console.log(`  -> Intent Detected: ${data.intent}`);
      console.log(`  -> Response snippet: ${data.message.slice(0, 140).replace(/\n/g, ' ')}...`);
      if (data.actionPayload) {
        console.log(`  -> Action Payload Type: ${data.actionPayload.type}`);
      }
      console.log(`  -> Status: OK (Confidence: ${data.confidence})\n`);
      passed++;
    } catch (err) {
      console.error(`  -> ERROR on prompt "${prompt}":`, err.message);
    }
  }

  console.log(`Finished ${passed}/${testPrompts.length} conversational tests successfully!`);
}

runTests();

