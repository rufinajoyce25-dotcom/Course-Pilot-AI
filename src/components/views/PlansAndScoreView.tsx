"use client";

import React from "react";
import { BarChart3, TrendingUp, CheckCircle, Award, Target, BookOpen } from "lucide-react";
import { Student } from "@/types";

interface PlansAndScoreViewProps {
  student: Student | null;
}

export const PlansAndScoreView: React.FC<PlansAndScoreViewProps> = ({ student }) => {
  const cgpa = student?.cgpa ?? 8.7;
  const credits = student?.completedCredits ?? 96;
  const required = student?.requiredCredits ?? 140;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-[#0c142c]">Academic Progress & Graduation Score</h2>
        <p className="text-[13px] text-[#64748b] mt-1">
          Detailed degree completion audit, GPA trajectory analytics, and graduation honors forecast.
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-[#eaeff8] shadow-soft">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase text-[#64748b]">Academic Standing</span>
              <h4 className="text-lg font-extrabold text-[#0c142c]">{student?.academicStanding || "Honor Roll"}</h4>
            </div>
          </div>
          <p className="text-[12px] text-[#556987]">
            Dean's List qualifier (Top 5% of Computer Science cohort).
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#eaeff8] shadow-soft">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase text-[#64748b]">Cumulative CGPA</span>
              <h4 className="text-lg font-extrabold text-[#0c142c]">{cgpa} / 10.0</h4>
            </div>
          </div>
          <p className="text-[12px] text-[#556987]">
            Projected Graduation CGPA: 8.82 based on current course trajectory.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#eaeff8] shadow-soft">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase text-[#64748b]">Remaining Credits</span>
              <h4 className="text-lg font-extrabold text-[#0c142c]">{required - credits} Credits</h4>
            </div>
          </div>
          <p className="text-[12px] text-[#556987]">
            Estimated completion in 2 semesters (Spring 2027).
          </p>
        </div>
      </div>

      {/* Degree Distribution Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#eaeff8] shadow-soft space-y-5">
        <h3 className="text-[16px] font-bold text-[#0c142c]">Degree Requirement Distribution</h3>
        
        {/* Core Bar */}
        <div>
          <div className="flex justify-between text-[13px] font-medium mb-1.5">
            <span className="text-[#334155]">Core Computer Science Requirements</span>
            <span className="font-bold text-[#0c142c]">12 / 16 Courses Completed (75%)</span>
          </div>
          <div className="w-full h-3 rounded-full bg-[#f1f5f9] overflow-hidden">
            <div className="h-full rounded-full bg-indigo-600" style={{ width: "75%" }}></div>
          </div>
        </div>

        {/* Electives Bar */}
        <div>
          <div className="flex justify-between text-[13px] font-medium mb-1.5">
            <span className="text-[#334155]">Technical & AI/ML Electives</span>
            <span className="font-bold text-[#0c142c]">8 / 12 Courses Completed (66%)</span>
          </div>
          <div className="w-full h-3 rounded-full bg-[#f1f5f9] overflow-hidden">
            <div className="h-full rounded-full bg-blue-600" style={{ width: "66%" }}></div>
          </div>
        </div>

        {/* Capstone & General Ed */}
        <div>
          <div className="flex justify-between text-[13px] font-medium mb-1.5">
            <span className="text-[#334155]">General Education & Capstone</span>
            <span className="font-bold text-[#0c142c]">6 / 8 Courses Completed (75%)</span>
          </div>
          <div className="w-full h-3 rounded-full bg-[#f1f5f9] overflow-hidden">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: "75%" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

