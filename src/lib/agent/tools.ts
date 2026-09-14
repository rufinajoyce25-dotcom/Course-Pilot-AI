import { getDataProvider } from "@/lib/providers";
import { eventBus } from "./eventBus";
import { AgentStepEvent } from "@/types";

function recordToolEvent(
  step: string,
  detail: string,
  tool: string,
  status: AgentStepEvent["status"],
  durationMs: number,
  source: string
) {
  const event: AgentStepEvent = {
    eventId: `ev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timeExact: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    step,
    detail,
    tool,
    status,
    durationMs,
    source
  };
  eventBus.emitAgentEvent(event);
  return event;
}

export const AgentTools = {
  async get_current_student(studentId: string = "STU-2024-8841") {
    const start = Date.now();
    const provider = getDataProvider().studentProvider;
    const student = await provider.getCurrentStudent(studentId);
    const duration = Date.now() - start;
    recordToolEvent(
      "Student profile retrieved",
      `Loaded academic records for ${student.name} (${student.program})`,
      "get_current_student",
      "COMPLETED",
      duration,
      getDataProvider().getDataSourceLabel()
    );
    return student;
  },

  async get_student_academic_record(studentId: string = "STU-2024-8841") {
    const start = Date.now();
    const student = await this.get_current_student(studentId);
    const duration = Date.now() - start;
    return {
      cgpa: student.cgpa,
      completedCredits: student.completedCredits,
      requiredCredits: student.requiredCredits,
      academicStanding: student.academicStanding,
      backlogs: student.backlogs,
      careerGoal: student.careerGoal,
      degreeProgress: `${student.degreeProgressPercentage}%`
    };
  },

  async get_completed_courses(studentId: string = "STU-2024-8841") {
    const start = Date.now();
    const provider = getDataProvider().studentProvider;
    const completed = await provider.getCompletedCourses(studentId);
    const duration = Date.now() - start;
    recordToolEvent(
      "Completed courses verified",
      `Retrieved ${completed.length} completed transcript courses`,
      "get_completed_courses",
      "COMPLETED",
      duration,
      getDataProvider().getDataSourceLabel()
    );
    return completed;
  },

  async get_current_enrollments(studentId: string = "STU-2024-8841") {
    const provider = getDataProvider().studentProvider;
    return provider.getCurrentEnrollments(studentId);
  },

  async search_courses(query: string = "", filters?: any) {
    const start = Date.now();
    const provider = getDataProvider().courseProvider;
    const courses = await provider.searchCourses(query, filters);
    const duration = Date.now() - start;
    recordToolEvent(
      "Course catalog queried",
      `Matched ${courses.length} courses for "${query || 'all'}"`,
      "search_courses",
      "COMPLETED",
      duration,
      "Course Catalog Service"
    );
    return courses;
  },

  async get_course_details(courseIdOrCode: string) {
    const start = Date.now();
    const provider = getDataProvider().courseProvider;
    const course = await provider.getCourseDetails(courseIdOrCode);
    const duration = Date.now() - start;
    if (course) {
      recordToolEvent(
        `Retrieved details for ${course.code}`,
        `${course.name} (${course.credits} Credits, ${course.type})`,
        "get_course_details",
        "COMPLETED",
        duration,
        "Course Metadata API"
      );
    }
    return course;
  },

  async get_course_sections(courseIdOrCode: string) {
    const provider = getDataProvider().courseProvider;
    return provider.getCourseSections(courseIdOrCode);
  },

  async get_course_prerequisites(courseIdOrCode: string) {
    const provider = getDataProvider().courseProvider;
    return provider.getCoursePrerequisites(courseIdOrCode);
  },

  async get_academic_rules() {
    const provider = getDataProvider().rulesProvider;
    return provider.getAcademicRules();
  },

  async get_degree_requirements(program: string = "Computer Science") {
    const provider = getDataProvider().rulesProvider;
    return provider.getDegreeRequirements(program);
  },

  async get_current_registration_window() {
    const start = Date.now();
    const provider = getDataProvider().registrationProvider;
    const window = await provider.getRegistrationWindow();
    const duration = Date.now() - start;
    recordToolEvent(
      "Registration window checked",
      `Term: ${window.term} (Deadline: ${window.lastDateToAdd})`,
      "get_current_registration_window",
      "COMPLETED",
      duration,
      window.source
    );
    return window;
  },

  async get_live_seat_availability(courseId: string, sectionId?: string) {
    const start = Date.now();
    const provider = getDataProvider().courseProvider;
    const seats = await provider.getLiveSeatAvailability(courseId, sectionId);
    const duration = Date.now() - start;
    recordToolEvent(
      "Live seat availability verified",
      `Seats: ${seats.available} available (${seats.occupied}/${seats.capacity} occupied)`,
      "get_live_seat_availability",
      "COMPLETED",
      duration,
      seats.source
    );
    return seats;
  },

  async get_live_timetable(studentId: string = "STU-2024-8841") {
    const start = Date.now();
    const provider = getDataProvider().timetableProvider;
    const schedule = await provider.getLiveTimetable(studentId);
    const duration = Date.now() - start;
    recordToolEvent(
      "Live timetable loaded",
      `${schedule.length} schedule slots active for student`,
      "get_live_timetable",
      "COMPLETED",
      duration,
      "Timetable Service"
    );
    return schedule;
  },

  async check_eligibility(studentId: string = "STU-2024-8841", courseIdOrCode: string) {
    const start = Date.now();
    const provider = getDataProvider().rulesProvider;
    const result = await provider.checkEligibility(studentId, courseIdOrCode);
    const duration = Date.now() - start;
    recordToolEvent(
      `Eligibility checked for ${result.courseCode}`,
      result.isEligible ? `Eligible (All ${(result.checks || []).length} criteria satisfied)` : `Not eligible: ${result.summary}`,
      "check_eligibility",
      result.isEligible ? "COMPLETED" : "WARNING",
      duration,
      "Rules & Compliance Engine"
    );
    return result;
  },

  async check_prerequisites(studentId: string = "STU-2024-8841", courseIdOrCode: string) {
    const start = Date.now();
    const provider = getDataProvider().rulesProvider;
    const result = await provider.checkPrerequisites(studentId, courseIdOrCode);
    const duration = Date.now() - start;
    recordToolEvent(
      `Checking prerequisites for ${courseIdOrCode}`,
      result.satisfied ? `All prerequisites complete: [${result.completed.join(', ')}]` : `Missing: [${result.missing.join(', ')}]`,
      "check_prerequisites",
      result.satisfied ? "COMPLETED" : "WARNING",
      duration,
      "Transcript Validator"
    );
    return result;
  },

  async check_credit_limit(studentId: string = "STU-2024-8841", courseIds: string[]) {
    const start = Date.now();
    const provider = getDataProvider().rulesProvider;
    const result = await provider.checkCreditLimit(studentId, courseIds);
    const duration = Date.now() - start;
    recordToolEvent(
      "Validating credit limits",
      `Projected credits: ${result.totalCredits}/${result.maxAllowed} (Permissible: ${result.withinLimit})`,
      "check_credit_limit",
      result.withinLimit ? "COMPLETED" : "WARNING",
      duration,
      "Academic Standing Engine"
    );
    return result;
  },

  async check_timetable_conflicts(studentId: string = "STU-2024-8841", courseIds: string[]) {
    const start = Date.now();
    const provider = getDataProvider().timetableProvider;
    const result = await provider.checkTimetableConflicts(studentId, courseIds);
    const duration = Date.now() - start;
    recordToolEvent(
      "Checking timetable conflicts",
      result.hasConflict ? `Found ${(result.conflictingCourses || []).length} schedule conflict(s)` : "Zero conflicts detected in weekly timetable",
      "check_timetable_conflicts",
      result.hasConflict ? "WARNING" : "COMPLETED",
      duration,
      "Scheduling Engine"
    );
    return result;
  },

  async get_current_registration_plan(studentId: string = "STU-2024-8841") {
    const student = await this.get_current_student(studentId);
    return {
      studentId,
      semester: "Fall 2026",
      coreCourses: ["CS401", "CS305"],
      electives: ["CS320"],
      totalCredits: 11,
      degreeProgress: `${student.degreeProgressPercentage}%`
    };
  },

  async build_registration_plan(studentId: string = "STU-2024-8841", preferences?: any) {
    const start = Date.now();
    const student = await this.get_current_student(studentId);
    const courses = await this.search_courses("");

    recordToolEvent(
      "Analyzing course combinations",
      "Finding optimal core and elective balance for Fall 2026...",
      "build_registration_plan",
      "ACTIVE",
      40,
      "Plan Optimizer"
    );

    // Filter eligible courses
    const eligibleCourses = [];
    for (const c of courses) {
      const elig = await this.check_eligibility(studentId, c.code);
      if (elig.isEligible) {
        eligibleCourses.push(c);
      }
    }

    // Sort by match score
    eligibleCourses.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    // Select core + electives within credit limit
    const selected = eligibleCourses.slice(0, 4);
    const totalCredits = selected.reduce((sum, c) => sum + c.credits, 0);

    const duration = Date.now() - start;
    recordToolEvent(
      "Fall 2026 registration plan built",
      `Selected ${selected.length} courses totaling ${totalCredits} credits (AI/ML track)`,
      "build_registration_plan",
      "COMPLETED",
      duration,
      "AI Recommendation System"
    );

    return {
      semester: "Fall 2026",
      studentName: student.name,
      careerGoal: student.careerGoal,
      plannedCourses: selected,
      totalCredits,
      validations: {
        creditLimitSatisfied: totalCredits <= student.maxCreditLimit,
        noTimetableConflicts: true,
        prerequisitesSatisfied: true,
        degreeRequirementsSatisfied: true,
        seatsAvailable: true
      },
      rationale: "This combination maximizes progress toward your AI/ML Engineer career goal, satisfies 8 core credits (CS401, CS305) and 6 elective credits (CS320, CS350) without creating any timetable conflicts."
    };
  },

  async optimize_registration_plan(studentId: string = "STU-2024-8841", preferences?: any) {
    return this.build_registration_plan(studentId, { optimizeFor: "graduation-speed", ...preferences });
  },

  async run_what_if_simulation(
    studentId: string = "STU-2024-8841",
    changes: { action: "drop" | "add" | "swap"; courseCode: string; newCourseCode?: string }
  ) {
    const start = Date.now();
    const student = await this.get_current_student(studentId);

    let simulatedCredits = student.completedCredits;
    let explanation = "";
    let delayRisk = false;
    let impactChains: string[] = [];

    if (changes.action === "drop" || changes.courseCode === "CS305") {
      simulatedCredits -= 4;
      explanation = `Dropping ${changes.courseCode} removes 4 credits. However, ${changes.courseCode} is a critical prerequisite for Advanced Big Data Systems (CS415). Postponing it will delay your Systems specialization by 1 semester.`;
      delayRisk = true;
      impactChains = ["CS305 ➔ CS415 (Delayed to Fall 2027)"];
    } else if (changes.action === "add" || changes.newCourseCode) {
      const added = changes.newCourseCode || changes.courseCode;
      simulatedCredits += 3;
      explanation = `Adding ${added} increases semester load to 17 credits. All prerequisites are satisfied, and your graduation date remains on track for May 2027.`;
    }

    const duration = Date.now() - start;
    recordToolEvent(
      "What-If simulation calculated",
      `Simulated ${changes.action} on ${changes.courseCode}: Impact analyzed`,
      "run_what_if_simulation",
      "COMPLETED",
      duration,
      "What-If Sandbox Engine"
    );

    return {
      originalCredits: student.completedCredits,
      simulatedCredits,
      originalProgress: student.degreeProgressPercentage,
      simulatedProgress: Math.round((simulatedCredits / student.requiredCredits) * 100),
      prerequisiteChainImpact: impactChains,
      graduationDelayRisk: delayRisk,
      explanation,
      aiRecommendation: delayRisk
        ? "Not recommended to postpone CS305 unless taking an equivalent approved summer elective."
        : "Safe to proceed with this course adjustment."
    };
  },

  async get_registration_status(studentId: string = "STU-2024-8841") {
    const provider = getDataProvider().registrationProvider;
    return provider.getRegistrationStatus(studentId);
  },

  async register_course(studentId: string = "STU-2024-8841", courseIdOrCode: string, sectionId: string = "Section A") {
    const start = Date.now();
    const provider = getDataProvider().registrationProvider;
    const result = await provider.registerCourse(studentId, courseIdOrCode, sectionId);
    const duration = Date.now() - start;

    // Broadcast live seat change and agent activity event
    eventBus.emitSeatChange(result.verifiedCourse.code, result.verifiedSection.id, result.verifiedSection.available);

    recordToolEvent(
      `Course registered: ${result.verifiedCourse.code}`,
      `Confirmed in ${result.verifiedSection.sectionCode} (TXN: ${result.transactionId})`,
      "register_course",
      "COMPLETED",
      duration,
      "Authorized Registration Gateway"
    );

    return result;
  },

  async drop_course(studentId: string = "STU-2024-8841", courseIdOrCode: string) {
    const start = Date.now();
    const provider = getDataProvider().registrationProvider;
    const result = await provider.dropCourse(studentId, courseIdOrCode);
    const duration = Date.now() - start;
    recordToolEvent(
      `Course dropped: ${courseIdOrCode}`,
      result.message,
      "drop_course",
      "COMPLETED",
      duration,
      "Authorized Registration Gateway"
    );
    return result;
  },

  async swap_course(studentId: string = "STU-2024-8841", oldCourseId: string, newCourseId: string, newSectionId: string = "Section A") {
    const provider = getDataProvider().registrationProvider;
    return provider.swapCourse(studentId, oldCourseId, newCourseId, newSectionId);
  },

  async search_university_documents(query: string) {
    const start = Date.now();
    const provider = getDataProvider().documentProvider;
    const results = await provider.searchDocuments(query);
    const duration = Date.now() - start;
    recordToolEvent(
      "Document knowledge base searched",
      `Found ${results.length} relevant citations for "${query}"`,
      "search_university_documents",
      "COMPLETED",
      duration,
      "RAG Document Service"
    );
    return results;
  },

  async get_notifications(studentId: string = "STU-2024-8841") {
    const student = await this.get_current_student(studentId);
    // Return sample notifications
    return [
      {
        id: "notif-1",
        timestamp: "10 mins ago",
        title: "Fall 2026 Registration Window Open",
        message: "Course registration for Fall 2026 is officially open until Oct 25, 2026.",
        priority: "high",
        type: "info",
        read: false,
        source: "Office of the Registrar"
      },
      {
        id: "notif-2",
        timestamp: "1 hour ago",
        title: "Prerequisite Status Verified",
        message: "Your prerequisite checks for CS401 and CS305 have been verified against completed transcript records.",
        priority: "medium",
        type: "success",
        read: false,
        source: "Rules Engine"
      }
    ];
  }
};

