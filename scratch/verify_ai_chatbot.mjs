// scratch/verify_ai_chatbot.mjs
const BASE_URL = "http://localhost:3000";

async function runAiChatbotTests() {
  console.log("==================================================");
  console.log("   COURSEPILOT AI - CHATBOT INTELLIGENCE SUITE   ");
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

  const queries = [
    // 1. Technical / Academic Questions
    {
      category: "Academic / Technical Concepts",
      question: "What is Machine Learning and how does supervised learning work?",
      validate: (data) =>
        data.message.toLowerCase().includes("supervised") &&
        data.message.toLowerCase().includes("algorithms") &&
        data.suggestedQuickActions.length > 0
    },
    {
      category: "Academic / Technical Concepts",
      question: "Explain how B-tree database indexes work and ACID properties",
      validate: (data) =>
        data.message.toLowerCase().includes("b-tree") &&
        data.message.toLowerCase().includes("acid") &&
        data.message.toLowerCase().includes("index")
    },
    {
      category: "Academic / Technical Concepts",
      question: "What is Docker and why is it used in cloud computing?",
      validate: (data) =>
        data.message.toLowerCase().includes("docker") &&
        data.message.toLowerCase().includes("container")
    },
    {
      category: "Academic / Technical Concepts",
      question: "What is Big O notation and how does binary search compare to linear search?",
      validate: (data) =>
        data.message.toLowerCase().includes("big-o") ||
        data.message.toLowerCase().includes("logarithmic") ||
        data.message.includes("O(")
    },
    {
      category: "Academic / Technical Concepts",
      question: "What is SQL injection and how can developers prevent it?",
      validate: (data) =>
        data.message.toLowerCase().includes("sql injection") &&
        data.message.toLowerCase().includes("prepared")
    },

    // 2. Career & Interview Preparation
    {
      category: "Career & Interview Preparation",
      question: "How should I prepare for technical coding interviews?",
      validate: (data) =>
        data.message.toLowerCase().includes("leetcode") &&
        data.message.toLowerCase().includes("star") &&
        data.message.toLowerCase().includes("system design")
    },
    {
      category: "Career & Interview Preparation",
      question: "What are good portfolio project ideas for my CS resume?",
      validate: (data) =>
        data.message.toLowerCase().includes("portfolio") &&
        data.message.toLowerCase().includes("project")
    },

    // 3. College Success, GPA & Regulations
    {
      category: "University Policies & GPA",
      question: "How is CGPA calculated and how can I raise my GPA?",
      validate: (data) =>
        data.message.toLowerCase().includes("cgpa") &&
        data.message.toLowerCase().includes("credit") &&
        data.message.toLowerCase().includes("grading scale")
    },
    {
      category: "University Policies & Deadlines",
      question: "What is the maximum credit limit and overload policy for Fall 2026?",
      validate: (data) =>
        data.message.includes("18") &&
        data.message.includes("21")
    },
    {
      category: "University Policies & Deadlines",
      question: "What is the add/drop deadline for courses this semester?",
      validate: (data) =>
        data.message.toLowerCase().includes("october 25, 2026") ||
        data.message.toLowerCase().includes("deadline")
    },

    // 4. CoursePilot Platform Usage
    {
      category: "Platform Features",
      question: "How do the practical hands-on coding labs work?",
      validate: (data) =>
        data.message.toLowerCase().includes("coding sandbox") ||
        data.message.toLowerCase().includes("boilerplates") ||
        data.message.toLowerCase().includes("run tests")
    },
    {
      category: "Platform Features",
      question: "How does the final assessment quiz work and how many attempts do I get?",
      validate: (data) =>
        data.message.includes("20") &&
        data.message.includes("12") &&
        data.message.includes("3")
    },
    {
      category: "Platform Features",
      question: "How do I get my official certificate of completion?",
      validate: (data) =>
        data.message.toLowerCase().includes("certificate") &&
        (data.message.includes("100%") || data.message.includes("labs"))
    },
    {
      category: "Platform Features",
      question: "How do I download the tuition-free proof of enrollment bill?",
      validate: (data) =>
        data.message.toLowerCase().includes("tuition-free") &&
        data.message.toLowerCase().includes("pdf")
    },

    // 5. Open-Domain & Universal Inquiries
    {
      category: "Open-Domain Intelligence",
      question: "Can you explain how a computer CPU works in simple terms?",
      validate: (data) =>
        data.message.length > 200 &&
        data.suggestedQuickActions.length > 0
    },
    {
      category: "Existing Core Registration Flow",
      question: "Can I register for CS401 Machine Learning?",
      validate: (data) =>
        data.message.toLowerCase().includes("already enrolled") ||
        data.message.toLowerCase().includes("lifelong access")
    }
  ];

  console.log(`\nExecuting ${queries.length} comprehensive AI Chatbot test queries...\n`);

  for (let i = 0; i < queries.length; i++) {
    const t = queries[i];
    console.log(`[QUERY ${i + 1}/${queries.length}] (${t.category}): "${t.question}"`);
    try {
      const res = await fetch(`${BASE_URL}/api/agent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: t.question,
          studentId: "STU-2024-8841"
        })
      });

      assert(res.ok, `HTTP 200 OK returned for "${t.question.slice(0, 35)}..."`);
      const data = await res.json();
      assert(typeof data.message === "string" && data.message.length > 100, "Substantive detailed markdown response generated (> 100 chars)");
      assert(Array.isArray(data.suggestedQuickActions) && data.suggestedQuickActions.length > 0, "Actionable quick chips returned");
      assert(t.validate(data), `Response correctly answered the domain inquiry for "${t.category}"`);
      console.log(`  -> Intent: ${data.intent} | Length: ${data.message.length} chars | Actions: [${data.suggestedQuickActions.join(", ")}]\n`);
    } catch (e) {
      console.error(`Error executing query: ${e.message}`);
      failed++;
    }
  }

  console.log("==================================================");
  console.log(`AI CHATBOT TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runAiChatbotTests().catch((e) => {
  console.error("Test failed with exception:", e);
  process.exit(1);
});

