"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, BookOpen, Brain, Database, Cloud, Shield, Check, Plus, AlertCircle, Lock } from "lucide-react";
import { Course } from "@/types";

interface CourseCatalogViewProps {
  courses: Course[];
  plannedCourseCodes: string[];
  enrolledCourseCodes?: string[];
  completedCourseCodes?: string[];
  onViewCourse: (course: Course) => void;
  onAddToPlan: (course: Course) => void;
  onRegisterIntent: (course: Course) => void;
  onStartLearning?: (course: Course) => void;
}

export const CourseCatalogView: React.FC<CourseCatalogViewProps> = ({
  courses,
  plannedCourseCodes,
  enrolledCourseCodes = [],
  completedCourseCodes = [],
  onViewCourse,
  onAddToPlan,
  onRegisterIntent,
  onStartLearning,
}) => {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [seatsOnly, setSeatsOnly] = useState<boolean>(false);

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch =
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase());

      const matchType = selectedType === "All" || c.type === selectedType;
      const totalSeats = c.sections.reduce((acc, s) => acc + s.available, 0);
      const matchSeats = !seatsOnly || totalSeats > 0;

      return matchSearch && matchType && matchSeats;
    });
  }, [courses, search, selectedType, seatsOnly]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0c142c]">Course Catalog</h2>
          <p className="text-[13px] text-[#64748b] mt-1">
            Browse live university courses, inspect prerequisite chains, and check real-time seat availability.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#eaeff8] shadow-soft flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#94a3b8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by code, title, or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#f8fafc] text-[13px] text-[#0f172a] rounded-xl border border-[#e2e8f0] focus:border-indigo-500 outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {["All", "Core", "Elective"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3.5 py-1.5 rounded-xl text-[12px] font-semibold transition-all ${
                selectedType === type
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-[#f8fafc] text-[#64748b] hover:bg-[#eef2f8]"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Available seats checkbox */}
        <label className="flex items-center gap-2 cursor-pointer select-none text-[12px] font-medium text-[#475569]">
          <input
            type="checkbox"
            checked={seatsOnly}
            onChange={(e) => setSeatsOnly(e.target.checked)}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
          />
          <span>Available Seats Only</span>
        </label>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCourses.map((course) => {
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
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold border border-indigo-100">
                      {course.code}
                    </span>
                    {isEnrolled && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10.5px] font-bold border border-amber-200 inline-flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-600" /> Locked • Enrolled
                      </span>
                    )}
                    {isCompleted && (
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10.5px] font-bold border border-slate-200 inline-flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-500" /> Locked • Completed
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-[#64748b]">
                    {course.credits} Credits • {course.type}
                  </span>
                </div>

                <h3 className="text-[16px] font-bold text-[#0c142c] mb-1.5">{course.name}</h3>
                <p className="text-[12px] text-[#556987] line-clamp-2 leading-relaxed mb-4">
                  {course.description}
                </p>

                {/* Prerequisites Summary */}
                <div className="text-[11px] text-[#64748b] mb-3">
                  <span className="font-semibold text-[#334155]">Prereqs: </span>
                  {course.prerequisites.length > 0
                    ? course.prerequisites.join(", ")
                    : "None (Open enrollment)"}
                </div>

                {/* Live Seats */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f8fafc] border border-[#eef2f8] mb-4 text-[11px]">
                  <span className="text-[#64748b]">Seats Available:</span>
                  <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>{totalSeats} remaining</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#f1f5f9]">
                <button
                  onClick={() => onViewCourse(course)}
                  className="py-2.5 px-3 rounded-2xl bg-[#f8fafc] hover:bg-[#eef3fb] border border-[#e2e8f0] text-[12px] font-semibold text-[#334155] transition-colors text-center cursor-pointer"
                >
                  View Details
                </button>
                {isEnrolled ? (
                  <button
                    onClick={() => (onStartLearning ? onStartLearning(course) : onViewCourse(course))}
                    className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-[12px] font-bold shadow-xs transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Registration is locked for this student. Click to open lifelong Learning Hub."
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Locked • Go to Learning</span>
                  </button>
                ) : isCompleted ? (
                  <button
                    disabled
                    className="py-2.5 px-3 rounded-2xl bg-slate-100 text-slate-500 border border-slate-200 text-[12px] font-bold shadow-none text-center flex items-center justify-center gap-1.5 cursor-not-allowed"
                    title="Course completed. Re-registration is locked."
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Locked • Completed</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onRegisterIntent(course)}
                    className="py-2.5 px-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-bold shadow-xs transition-all text-center cursor-pointer"
                  >
                    Register
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

