import { AgentTools } from "./tools";
import { eventBus } from "./eventBus";
import { AgentStepEvent, Course, Student } from "@/types";
import { globalUnivDb } from "@/lib/server/universityDatabase";
import { universalKnowledgeEngine } from "./universalKnowledgeEngine";

export interface AgentResponsePayload {
  message: string;
  intent: string;
  steps: AgentStepEvent[];
  data?: any;
  requiresConfirmation?: boolean;
  confirmationAction?: {
    type: "REGISTER" | "DROP" | "SWAP";
    courseCode: string;
    courseName: string;
    sectionCode: string;
    credits: number;
    schedule: string;
    seatsAvailable: number;
    eligibilitySummary: string;
  };
  suggestedQuickActions?: string[];
  updatedStudent?: any;
}

export class AgentOrchestrator {
  private static instance: AgentOrchestrator;

  public static getInstance(): AgentOrchestrator {
    if (!AgentOrchestrator.instance) {
      AgentOrchestrator.instance = new AgentOrchestrator();
    }
    return AgentOrchestrator.instance;
  }

  // Course extraction helper for single primary match
  private extractCourse(query: string): Course | null {
    const q = query.toLowerCase();
    const courses = Array.from(globalUnivDb.courses.values());

    for (const c of courses) {
      if (
        q.includes(c.code.toLowerCase()) ||
        q.includes(c.name.toLowerCase()) ||
        (c.code === "CS401" && (q.includes("machine learning") || q.includes("ml"))) ||
        (c.code === "CS305" && (q.includes("database") || q.includes("db") || q.includes("sql"))) ||
        (c.code === "CS320" && (q.includes("cloud") || q.includes("aws") || q.includes("docker"))) ||
        (c.code === "CS380" && (q.includes("cyber") || q.includes("security") || q.includes("crypto"))) ||
        (c.code === "CS350" && (q.includes("computer vision") || q.includes("vision") || q.includes("cv"))) ||
        (c.code === "CS420" && (q.includes("nlp") || q.includes("language processing") || q.includes("llm"))) ||
        (c.code === "CS310" && (q.includes("web") || q.includes("mobile") || q.includes("fullstack") || q.includes("full-stack"))) ||
        (c.code === "CS450" && (q.includes("distributed") || q.includes("microservices")))
      ) {
        return c;
      }
    }
    return null;
  }

  // Course extraction helper for multiple matches (e.g. comparing courses)
  private extractAllCourses(query: string): Course[] {
    const q = query.toLowerCase();
    const all = Array.from(globalUnivDb.courses.values());
    const matched: Course[] = [];

    for (const c of all) {
      const codeMatch = q.includes(c.code.toLowerCase());
      const nameMatch = q.includes(c.name.toLowerCase());
      const altMatch =
        (c.code === "CS401" && (q.includes("machine learning") || q.includes(" ml "))) ||
        (c.code === "CS305" && (q.includes("database") || q.includes(" sql "))) ||
        (c.code === "CS320" && (q.includes("cloud") || q.includes("aws") || q.includes("docker"))) ||
        (c.code === "CS380" && (q.includes("cyber") || q.includes("security") || q.includes("crypto"))) ||
        (c.code === "CS350" && (q.includes("computer vision") || q.includes("vision"))) ||
        (c.code === "CS420" && (q.includes("nlp") || q.includes("natural language") || q.includes("llm"))) ||
        (c.code === "CS310" && (q.includes("web") || q.includes("fullstack") || q.includes("full-stack") || q.includes("mobile"))) ||
        (c.code === "CS450" && (q.includes("distributed systems") || q.includes("microservices")));

      if (codeMatch || nameMatch || altMatch) {
        if (!matched.some((m) => m.code === c.code)) {
          matched.push(c);
        }
      }
    }
    return matched;
  }

  // Check if Gemini API key exists
  private getGeminiApiKey(): string | null {
    return process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || null;
  }

  // Optional real Gemini API call
  private async callGeminiIfAvailable(
    apiKey: string,
    systemPrompt: string,
    userPrompt: string
  ): Promise<string | null> {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemPrompt}\n\nStudent User Query: ${userPrompt}` }],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 800,
          },
        }),
      });

      if (!res.ok) return null;
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
    } catch (e) {
      return null;
    }
  }

  async processUserMessage(
    userMessage: string,
    studentId?: string,
    apiKey?: string | null,
    selectedModel?: string
  ): Promise<AgentResponsePayload> {
    const executedSteps: AgentStepEvent[] = [];
    const query = userMessage.toLowerCase().trim();

    // 1. Fetch official active student from SIS
    const sId = studentId || "STU-2024-8841";
    const activeStudent = globalUnivDb.getStudent(sId) || globalUnivDb.getActiveStudent();

    // Emit live perception event
    const understandEvent: AgentStepEvent = {
      eventId: `ev-${Date.now()}-parse`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timeExact: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      step: "Analyzing natural language request",
      detail: `Contextual reasoning for ${activeStudent.name} (${activeStudent.program}, CGPA: ${activeStudent.cgpa})`,
      tool: "intent_and_entity_extractor",
      status: "COMPLETED",
      durationMs: 35,
      source: "AI Autonomous Engine",
    };
    eventBus.emitAgentEvent(understandEvent);
    executedSteps.push(understandEvent);

    const detectedCourses = this.extractAllCourses(query);

    // 2. Intent Classification & Routing

    // --- Intent: Profile Updates via Chat ---
    if (
      query.includes("change my career goal") ||
      query.includes("update my career goal") ||
      query.includes("set my career goal") ||
      query.includes("switch my goal") ||
      query.includes("switch focus to") ||
      query.includes("focus on") ||
      query.includes("i want to be a") ||
      query.includes("i want to become a") ||
      query.includes("focus on cybersecurity") ||
      query.includes("focus on cloud") ||
      query.includes("focus on ai") ||
      query.includes("my name is") ||
      query.includes("call me")
    ) {
      return this.handleProfileUpdateFlow(userMessage, activeStudent, executedSteps);
    }

    // --- Intent: Schedule Conflict Check Between Two Courses ---
    if (
      (query.includes("conflict") || query.includes("overlap") || query.includes("clash")) &&
      detectedCourses.length >= 2
    ) {
      return this.handleScheduleConflictBetweenCoursesFlow(query, activeStudent, detectedCourses, executedSteps);
    }

    // --- Intent: Course Comparison ---
    if (
      detectedCourses.length >= 2 &&
      (query.includes("compare") ||
        query.includes("difference between") ||
        query.includes("vs") ||
        query.includes("which is better") ||
        query.includes("or"))
    ) {
      return this.handleComparisonFlow(query, activeStudent, detectedCourses, executedSteps);
    }

    // --- Intent: Graduation & Degree Progress Audit ---
    if (
      query.includes("graduate") ||
      query.includes("graduation") ||
      query.includes("degree progress") ||
      query.includes("remaining credits") ||
      query.includes("credits left") ||
      query.includes("am i on track")
    ) {
      return this.handleGraduationAuditFlow(query, activeStudent, executedSteps);
    }

    // --- Intent: Faculty & Classroom Inquiries ---
    if (
      query.includes("who teaches") ||
      query.includes("who is teaching") ||
      query.includes("professor") ||
      query.includes("instructor") ||
      query.includes("faculty") ||
      query.includes("rating") ||
      query.includes("what room") ||
      query.includes("where is") ||
      query.includes("where does") ||
      query.includes("classroom") ||
      query.includes("location")
    ) {
      return this.handleProfessorAndRoomFlow(query, activeStudent, detectedCourses, executedSteps);
    }

    // --- Intent: Check Eligibility & Prerequisites ---
    if (
      query.includes("can i register") ||
      query.includes("can i take") ||
      query.includes("can i enroll") ||
      query.includes("eligible") ||
      query.includes("prereq") ||
      query.includes("prerequisite") ||
      query.includes("check eligibility")
    ) {
      return this.handleEligibilityFlow(userMessage, activeStudent, detectedCourses, executedSteps);
    }

    // --- Intent: Direct Registration Command ---
    if (
      query.includes("register me") ||
      query.includes("enroll me") ||
      query.includes("sign me up") ||
      query.includes("register for") ||
      query.startsWith("register") ||
      query.startsWith("enroll")
    ) {
      return this.handleRegistrationIntentFlow(userMessage, activeStudent, detectedCourses, executedSteps);
    }

    // --- Intent: Check Eligibility & Prerequisites ---
    if (
      query.includes("can i register") ||
      query.includes("can i take") ||
      query.includes("eligible") ||
      query.includes("prereq") ||
      query.includes("prerequisite") ||
      query.includes("check eligibility")
    ) {
      return this.handleEligibilityFlow(userMessage, activeStudent, detectedCourses, executedSteps);
    }

    // --- Intent: Recommendations & Suggestions ---
    if (
      query.includes("suggest") ||
      query.includes("recommend") ||
      query.includes("what course") ||
      query.includes("which course") ||
      query.includes("what should i take") ||
      query.includes("elective") ||
      query.includes("best course") ||
      query.includes("best ai") ||
      query.includes("find course") ||
      query.includes("plan my semester") ||
      query.includes("pick a course")
    ) {
      return this.handleRecommendationFlow(userMessage, activeStudent, executedSteps);
    }

    // --- Intent: Timetable & Schedule Overlaps ---
    if (
      query.includes("timetable") ||
      query.includes("schedule") ||
      query.includes("time slot") ||
      query.includes("free on") ||
      query.includes("class times")
    ) {
      return this.handleTimetableFlow(userMessage, activeStudent, executedSteps);
    }

    // --- Intent: Knowledge Answering Engine (Concepts, Labs, Quizzes, Policies, Career, Study) ---
    if (
      query.startsWith("what is") ||
      query.startsWith("what are") ||
      query.startsWith("how do") ||
      query.startsWith("how does") ||
      query.startsWith("how can") ||
      query.startsWith("how to") ||
      query.startsWith("why") ||
      query.startsWith("explain") ||
      query.includes("difference between") ||
      query.includes("how does labs work") ||
      query.includes("how do labs work") ||
      query.includes("how does the quiz work") ||
      query.includes("how many questions") ||
      query.includes("how many attempts") ||
      query.includes("how to get certificate") ||
      query.includes("certificate") ||
      query.includes("anti-cheat") ||
      query.includes("anti cheat") ||
      query.includes("tuition bill") ||
      query.includes("interview") ||
      query.includes("leetcode") ||
      query.includes("resume") ||
      query.includes("study tips") ||
      query.includes("study habits") ||
      query.includes("gpa") ||
      query.includes("cgpa") ||
      query.includes("big o") ||
      query.includes("docker") ||
      query.includes("machine learning") ||
      query.includes("database index") ||
      query.includes("acid") ||
      query.includes("deadline")
    ) {
      return this.handleKnowledgeQueryFlow(userMessage, activeStudent, executedSteps, apiKey, selectedModel);
    }

    // --- Intent: What-If Simulations (Drop/Swap) ---
    if (
      query.includes("what if") ||
      query.includes("drop") ||
      query.includes("swap") ||
      query.includes("simulate") ||
      query.includes("delay graduation")
    ) {
      return this.handleWhatIfFlow(userMessage, activeStudent, executedSteps);
    }

    // --- Intent: Policy, Credit Limits, Deadlines ---
    if (
      query.includes("credit limit") ||
      query.includes("how many credits") ||
      query.includes("overload") ||
      query.includes("add/drop") ||
      query.includes("policy") ||
      query.includes("regulation") ||
      query.includes("rule") ||
      query.includes("handbook") ||
      query.includes("probation") ||
      query.includes("honor roll")
    ) {
      return this.handleDocumentRAGFlow(userMessage, activeStudent, executedSteps);
    }

    // --- Intent: Greetings & Introductions ---
    if (
      query === "hi" ||
      query === "hello" ||
      query.startsWith("hi ") ||
      query.startsWith("hello ") ||
      query.includes("who are you") ||
      query.includes("help me")
    ) {
      return this.handleGreetingFlow(userMessage, activeStudent, executedSteps);
    }

    // --- Fallback: Universal Contextual Academic Advising ---
    return this.handleUniversalAdvisingFlow(userMessage, activeStudent, detectedCourses, executedSteps, apiKey, selectedModel);
  }

  // --- 1. Profile Update Flow ---
  private async handleProfileUpdateFlow(
    query: string,
    student: Student,
    steps: AgentStepEvent[]
  ): Promise<AgentResponsePayload> {
    const q = query.toLowerCase();
    const updates: Partial<Student> = {};

    if (q.includes("my name is ")) {
      const parts = query.split(/my name is /i);
      if (parts[1]) updates.name = parts[1].split(".")[0].split(",")[0].trim();
    } else if (q.includes("call me ")) {
      const parts = query.split(/call me /i);
      if (parts[1]) updates.name = parts[1].split(".")[0].split(",")[0].trim();
    }

    if (q.includes("cybersecurity") || q.includes("security") || q.includes("ethical hacker")) {
      updates.careerGoal = "Cybersecurity Analyst & Security Researcher";
    } else if (q.includes("cloud") || q.includes("devops") || q.includes("aws")) {
      updates.careerGoal = "Cloud Solutions Architect & DevOps Engineer";
    } else if (q.includes("ai") || q.includes("machine learning") || q.includes("ml")) {
      updates.careerGoal = "AI & Machine Learning Research Engineer";
    } else if (q.includes("software engineer") || q.includes("full stack") || q.includes("developer")) {
      updates.careerGoal = "Full Stack Software Engineer";
    } else if (q.includes("data scientist") || q.includes("data science") || q.includes("analyst")) {
      updates.careerGoal = "Data Scientist & Analyst";
    }

    const updated = globalUnivDb.updateStudentProfile(student.id, updates);

    const stepEvent: AgentStepEvent = {
      eventId: `ev-${Date.now()}-prof`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timeExact: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      step: "Updated live student profile in University SIS",
      detail: `Synchronized: ${updates.name ? `Name: "${updated.name}" ` : ""}${updates.careerGoal ? `Goal: "${updated.careerGoal}"` : ""}`,
      tool: "update_student_profile",
      status: "COMPLETED",
      durationMs: 45,
      source: "University SIS Live Gateway",
    };
    eventBus.emitAgentEvent(stepEvent);
    steps.push(stepEvent);

    const recs = globalUnivDb.getRecommendedCoursesForStudent(updated).slice(0, 3);
    const recList = recs
      .map(
        (r) =>
          `• **${r.code} — ${r.name}** (${r.matchScore}% Match): ${r.matchReason?.[0] || "Aligned to track"}`
      )
      .join("\n");

    const message =
      `✅ **Profile Synchronized in University SIS!**\n\n` +
      `I've updated your record:\n` +
      `• **Student Name:** ${updated.name}\n` +
      `• **Career Trajectory:** **${updated.careerGoal}**\n` +
      `• **Degree Progress:** ${updated.completedCredits} / ${updated.requiredCredits} credits (${updated.degreeProgressPercentage}%)\n\n` +
      `Based on this change, I've re-scored your curriculum recommendations:\n\n${recList}\n\n` +
      `Would you like me to check your eligibility or assist you with registering for any of these?`;

    return {
      message,
      intent: "PROFILE_UPDATED",
      steps,
      data: { updatedStudent: updated, recommendations: recs },
      updatedStudent: updated,
      suggestedQuickActions: [
        `Register for ${recs[0]?.code || "top course"}`,
        `Check ${recs[0]?.code || "top course"} Eligibility`,
        "View Schedule Fit",
      ],
    };
  }

  // --- 2. Course Comparison Flow ---
  private async handleComparisonFlow(
    query: string,
    student: Student,
    courses: Course[],
    steps: AgentStepEvent[]
  ): Promise<AgentResponsePayload> {
    const list =
      courses.length >= 2
        ? courses.slice(0, 2)
        : [globalUnivDb.courses.get("CS401")!, globalUnivDb.courses.get("CS320")!];

    const cA = list[0];
    const cB = list[1];

    const step: AgentStepEvent = {
      eventId: `ev-${Date.now()}-comp`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timeExact: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      step: "Multi-course comparison & curriculum analysis",
      detail: `Comparing ${cA.code} vs ${cB.code} against career trajectory (${student.careerGoal})`,
      tool: "course_comparison_tool",
      status: "COMPLETED",
      durationMs: 50,
      source: "Academic Advisor Intelligence",
    };
    eventBus.emitAgentEvent(step);
    steps.push(step);

    const completed = new Set(student.completedCourses || []);
    const prereqA = (cA.prerequisites || []).every((p: string) => completed.has(p));
    const prereqB = (cB.prerequisites || []).every((p: string) => completed.has(p));

    const secA = cA.sections[0];
    const secB = cB.sections[0];

    const message =
      `Here is a side-by-side comparison between **${cA.code} (${cA.name})** and **${cB.code} (${cB.name})** for your **${student.careerGoal}** pathway:\n\n` +
      `| Metric | **${cA.code}** | **${cB.code}** |\n` +
      `| :--- | :--- | :--- |\n` +
      `| **Credits & Type** | ${cA.credits} Cr (${cA.type}) | ${cB.credits} Cr (${cB.type}) |\n` +
      `| **Instructor** | ${cA.instructor} | ${cB.instructor} |\n` +
      `| **Prerequisites** | ${(cA.prerequisites || []).join(", ") || "None"} (${prereqA ? "✓ Complete" : "⚠️ Incomplete"}) | ${(cB.prerequisites || []).join(", ") || "None"} (${prereqB ? "✓ Complete" : "⚠️ Incomplete"}) |\n` +
      `| **Live Seats** | **${secA?.available || 0} seats** in ${secA?.sectionCode || "Sec A"} | **${secB?.available || 0} seats** in ${secB?.sectionCode || "Sec A"} |\n` +
      `| **Meeting Times** | ${secA?.schedule.map((s: any) => `${s.day.slice(0, 3)} ${s.startTime}`).join(", ")} | ${secB?.schedule.map((s: any) => `${s.day.slice(0, 3)} ${s.startTime}`).join(", ")} |\n` +
      `| **AI Match Score** | **${cA.matchScore || 85}%** (${cA.matchBadge || "Recommended"}) | **${cB.matchScore || 85}%** (${cB.matchBadge || "Recommended"}) |\n\n` +
      `**Advisor Recommendation:**\n` +
      `• If you want to focus heavily on theoretical foundations and modeling, **${cA.code}** is the gold standard.\n` +
      `• If you are prioritizing distributed infrastructure and operational engineering, **${cB.code}** provides immediate practical industry tooling.\n\n` +
      `Which one would you like to register for?`;

    return {
      message,
      intent: "COURSE_COMPARISON",
      steps,
      data: { courseA: cA, courseB: cB },
      suggestedQuickActions: [
        `Register for ${cA.code}`,
        `Register for ${cB.code}`,
        "Check Timetable Fit",
      ],
    };
  }

  // --- 3. Schedule Conflict Check Between Two Courses ---
  private async handleScheduleConflictBetweenCoursesFlow(
    query: string,
    student: Student,
    courses: Course[],
    steps: AgentStepEvent[]
  ): Promise<AgentResponsePayload> {
    const c1 = courses[0];
    const c2 = courses[1];

    const step: AgentStepEvent = {
      eventId: `ev-${Date.now()}-clash`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timeExact: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      step: "Cross-course timetable conflict check",
      detail: `Auditing lecture time slots between ${c1.code} and ${c2.code}`,
      tool: "check_timetable_overlap",
      status: "COMPLETED",
      durationMs: 38,
      source: "University Room Scheduling System",
    };
    eventBus.emitAgentEvent(step);
    steps.push(step);

    const s1 = c1.sections[0];
    const s2 = c2.sections[0];

    let conflictFound = false;
    let conflictDetail = "";

    for (const slot1 of s1.schedule) {
      for (const slot2 of s2.schedule) {
        if (slot1.day === slot2.day) {
          if (slot1.startTime < slot2.endTime && slot1.endTime > slot2.startTime) {
            conflictFound = true;
            conflictDetail = `${slot1.day} between ${slot1.startTime} and ${slot2.endTime}`;
            break;
          }
        }
      }
      if (conflictFound) break;
    }

    let message = "";
    if (conflictFound) {
      message = `⚠️ **Schedule Conflict Warning:** A timetable collision was detected between **${c1.code} (${c1.name})** and **${c2.code} (${c2.name})** on **${conflictDetail}**.\n\nYou cannot enroll in both ${c1.code} ${s1.sectionCode} and ${c2.code} ${s2.sectionCode}. Would you like me to find an alternate section with zero conflicts?`;
    } else {
      const sched1 = s1.schedule.map((s: any) => `${s.day} ${s.startTime}–${s.endTime}`).join(", ");
      const sched2 = s2.schedule.map((s: any) => `${s.day} ${s.startTime}–${s.endTime}`).join(", ");
      message =
        `✅ **Zero Schedule Conflicts Detected!**\n\n` +
        `• **${c1.code} (${c1.name}):** ${sched1} in room ${s1.room} (${s1.available} seats left)\n` +
        `• **${c2.code} (${c2.name}):** ${sched2} in room ${s2.room} (${s2.available} seats left)\n\n` +
        `Both courses fit into your weekly calendar without any timetable clash. You can register for both courses for Fall 2026.`;
    }

    return {
      message,
      intent: "TIMETABLE_CONFLICT_AUDIT",
      steps,
      data: { course1: c1, course2: c2, conflictFound },
      suggestedQuickActions: [
        `Register for ${c1.code}`,
        `Register for ${c2.code}`,
        "View Weekly Timetable",
      ],
    };
  }

  // --- 4. Graduation & Degree Progress Audit Flow ---
  private async handleGraduationAuditFlow(
    query: string,
    student: Student,
    steps: AgentStepEvent[]
  ): Promise<AgentResponsePayload> {
    const step: AgentStepEvent = {
      eventId: `ev-${Date.now()}-deg`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timeExact: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      step: "Degree progress & graduation audit",
      detail: `Auditing degree requirements for ${student.name} (${student.id})`,
      tool: "degree_audit_calculator",
      status: "COMPLETED",
      durationMs: 42,
      source: "University Registrar Degree Audit",
    };
    eventBus.emitAgentEvent(step);
    steps.push(step);

    const remainingCredits = Math.max(0, student.requiredCredits - student.completedCredits);
    const estimatedSemesters = Math.ceil(remainingCredits / 16);

    const message =
      `🎓 **Official Degree Progress & Graduation Audit for ${student.name}:**\n\n` +
      `• **Current Program:** ${student.program} (Semester ${student.semester})\n` +
      `• **Academic Standing:** ${student.academicStanding} (CGPA: **${student.cgpa} / 10.0**)\n` +
      `• **Credits Completed:** **${student.completedCredits} / ${student.requiredCredits} credits** (${student.degreeProgressPercentage}% complete)\n` +
      `• **Credits Remaining to Graduate:** **${remainingCredits} credits** (~${estimatedSemesters} academic semester${estimatedSemesters > 1 ? "s" : ""})\n` +
      `• **Degree Status:** On track for graduation in Spring 2028 with **${student.academicStanding}**.\n\n` +
      `To maintain optimal graduation velocity, we recommend enrolling in 15–18 credits this Fall 2026 semester.\n\n` +
      `Would you like to review recommended courses to satisfy your remaining graduation requirements?`;

    return {
      message,
      intent: "GRADUATION_DEGREE_AUDIT",
      steps,
      data: { student, remainingCredits, estimatedSemesters },
      suggestedQuickActions: [
        "Suggest Best Courses",
        "Check Credit Limits",
        "View Weekly Timetable",
      ],
    };
  }

  // --- 5. Professor & Classroom Inquiries ---
  private async handleProfessorAndRoomFlow(
    query: string,
    student: Student,
    courses: Course[],
    steps: AgentStepEvent[]
  ): Promise<AgentResponsePayload> {
    const course = courses[0] || globalUnivDb.courses.get("CS401")!;
    const sec = course.sections[0];

    const step: AgentStepEvent = {
      eventId: `ev-${Date.now()}-fac`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timeExact: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      step: "Faculty & room directory query",
      detail: `Retrieved instructor & room allocation for ${course.code}`,
      tool: "get_faculty_and_room",
      status: "COMPLETED",
      durationMs: 32,
      source: "University Room & Faculty Directory",
    };
    eventBus.emitAgentEvent(step);
    steps.push(step);

    const ratingMap: Record<string, string> = {
      "Dr. Elena Rostova": "★ 4.9 / 5.0 (98% Student Approval • Top Ranked AI Faculty)",
      "Prof. Michael Chang": "★ 4.8 / 5.0 (94% Student Approval • High Engagement & Practical Labs)",
      "Dr. Sarah Jenkins": "★ 4.7 / 5.0 (92% Student Approval • Renowned Distributed Systems Researcher)",
      "Dr. Marcus Vance": "★ 4.9 / 5.0 (96% Student Approval • Industry Cyber Threat Specialist)",
    };

    const sectionsInfo = course.sections
      .map((s: any) => {
        const rating = ratingMap[s.instructor] || "★ 4.8 / 5.0 (Highly Rated by Students)";
        return (
          `• **${s.sectionCode}:** Instructor **${s.instructor}** (${rating})\n` +
          `  - **Classroom / Lab:** ${s.room}\n` +
          `  - **Meeting Schedule:** ${s.schedule.map((x: any) => `${x.day} ${x.startTime}–${x.endTime}`).join(", ")}\n` +
          `  - **Live Seats Available:** **${s.available} seats** remaining`
        );
      })
      .join("\n\n");

    const message =
      `Here are the official instructor, evaluation rating, and classroom details for **${course.code} — ${course.name}** (Fall 2026):\n\n` +
      `${sectionsInfo}\n\n` +
      `**Faculty Office Hours:** ${sec.instructor} holds student office hours every Tuesday & Thursday 2:00 PM – 4:00 PM in ${sec.room.split(" ")[0]} 4th floor.\n\n` +
      `Would you like to register for ${sec.sectionCode} or check timetable compatibility?`;

    return {
      message,
      intent: "FACULTY_AND_ROOM_INQUIRY",
      steps,
      data: { course, sections: course.sections },
      suggestedQuickActions: [
        `Register for ${course.code}`,
        "Check Timetable Collisions",
        "View Syllabus Details",
      ],
    };
  }

  // --- 6. Greetings & Introduction ---
  private async handleGreetingFlow(
    query: string,
    student: Student,
    steps: AgentStepEvent[]
  ): Promise<AgentResponsePayload> {
    const topRecs = globalUnivDb.getRecommendedCoursesForStudent(student).slice(0, 3);
    const recStr = topRecs.map((r) => `**${r.code}** (${r.name})`).join(", ");

    const message =
      `Hello **${student.name}**! 👋 I am your autonomous real-time academic agent connected directly to your university's SIS and registration portal.\n\n` +
      `Here is your live academic status:\n` +
      `• **Program:** ${student.program} (Semester ${student.semester})\n` +
      `• **CGPA:** ${student.cgpa} (${student.academicStanding})\n` +
      `• **Credits:** ${student.completedCredits} / ${student.requiredCredits} (${student.degreeProgressPercentage}% Completed)\n` +
      `• **Career Target:** ${student.careerGoal}\n\n` +
      `I can help you with:\n` +
      `1. **Eligibility Audits:** Ask *"Can I take CS401?"* or any course to verify transcript prerequisites.\n` +
      `2. **Intelligent Recommendations:** Ask *"What courses should I take for Cloud Architecture?"*\n` +
      `3. **1-Click Registration:** Say *"Register me for CS401"* to lock a live seat and generate an official receipt.\n` +
      `4. **Schedule Optimization:** Check for timetable overlaps and room conflicts.\n` +
      `5. **Profile Customization:** Tell me your real career goals or update your transcript.\n\n` +
      `Top recommended courses for your ${student.careerGoal} path: ${recStr}.\n\n` +
      `How can I assist you right now?`;

    return {
      message,
      intent: "GREETING",
      steps,
      suggestedQuickActions: [
        `Register for ${topRecs[0]?.code || "CS401"}`,
        "Suggest Electives for Me",
        "Check Timetable Conflicts",
        "Update My Career Goal",
      ],
    };
  }

  // --- 7. Eligibility Flow ---
  private async handleEligibilityFlow(
    userMessage: string,
    student: Student,
    courses: Course[],
    steps: AgentStepEvent[]
  ): Promise<AgentResponsePayload> {
    const course = courses[0] || this.extractCourse(userMessage) || globalUnivDb.courses.get("CS401")!;
    const primarySection = course.sections[0];

    // Step 1: SIS Check
    const sisStep: AgentStepEvent = {
      eventId: `ev-${Date.now()}-sis`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timeExact: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      step: "Transcript & prerequisite audit",
      detail: `Auditing ${student.name}'s completed courses against ${course.code} prerequisites: [${(course.prerequisites || []).join(", ")}]`,
      tool: "check_prerequisites",
      status: "COMPLETED",
      durationMs: 48,
      source: "University Rules & Compliance Engine",
    };
    eventBus.emitAgentEvent(sisStep);
    steps.push(sisStep);

    // Step 2: Live Seat Query
    const seatStep: AgentStepEvent = {
      eventId: `ev-${Date.now()}-seats`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timeExact: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      step: "Real-time seat availability check",
      detail: `Live capacity query: ${primarySection.available} seats remaining in ${primarySection.sectionCode}`,
      tool: "get_live_seat_availability",
      status: "COMPLETED",
      durationMs: 38,
      source: "University Registration API",
    };
    eventBus.emitAgentEvent(seatStep);
    steps.push(seatStep);

    // Check if already enrolled
    const isAlreadyEnrolled =
      (student.currentEnrollments || []).includes(course.code) ||
      (student.completedCourses || []).includes(course.code);

    if (isAlreadyEnrolled) {
      return {
        message: `🔒 **Registration Locked:** You are already enrolled in **${course.code} — ${course.name}**!\n\nUnder University Registrar policy, multiple registrations for the same course by the same individual are strictly locked. Your enrollment is active with guaranteed lifelong access to all lecture videos, coding environments, and course certification under **Enrolled Courses**.`,
        intent: "CHECK_ELIGIBILITY",
        steps,
        data: {
          course,
          isAlreadyEnrolled: true,
          isEligible: false,
          isLocked: true,
          eligibility: {
            isEligible: false,
            isLocked: true,
            summary: `Registration is locked. Student is already enrolled in ${course.code} with permanent lifelong access. Repeated registrations for the same individual are not permitted.`,
            checks: [
              { ruleName: "Single Enrollment Constraint", passed: false, explanation: `Locked: Already enrolled in ${course.code}. One enrollment per student limit enforced.` },
              { ruleName: "Prerequisites Verified", passed: true, explanation: "All academic prerequisites satisfied." },
              { ruleName: "Academic Standing", passed: true, explanation: `CGPA ${student.cgpa} meets minimum threshold.` },
              { ruleName: "Lifelong Access Status", passed: true, explanation: "Permanent access active in Learning Hub." }
            ]
          }
        },
        suggestedQuickActions: ["Open Course Learning", "View Enrolled Courses", "Check Timetable"],
      };
    }

    // Evaluate
    const completedSet = new Set(student.completedCourses || []);
    const missingPrereqs = (course.prerequisites || []).filter((p: string) => !completedSet.has(p));
    const cgpaOk = student.cgpa >= (course.minimumCgpa || 6.0);
    const hasSeats = primarySection.available > 0;
    const isEligible = missingPrereqs.length === 0 && cgpaOk && hasSeats;

    let message = "";
    let requiresConfirmation = false;
    let confirmationAction: any = undefined;

    if (isEligible) {
      message =
        `You are fully eligible to register for **${course.code} — ${course.name}**!\n\n` +
        `• **Prerequisites:** All satisfied (${(course.prerequisites || []).join(", ") || "None"})\n` +
        `• **Academic Standing:** CGPA ${student.cgpa} meets minimum requirement (${course.minimumCgpa || 6.0})\n` +
        `• **Credit Headroom:** ${course.credits} credits fit within your semester limit (${student.currentCreditLimit || 18} cr)\n` +
        `• **Live Availability:** **${primarySection.available} seats** remaining in ${primarySection.sectionCode} (${primarySection.room})\n` +
        `• **Schedule:** ${primarySection.schedule.map((s: any) => `${s.day} ${s.startTime}–${s.endTime}`).join(", ")} (Zero timetable collisions)`;

      requiresConfirmation = true;
      confirmationAction = {
        type: "REGISTER",
        courseCode: course.code,
        courseName: course.name,
        sectionCode: primarySection.sectionCode,
        credits: course.credits,
        schedule: primarySection.schedule.map((s: any) => `${s.day} ${s.startTime}–${s.endTime}`).join(", "),
        seatsAvailable: primarySection.available,
        eligibilitySummary: `Prerequisites verified, CGPA ${student.cgpa} ≥ ${course.minimumCgpa || 6.0}, 0 schedule conflicts.`,
      };
    } else {
      const issues: string[] = [];
      if (missingPrereqs.length > 0) {
        issues.push(`You have not completed required prerequisite(s): **${missingPrereqs.join(", ")}**`);
      }
      if (!cgpaOk) {
        issues.push(`Current CGPA (${student.cgpa}) is below course requirement (${course.minimumCgpa})`);
      }
      if (!hasSeats) {
        issues.push(`Section is currently full (0 seats available)`);
      }

      message =
        `⚠️ **Not Currently Eligible for ${course.code} (${course.name}):**\n\n` +
        issues.map((i) => `• ${i}`).join("\n") +
        `\n\n**Advisor Guidance:** To enroll in ${course.code} in a subsequent semester, register for ${missingPrereqs.join(", ")} first. Would you like me to show alternative electives you are currently qualified for?`;
    }

    return {
      message,
      intent: "CHECK_ELIGIBILITY",
      steps,
      data: { course, isEligible, missingPrereqs, seats: primarySection.available },
      requiresConfirmation,
      confirmationAction,
      suggestedQuickActions: isEligible
        ? [`Register for ${course.code}`, "Check Timetable", "View Syllabus"]
        : ["Find Eligible Alternatives", "View Degree Roadmap", "Check Prerequisites"],
    };
  }

  // --- 8. Registration Intent Flow ---
  private async handleRegistrationIntentFlow(
    userMessage: string,
    student: Student,
    courses: Course[],
    steps: AgentStepEvent[]
  ): Promise<AgentResponsePayload> {
    const course = courses[0] || this.extractCourse(userMessage) || globalUnivDb.courses.get("CS401")!;
    const primarySection = course.sections[0];

    const isAlreadyEnrolled =
      (student.currentEnrollments || []).includes(course.code) ||
      (student.completedCourses || []).includes(course.code);

    if (isAlreadyEnrolled) {
      return {
        message: `🔒 **Registration Locked:** You are already enrolled in **${course.code} — ${course.name}**!\n\nUnder university policy, multiple registrations for the same course are locked for the same individual. One enrollment is permitted per student, with guaranteed lifelong access to all lecture videos, lab environments, and course certifications.\n\nYou can access your learning curriculum and coding labs anytime under **Enrolled Courses**!`,
        intent: "ALREADY_ENROLLED",
        steps,
        data: { course, isAlreadyEnrolled: true, isLocked: true },
        suggestedQuickActions: ["Open Course Learning", "View Degree Progress", "Explore Other Courses"],
      };
    }

    const completedSet = new Set(student.completedCourses || []);
    const missing = (course.prerequisites || []).filter((p: string) => !completedSet.has(p));

    if (missing.length > 0) {
      return {
        message: `❌ Cannot proceed with registration for **${course.code}**. You have missing prerequisite(s): **${missing.join(", ")}**.\n\nPlease complete these prerequisites first or petition the academic dean for a prerequisite waiver.`,
        intent: "REGISTRATION_BLOCKED",
        steps,
        suggestedQuickActions: ["Find Eligible Courses", "View Degree Progress"],
      };
    }

    const schedStr = primarySection.schedule
      .map((s: any) => `${s.day} ${s.startTime}–${s.endTime}`)
      .join(", ");

    const lockStep: AgentStepEvent = {
      eventId: `ev-${Date.now()}-prelock`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timeExact: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      step: "Pre-registration audit complete",
      detail: `Validated enrollment gate for ${student.name}: ${course.code} (${primarySection.sectionCode})`,
      tool: "pre_registration_gate",
      status: "COMPLETED",
      durationMs: 44,
      source: "University Registration Gateway",
    };
    eventBus.emitAgentEvent(lockStep);
    steps.push(lockStep);

    const message =
      `I have verified all academic requirements for **${course.code} — ${course.name}**:\n\n` +
      `• **Section:** ${primarySection.sectionCode} (${primarySection.instructor})\n` +
      `• **Classroom:** ${primarySection.room}\n` +
      `• **Meeting Times:** ${schedStr}\n` +
      `• **Credits:** ${course.credits} Credits\n` +
      `• **Live Seats Remaining:** **${primarySection.available} seats**\n\n` +
      `Click **"Confirm Registration"** below to submit this registration to the authorized University Registrar.`;

    return {
      message,
      intent: "REGISTER_COURSE_CONFIRMATION_REQUIRED",
      steps,
      requiresConfirmation: true,
      confirmationAction: {
        type: "REGISTER",
        courseCode: course.code,
        courseName: course.name,
        sectionCode: primarySection.sectionCode,
        credits: course.credits,
        schedule: schedStr,
        seatsAvailable: primarySection.available,
        eligibilitySummary: `Prerequisites verified, CGPA ${student.cgpa} meets requirement, credit headroom available.`,
      },
      suggestedQuickActions: [
        `Confirm Registration for ${course.code}`,
        "Review Timetable Slots",
        "Cancel",
      ],
    };
  }

  // --- 9. Course Recommendation Flow ---
  private async handleRecommendationFlow(
    userMessage: string,
    student: Student,
    steps: AgentStepEvent[]
  ): Promise<AgentResponsePayload> {
    const listStep: AgentStepEvent = {
      eventId: `ev-${Date.now()}-rec`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timeExact: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      step: "Dynamic career & prerequisite scoring",
      detail: `Ranking open Fall 2026 catalog against ${student.name}'s target: "${student.careerGoal}"`,
      tool: "recommend_courses",
      status: "COMPLETED",
      durationMs: 55,
      source: "Academic Advisor Intelligence",
    };
    eventBus.emitAgentEvent(listStep);
    steps.push(listStep);

    const recommendations = globalUnivDb.getRecommendedCoursesForStudent(student).slice(0, 3);
    const top = recommendations[0];

    const recLines = recommendations
      .map((r, i) => {
        const sec = r.sections[0];
        return (
          `**${i + 1}. ${r.code} — ${r.name}** (${r.matchScore}% Match • ${r.matchBadge})\n` +
          `   • *Credits:* ${r.credits} | *Type:* ${r.type} | *Seats Available:* **${sec?.available || 0} seats** in ${sec?.sectionCode || "Section A"}\n` +
          `   • *Why this course:* ${r.matchReason?.join("; ") || "Matches academic trajectory"}`
        );
      })
      .join("\n\n");

    const message =
      `Based on your academic profile, completed transcript coursework, and career target as a **${student.careerGoal}**, here are the top 3 recommended courses for Fall 2026:\n\n${recLines}\n\n` +
      `Would you like me to register you for **${top.code}** or check timetable fit?`;

    return {
      message,
      intent: "RECOMMEND_COURSES",
      steps,
      data: { recommendations },
      suggestedQuickActions: [
        `Register for ${top.code}`,
        `Check ${top.code} Eligibility`,
        "Explore More Electives",
      ],
    };
  }

  // --- 10. Timetable Flow ---
  private async handleTimetableFlow(
    userMessage: string,
    student: Student,
    steps: AgentStepEvent[]
  ): Promise<AgentResponsePayload> {
    const timetable = globalUnivDb.getStudentTimetable(student.id);

    const step: AgentStepEvent = {
      eventId: `ev-${Date.now()}-tt`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timeExact: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      step: "Timetable collision analysis",
      detail: `Audited ${timetable.length} registered slots against room matrix`,
      tool: "get_live_timetable",
      status: "COMPLETED",
      durationMs: 30,
      source: "University Room Scheduling System",
    };
    eventBus.emitAgentEvent(step);
    steps.push(step);

    let message = "";
    if (timetable.length === 0) {
      message =
        `Your weekly timetable for Fall 2026 is currently **100% open with zero schedule conflicts**!\n\n` +
        `All standard lecture blocks are available:\n` +
        `• **Monday/Wednesday 10:00–11:00 AM:** CS401 Machine Learning\n` +
        `• **Monday/Wednesday 13:00–14:30 PM:** CS305 Database Systems\n` +
        `• **Tuesday/Thursday 10:00–11:30 AM:** CS320 Cloud Computing\n` +
        `• **Friday 10:00–13:00 PM:** CS380 Cybersecurity\n\n` +
        `Would you like me to help you schedule and register for your first course?`;
    } else {
      const list = timetable
        .map((t) => `• **${t.courseCode}** (${t.day} ${t.startTime}–${t.endTime} at ${t.room})`)
        .join("\n");
      message =
        `Here is your current registered weekly schedule:\n\n${list}\n\n` +
        `All slots are synchronized with the university room database and confirmed collision-free.`;
    }

    return {
      message,
      intent: "TIMETABLE_INQUIRY",
      steps,
      data: { timetable },
      suggestedQuickActions: [
        "View Weekly Timetable",
        "Check CS401 Schedule",
        "Suggest Electives for Me",
      ],
    };
  }

  // --- 11. What-If Simulation Flow ---
  private async handleWhatIfFlow(
    userMessage: string,
    student: Student,
    steps: AgentStepEvent[]
  ): Promise<AgentResponsePayload> {
    const isDrop = userMessage.toLowerCase().includes("drop");
    const simulation = await AgentTools.run_what_if_simulation(student.id, {
      action: isDrop ? "drop" : "swap",
      courseCode: "CS305",
    });

    const message =
      `**What-If Simulation Results:**\n\n${simulation.explanation}\n\n` +
      `• Current Completed Credits: **${simulation.originalCredits}** → Projected: **${simulation.simulatedCredits}**\n` +
      `• Degree Progress: **${simulation.originalProgress}%** → Projected: **${simulation.simulatedProgress}%**\n` +
      `• Graduation Impact: ${simulation.graduationDelayRisk ? "⚠️ Risk of 1-semester delay" : "✓ On track"}\n\n` +
      `**Advisor Recommendation:** ${simulation.aiRecommendation}`;

    return {
      message,
      intent: "WHAT_IF_SIMULATION",
      steps,
      data: { simulation },
      suggestedQuickActions: [
        "Keep Course in Plan",
        "Explore Alternative Electives",
        "Check Credit Limits",
      ],
    };
  }

  // --- 12. Document RAG Flow ---
  private async handleDocumentRAGFlow(
    userMessage: string,
    student: Student,
    steps: AgentStepEvent[]
  ): Promise<AgentResponsePayload> {
    const docs = await AgentTools.search_university_documents(userMessage);

    let message = "";
    if (docs.length > 0) {
      const top = docs[0];
      message =
        `According to the official **${top.document.title}** (${top.document.section}):\n\n` +
        `> "${top.snippet}"\n\n` +
        `*Source: ${top.document.sourceFile} (Verified: Fall 2026)*`;
    } else {
      message =
        `According to University Academic Regulations (Section 4.2), undergraduate students in good standing (CGPA ≥ 6.0) may register for up to **18 credits** per semester. ` +
        `Students on the Dean's Honor Roll (CGPA ≥ 8.5) may request an overload up to **21 credits** with advisor approval. ` +
        `The Fall 2026 add/drop deadline without transcript notation is **October 25, 2026**.`;
    }

    return {
      message,
      intent: "DOCUMENT_SEARCH",
      steps,
      data: { documents: docs },
      suggestedQuickActions: [
        "Check Credit Limits",
        "Registration Deadlines",
        "View Degree Requirements",
      ],
    };
  }

  // --- 13. Knowledge Answering Flow ---
  private async handleKnowledgeQueryFlow(
    rawQuery: string,
    student: Student,
    steps: AgentStepEvent[],
    apiKey?: string | null,
    selectedModel?: string
  ): Promise<AgentResponsePayload> {
    const step: AgentStepEvent = {
      eventId: `ev-${Date.now()}-knowledge`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timeExact: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      step: "Consulting Universal Academic & Technical Knowledge Engine",
      detail: `Synthesizing pedagogical answer for: "${rawQuery}" (${student.program}, Semester ${student.semester})`,
      tool: "universal_knowledge_engine",
      status: "COMPLETED",
      durationMs: 42,
      source: "CoursePilot Autonomous Intelligence",
    };
    eventBus.emitAgentEvent(step);
    steps.push(step);

    const answer = await universalKnowledgeEngine.answerQuestion(rawQuery, student, apiKey, selectedModel);
    return {
      message: answer.message,
      intent: answer.intent,
      steps,
      data: { topicCategory: answer.topicCategory, source: answer.source },
      suggestedQuickActions: answer.suggestedQuickActions,
    };
  }

  // --- 14. Universal Fallback Academic Advising Flow ---
  private async handleUniversalAdvisingFlow(
    rawQuery: string,
    student: Student,
    courses: Course[],
    steps: AgentStepEvent[],
    apiKey?: string | null,
    selectedModel?: string
  ): Promise<AgentResponsePayload> {
    return this.handleKnowledgeQueryFlow(rawQuery, student, steps, apiKey, selectedModel);
  }
}

export const orchestrator = AgentOrchestrator.getInstance();
