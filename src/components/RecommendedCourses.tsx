"use client";

import React from "react";
import { Sparkles, Brain, Database, Cloud, Shield, Check, Plus, ArrowRight, Lock } from "lucide-react";
import { Course } from "@/types";

interface RecommendedCoursesProps {
  courses: Course[];
  plannedCourseCodes: string[];
  enrolledCourseCodes?: string[];
  completedCourseCodes?: string[];
  onViewDetails: (course: Course) => void;
  onAddToPlan: (course: Course) => void;
  onStartLearning?: (course: Course) => void;
  onViewAll?: () => void;
}

export const RecommendedCourses: React.FC<RecommendedCoursesProps> = ({
  courses,
  plannedCourseCodes,
  enrolledCourseCodes = [],
  completedCourseCodes = [],
  onViewDetails,
  onAddToPlan,
  onStartLearning,
  onViewAll,
}) => {
  // Show up to top 3
  const topCourses = courses.slice(0, 3);

  const getCardStyling = (code: string) => {
    if (code === "CS401") {
      return {
        icon: Brain,
        bg: "bg-blue-50 text-blue-600 border border-blue-100",
        badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
        btnBg: "bg-indigo-600 hover:bg-indigo-700 text-white",
      };
    }
    if (code === "CS305") {
      return {
        icon: Database,
        bg: "bg-indigo-50 text-indigo-600 border border-indigo-100",
        badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
        btnBg: "bg-[#1d4ed8] hover:bg-[#1e40af] text-white",
      };
    }
    if (code === "CS380") {
      return {
        icon: Shield,
        bg: "bg-emerald-50 text-emerald-600 border border-emerald-100",
        badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        btnBg: "bg-emerald-600 hover:bg-emerald-700 text-white",
      };
    }
    return {
      icon: Cloud,
      bg: "bg-amber-50 text-amber-600 border border-amber-100",
      badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
      btnBg: "bg-[#9a4e14] hover:bg-[#833e0d] text-white",
    };
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h2 className="text-[17px] font-bold text-[#0c142c]">
            Recommended for You
          </h2>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            ● LIVE AI Scored
          </span>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-[13px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Grid of 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {topCourses.map((course) => {
          const styling = getCardStyling(course.code);
          const Icon = styling.icon;
          const isPlanned = plannedCourseCodes.includes(course.code);
          const isEnrolled = enrolledCourseCodes.includes(course.code);
          const isCompleted = completedCourseCodes.includes(course.code);
          const totalSeats = course.sections.reduce((acc, s) => acc + s.available, 0);

          return (
            <div
              key={course.id}
              className="bg-white rounded-3xl p-5 border border-[#eaeff8] shadow-soft academic-card-hover flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Icon & Match Badge */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${styling.bg}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isEnrolled ? (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border bg-amber-50 text-amber-800 border-amber-200 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-600" />
                        Enrolled & Locked
                      </span>
                    ) : isCompleted ? (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border bg-slate-100 text-slate-700 border-slate-200 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-500" />
                        Completed
                      </span>
                    ) : (
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${styling.badgeBg}`}
                      >
                        {course.matchBadge || "Recommended"}
                      </span>
                    )}
                    <span className="text-[12px] font-bold text-[#0c142c]">
                      {course.matchScore || 90}%
                    </span>
                  </div>
                </div>

                {/* Course Code & Name */}
                <div className="mb-2">
                  <span className="text-[12px] font-semibold text-[#64748b] block">
                    {course.code}
                  </span>
                  <h3 className="text-[16px] font-bold text-[#0c142c] leading-snug">
                    {course.name}
                  </h3>
                </div>

                {/* Course Metadata Pill row */}
                <div className="flex items-center gap-2 text-[11px] text-[#64748b] font-medium mb-3">
                  <span>{course.credits} Credits</span>
                  <span>•</span>
                  <span>{course.type}</span>
                  <span>•</span>
                  <span>{course.semester}</span>
                </div>

                {/* Short Description */}
                <p className="text-[12px] text-[#556987] leading-relaxed line-clamp-2 mb-4">
                  {course.description}
                </p>

                {/* Live Seats & Source Metadata */}
                <div className="p-2.5 rounded-2xl bg-[#f8fafc] border border-[#eef2f8] mb-4 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#64748b] font-medium">Seats Available:</span>
                    <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>● LIVE • {totalSeats} available</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#94a3b8]">
                    <span>Source: University Registration API</span>
                    <span>Updated: Just now</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-[#f1f5f9]">
                <button
                  type="button"
                  onClick={() => onViewDetails(course)}
                  className="w-full py-2.5 px-3 rounded-2xl bg-[#f8fafc] hover:bg-[#f1f5fb] border border-[#e2e8f0] text-[12px] font-semibold text-[#334155] transition-colors text-center cursor-pointer"
                >
                  View Details
                </button>
                {isEnrolled ? (
                  <button
                    type="button"
                    onClick={() => (onStartLearning ? onStartLearning(course) : onViewDetails(course))}
                    className="w-full py-2.5 px-3 rounded-2xl text-[12px] font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white cursor-pointer"
                    title="Course enrolled & locked against re-registration. Click to open Learning Hub."
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Locked • Learn</span>
                  </button>
                ) : isCompleted ? (
                  <button
                    type="button"
                    disabled
                    className="w-full py-2.5 px-3 rounded-2xl text-[12px] font-bold transition-all flex items-center justify-center gap-1.5 shadow-none bg-slate-100 text-slate-500 border border-slate-200 cursor-not-allowed"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Completed</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onAddToPlan(course)}
                    disabled={isPlanned}
                    className={`w-full py-2.5 px-3 rounded-2xl text-[12px] font-semibold transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer ${
                      isPlanned
                        ? "bg-emerald-600 text-white cursor-default"
                        : styling.btnBg
                    }`}
                  >
                    {isPlanned ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>In Plan</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Plan</span>
                      </>
                    )}
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
