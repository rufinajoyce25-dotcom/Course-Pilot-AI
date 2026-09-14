import {
  Student,
  Course,
  CourseSection,
  EligibilityResult,
  ConflictResult,
  TimetableSlot,
  UniversityDocument,
  DataStatus
} from "@/types";
import {
  UniversityStudentProvider,
  UniversityCourseProvider,
  UniversityRegistrationProvider,
  UniversityTimetableProvider,
  UniversityRulesProvider,
  UniversityDocumentProvider,
  UniversityDataProviderSuite
} from "./types";

// In-Memory Normalized State Store
class UniversityDataStore {
  public student: Student;
  public courses: Map<string, Course>;
  public completedCourses: Set<string>;
  public currentEnrollments: Set<string>;
  public registrationWindow: {
    isOpen: boolean;
    term: string;
    startDate: string;
    endDate: string;
    lastDateToAdd: string;
    withdrawalDeadline: string;
    source: string;
  };
  public documents: UniversityDocument[];
  public notifications: Array<{
    id: string;
    timestamp: string;
    title: string;
    message: string;
    priority: "high" | "medium" | "low";
    type: "success" | "warning" | "info" | "error";
    read: boolean;
    source: string;
  }>;
  public registrationTransactions: Array<{
    transactionId: string;
    studentId: string;
    courseId: string;
    sectionId: string;
    action: "REGISTER" | "DROP" | "SWAP";
    timestamp: string;
    status: "CONFIRMED" | "CANCELLED";
  }>;

  constructor() {
    this.student = {
      id: "STU-2024-8841",
      name: "Alex Chen",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      email: "alex.chen@university.edu",
      program: "Computer Science",
      department: "School of Computing & Data Science",
      semester: 6,
      cgpa: 8.7,
      completedCredits: 96,
      requiredCredits: 140,
      completedCourses: [
        "CS101", "CS102", "CS201", "CS202", "CS205",
        "MATH201", "MATH202", "CS301", "CS302", "CS304"
      ],
      currentEnrollments: [],
      academicStanding: "Honor Roll",
      backlogs: 0,
      careerGoal: "AI/ML Engineer",
      degreeProgressPercentage: 68,
      coreCoursesCompleted: 12,
      coreCoursesTotal: 16,
      electivesCompleted: 8,
      electivesTotal: 12,
      maxCreditLimit: 18,
      currentCreditLimit: 18,
    };

    this.completedCourses = new Set(this.student.completedCourses);
    this.currentEnrollments = new Set(this.student.currentEnrollments);

    this.registrationWindow = {
      isOpen: true,
      term: "Fall 2026",
      startDate: "Oct 10, 2026",
      endDate: "Oct 25, 2026",
      lastDateToAdd: "Oct 17, 2026",
      withdrawalDeadline: "Nov 05, 2026",
      source: "University Academic Calendar Service",
    };

    this.courses = new Map();
    this.seedCourses();

    this.documents = [
      {
        id: "doc-1",
        title: "Academic Regulations 2026",
        category: "Regulations",
        section: "Section 4.2 - Credit Load & Overloads",
        content: "Undergraduate students in good standing (CGPA >= 6.0) may register for a maximum of 18 credits per regular semester. Students on the Dean's Honor Roll (CGPA >= 8.5) may petition for an overload up to 21 credits with academic advisor approval. Minimum full-time registration is 12 credits.",
        lastUpdated: "Fall 2026",
        sourceFile: "Regulations_2026_RevB.pdf"
      },
      {
        id: "doc-2",
        title: "Course Registration Policy",
        category: "Policy",
        section: "Section 2.1 - Add/Drop Periods & Live Seat Allocation",
        content: "Course registration takes place through the automated portal. Course seats are reserved on a verified first-come-first-served basis upon student confirmation. The last date to add courses without penalty is Oct 17, 2026. Drops before Oct 25, 2026 will not appear on official academic transcripts.",
        lastUpdated: "Aug 2026",
        sourceFile: "Registration_Policy_Fall2026.pdf"
      },
      {
        id: "doc-3",
        title: "Degree Requirements: B.S. Computer Science",
        category: "Requirements",
        section: "AI/ML Specialization Track",
        content: "To graduate with an AI/ML Specialization track, students must complete: CS401 Machine Learning (Core, 4 credits), CS350 Computer Vision (Elective, 3 credits) or CS420 Natural Language Processing (Elective, 3 credits), and complete a capstone project with AI focus. Prerequisites CS201, CS202, and MATH202 must be satisfied prior to CS401.",
        lastUpdated: "Fall 2026",
        sourceFile: "BS_CS_Degree_Requirements_2026.pdf"
      },
      {
        id: "doc-4",
        title: "Prerequisite Enforcement Rules",
        category: "Handbook",
        section: "Section 3.5 - Mandatory Prerequisite Verification",
        content: "Prerequisites are verified automatically at the point of registration. A course marked as prerequisite must have a recorded passing grade (Grade >= C / 2.0). Co-requisites may be registered simultaneously provided both course sections do not create timetable collisions.",
        lastUpdated: "Fall 2026",
        sourceFile: "Course_Handbook_2026.pdf"
      }
    ];

    this.notifications = [
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

    this.registrationTransactions = [];
  }

  private seedCourses() {
    const rawCourses: Course[] = [
      {
        id: "c-cs401",
        code: "CS401",
        name: "Machine Learning",
        description: "Core course for AI specialization. Covers ML algorithms and applications, supervised & unsupervised learning, and neural networks.",
        credits: 4,
        department: "Computer Science",
        type: "Core",
        semester: "Fall 2026",
        level: 400,
        instructor: "Dr. Elena Rostova",
        prerequisites: ["CS201", "CS202", "MATH202"],
        minimumCgpa: 7.0,
        matchScore: 96,
        matchBadge: "High Match",
        matchReason: [
          "Directly matches your AI/ML Engineer career goal",
          "All 3 prerequisites completed (CS201, CS202, MATH202)",
          "Required core course for AI specialization track",
          "Optimal fit for your 18 credit semester limit",
          "No schedule conflicts with currently planned slots",
          "8 seats currently available in Section A"
        ],
        dataSource: {
          source: "University Registration API",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          status: "DEMO"
        },
        sections: [
          {
            id: "sec-cs401-a",
            sectionCode: "Section A",
            instructor: "Dr. Elena Rostova",
            room: "Turing Hall 302",
            schedule: [
              { day: "Monday", startTime: "10:00", endTime: "11:00" },
              { day: "Wednesday", startTime: "10:00", endTime: "11:00" }
            ],
            capacity: 50,
            occupied: 42,
            available: 8 // EXACTLY matches 8 seats available from prompt!
          },
          {
            id: "sec-cs401-b",
            sectionCode: "Section B",
            instructor: "Dr. David Kim",
            room: "Lovelace 104",
            schedule: [
              { day: "Tuesday", startTime: "14:00", endTime: "15:30" },
              { day: "Thursday", startTime: "14:00", endTime: "15:30" }
            ],
            capacity: 45,
            occupied: 41,
            available: 4
          }
        ]
      },
      {
        id: "c-cs305",
        code: "CS305",
        name: "Database Systems",
        description: "Fundamentals of database design, SQL, and data management. Relational models, indexing, transaction ACID properties, and distributed DBs.",
        credits: 4,
        department: "Computer Science",
        type: "Core",
        semester: "Fall 2026",
        level: 300,
        instructor: "Prof. Marcus Vance",
        prerequisites: ["CS201"],
        minimumCgpa: 6.5,
        matchScore: 91,
        matchBadge: "Recommended",
        matchReason: [
          "Core degree requirement for Semester 6",
          "Foundational for large-scale data engineering pipelines",
          "Prerequisite CS201 completed with grade A",
          "12 seats available in Section A"
        ],
        dataSource: {
          source: "University Registration API",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          status: "DEMO"
        },
        sections: [
          {
            id: "sec-cs305-a",
            sectionCode: "Section A",
            instructor: "Prof. Marcus Vance",
            room: "Hopper Hall 210",
            schedule: [
              { day: "Monday", startTime: "13:00", endTime: "14:30" },
              { day: "Wednesday", startTime: "13:00", endTime: "14:30" }
            ],
            capacity: 60,
            occupied: 48,
            available: 12
          }
        ]
      },
      {
        id: "c-cs320",
        code: "CS320",
        name: "Cloud Computing",
        description: "Introduction to cloud platforms and distributed systems. Microservices, Kubernetes, cloud storage architectures, and serverless compute.",
        credits: 3,
        department: "Computer Science",
        type: "Elective",
        semester: "Spring 2026",
        level: 300,
        instructor: "Dr. Aisha Patel",
        prerequisites: ["CS301"],
        minimumCgpa: 6.5,
        matchScore: 87,
        matchBadge: "Good Fit",
        matchReason: [
          "Fulfills 3 out of 12 required upper-level elective credits",
          "Essential skills for deploying machine learning pipelines in the cloud",
          "Prerequisite Operating Systems (CS301) completed",
          "No timetable conflicts"
        ],
        dataSource: {
          source: "University Registration API",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          status: "DEMO"
        },
        sections: [
          {
            id: "sec-cs320-a",
            sectionCode: "Section A",
            instructor: "Dr. Aisha Patel",
            room: "Berners-Lee 101",
            schedule: [
              { day: "Tuesday", startTime: "10:00", endTime: "11:30" },
              { day: "Thursday", startTime: "10:00", endTime: "11:30" }
            ],
            capacity: 40,
            occupied: 32,
            available: 8
          }
        ]
      },
      {
        id: "c-cs350",
        code: "CS350",
        name: "Computer Vision",
        description: "Convolutional neural networks, object detection, segmentation, optical flow, and generative diffusion models.",
        credits: 3,
        department: "Computer Science",
        type: "Elective",
        semester: "Fall 2026",
        level: 300,
        instructor: "Dr. Kenji Sato",
        prerequisites: ["CS401"],
        minimumCgpa: 7.5,
        matchScore: 93,
        matchBadge: "High Match",
        matchReason: [
          "Key component of AI/ML specialization track",
          "Co-requisite or follow-up to CS401 Machine Learning",
          "5 seats remaining"
        ],
        dataSource: {
          source: "University Registration API",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          status: "DEMO"
        },
        sections: [
          {
            id: "sec-cs350-a",
            sectionCode: "Section A",
            instructor: "Dr. Kenji Sato",
            room: "Shannon Hall 105",
            schedule: [
              { day: "Monday", startTime: "15:00", endTime: "16:30" },
              { day: "Wednesday", startTime: "15:00", endTime: "16:30" }
            ],
            capacity: 35,
            occupied: 30,
            available: 5
          }
        ]
      },
      {
        id: "c-cs420",
        code: "CS420",
        name: "Natural Language Processing",
        description: "Transformer models, attention mechanisms, fine-tuning LLMs, sequence-to-sequence architectures, and vector embeddings.",
        credits: 3,
        department: "Computer Science",
        type: "Elective",
        semester: "Fall 2026",
        level: 400,
        instructor: "Dr. Sarah Jenkins",
        prerequisites: ["CS401"],
        minimumCgpa: 7.5,
        matchScore: 89,
        matchBadge: "Recommended",
        dataSource: {
          source: "University Registration API",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          status: "DEMO"
        },
        sections: [
          {
            id: "sec-cs420-a",
            sectionCode: "Section A",
            instructor: "Dr. Sarah Jenkins",
            room: "Turing 204",
            schedule: [
              { day: "Tuesday", startTime: "11:30", endTime: "13:00" },
              { day: "Thursday", startTime: "11:30", endTime: "13:00" }
            ],
            capacity: 35,
            occupied: 33,
            available: 2
          }
        ]
      },
      {
        id: "c-cs380",
        code: "CS380",
        name: "Cybersecurity & Cryptography",
        description: "Public-key cryptography, TLS/SSL, zero-trust network models, penetration testing, and software vulnerability analysis.",
        credits: 3,
        department: "Computer Science",
        type: "Elective",
        semester: "Fall 2026",
        level: 300,
        instructor: "Prof. Victor Thorne",
        prerequisites: ["CS201", "MATH201"],
        minimumCgpa: 6.5,
        matchScore: 82,
        matchBadge: "Good Fit",
        dataSource: {
          source: "University Registration API",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          status: "DEMO"
        },
        sections: [
          {
            id: "sec-cs380-a",
            sectionCode: "Section A",
            instructor: "Prof. Victor Thorne",
            room: "Diffie-Hellman 102",
            schedule: [
              { day: "Friday", startTime: "10:00", endTime: "13:00" }
            ],
            capacity: 45,
            occupied: 38,
            available: 7
          }
        ]
      }
    ];

    for (const c of rawCourses) {
      this.courses.set(c.id, c);
      this.courses.set(c.code.toLowerCase(), c);
      this.courses.set(c.code, c);
    }
  }
}

// Global Singleton for Development in-memory DB
const globalStore = new UniversityDataStore();

export class DevelopmentStudentProvider implements UniversityStudentProvider {
  async getCurrentStudent(studentId: string): Promise<Student> {
    return { ...globalStore.student };
  }

  async getCompletedCourses(studentId: string): Promise<string[]> {
    return Array.from(globalStore.completedCourses);
  }

  async getCurrentEnrollments(studentId: string): Promise<string[]> {
    return Array.from(globalStore.currentEnrollments);
  }
}

export class DevelopmentCourseProvider implements UniversityCourseProvider {
  async searchCourses(query?: string, filters?: {
    department?: string;
    level?: number;
    type?: string;
    availableSeatsOnly?: boolean;
    semester?: string;
  }): Promise<Course[]> {
    const list: Course[] = [];
    const seen = new Set<string>();

    for (const course of Array.from(globalStore.courses.values())) {
      if (seen.has(course.id)) continue;
      seen.add(course.id);

      let match = true;
      if (query && query.trim().length > 0) {
        const q = query.toLowerCase();
        const inCode = course.code.toLowerCase().includes(q);
        const inName = course.name.toLowerCase().includes(q);
        const inDesc = course.description.toLowerCase().includes(q);
        const inDept = course.department.toLowerCase().includes(q);
        if (!inCode && !inName && !inDesc && !inDept) {
          match = false;
        }
      }

      if (filters?.department && course.department !== filters.department) match = false;
      if (filters?.level && course.level !== filters.level) match = false;
      if (filters?.type && course.type !== filters.type) match = false;
      if (filters?.availableSeatsOnly) {
        const totalAvail = course.sections.reduce((acc, s) => acc + s.available, 0);
        if (totalAvail <= 0) match = false;
      }

      if (match) {
        list.push({ ...course });
      }
    }

    return list;
  }

  async getCourseDetails(courseIdOrCode: string): Promise<Course | null> {
    const direct = globalStore.courses.get(courseIdOrCode) ||
                   globalStore.courses.get(courseIdOrCode.toLowerCase()) ||
                   globalStore.courses.get(courseIdOrCode.toUpperCase());
    if (direct) return { ...direct };

    // Partial search fallback
    for (const c of Array.from(globalStore.courses.values())) {
      if (c.name.toLowerCase().includes(courseIdOrCode.toLowerCase())) {
        return { ...c };
      }
    }
    return null;
  }

  async getCourseSections(courseIdOrCode: string): Promise<CourseSection[]> {
    const course = await this.getCourseDetails(courseIdOrCode);
    return course ? course.sections : [];
  }

  async getCoursePrerequisites(courseIdOrCode: string): Promise<string[]> {
    const course = await this.getCourseDetails(courseIdOrCode);
    return course ? course.prerequisites : [];
  }

  async getLiveSeatAvailability(courseId: string, sectionId?: string): Promise<{
    capacity: number;
    occupied: number;
    available: number;
    source: string;
    timestamp: string;
    status: DataStatus;
  }> {
    const course = await this.getCourseDetails(courseId);
    if (!course) {
      throw new Error(`Course not found: ${courseId}`);
    }

    if (sectionId) {
      const section = course.sections.find(s => s.id === sectionId || s.sectionCode.toLowerCase() === sectionId.toLowerCase());
      if (!section) throw new Error(`Section not found: ${sectionId}`);
      return {
        capacity: section.capacity,
        occupied: section.occupied,
        available: section.available,
        source: "University Registration API (Dev Provider)",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        status: "DEMO"
      };
    }

    // Default to first section or sum
    const sec = course.sections[0];
    return {
      capacity: sec.capacity,
      occupied: sec.occupied,
      available: sec.available,
      source: "University Registration API (Dev Provider)",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      status: "DEMO"
    };
  }
}

export class DevelopmentRegistrationProvider implements UniversityRegistrationProvider {
  async getRegistrationWindow() {
    return { ...globalStore.registrationWindow };
  }

  async getRegistrationStatus(studentId: string) {
    const enrollments = Array.from(globalStore.currentEnrollments);
    return {
      status: enrollments.length > 0 ? "PARTIALLY_REGISTERED" : "REGISTRATION_OPEN",
      enrollments,
      registrationId: `REG-FA26-${studentId.replace("STU-", "")}-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString()
    };
  }

  async registerCourse(studentId: string, courseId: string, sectionId: string) {
    const course = globalStore.courses.get(courseId) ||
                   globalStore.courses.get(courseId.toLowerCase()) ||
                   globalStore.courses.get(courseId.toUpperCase());
    if (!course) {
      throw new Error(`Invalid course: ${courseId}`);
    }

    // SINGLE ENROLLMENT RULE ENFORCEMENT - LOCKED REGISTRATION
    if (globalStore.currentEnrollments.has(course.code)) {
      throw new Error(`Registration Locked: You are already enrolled in ${course.code} (${course.name}). Multiple registrations for the same course are locked for the same individual, with permanent lifelong access to all videos and labs.`);
    }
    if (globalStore.student.completedCourses?.includes(course.code)) {
      throw new Error(`Registration Locked: You have already completed ${course.code} (${course.name}). Course re-enrollment is locked.`);
    }

    let section = course.sections.find(s => s.id === sectionId || s.sectionCode.toLowerCase() === sectionId.toLowerCase());
    if (!section) {
      section = course.sections[0];
    }

    if (section.available <= 0) {
      throw new Error(`No available seats in ${course.code} ${section.sectionCode}`);
    }

    // Mutate live seats (e.g. 8 -> 7)
    section.occupied += 1;
    section.available -= 1;

    // Mutate student state
    globalStore.currentEnrollments.add(course.code);
    globalStore.student.currentEnrollments = Array.from(globalStore.currentEnrollments);
    globalStore.student.completedCredits += course.credits;
    if (course.type === "Core") {
      globalStore.student.coreCoursesCompleted += 1;
    } else {
      globalStore.student.electivesCompleted += 1;
    }
    globalStore.student.degreeProgressPercentage = Math.round(
      (globalStore.student.completedCredits / globalStore.student.requiredCredits) * 100
    );

    const transactionId = `TXN-UNIV-${Math.floor(100000 + Math.random() * 900000)}`;
    const timestamp = new Date().toISOString();
    const scheduleStr = section.schedule.map(s => `${s.day} ${s.startTime}–${s.endTime}`).join(", ");

    globalStore.registrationTransactions.push({
      transactionId,
      studentId,
      courseId: course.id,
      sectionId: section.id,
      action: "REGISTER",
      timestamp,
      status: "CONFIRMED"
    });

    // Add notification
    globalStore.notifications.unshift({
      id: `notif-${Date.now()}`,
      timestamp: "Just now",
      title: `Registration Confirmed: ${course.code}`,
      message: `Successfully registered for ${course.code} ${course.name} (${section.sectionCode}). Transaction ID: ${transactionId}`,
      priority: "high",
      type: "success",
      read: false,
      source: "Real University SIS Gateway"
    });

    return {
      success: true,
      transactionId,
      message: `Registration confirmed for ${course.code} — ${course.name} (${section.sectionCode})`,
      timestamp,
      courseCode: course.code,
      courseName: course.name,
      sectionCode: section.sectionCode,
      room: section.room,
      schedule: scheduleStr,
      credits: course.credits,
      seatsRemaining: section.available,
      completedCreditsNow: globalStore.student.completedCredits,
      degreeProgressNow: globalStore.student.degreeProgressPercentage,
      verifiedCourse: course,
      verifiedSection: section
    };
  }

  async dropCourse(studentId: string, courseId: string) {
    const course = globalStore.courses.get(courseId) ||
                   globalStore.courses.get(courseId.toLowerCase());
    if (!course) throw new Error(`Course not found: ${courseId}`);

    if (globalStore.currentEnrollments.has(course.code)) {
      globalStore.currentEnrollments.delete(course.code);
      globalStore.student.currentEnrollments = Array.from(globalStore.currentEnrollments);
      globalStore.student.completedCredits -= course.credits;

      // Restore seat
      if (course.sections[0]) {
        course.sections[0].occupied = Math.max(0, course.sections[0].occupied - 1);
        course.sections[0].available += 1;
      }
    }

    const transactionId = `TXN-DROP-${Math.floor(100000 + Math.random() * 900000)}`;
    return {
      success: true,
      transactionId,
      message: `Course ${course.code} dropped successfully`,
      timestamp: new Date().toISOString()
    };
  }

  async swapCourse(studentId: string, oldCourseId: string, newCourseId: string, newSectionId: string) {
    await this.dropCourse(studentId, oldCourseId);
    const regResult = await this.registerCourse(studentId, newCourseId, newSectionId);
    return {
      success: true,
      transactionId: regResult.transactionId,
      message: `Swapped ${oldCourseId} for ${newCourseId}`,
      timestamp: new Date().toISOString()
    };
  }
}

export class DevelopmentTimetableProvider implements UniversityTimetableProvider {
  async getLiveTimetable(studentId: string): Promise<TimetableSlot[]> {
    const slots: TimetableSlot[] = [];
    const colors = ["#6366f1", "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"];
    let colorIdx = 0;

    for (const code of globalStore.currentEnrollments) {
      const course = globalStore.courses.get(code);
      if (!course) continue;
      const sec = course.sections[0];
      const color = colors[colorIdx % colors.length];
      colorIdx++;

      for (const item of sec.schedule) {
        slots.push({
          day: item.day,
          startTime: item.startTime,
          endTime: item.endTime,
          courseCode: course.code,
          courseName: course.name,
          sectionCode: sec.sectionCode,
          room: sec.room,
          instructor: sec.instructor,
          color
        });
      }
    }

    return slots;
  }

  async checkTimetableConflicts(studentId: string, candidateCourseIds: string[]): Promise<ConflictResult> {
    const existingSlots = await this.getLiveTimetable(studentId);
    const candidateSlots: (TimetableSlot & { candidate: boolean })[] = [];

    for (const id of candidateCourseIds) {
      const course = globalStore.courses.get(id) || globalStore.courses.get(id.toLowerCase());
      if (!course) continue;
      const sec = course.sections[0];
      for (const item of sec.schedule) {
        candidateSlots.push({
          day: item.day,
          startTime: item.startTime,
          endTime: item.endTime,
          courseCode: course.code,
          courseName: course.name,
          sectionCode: sec.sectionCode,
          room: sec.room,
          instructor: sec.instructor,
          color: "#4f46e5",
          candidate: true
        });
      }
    }

    const conflicts: ConflictResult["conflictingCourses"] = [];

    const timeToMin = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };

    // Check candidate vs existing
    for (const cand of candidateSlots) {
      for (const exist of existingSlots) {
        if (cand.courseCode === exist.courseCode) continue;
        if (cand.day === exist.day) {
          const cStart = timeToMin(cand.startTime);
          const cEnd = timeToMin(cand.endTime);
          const eStart = timeToMin(exist.startTime);
          const eEnd = timeToMin(exist.endTime);

          if (Math.max(cStart, eStart) < Math.min(cEnd, eEnd)) {
            conflicts.push({
              courseA: cand.courseCode,
              courseB: exist.courseCode,
              day: cand.day,
              time: `${cand.startTime}-${cand.endTime}`,
              details: `Conflict between ${cand.courseCode} (${cand.startTime}-${cand.endTime}) and enrolled ${exist.courseCode} (${exist.startTime}-${exist.endTime}) on ${cand.day}`
            });
          }
        }
      }
    }

    // Check candidate vs candidate
    for (let i = 0; i < candidateSlots.length; i++) {
      for (let j = i + 1; j < candidateSlots.length; j++) {
        const c1 = candidateSlots[i];
        const c2 = candidateSlots[j];
        if (c1.courseCode === c2.courseCode) continue;
        if (c1.day === c2.day) {
          const s1 = timeToMin(c1.startTime);
          const e1 = timeToMin(c1.endTime);
          const s2 = timeToMin(c2.startTime);
          const e2 = timeToMin(c2.endTime);

          if (Math.max(s1, s2) < Math.min(e1, e2)) {
            conflicts.push({
              courseA: c1.courseCode,
              courseB: c2.courseCode,
              day: c1.day,
              time: `${c1.startTime}-${c1.endTime}`,
              details: `Conflict between planned ${c1.courseCode} and ${c2.courseCode} on ${c1.day}`
            });
          }
        }
      }
    }

    return {
      hasConflict: conflicts.length > 0,
      conflictingCourses: conflicts,
      suggestedAlternatives: conflicts.length > 0 ? [
        {
          courseCode: "CS401",
          alternativeSection: "Section B",
          schedule: "Tuesday/Thursday 14:00-15:30 (Lovelace 104)"
        }
      ] : []
    };
  }
}

export class DevelopmentRulesProvider implements UniversityRulesProvider {
  async getAcademicRules() {
    return {
      minCgpaForElectives: 6.5,
      maxCreditsStandard: 18,
      maxCreditsProbation: 12,
      addDropDeadlineDays: 7,
      passingGradeCgpa: 5.0
    };
  }

  async getDegreeRequirements(program: string) {
    return {
      totalRequiredCredits: 140,
      coreCreditsRequired: 64,
      electiveCreditsRequired: 36,
      specializationTracks: ["Artificial Intelligence / ML", "Cloud Systems", "Cybersecurity"]
    };
  }

  async checkPrerequisites(studentId: string, courseIdOrCode: string) {
    const course = globalStore.courses.get(courseIdOrCode) || globalStore.courses.get(courseIdOrCode.toLowerCase());
    if (!course) throw new Error(`Course not found: ${courseIdOrCode}`);

    const completed = course.prerequisites.filter(pr => globalStore.completedCourses.has(pr));
    const missing = course.prerequisites.filter(pr => !globalStore.completedCourses.has(pr));

    return {
      satisfied: missing.length === 0,
      completed,
      missing
    };
  }

  async checkCreditLimit(studentId: string, proposedCourseIds: string[]) {
    let currentEnrolledCredits = 0;
    for (const code of globalStore.currentEnrollments) {
      const c = globalStore.courses.get(code);
      if (c) currentEnrolledCredits += c.credits;
    }

    let addedCredits = 0;
    for (const id of proposedCourseIds) {
      const c = globalStore.courses.get(id) || globalStore.courses.get(id.toLowerCase());
      if (c) addedCredits += c.credits;
    }

    const totalCredits = currentEnrolledCredits + addedCredits;
    const maxAllowed = globalStore.student.maxCreditLimit;

    return {
      currentCredits: currentEnrolledCredits,
      addedCredits,
      totalCredits,
      maxAllowed,
      withinLimit: totalCredits <= maxAllowed
    };
  }

  async checkEligibility(studentId: string, courseIdOrCode: string): Promise<EligibilityResult> {
    const course = globalStore.courses.get(courseIdOrCode) || globalStore.courses.get(courseIdOrCode.toLowerCase());
    if (!course) {
      throw new Error(`Course not found: ${courseIdOrCode}`);
    }

    const checks: EligibilityResult["checks"] = [];

    // 1. Program requirement
    const progCheck = globalStore.student.program === "Computer Science";
    checks.push({
      ruleName: "Program requirement",
      passed: progCheck,
      explanation: progCheck ? "Valid: Student enrolled in B.S. Computer Science" : "Invalid degree program",
      critical: true
    });

    // 2. Semester requirement
    const semCheck = globalStore.student.semester >= (course.level >= 400 ? 5 : 3);
    checks.push({
      ruleName: "Semester requirement",
      passed: semCheck,
      explanation: semCheck
        ? `Valid: Student is in Semester ${globalStore.student.semester} (Minimum required: Semester ${course.level >= 400 ? 5 : 3})`
        : `Requires minimum Semester ${course.level >= 400 ? 5 : 3}`,
      critical: true
    });

    // 3. CGPA requirement
    const minCgpa = course.minimumCgpa || 6.0;
    const cgpaCheck = globalStore.student.cgpa >= minCgpa;
    checks.push({
      ruleName: "CGPA requirement",
      passed: cgpaCheck,
      explanation: cgpaCheck
        ? `Valid: Current CGPA ${globalStore.student.cgpa} exceeds minimum required ${minCgpa}`
        : `Current CGPA ${globalStore.student.cgpa} is below minimum requirement of ${minCgpa}`,
      critical: true
    });

    // 4. Prerequisites
    const prereqResult = await this.checkPrerequisites(studentId, course.code);
    checks.push({
      ruleName: "Prerequisites",
      passed: prereqResult.satisfied,
      explanation: prereqResult.satisfied
        ? `All prerequisites completed: [${prereqResult.completed.join(", ")}]`
        : `Missing prerequisite(s): [${prereqResult.missing.join(", ")}]`,
      critical: true
    });

    // 5. Credit limit
    const creditCheck = await this.checkCreditLimit(studentId, [course.code]);
    checks.push({
      ruleName: "Credit limit",
      passed: creditCheck.withinLimit,
      explanation: creditCheck.withinLimit
        ? `Total semester credits ${creditCheck.totalCredits}/${creditCheck.maxAllowed} within limit`
        : `Credit overload: ${creditCheck.totalCredits} credits exceeds max ${creditCheck.maxAllowed}`,
      critical: true
    });

    // 6. Timetable
    const timetableProvider = new DevelopmentTimetableProvider();
    const conflictResult = await timetableProvider.checkTimetableConflicts(studentId, [course.code]);
    checks.push({
      ruleName: "Timetable",
      passed: !conflictResult.hasConflict,
      explanation: !conflictResult.hasConflict
        ? "No timetable schedule collisions detected"
        : `Schedule collision detected: ${conflictResult.conflictingCourses?.[0]?.details || "Time overlap"}`,
      critical: true
    });

    // 7. Registration window
    const windowOpen = globalStore.registrationWindow.isOpen;
    checks.push({
      ruleName: "Registration window",
      passed: windowOpen,
      explanation: windowOpen ? `Active window: ${globalStore.registrationWindow.term}` : "Registration window closed",
      critical: true
    });

    // 8. Seat capacity
    const secA = course.sections[0];
    const seatsAvailable = secA ? secA.available : 0;
    checks.push({
      ruleName: "Seat availability",
      passed: seatsAvailable > 0,
      explanation: seatsAvailable > 0 ? `${seatsAvailable} seats currently available in Section A` : "Section is at maximum capacity",
      critical: true
    });

    const isEligible = checks.every(c => c.passed);

    return {
      courseId: course.id,
      courseCode: course.code,
      courseName: course.name,
      isEligible,
      summary: isEligible
        ? `You're eligible for ${course.name} because you completed all required prerequisites, meet the CGPA requirement (${globalStore.student.cgpa} >= ${minCgpa}), and have sufficient credits available.`
        : `You are currently not eligible for ${course.name}: ${checks.filter(c => !c.passed).map(c => c.explanation).join(". ")}`,
      checks,
      unmetPrerequisites: prereqResult.missing,
      creditOverload: !creditCheck.withinLimit,
      hasScheduleConflict: conflictResult.hasConflict,
      seatsAvailable,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
  }
}

export class DevelopmentDocumentProvider implements UniversityDocumentProvider {
  async searchDocuments(query: string) {
    const q = query.toLowerCase();
    const results = [];

    for (const doc of globalStore.documents) {
      let score = 0;
      const titleMatch = doc.title.toLowerCase().includes(q);
      const sectionMatch = doc.section.toLowerCase().includes(q);
      const contentMatch = doc.content.toLowerCase().includes(q);

      if (titleMatch) score += 5;
      if (sectionMatch) score += 4;
      if (contentMatch) score += 3;

      // Word matching
      const words = q.split(/\s+/).filter(w => w.length > 2);
      for (const w of words) {
        if (doc.content.toLowerCase().includes(w)) score += 1;
      }

      if (score > 0) {
        results.push({
          document: doc,
          score,
          snippet: doc.content
        });
      }
    }

    results.sort((a, b) => b.score - a.score);
    return results;
  }

  async getAllDocuments() {
    return [...globalStore.documents];
  }
}

export function createDevelopmentProviderSuite(): UniversityDataProviderSuite {
  return {
    studentProvider: new DevelopmentStudentProvider(),
    courseProvider: new DevelopmentCourseProvider(),
    registrationProvider: new DevelopmentRegistrationProvider(),
    timetableProvider: new DevelopmentTimetableProvider(),
    rulesProvider: new DevelopmentRulesProvider(),
    documentProvider: new DevelopmentDocumentProvider(),
    isDemoMode: () => true,
    getDataSourceLabel: () => "DEMO DATA"
  };
}

export { globalStore };
