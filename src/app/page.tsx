"use client";

import React, { useState, useEffect } from "react";
import { Sidebar, NavItem } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";
import { HeroSection } from "@/components/HeroSection";
import { AiInputCard } from "@/components/AiInputCard";
import { AcademicSummaryCards } from "@/components/AcademicSummaryCards";
import { RecommendedCourses } from "@/components/RecommendedCourses";
import { DashboardEnrolledCoursesWidget } from "@/components/DashboardEnrolledCoursesWidget";
import { AgentActivity } from "@/components/AgentActivity";
import { MyPlanWidget } from "@/components/MyPlanWidget";
import { QuoteBanner } from "@/components/QuoteBanner";
import { ImportantDatesWidget } from "@/components/ImportantDatesWidget";
import { CourseModal } from "@/components/CourseModal";
import { RegistrationConfirmModal } from "@/components/RegistrationConfirmModal";
import { EnrollmentProgressModal, EnrollmentResultData } from "@/components/EnrollmentProgressModal";
import { StudentProfileSetupModal } from "@/components/StudentProfileSetupModal";
import { CreateStudentModal } from "@/components/CreateStudentModal";
import { CourseLearningModal } from "@/components/CourseLearningModal";
import { CertificateModal } from "@/components/CertificateModal";
import { NotificationDrawer } from "@/components/NotificationDrawer";

// Views
import { CourseCatalogView } from "@/components/views/CourseCatalogView";
import { EligibilityView } from "@/components/views/EligibilityView";
import { PrerequisitesView } from "@/components/views/PrerequisitesView";
import { TimetableView } from "@/components/views/TimetableView";
import { WhatIfSimulatorView } from "@/components/views/WhatIfSimulatorView";
import { PlansAndScoreView } from "@/components/views/PlansAndScoreView";
import { DocumentsRAGView } from "@/components/views/DocumentsRAGView";
import { StudentProfileView } from "@/components/views/StudentProfileView";
import { SettingsView } from "@/components/views/SettingsView";
import { EnrolledCoursesView } from "@/components/views/EnrolledCoursesView";

import { Student, Course, AgentStepEvent, NotificationItem, TimetableSlot, CourseCertificate } from "@/types";
import { Sparkles, Trash2, Camera } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "agent";
  text: string;
  timestamp: string;
  requiresConfirmation?: boolean;
  confirmationAction?: any;
  suggestedQuickActions?: string[];
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavItem>("ai-agent");
  const [student, setStudent] = useState<Student | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [timetableSlots, setTimetableSlots] = useState<TimetableSlot[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isDemo, setIsDemo] = useState(false);
  const [dataSourceLabel, setDataSourceLabel] = useState("● LIVE • University SIS");

  // Multi-turn Chat History State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAgentLoading, setIsAgentLoading] = useState(false);

  // Modals & Drawers
  const [selectedCourseForModal, setSelectedCourseForModal] = useState<Course | null>(null);
  const [confirmModalData, setConfirmModalData] = useState<{
    courseCode: string;
    courseName: string;
    sectionCode: string;
    credits: number;
    schedule: string;
    seatsAvailable: number;
    eligibilitySummary: string;
  } | null>(null);
  const [enrollmentProgressResult, setEnrollmentProgressResult] = useState<EnrollmentResultData | null>(null);
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);
  const [showProfileSetupModal, setShowProfileSetupModal] = useState(false);
  const [showCreateStudentModal, setShowCreateStudentModal] = useState(false);
  const [allStudents, setAllStudents] = useState<Student[]>([]);

  // Learning & Certificate Modals
  const [learningModalCourse, setLearningModalCourse] = useState<string | null>(null);
  const [certificateModalData, setCertificateModalData] = useState<CourseCertificate | null>(null);

  // Planned courses in student's draft
  const [plannedCourses, setPlannedCourses] = useState<string[]>([]);

  // Agent Activity State
  const [agentEvents, setAgentEvents] = useState<AgentStepEvent[]>([
    {
      eventId: "ev-1",
      timestamp: "11:32 AM",
      timeExact: "11:32:05 AM",
      step: "Understanding your request",
      detail: "Analyzing query and academic trajectory...",
      status: "COMPLETED",
      source: "AI Orchestrator",
      durationMs: 42,
    },
    {
      eventId: "ev-2",
      timestamp: "11:32 AM",
      timeExact: "11:32:15 AM",
      step: "Student profile retrieved",
      detail: "Loaded official transcript records from University SIS",
      status: "COMPLETED",
      source: "University Student Records SIS",
      durationMs: 110,
    },
    {
      eventId: "ev-3",
      timestamp: "11:33 AM",
      timeExact: "11:33:02 AM",
      step: "Course catalog retrieved",
      detail: "Found active courses in Fall 2026 registration window",
      status: "COMPLETED",
      source: "University Registration API",
      durationMs: 145,
    },
    {
      eventId: "ev-4",
      timestamp: "11:33 AM",
      timeExact: "11:33:20 AM",
      step: "Checking prerequisites",
      detail: "Validating transcript against course eligibility rules",
      status: "COMPLETED",
      source: "University Rules Engine",
      durationMs: 68,
    },
    {
      eventId: "ev-5",
      timestamp: "11:33 AM",
      timeExact: "11:33:35 AM",
      step: "Analyzing course combinations",
      detail: "Optimizing schedule & credit headroom...",
      status: "COMPLETED",
      source: "Plan Optimizer",
      durationMs: 52,
    },
  ]);

  // Fetch initial student data
  const loadStudentData = async (targetStudentId?: string) => {
    try {
      const url = targetStudentId
        ? `/api/v1/students/${targetStudentId}`
        : `/api/v1/students/active`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setStudent(data);
        return data;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  // Fetch courses data tailored to active student
  const loadCoursesData = async (targetStudentId?: string) => {
    try {
      const url = targetStudentId
        ? `/api/v1/courses?studentId=${targetStudentId}`
        : `/api/v1/courses`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setCourses(data || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch timetable slots
  const loadTimetable = async (studentId?: string) => {
    try {
      const sId = studentId || student?.id || "STU-2024-8841";
      const res = await fetch(`/api/v1/timetable/${sId}`);
      if (res.ok) {
        const data = await res.json();
        setTimetableSlots(data || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch all students directory
  const loadAllStudents = async () => {
    try {
      const res = await fetch("/api/v1/students");
      if (res.ok) {
        const data = await res.json();
        if (data.students) setAllStudents(data.students);
      }
    } catch (e) {
      console.error("Error loading students:", e);
    }
  };

  const handleSwitchStudent = async (studentId: string) => {
    try {
      const res = await fetch("/api/v1/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "switch_active", studentId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.activeStudent) {
          handleStudentUpdated(data.activeStudent);
          loadAllStudents();
        }
      }
    } catch (e) {
      console.error("Error switching student:", e);
    }
  };

  const handleStudentCreated = (newStudent: Student) => {
    handleStudentUpdated(newStudent);
    loadAllStudents();
  };

  // Initial Load with LocalStorage profile check
  useEffect(() => {
    loadAllStudents();
    let savedProfile: any = null;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("coursepilot_user_profile");
      if (stored) {
        try {
          savedProfile = JSON.parse(stored);
        } catch (e) {}
      }
    }

    if (savedProfile && savedProfile.id) {
      // Sync saved user profile with server
      fetch(`/api/v1/students/active`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(savedProfile),
      })
        .then((res) => res.json())
        .then((d) => {
          const current = d.student || savedProfile;
          setStudent(current);
          loadCoursesData(current.id);
          loadTimetable(current.id);
        })
        .catch(() => {
          loadStudentData().then((st) => {
            if (st) {
              loadCoursesData(st.id);
              loadTimetable(st.id);
            }
          });
        });
    } else {
      loadStudentData().then((st) => {
        if (st) {
          loadCoursesData(st.id);
          loadTimetable(st.id);
        } else {
          loadCoursesData();
          loadTimetable();
        }
      });
    }
  }, []);

  // Subscribe to SSE real-time events
  useEffect(() => {
    const eventSource = new EventSource("/api/agent/events");

    eventSource.addEventListener("agent_step", (e: MessageEvent) => {
      try {
        const newStep: AgentStepEvent = JSON.parse(e.data);
        setAgentEvents((prev) => {
          const exists = prev.some((x) => x.eventId === newStep.eventId);
          if (exists) {
            return prev.map((x) => (x.eventId === newStep.eventId ? newStep : x));
          }
          return [newStep, ...prev.slice(0, 15)];
        });
      } catch (err) {}
    });

    eventSource.addEventListener("seat_update", (e: MessageEvent) => {
      try {
        const seatData = JSON.parse(e.data);
        setCourses((prevCourses) =>
          prevCourses.map((c) => {
            if (c.code === seatData.courseCode) {
              const updatedSections = c.sections.map((s) =>
                s.id === seatData.sectionId || s.sectionCode === seatData.sectionId
                  ? { ...s, available: seatData.available, occupied: s.capacity - seatData.available }
                  : s
              );
              return { ...c, sections: updatedSections };
            }
            return c;
          })
        );
      } catch (err) {}
    });

    eventSource.addEventListener("notification", (e: MessageEvent) => {
      try {
        const notif = JSON.parse(e.data);
        setNotifications((prev) => [notif, ...prev]);
      } catch (err) {}
    });

    return () => {
      eventSource.close();
    };
  }, []);

  // Send message to Agent Orchestrator (Universal NLP)
  const handleSendMessage = async (messageText: string, modelName?: string) => {
    if (!messageText.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      sender: "user",
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsAgentLoading(true);

    try {
      const storedApiKey = typeof window !== "undefined" ? localStorage.getItem("coursepilot_gemini_api_key") : null;
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          studentId: student?.id,
          apiKey: storedApiKey || undefined,
          model: modelName || undefined,
        }),
      });

      const data = await res.json();

      const agentMsg: ChatMessage = {
        id: `msg-${Date.now()}-a`,
        sender: "agent",
        text: data.message || "I have analyzed your request.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        requiresConfirmation: data.requiresConfirmation,
        confirmationAction: data.confirmationAction,
        suggestedQuickActions: data.suggestedQuickActions,
      };

      setChatMessages((prev) => [...prev, agentMsg]);

      // If agent updated student profile via chat
      if (data.updatedStudent) {
        setStudent(data.updatedStudent);
        loadCoursesData(data.updatedStudent.id);
        if (typeof window !== "undefined") {
          localStorage.setItem("coursepilot_user_profile", JSON.stringify(data.updatedStudent));
        }
      }

      // Check if registration confirmation is requested
      if (data.requiresConfirmation && data.confirmationAction) {
        setConfirmModalData(data.confirmationAction);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAgentLoading(false);
    }
  };

  // Action Handlers
  const handleAddToPlan = (course: Course) => {
    if (!plannedCourses.includes(course.code)) {
      setPlannedCourses([...plannedCourses, course.code]);
      const event: AgentStepEvent = {
        eventId: `ev-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        timeExact: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        step: `Added to draft plan: ${course.code}`,
        detail: `${course.name} (${course.credits} Credits)`,
        status: "COMPLETED",
        source: "University Registration Planner",
        durationMs: 30,
      };
      setAgentEvents((prev) => [event, ...prev]);
    }
  };

  const handleRegisterIntent = (course: Course) => {
    // Single enrollment check: If already enrolled, open learning hub directly
    // Single enrollment check: If already enrolled, lock registration and open learning hub directly
    if (student?.currentEnrollments?.includes(course.code)) {
      alert(`Registration Locked: You are already enrolled in ${course.code} (${course.name}). Multiple registrations for the same individual are strictly locked. Opening your lifelong Learning Hub...`);
      setLearningModalCourse(course.code);
      return;
    }

    if (student?.completedCourses?.includes(course.code)) {
      alert(`You have already completed ${course.code} (${course.name}). Retaking completed courses is not permitted.`);
      alert(`Registration Locked: You have already completed ${course.code} (${course.name}). Retaking completed courses is locked under university policy.`);
      return;
    }

    const sec = course.sections[0];
    setConfirmModalData({
      courseCode: course.code,
      courseName: course.name,
      sectionCode: sec ? sec.sectionCode : "Section A",
      credits: course.credits,
      schedule: sec
        ? sec.schedule.map((s) => `${s.day} ${s.startTime}–${s.endTime}`).join(", ")
        : "Monday/Wednesday 10:00–11:00 AM",
      seatsAvailable: sec ? sec.available : 8,
      eligibilitySummary: "Eligible • Prerequisites satisfied • No timetable collisions",
    });
  };

  const handleRegistrationSuccess = (regResult: any) => {
    // Dismiss confirm dialog and launch the live 5-step progress modal
    const targetCourseCode = regResult.courseCode || regResult.course || confirmModalData?.courseCode || "CS401";
    const targetCourseName = regResult.courseName || confirmModalData?.courseName || "Machine Learning";
    const targetSection = regResult.sectionCode || regResult.section || confirmModalData?.sectionCode || "Section A";
    const targetRoom = regResult.room || "Turing Hall 302";
    const targetSchedule = regResult.schedule || confirmModalData?.schedule || "Monday & Wednesday 10:00–11:00 AM";
    const targetCredits = regResult.credits || confirmModalData?.credits || 4;

    setConfirmModalData(null);
    setEnrollmentProgressResult({
      transactionId: regResult.transactionId || `TXN-UNIV-${Math.floor(100000 + Math.random() * 900000)}`,
      courseCode: targetCourseCode,
      courseName: targetCourseName,
      sectionCode: targetSection,
      room: targetRoom,
      schedule: targetSchedule,
      credits: targetCredits,
      seatsRemaining: regResult.seatsRemaining !== undefined ? regResult.seatsRemaining : (confirmModalData?.seatsAvailable !== undefined ? Math.max(0, confirmModalData.seatsAvailable - 1) : 7),
      completedCreditsNow: regResult.completedCreditsNow || (student ? student.completedCredits + targetCredits : 100),
      degreeProgressNow: regResult.degreeProgressNow || (student ? Math.min(100, Math.round(((student.completedCredits + targetCredits) / student.requiredCredits) * 100)) : 71),
      timestamp: regResult.timestamp || new Date().toLocaleTimeString(),
    });

    // Refresh student records, courses, and timetable immediately
    const sid = student?.id || regResult.studentId;
    loadStudentData(sid);
    loadCoursesData(sid);
    loadTimetable(sid);
  };

  const handleStudentUpdated = (updated: Student) => {
    setStudent(updated);
    loadCoursesData(updated.id);
    loadTimetable(updated.id);
    if (typeof window !== "undefined") {
      localStorage.setItem("coursepilot_user_profile", JSON.stringify(updated));
    }
  };

  const handleToggleProvider = (useReal: boolean) => {
    setIsDemo(!useReal);
    setDataSourceLabel(useReal ? "● LIVE (University SIS)" : "SANDBOX / STAGING");
  };

  const getInitials = (name?: string) => {
    if (!name) return "ST";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="flex min-h-screen bg-[#f4f7fc]">
      {/* Left Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation */}
        <TopNav
          student={student}
          notifications={notifications}
          isDemo={isDemo}
          dataSourceLabel={dataSourceLabel}
          allStudents={allStudents}
          onSearch={() => setActiveTab("course-catalog")}
          onOpenNotifications={() => setShowNotificationsDrawer(true)}
          onOpenSettings={() => setActiveTab("settings")}
          onOpenProfileSetup={() => setShowProfileSetupModal(true)}
          onOpenCreateStudent={() => setShowCreateStudentModal(true)}
          onSwitchStudent={handleSwitchStudent}
        />

        {/* Dynamic Center & Right Columns Container */}
        <main className="flex-1 p-6 sm:p-8 max-w-[1600px] w-full mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            {/* Center Content Column */}
            <div className="xl:col-span-8 min-w-0 space-y-6">
              {activeTab === "ai-agent" || activeTab === "overview" ? (
                <>
                  {/* Hero Banner with Academic Robot */}
                  <HeroSection />

                  {/* AI Input Card + Quick Action Chips */}
                  <AiInputCard
                    onSendMessage={handleSendMessage}
                    isLoading={isAgentLoading}
                  />

                  {/* Real-time Multi-turn Chat Stream */}
                  {(chatMessages.length > 0 || isAgentLoading) && (
                    <div className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-soft space-y-5 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-bold text-[14px] text-[#0c142c]">
                            Conversation with CoursePilot Agent
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            ● Real-Time SIS Sync
                          </span>
                          <button
                            onClick={() => setChatMessages([])}
                            title="Clear conversation history"
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Messages Stream */}
                      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                        {chatMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                          >
                            <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-slate-400 font-medium">
                              <span>{msg.sender === "user" ? student?.name || "You" : "CoursePilot AI"}</span>
                              <span>•</span>
                              <span>{msg.timestamp}</span>
                            </div>

                            <div
                              className={`p-4 rounded-3xl max-w-[90%] text-[13px] leading-relaxed shadow-2xs whitespace-pre-line ${
                                msg.sender === "user"
                                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-xs"
                                  : "bg-[#f8fafc] text-[#1e293b] border border-[#eaeff8] rounded-tl-xs"
                              }`}
                            >
                              {msg.text}

                              {/* Interactive Inline Registration Card if requiresConfirmation */}
                              {msg.requiresConfirmation && msg.confirmationAction && (
                                <div className="mt-4 p-3.5 rounded-2xl bg-white border border-indigo-200 text-[#0c142c] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                  <div>
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                                      Authorized Registration Action
                                    </div>
                                    <div className="font-extrabold text-[14px]">
                                      {msg.confirmationAction.courseCode} — {msg.confirmationAction.courseName}
                                    </div>
                                    <div className="text-[11px] text-slate-500">
                                      {msg.confirmationAction.credits} Credits • {msg.confirmationAction.sectionCode} • {msg.confirmationAction.schedule}
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => setConfirmModalData(msg.confirmationAction)}
                                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-bold transition-all shrink-0 shadow-sm"
                                  >
                                    Review & Confirm
                                  </button>
                                </div>
                              )}

                              {/* Follow-up Quick Chips */}
                              {msg.suggestedQuickActions && msg.suggestedQuickActions.length > 0 && (
                                <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-200/60">
                                  <span className="text-[10px] font-bold text-slate-400">Quick options:</span>
                                  {msg.suggestedQuickActions.map((act, i) => (
                                    <button
                                      key={i}
                                      onClick={() => handleSendMessage(act)}
                                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 border border-slate-200 text-[11px] font-semibold text-slate-700 hover:text-indigo-600 transition-all"
                                    >
                                      {act}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}

                        {/* Loading Bubble */}
                        {isAgentLoading && (
                          <div className="flex items-start gap-2">
                            <div className="p-4 rounded-3xl bg-indigo-50/70 border border-indigo-100 text-indigo-700 text-[13px] flex items-center gap-3">
                              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping"></span>
                              <span>Auditing live student records & reasoning over academic rules...</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Enrolled Courses & Learning Progress Widget */}
                  {student && (
                    <DashboardEnrolledCoursesWidget
                      student={student}
                      allCourses={courses}
                      onOpenLearningModal={(code) => setLearningModalCourse(code)}
                      onOpenCertificateModal={(cert) => setCertificateModalData(cert)}
                      onExploreCatalog={() => setActiveTab("course-catalog")}
                    />
                  )}

                  {/* 4 Academic Summary Cards */}
                  <AcademicSummaryCards
                    student={student}
                    onCardClick={(type) => {
                      if (type === "credits" || type === "cgpa") {
                        setActiveTab("plans-and-score");
                      }
                    }}
                  />

                  {/* Recommended for You Cards */}
                  <RecommendedCourses
                    courses={courses}
                    plannedCourseCodes={plannedCourses}
                    enrolledCourseCodes={student?.currentEnrollments || []}
                    completedCourseCodes={student?.completedCourses || []}
                    onViewDetails={(c) => setSelectedCourseForModal(c)}
                    onAddToPlan={(c) => handleAddToPlan(c)}
                    onStartLearning={(c) => setLearningModalCourse(c.code)}
                    onViewAll={() => setActiveTab("course-catalog")}
                  />
                </>
              ) : activeTab === "enrolled-courses" ? (
                student && (
                  <EnrolledCoursesView
                    student={student}
                    allCourses={courses}
                    onOpenLearningModal={(code) => setLearningModalCourse(code)}
                    onOpenCertificateModal={(cert) => setCertificateModalData(cert)}
                    onExploreCatalog={() => setActiveTab("course-catalog")}
                  />
                )
              ) : activeTab === "student-profile" ? (
                <StudentProfileView
                  student={student}
                  onStudentUpdated={handleStudentUpdated}
                  onRefreshData={() => {
                    loadStudentData(student?.id);
                    loadCoursesData(student?.id);
                    loadAllStudents();
                  }}
                  onOpenCreateStudent={() => setShowCreateStudentModal(true)}
                />
              ) : activeTab === "course-catalog" ? (
                <CourseCatalogView
                  courses={courses}
                  plannedCourseCodes={plannedCourses}
                  enrolledCourseCodes={student?.currentEnrollments || []}
                  completedCourseCodes={student?.completedCourses || []}
                  onViewCourse={(c) => setSelectedCourseForModal(c)}
                  onAddToPlan={(c) => handleAddToPlan(c)}
                  onRegisterIntent={(c) => handleRegisterIntent(c)}
                  onStartLearning={(c) => setLearningModalCourse(c.code)}
                />
              ) : activeTab === "eligibility" ? (
                <EligibilityView
                  courses={courses}
                  enrolledCourseCodes={student?.currentEnrollments || []}
                  completedCourseCodes={student?.completedCourses || []}
                  onRegisterIntent={(c) => handleRegisterIntent(c)}
                  onStartLearning={(c) => setLearningModalCourse(c.code)}
                />
              ) : activeTab === "prerequisites" ? (
                <PrerequisitesView
                  onViewCourse={(c) => setSelectedCourseForModal(c)}
                  onRegisterIntent={(c) => handleRegisterIntent(c)}
                  enrolledCourseCodes={student?.currentEnrollments || []}
                  completedCourseCodes={student?.completedCourses || []}
                  onStartLearning={(code) => setLearningModalCourse(code)}
                />
              ) : activeTab === "timetable" ? (
                <TimetableView slots={timetableSlots} />
              ) : activeTab === "what-if" ? (
                <WhatIfSimulatorView />
              ) : activeTab === "plans-and-score" ? (
                <PlansAndScoreView student={student} />
              ) : activeTab === "documents" ? (
                <DocumentsRAGView />
              ) : activeTab === "settings" ? (
                <SettingsView
                  isDemo={isDemo}
                  dataSourceLabel={dataSourceLabel}
                  onToggleProvider={handleToggleProvider}
                />
              ) : null}
            </div>

            {/* Right-Side Persistent Panel */}
            <aside className="xl:col-span-4 space-y-5">
              {/* Real-time Student Identity Card */}
              <div className="p-4 rounded-3xl bg-white border border-[#eaeff8] shadow-soft flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {student?.avatar ? (
                    <img
                      src={student.avatar}
                      alt={student.name || "Student"}
                      className="w-10 h-10 rounded-2xl object-cover ring-2 ring-indigo-100"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-purple-600 text-white font-bold text-sm flex items-center justify-center shadow-xs ring-2 ring-indigo-100">
                      {getInitials(student?.name)}
                    </div>
                  )}
                  <div>
                    <div className="text-[13px] font-extrabold text-[#0c142c]">{student?.name || "Joyce Chen"}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{student?.id || "STU-2024-8841"}</div>
                  </div>
                </div>
                <button
                  onClick={() => setShowProfileSetupModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold border border-indigo-100 transition-colors flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Edit Photo
                </button>
              </div>

              {/* Agent Activity Live Timeline */}
              <AgentActivity events={agentEvents} isLive={true} />

              {/* My Plan Widget */}
              <MyPlanWidget
                student={student}
                onViewPlan={() => setActiveTab("plans-and-score")}
              />

              {/* Mountain Quote Card */}
              <QuoteBanner />

              {/* Important Dates Widget */}
              <ImportantDatesWidget
                onViewAll={() => setActiveTab("documents")}
              />
            </aside>
          </div>
        </main>
      </div>

      {/* Course Details Modal */}
      {selectedCourseForModal && (
        <CourseModal
          course={selectedCourseForModal}
          onClose={() => setSelectedCourseForModal(null)}
          isEnrolled={student?.currentEnrollments?.includes(selectedCourseForModal.code)}
          isCompleted={student?.completedCourses?.includes(selectedCourseForModal.code)}
          onStartLearning={(c) => {
            setSelectedCourseForModal(null);
            setLearningModalCourse(c.code);
          }}
          onRegisterIntent={(c) => {
            setSelectedCourseForModal(null);
            handleRegisterIntent(c);
          }}
          onAddToPlan={(c) => handleAddToPlan(c)}
          isPlanned={plannedCourses.includes(selectedCourseForModal.code)}
        />
      )}

      {/* Human-in-the-Loop Registration Confirmation Modal */}
      {confirmModalData && (
        <RegistrationConfirmModal
          studentId={student?.id}
          courseCode={confirmModalData.courseCode}
          courseName={confirmModalData.courseName}
          sectionCode={confirmModalData.sectionCode}
          credits={confirmModalData.credits}
          schedule={confirmModalData.schedule}
          seatsAvailable={confirmModalData.seatsAvailable}
          eligibilitySummary={confirmModalData.eligibilitySummary}
          isEnrolled={student?.currentEnrollments?.includes(confirmModalData.courseCode)}
          isCompleted={student?.completedCourses?.includes(confirmModalData.courseCode)}
          onStartLearning={(code) => {
            setConfirmModalData(null);
            setLearningModalCourse(code);
          }}
          onCancel={() => setConfirmModalData(null)}
          onSuccess={handleRegistrationSuccess}
        />
      )}

      {/* Live 5-Step Enrollment Pipeline Progress Modal */}
      {enrollmentProgressResult && (
        <EnrollmentProgressModal
          isOpen={Boolean(enrollmentProgressResult)}
          onClose={() => setEnrollmentProgressResult(null)}
          result={enrollmentProgressResult}
          onViewTimetable={() => setActiveTab("timetable")}
          onStartLearning={(code) => setLearningModalCourse(code)}
        />
      )}

      {/* Real-time Student Profile Setup Modal */}
      <StudentProfileSetupModal
        isOpen={showProfileSetupModal}
        onClose={() => setShowProfileSetupModal(false)}
        currentStudent={student}
        onProfileSaved={handleStudentUpdated}
      />

      {/* Create New Student Profile Modal */}
      <CreateStudentModal
        isOpen={showCreateStudentModal}
        onClose={() => setShowCreateStudentModal(false)}
        existingStudents={allStudents}
        onStudentCreated={handleStudentCreated}
        onSwitchToStudent={handleSwitchStudent}
      />

      {/* Course Learning & Video Player Modal */}
      {learningModalCourse && student && (
        <CourseLearningModal
          courseCode={learningModalCourse}
          isOpen={Boolean(learningModalCourse)}
          student={student}
          course={courses.find((c) => c.code.toUpperCase() === learningModalCourse.toUpperCase())}
          onClose={() => setLearningModalCourse(null)}
          onViewCertificate={(cert) => {
            setCertificateModalData(cert);
          }}
        />
      )}

      {/* Certificate Display & Download Modal */}
      <CertificateModal
        certificate={certificateModalData}
        isOpen={Boolean(certificateModalData)}
        onClose={() => setCertificateModalData(null)}
      />

      {/* Notifications Drawer */}
      {showNotificationsDrawer && (
        <NotificationDrawer
          notifications={notifications}
          onClose={() => setShowNotificationsDrawer(false)}
          onClearAll={() => setNotifications([])}
        />
      )}
    </div>
  );
}
