"use client";

import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Play,
  FileText,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Video
} from "lucide-react";
import { Student, Course, EnrolledCourseProgress, CourseCertificate } from "@/types";
import { generateEnrollmentBillPdf } from "@/lib/utils/pdfGenerator";

interface DashboardEnrolledCoursesWidgetProps {
  student: Student;
  allCourses: Course[];
  onOpenLearningModal: (courseCode: string) => void;
  onOpenCertificateModal: (cert: CourseCertificate) => void;
  onExploreCatalog?: () => void;
}

export const DashboardEnrolledCoursesWidget: React.FC<DashboardEnrolledCoursesWidgetProps> = ({
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

  const handleDownloadBill = (progressItem: EnrolledCourseProgress) => {
    const courseObj = allCourses.find(c => c.code.toUpperCase() === progressItem.courseCode.toUpperCase());
    if (courseObj) {
      generateEnrollmentBillPdf(student, courseObj, undefined, progressItem.transactionId);
    } else {
      // Fallback
      const pseudo: Course = {
        id: `c-${progressItem.courseCode.toLowerCase()}`,
        code: progressItem.courseCode,
        name: progressItem.courseName,
        description: "Enrolled Course",
        credits: progressItem.credits,
        department: "Computer Science",
        type: "Core",
        semester: "Fall 2026",
        level: 400,
        instructor: progressItem.instructor,
        prerequisites: [],
        sections: [
          {
            id: `sec-a`,
            sectionCode: progressItem.sectionCode,
            instructor: progressItem.instructor,
            room: "Turing Hall 302",
            schedule: [{ day: "Monday", startTime: "10:00", endTime: "11:30" }],
            capacity: 40,
            occupied: 32,
            available: 8
          }
        ],
        dataSource: { source: "University Registration API", timestamp: "Just now", status: "LIVE" }
      };
      generateEnrollmentBillPdf(student, pseudo, undefined, progressItem.transactionId);
    }
  };

  if (enrolledProgress.length === 0 && !isLoading) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#eaeff8] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-[#0c142c]">
                Enrolled Courses & Video Learning Hub
              </h3>
              <p className="text-[12px] text-slate-500">
                You haven't registered for any Fall 2026 courses yet. Enroll in courses to access video lectures and certificates.
              </p>
            </div>
          </div>
          {onExploreCatalog && (
            <button
              onClick={onExploreCatalog}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[13px] shadow-sm shadow-indigo-200 transition-all shrink-0 cursor-pointer"
            >
              <span>Explore Courses</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#eaeff8] shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[18px] font-extrabold text-[#0c142c]">
                Active Enrolled Courses & Video Progress
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {enrolledProgress.length} Registered
              </span>
            </div>
            <p className="text-[12px] text-slate-500 font-medium">
              Watch all curriculum video modules (5–10 per course) to earn official verifiable certificates of completion.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[12px] text-slate-500 font-medium hidden sm:inline">
            Official Registrar Term: <strong>Fall 2026</strong>
          </span>
        </div>
      </div>

      {/* Grid of Enrolled Courses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
        {enrolledProgress.map((item) => {
          const is100 = item.progressPercentage >= 100;
          const cert = certificates.find(c => c.courseCode.toUpperCase() === item.courseCode.toUpperCase());

          return (
            <div
              key={item.courseCode}
              className="bg-[#f8fafc] hover:bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-indigo-300 transition-all duration-200 shadow-2xs hover:shadow-md flex flex-col justify-between group"
            >
              <div>
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-xl text-[12px] font-extrabold bg-indigo-100/70 text-indigo-700 border border-indigo-200/60">
                    {item.courseCode}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {is100 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 100% Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3.5 h-3.5" /> In Progress
                      </span>
                    )}
                  </div>
                </div>

                {/* Course Title & Instructor */}
                <h4 className="text-[16px] font-bold text-[#0c142c] group-hover:text-indigo-600 transition-colors leading-snug">
                  {item.courseName}
                </h4>
                <p className="text-[12px] text-slate-500 mt-1">
                  Instructor: {item.instructor} • {item.sectionCode} • {item.credits} Credits
                </p>

                {/* Progress Bar */}
                <div className="mt-4 pt-3 border-t border-slate-200/60">
                  <div className="flex items-center justify-between text-[12px] mb-1.5">
                    <span className="font-semibold text-slate-700">Course Completion:</span>
                    <span className="font-extrabold text-indigo-600 text-[13px]">
                      {item.progressPercentage}%
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        is100
                          ? "bg-gradient-to-r from-emerald-500 to-green-600"
                          : "bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600"
                      }`}
                      style={{ width: `${item.progressPercentage}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                    <span>{item.completedVideoIds?.length || 0} of {item.totalVideos} lessons completed</span>
                    <span className="text-slate-400">Ref: {item.transactionId}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-200/60 flex flex-wrap items-center gap-2.5">
                {/* Watch Videos / Resume Learning Button */}
                <button
                  onClick={() => onOpenLearningModal(item.courseCode)}
                  className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[12.5px] shadow-sm shadow-indigo-200 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{is100 ? "Review Lectures" : "Watch Videos"}</span>
                </button>

                {/* Download Proof of Enrollment Bill (PDF) */}
                <button
                  onClick={() => handleDownloadBill(item)}
                  title="Download Official Proof of Enrollment Bill & Tuition Statement as PDF"
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-[12px] transition-all cursor-pointer shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span>PDF Bill</span>
                </button>

                {/* Certificate Button */}
                {is100 && cert && (
                  <button
                    onClick={() => onOpenCertificateModal(cert)}
                    title="View & Download Official Completion Certificate"
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-[12px] shadow-sm shadow-amber-200 transition-all cursor-pointer animate-bounce"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Certificate</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

