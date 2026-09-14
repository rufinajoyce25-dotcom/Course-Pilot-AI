export type DataStatus = "LIVE" | "SYNCED" | "STALE" | "OFFLINE" | "DEMO";

export interface DataSourceMetadata {
  source: string;
  timestamp: string;
  status: DataStatus;
  latencyMs?: number;
}

export interface Student {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  program: string;
  department: string;
  semester: number;
  cgpa: number;
  completedCredits: number;
  requiredCredits: number;
  completedCourses: string[]; // Course IDs
  currentEnrollments: string[]; // Course IDs
  academicStanding: "Good Standing" | "Probation" | "Honor Roll" | "Dean's List";
  backlogs: number;
  careerGoal: string;
  degreeProgressPercentage: number;
  coreCoursesCompleted: number;
  coreCoursesTotal: number;
  electivesCompleted: number;
  electivesTotal: number;
  maxCreditLimit: number;
  currentCreditLimit: number;
}

export interface CourseSection {
  id: string;
  sectionCode: string;
  instructor: string;
  room: string;
  schedule: {
    day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
    startTime: string; // "10:00"
    endTime: string;   // "11:00"
  }[];
  capacity: number;
  occupied: number;
  available: number;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  credits: number;
  department: string;
  type: "Core" | "Elective" | "Specialization" | "General";
  semester: string; // e.g. "Fall 2026", "Spring 2026"
  level: 100 | 200 | 300 | 400 | 500;
  instructor: string;
  sections: CourseSection[];
  prerequisites: string[]; // Course codes (e.g. ["CS201", "CS301"])
  minimumCgpa?: number;
  matchScore?: number;
  matchBadge?: "High Match" | "Recommended" | "Good Fit" | "Eligible" | "Top Match";
  matchReason?: string[];
  dataSource: DataSourceMetadata;
}

export interface TimetableSlot {
  id?: string;
  credits?: number;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
  startTime: string;
  endTime: string;
  courseCode: string;
  courseName: string;
  sectionCode: string;
  room: string;
  instructor: string;
  color: string;
}

export interface ConflictResult {
  hasConflict: boolean;
  conflictingCourses?: {
    courseA: string;
    courseB: string;
    day: string;
    time: string;
    details: string;
  }[];
  conflicts?: any[];
  dataSource?: DataSourceMetadata;
  suggestedAlternatives?: {
    courseCode: string;
    alternativeSection: string;
    schedule: string;
  }[];
}

export interface RuleCheckResult {
  ruleName: string;
  passed: boolean;
  explanation: string;
  critical: boolean;
}

export interface EligibilityResult {
  courseId?: string;
  courseCode: string;
  courseName: string;
  isEligible: boolean;
  summary: string;
  checks?: RuleCheckResult[];
  unmetPrerequisites?: string[];
  creditOverload?: boolean;
  hasScheduleConflict?: boolean;
  seatsAvailable?: number;
  timestamp?: string;
  eligible?: boolean;
  studentId?: string;
  prerequisitesSatisfied?: boolean;
  missingPrerequisites?: string[];
  cgpaRequirementMet?: boolean;
  creditLimitSatisfied?: boolean;
  timetableConflictFree?: boolean;
  seatCount?: number;
  reasons?: string[];
  dataSource?: DataSourceMetadata;
}

export interface RegistrationPlan {
  id: string;
  studentId: string;
  semester: string;
  plannedCourses: {
    courseId: string;
    sectionId: string;
    credits: number;
    type: string;
  }[];
  totalCredits: number;
  isValidated: boolean;
  validationDetails: {
    creditLimitSatisfied: boolean;
    noConflicts: boolean;
    prerequisitesSatisfied: boolean;
    degreeRequirementsSatisfied: boolean;
    seatsAvailable: boolean;
  };
  lastUpdated: string;
}

export interface AgentStepEvent {
  eventId: string;
  timestamp: string; // e.g. "11:32 AM" or ISO
  timeExact: string; // "11:32:14 AM"
  step: string;
  detail: string;
  tool?: string;
  status: "COMPLETED" | "ACTIVE" | "PENDING" | "WARNING" | "ERROR";
  durationMs?: number;
  source: string;
}

export interface NotificationItem {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  priority: "high" | "medium" | "low";
  type: "success" | "warning" | "info" | "error";
  read: boolean;
  source: string;
}

export interface UniversityDocument {
  id: string;
  title: string;
  category: "Policy" | "Regulations" | "Handbook" | "Requirements" | "Curriculum";
  section: string;
  content: string;
  lastUpdated: string;
  sourceFile: string;
}

export interface WhatIfSimulationResult {
  originalCredits: number;
  simulatedCredits: number;
  originalProgress: number;
  simulatedProgress: number;
  prerequisiteChainImpact: string[];
  graduationDelayRisk: boolean;
  explanation: string;
  aiRecommendation: string;
}

export interface CourseVideo {
  id: string;
  title: string;
  duration: string;
  youtubeId: string;
  youtubeEmbedUrl: string;
  description: string;
  order: number;
  thumbnail?: string;
}

export interface CourseLab {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  tasks?: string[];
  estimatedMinutes?: number;
  starterCode?: string;
  testCases?: { name: string; expected: string }[];
  points: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  points: number; // 2 marks each
  explanation: string;
}

export interface CourseQuiz {
  courseCode: string;
  title: string;
  totalMarks: number; // 20
  passingMarks: number; // 12
  questions: QuizQuestion[];
}

export interface CourseCurriculum {
  courseCode: string;
  courseName: string;
  totalVideos: number;
  totalDuration: string;
  videos: CourseVideo[];
  labs?: CourseLab[];
  quiz?: CourseQuiz;
}

export interface EnrolledCourseProgress {
  studentId: string;
  courseCode: string;
  courseName: string;
  sectionCode: string;
  instructor: string;
  credits: number;
  enrolledAt: string;
  transactionId: string;
  completedVideoIds: string[];
  totalVideos: number;
  completedLabIds?: string[];
  totalLabs?: number;
  quizScore?: number; // Out of 20
  quizPassed?: boolean; // Score >= 12
  quizAttempts?: number;
  watchedSeconds?: Record<string, number>;
  progressPercentage: number;
  status: "IN_PROGRESS" | "COMPLETED";
  certificateIssuedAt?: string;
  certificateId?: string;
  lastAccessedVideoId?: string;
}

export interface CourseCertificate {
  certificateId: string;
  studentId: string;
  studentName: string;
  courseCode: string;
  courseName: string;
  credits: number;
  completionDate: string;
  grade: string;
  honors: string;
  quizScore?: number; // Out of 20
  quizMaxScore?: number; // 20
  verificationCode: string;
  instructorName: string;
  department: string;
}



