"use client";

import React from "react";
import { ArrowRight, BookOpen, Layers, Sigma, AlertCircle } from "lucide-react";
import { Student } from "@/types";

interface MyPlanWidgetProps {
  student: Student | null;
  onViewPlan: () => void;
}

export const MyPlanWidget: React.FC<MyPlanWidgetProps> = ({ student, onViewPlan }) => {
  const percentage = student?.degreeProgressPercentage ?? 68;
  const coreCompleted = student?.coreCoursesCompleted ?? 12;
  const coreTotal = student?.coreCoursesTotal ?? 16;
  const electivesCompleted = student?.electivesCompleted ?? 8;
  const electivesTotal = student?.electivesTotal ?? 12;
  const completedCredits = student?.completedCredits ?? 96;
  const requiredCredits = student?.requiredCredits ?? 140;
  const backlogs = student?.backlogs ?? 0;

  // SVG circle calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  return (
    <div className="bg-white rounded-3xl p-5 border border-[#eaeff8] shadow-soft mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-bold text-[#0c142c]">My Plan</h3>
        <button
          onClick={onViewPlan}
          className="text-[12px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
        >
          <span>View Plan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Degree Progress & Circular Gauge */}
      <div className="flex items-center gap-4 pb-4 border-b border-[#f1f5f9]">
        <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="text-[#f1f5f9]"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="text-emerald-500 transition-all duration-700 ease-out"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-[18px] font-extrabold text-[#0c142c] leading-none">
              {percentage}%
            </span>
            <span className="text-[9px] text-[#64748b] font-medium leading-none mt-1">
              Degree
              <br />
              Progress
            </span>
          </div>
        </div>

        {/* Breakdown Stats */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between text-[12px]">
            <span className="flex items-center gap-1.5 text-[#64748b]">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              Core Courses
            </span>
            <span className="font-bold text-[#0c142c]">
              {coreCompleted} / {coreTotal}
            </span>
          </div>

          <div className="flex items-center justify-between text-[12px]">
            <span className="flex items-center gap-1.5 text-[#64748b]">
              <Layers className="w-3.5 h-3.5 text-blue-500" />
              Electives
            </span>
            <span className="font-bold text-[#0c142c]">
              {electivesCompleted} / {electivesTotal}
            </span>
          </div>

          <div className="flex items-center justify-between text-[12px]">
            <span className="flex items-center gap-1.5 text-[#64748b]">
              <Sigma className="w-3.5 h-3.5 text-purple-500" />
              Total Credits
            </span>
            <span className="font-bold text-[#0c142c]">
              {completedCredits} / {requiredCredits}
            </span>
          </div>

          <div className="flex items-center justify-between text-[12px]">
            <span className="flex items-center gap-1.5 text-[#64748b]">
              <AlertCircle className="w-3.5 h-3.5 text-emerald-500" />
              Active Backlogs
            </span>
            <span className="font-bold text-[#0c142c]">{backlogs}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

