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

export interface UniversityStudentProvider {
  getCurrentStudent(studentId: string): Promise<Student>;
  getCompletedCourses(studentId: string): Promise<string[]>;
  getCurrentEnrollments(studentId: string): Promise<string[]>;
}

export interface UniversityCourseProvider {
  searchCourses(query?: string, filters?: {
    department?: string;
    level?: number;
    type?: string;
    availableSeatsOnly?: boolean;
    semester?: string;
  }): Promise<Course[]>;
  getCourseDetails(courseIdOrCode: string): Promise<Course | null>;
  getCourseSections(courseIdOrCode: string): Promise<CourseSection[]>;
  getCoursePrerequisites(courseIdOrCode: string): Promise<string[]>;
  getLiveSeatAvailability(courseId: string, sectionId?: string): Promise<{
    capacity: number;
    occupied: number;
    available: number;
    source: string;
    timestamp: string;
    status: DataStatus;
  }>;
}

export interface UniversityRegistrationProvider {
  getRegistrationWindow(): Promise<{
    isOpen: boolean;
    term: string;
    startDate: string;
    endDate: string;
    lastDateToAdd: string;
    withdrawalDeadline: string;
    source: string;
  }>;
  getRegistrationStatus(studentId: string): Promise<{
    status: string;
    enrollments: string[];
    registrationId?: string;
    timestamp: string;
  }>;
  registerCourse(
    studentId: string,
    courseId: string,
    sectionId: string
  ): Promise<{
    success: boolean;
    transactionId: string;
    message: string;
    timestamp: string;
    verifiedCourse: Course;
    verifiedSection: CourseSection;
    credits: number;
  }>;
  dropCourse(
    studentId: string,
    courseId: string
  ): Promise<{
    success: boolean;
    transactionId: string;
    message: string;
    timestamp: string;
  }>;
  swapCourse(
    studentId: string,
    oldCourseId: string,
    newCourseId: string,
    newSectionId: string
  ): Promise<{
    success: boolean;
    transactionId: string;
    message: string;
    timestamp: string;
  }>;
}

export interface UniversityTimetableProvider {
  getLiveTimetable(studentId: string): Promise<TimetableSlot[]>;
  checkTimetableConflicts(
    studentId: string,
    candidateCourseIds: string[]
  ): Promise<ConflictResult>;
}

export interface UniversityRulesProvider {
  getAcademicRules(): Promise<{
    minCgpaForElectives: number;
    maxCreditsStandard: number;
    maxCreditsProbation: number;
    addDropDeadlineDays: number;
    passingGradeCgpa: number;
  }>;
  getDegreeRequirements(program: string): Promise<{
    totalRequiredCredits: number;
    coreCreditsRequired: number;
    electiveCreditsRequired: number;
    specializationTracks: string[];
  }>;
  checkEligibility(studentId: string, courseIdOrCode: string): Promise<EligibilityResult>;
  checkPrerequisites(studentId: string, courseIdOrCode: string): Promise<{
    satisfied: boolean;
    completed: string[];
    missing: string[];
  }>;
  checkCreditLimit(studentId: string, proposedCourseIds: string[]): Promise<{
    currentCredits: number;
    addedCredits: number;
    totalCredits: number;
    maxAllowed: number;
    withinLimit: boolean;
  }>;
}

export interface UniversityDocumentProvider {
  searchDocuments(query: string): Promise<{
    document: UniversityDocument;
    score: number;
    snippet: string;
  }[]>;
  getAllDocuments(): Promise<UniversityDocument[]>;
}

export interface UniversityDataProviderSuite {
  studentProvider: UniversityStudentProvider;
  courseProvider: UniversityCourseProvider;
  registrationProvider: UniversityRegistrationProvider;
  timetableProvider: UniversityTimetableProvider;
  rulesProvider: UniversityRulesProvider;
  documentProvider: UniversityDocumentProvider;
  isDemoMode: () => boolean;
  getDataSourceLabel: () => string;
}

