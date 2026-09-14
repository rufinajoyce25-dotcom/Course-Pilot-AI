"use client";

import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Play,
  FileText,
  Award,
  CheckCircle2,
  Clock,
  BookOpen,
  Sparkles,
  Download,
  Video,
  ArrowRight
} from "lucide-react";
import { Student, Course, EnrolledCourseProgress, CourseCertificate } from "@/types";
import { generateEnrollmentBillPdf } from "@/lib/utils/pdfGenerator";

interface EnrolledCoursesViewProps {
  student: Student;
  allCourses: Course[];
  onOpenLearningModal: (courseCode: string) => void;
  onOpenCertificateModal: (cert: CourseCertificate) => void;
  onExploreCatalog?: () => void;
}

export const EnrolledCoursesView: React.FC<EnrolledCoursesViewProps> = ({
  student,
  allCourses,
  onOpenLearningModal,
  onOpenCertificateModal,
  onExploreCatalog,
}) => {
  const [enrolledProgress, setEnrolledProgress] = useState<EnrolledCourseProgress[]>([]);
  const [certificates, setCertificates] = useState<CourseCertificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProgress = async () => {
    try {
      const res = await fetch(`/api/v1/learning?studentId=${student.id}`);
      if (res.ok) {
        const data = await res.json();
        setEnrolledProgress(data.enrolledCourses || []);
        setCertificates(data.certificates || []);
      }
    } catch (e) {
      console.error("Error loading learning progress:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProgress();
  }, [student.id, student.currentEnrollments?.length]);

  const totalCredits = enrolledProgress.reduce((acc, c) => acc + c.credits, 0);
  const completedCoursesCount = enrolledProgress.filter(c => c.progressPercentage >= 100).length;
  const totalLessonsWatched = enrolledProgress.reduce((acc, c) => acc + (c.completedVideoIds?.length || 0), 0);
  const totalLessonsAvailable = enrolledProgress.reduce((acc, c) => acc + c.totalVideos, 0);

  const handleDownloadBill = (item: EnrolledCourseProgress) => {
    const courseObj = allCourses.find(c => c.code.toUpperCase() === item.courseCode.toUpperCase());
    if (courseObj) {
      generateEnrollmentBillPdf(student, courseObj, undefined, item.transactionId);
    } else {
      const pseudo: Course = {
        id: `c-${item.courseCode.toLowerCase()}`,
        code: item.courseCode,
        name: item.courseName,
        description: "Enrolled Course",
        credits: item.credits,
        department: "Computer Science",
        type: "Core",
        semester: "Fall 2026",
        level: 400,
        instructor: item.instructor,
        prerequisites: [],
        sections: [
          {
            id: `sec-a`,
            sectionCode: item.sectionCode,
            instructor: item.instructor,
            room: "Turing Hall 302",
            schedule: [{ day: "Monday", startTime: "10:00", endTime: "11:30" }],
            capacity: 40,
            occupied: 32,
            available: 8
          }
        ],
        dataSource: { source: "University Registration API", timestamp: "Just now", status: "LIVE" }
      };
      generateEnrollmentBillPdf(student, pseudo, undefined, item.transactionId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-indigo-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Academic Term: Fall 2026 Live Session</span>
          </div>
          <h1 className="text-[24px] sm:text-[30px] font-extrabold tracking-tight">
            My Enrolled Courses & Learning Progress
          </h1>
          <p className="text-[13px] sm:text-[14px] text-indigo-100/90 mt-2 leading-relaxed">
            Track video module completion, access official downloadable enrollment bills, and receive verifiable university completion certificates upon 100% course mastery.
          </p>
        </div>

        {/* Floating Icons in Background */}
        <div className="absolute -right-8 -bottom-8 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden md:block opacity-20">
          <GraduationCap className="w-44 h-44 text-white" />
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#eaeff8] shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Enrolled Courses
          </div>
          <div className="text-[24px] font-extrabold text-[#0c142c] mt-1">
            {enrolledProgress.length}
          </div>
          <div className="text-[11px] text-indigo-600 font-semibold mt-0.5">
            {totalCredits} Registered Credits
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#eaeff8] shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Videos Watched
          </div>
          <div className="text-[24px] font-extrabold text-[#0c142c] mt-1">
            {totalLessonsWatched} / {totalLessonsAvailable}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">
            Curriculum Lessons
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#eaeff8] shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Certificates Issued
          </div>
          <div className="text-[24px] font-extrabold text-emerald-600 mt-1">
            {certificates.length}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
            {certificates.length > 0 ? "Verified Credentials" : "Pending 100% Finish"}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#eaeff8] shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Billing Status
          </div>
          <div className="text-[22px] font-extrabold text-indigo-900 mt-1">
            Cleared
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">
            PDF Invoices Available
          </div>
        </div>
      </div>

      {/* Enrolled Courses Detailed List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-[#0c142c]">
            Active Course Enrolments & Syllabus Videos
          </h2>
          {onExploreCatalog && (
            <button
              onClick={onExploreCatalog}
              className="text-[13px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Browse More Electives</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {enrolledProgress.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#eaeff8]">
            <GraduationCap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-[18px] font-bold text-slate-800">No Courses Enrolled Currently</h3>
            <p className="text-[13px] text-slate-500 max-w-md mx-auto mt-1 mb-6">
              Browse the Fall 2026 catalog or ask CoursePilot AI in chat to register you for verified courses matching your degree trajectory.
            </p>
            {onExploreCatalog && (
              <button
                onClick={onExploreCatalog}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[14px] shadow-md shadow-indigo-200 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>Browse Course Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {enrolledProgress.map((item) => {
              const is100 = item.progressPercentage >= 100;
              const cert = certificates.find(c => c.courseCode.toUpperCase() === item.courseCode.toUpperCase());

              return (
                <div
                  key={item.courseCode}
                  className="bg-white rounded-3xl p-6 border border-[#eaeff8] hover:border-indigo-200 transition-all shadow-xs hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-3 py-1 rounded-xl text-[12px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {item.courseCode}
                      </span>
                      <span className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {item.credits} Credits
                      </span>
                      <span className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-slate-100 text-slate-700">
                        Section {item.sectionCode}
                      </span>
                      {is100 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 100% Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3.5 h-3.5" /> In Progress
                        </span>
                      )}
                    </div>

                    <h3 className="text-[18px] font-extrabold text-[#0c142c]">
                      {item.courseName}
                    </h3>
                    <p className="text-[12.5px] text-slate-500 mt-1">
                      Faculty Instructor: <strong>{item.instructor}</strong> • Term: Fall 2026 • Verified SIS Ref: <code className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">{item.transactionId}</code>
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-4 max-w-xl">
                      <div className="flex items-center justify-between text-[12px] mb-1.5">
                        <span className="font-semibold text-slate-700">
                          Course Progress Breakdown:
                        </span>
                        <span className="font-extrabold text-indigo-600 text-[13px]">
                          {item.progressPercentage}%
                        </span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200 mb-2">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            is100
                              ? "bg-gradient-to-r from-emerald-500 to-green-600"
                              : "bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600"
                          }`}
                          style={{ width: `${item.progressPercentage}%` }}
                        ></div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                        <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                          Lectures: {item.completedVideoIds?.length || 0}/{item.totalVideos}
                        </span>
                        <span>•</span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                          Labs: {item.completedLabIds?.length || 0}/{item.totalLabs || 3}
                        </span>
                        <span>•</span>
                        <span className={`px-2 py-0.5 rounded-md font-bold ${
                          item.quizPassed ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-600"
                        }`}>
                          Quiz: {item.quizPassed ? `Passed (${item.quizScore}/20)` : (item.quizScore !== undefined ? `${item.quizScore}/20` : "Pending")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 justify-center">
                    {/* Watch Videos / Resume Learning */}
                    <button
                      onClick={() => onOpenLearningModal(item.courseCode)}
                      className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[13px] shadow-sm shadow-indigo-200 transition-all cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>{is100 ? "Learning Hub (Completed)" : "Open Learning Hub"}</span>
                    </button>

                    {/* Download Proof of Enrollment Bill (PDF) */}
                    <button
                      onClick={() => handleDownloadBill(item)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-[12px] transition-all cursor-pointer shadow-2xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Download Bill (PDF)</span>
                    </button>

                    {/* Certificate Button if 100% */}
                    {is100 && cert && (
                      <button
                        onClick={() => onOpenCertificateModal(cert)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold text-[12px] shadow-md shadow-amber-200 transition-all cursor-pointer animate-pulse"
                      >
                        <Award className="w-4 h-4" />
                        <span>View Certificate</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

