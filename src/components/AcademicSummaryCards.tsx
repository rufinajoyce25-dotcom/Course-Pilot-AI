"use client";

import React from "react";
import { GraduationCap, BarChart3, BookOpen, Target, ArrowRight } from "lucide-react";
import { Student } from "@/types";

interface AcademicSummaryCardsProps {
  student: Student | null;
  onCardClick?: (type: string) => void;
}

export const AcademicSummaryCards: React.FC<AcademicSummaryCardsProps> = ({
  student,
  onCardClick,
}) => {
  const cards = [
    {
      id: "credits",
      title: "Completed Credits",
      value: `${student?.completedCredits ?? 96} / ${student?.requiredCredits ?? 140}`,
      icon: GraduationCap,
      iconBg: "bg-emerald-100 text-emerald-600",
      hasArrow: true,
      onClick: () => onCardClick && onCardClick("credits"),
    },
    {
      id: "cgpa",
      title: "Current CGPA",
      value: `${student?.cgpa ?? 8.7}`,
      icon: BarChart3,
      iconBg: "bg-purple-100 text-purple-600",
      hasArrow: true,
      onClick: () => onCardClick && onCardClick("cgpa"),
    },
    {
      id: "semester",
      title: "Current Semester",
      value: `${student?.semester ?? 6}`,
      icon: BookOpen,
      iconBg: "bg-blue-100 text-blue-600",
      hasArrow: false,
    },
    {
      id: "career",
      title: "Career Goal",
      value: `${student?.careerGoal ?? "AI/ML Engineer"}`,
      icon: Target,
      iconBg: "bg-rose-100 text-rose-600",
      hasArrow: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={card.onClick}
            className={`bg-white rounded-3xl p-5 border border-[#eaeff8] shadow-soft academic-card-hover flex flex-col justify-between ${
              card.onClick ? "cursor-pointer" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${card.iconBg}`}>
                <Icon className="w-5 h-5" />
              </div>
              {card.hasArrow && (
                <span className="text-[#94a3b8] hover:text-[#0c142c] transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </div>

            <div>
              <div className="text-xl sm:text-[22px] font-extrabold text-[#0c142c] tracking-tight">
                {card.value}
              </div>
              <div className="text-[12px] text-[#64748b] font-medium mt-0.5 flex items-center justify-between">
                <span>{card.title}</span>
                <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  LIVE
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
