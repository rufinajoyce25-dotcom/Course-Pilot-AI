"use client";

import React, { useState } from "react";
import { X, Check, AlertCircle, Clock, MapPin, Calendar, Sparkles, BookOpen, User, Lock } from "lucide-react";
import { Course } from "@/types";

interface CourseModalProps {
  course: Course;
  onClose: () => void;
  onRegisterIntent: (course: Course) => void;
  onAddToPlan: (course: Course) => void;
  onStartLearning?: (course: Course) => void;
  isPlanned?: boolean;
  isEnrolled?: boolean;
  isCompleted?: boolean;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  course,
  onClose,
  onRegisterIntent,
  onAddToPlan,
  onStartLearning,
  isPlanned,
  isEnrolled,
  isCompleted,
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [eligibility, setEligibility] = useState<any | null>(null);

  const handleCheckEligibility = async () => {
    setIsChecking(true);
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: `Check eligibility for ${course.code}` }),
      });
      const data = await res.json();
      if (data.data?.eligibility) {
        setEligibility(data.data.eligibility);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsChecking(false);
    }
  };

  const primarySection = course.sections[0];

  return (
    <div className="fixed inset-0 z-50 bg-navy-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#eaeff8] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-[#f1f5f9] flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold border border-indigo-100">
                {course.code}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium">
                {course.type}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                ● LIVE
              </span>
              {isEnrolled ? (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-600" />
                  ● REGISTRATION LOCKED (ENROLLED)
                </span>
              ) : isCompleted ? (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-500" />
                  ● LOCKED (COMPLETED)
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  ● LIVE
                </span>
              )}
            </div>
            <h3 className="text-xl font-extrabold text-[#0c142c]">{course.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f1f5fb] hover:bg-[#e2e8f0] flex items-center justify-center text-[#64748b] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Locked Registration Notification Banner */}
          {isEnrolled && (
            <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 flex-shrink-0 mt-0.5">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h5 className="text-[13px] font-extrabold flex items-center gap-2 text-amber-950">
                  <span>Registration Locked for this Student</span>
                  <span className="text-[10px] uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">1 Course = 1 Enrollment</span>
                </h5>
                <p className="text-[12px] text-amber-800 leading-relaxed">
                  You are already actively enrolled in <strong>{course.code} — {course.name}</strong>. University policy strictly locks and prohibits duplicate or repeated registrations for the same individual. Your active enrollment grants you <strong>permanent lifelong access</strong> to all lecture videos, coding environments, and certifications.
                </p>
              </div>
            </div>
          )}

          {isCompleted && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 flex items-start gap-3 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 flex-shrink-0 mt-0.5">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h5 className="text-[13px] font-extrabold text-slate-900">
                  Course Completed & Locked
                </h5>
                <p className="text-[12px] text-slate-600 leading-relaxed">
                  You have successfully completed <strong>{course.code}</strong>. Course retakes are locked under academic regulations.
                </p>
              </div>
            </div>
          )}

          {/* Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-[#f8fafc] border border-[#eaeff8]">
              <div className="text-[11px] font-bold text-[#64748b] uppercase">Credits</div>
              <div className="text-base font-extrabold text-[#0c142c] mt-0.5">{course.credits} Cr</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#f8fafc] border border-[#eaeff8]">
              <div className="text-[11px] font-bold text-[#64748b] uppercase">Min CGPA</div>
              <div className="text-base font-extrabold text-[#0c142c] mt-0.5">{course.minimumCgpa || 6.0}</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#f8fafc] border border-[#eaeff8]">
              <div className="text-[11px] font-bold text-[#64748b] uppercase">Term</div>
              <div className="text-base font-extrabold text-[#0c142c] mt-0.5">{course.semester}</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#f8fafc] border border-[#eaeff8]">
              <div className="text-[11px] font-bold text-[#64748b] uppercase">AI Match</div>
              <div className="text-base font-extrabold text-indigo-600 mt-0.5">{course.matchScore || 90}%</div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-[13px] font-bold text-[#0c142c] mb-1.5">Description</h4>
            <p className="text-[13px] text-[#475569] leading-relaxed">{course.description}</p>
          </div>

          {/* Prerequisites */}
          <div>
            <h4 className="text-[13px] font-bold text-[#0c142c] mb-2">Required Prerequisites</h4>
            <div className="flex flex-wrap gap-2">
              {course.prerequisites && course.prerequisites.length > 0 ? (
                course.prerequisites.map((prereq) => (
                  <span
                    key={prereq}
                    className="px-3 py-1 rounded-xl bg-[#f1f5fb] border border-[#e2e8f0] text-[12px] font-semibold text-[#334155]"
                  >
                    {prereq}
                  </span>
                ))
              ) : (
                <span className="text-[12px] text-[#64748b]">None required</span>
              )}
            </div>
          </div>

          {/* Sections & Live Seats */}
          {primarySection && (
            <div>
              <h4 className="text-[13px] font-bold text-[#0c142c] mb-2">Section & Schedule</h4>
              <div className="p-4 rounded-2xl border border-[#e2e8f0] bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[14px] text-[#0c142c]">
                    {primarySection.sectionCode} ({primarySection.instructor})
                  </span>
                  <div className="flex items-center gap-2 text-[12px] text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>● LIVE • {primarySection.available} / {primarySection.capacity} seats available</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-[12px] text-[#475569]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    <span>
                      {primarySection.schedule
                        .map((s) => `${s.day} ${s.startTime}–${s.endTime}`)
                        .join(", ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{primarySection.room}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Eligibility Audit Box */}
          {eligibility ? (
            <div
              className={`p-4 rounded-2xl border ${
                eligibility.isEligible
                  ? "bg-emerald-50/70 border-emerald-200"
                  : "bg-rose-50/70 border-rose-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {eligibility.isEligible ? (
                  <Check className="w-4 h-4 text-emerald-600 font-bold" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                )}
                <h5
                  className={`text-[13px] font-bold ${
                    eligibility.isEligible ? "text-emerald-900" : "text-rose-900"
                  }`}
                >
                  {eligibility.isEligible ? "🟢 ELIGIBLE TO REGISTER" : "🔴 NOT ELIGIBLE"}
                </h5>
              </div>
              <p className="text-[12px] text-[#334155] mb-3">{eligibility.summary}</p>
              <div className="space-y-1.5">
                {eligibility.checks?.map((chk: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-[11px]">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        chk.passed ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    ></span>
                    <span className="font-semibold text-[#0c142c]">{chk.ruleName}:</span>
                    <span className="text-[#64748b]">{chk.explanation}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <button
              onClick={handleCheckEligibility}
              disabled={isChecking}
              className="w-full py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-[13px] flex items-center justify-center gap-2 border border-indigo-200 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isChecking ? "Running Eligibility Audit..." : "Check Full Eligibility"}</span>
            </button>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 pt-4 border-t border-[#f1f5f9] flex items-center justify-end gap-3 bg-[#fafbfd]">
          {isEnrolled ? (
            <button
              onClick={() => (onStartLearning ? onStartLearning(course) : onRegisterIntent(course))}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-[13px] font-bold shadow-md shadow-emerald-200 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Locked • Open Learning Hub</span>
            </button>
          ) : isCompleted ? (
            <button
              disabled
              className="px-5 py-2.5 rounded-2xl bg-slate-200 text-slate-600 text-[13px] font-bold cursor-not-allowed flex items-center gap-2"
            >
              <Lock className="w-4 h-4 text-slate-500" />
              <span>Locked (Course Completed)</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => onAddToPlan(course)}
                className="px-4 py-2.5 rounded-2xl bg-white border border-[#cbd5e1] hover:bg-[#f1f5f9] text-[13px] font-semibold text-[#334155] transition-colors"
              >
                {isPlanned ? "In Plan ✓" : "+ Add to Plan"}
              </button>
              <button
                onClick={() => onRegisterIntent(course)}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-[13px] font-bold shadow-md shadow-indigo-200 transition-all cursor-pointer"
              >
                Register for {course.code}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
