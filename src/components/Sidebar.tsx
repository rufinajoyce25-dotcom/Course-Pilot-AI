"use client";

import React from "react";
import {
  Bot,
  Home,
  User,
  BookOpen,
  ShieldCheck,
  GitBranch,
  Calendar,
  Lightbulb,
  BarChart2,
  FileText,
  Send,
  GraduationCap
} from "lucide-react";

export type NavItem =
  | "ai-agent"
  | "overview"
  | "enrolled-courses"
  | "student-profile"
  | "course-catalog"
  | "eligibility"
  | "prerequisites"
  | "timetable"
  | "what-if"
  | "plans-and-score"
  | "documents"
  | "settings";

interface SidebarProps {
  activeTab: NavItem;
  onTabChange: (tab: NavItem) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const navLinks = [
    { id: "ai-agent" as NavItem, label: "AI Agent", icon: Bot, isSpecial: true },
    { id: "overview" as NavItem, label: "Overview", icon: Home },
    { id: "enrolled-courses" as NavItem, label: "Enrolled & Learning", icon: GraduationCap },
    { id: "student-profile" as NavItem, label: "Student Profile", icon: User },
    { id: "course-catalog" as NavItem, label: "Course Catalog", icon: BookOpen },
    { id: "eligibility" as NavItem, label: "Eligibility", icon: ShieldCheck },
    { id: "prerequisites" as NavItem, label: "Prerequisites", icon: GitBranch },
    { id: "timetable" as NavItem, label: "Timetable", icon: Calendar },
    { id: "what-if" as NavItem, label: "What-If Simulator", icon: Lightbulb },
    { id: "plans-and-score" as NavItem, label: "Plans & Score", icon: BarChart2 },
    { id: "documents" as NavItem, label: "Documents", icon: FileText },
  ];

  return (
    <aside className="w-[245px] flex-shrink-0 bg-white border-r border-[#eaeff8] flex flex-col justify-between min-h-screen py-6 px-4 select-none">
      {/* Brand Header */}
      <div>
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-purple-500 flex items-center justify-center shadow-md shadow-indigo-200">
            <Send className="w-5 h-5 text-white transform -rotate-12 translate-x-0.5" />
          </div>
          <div>
            <h1 className="text-[19px] font-bold tracking-tight text-[#0c142c]">
              CoursePilot
            </h1>
            <p className="text-[11px] text-[#64748b] font-normal leading-none mt-0.5">
              Plan Smarter. Learn Further.
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;

            if (isActive) {
              return (
                <button
                  key={link.id}
                  onClick={() => onTabChange(link.id)}
                  className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-medium text-[14px] shadow-lg shadow-indigo-200/50 transition-all duration-200"
                >
                  <Icon className="w-4 h-4 text-white" />
                  <span>{link.label}</span>
                </button>
              );
            }

            return (
              <button
                key={link.id}
                onClick={() => onTabChange(link.id)}
                className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-[#334155] hover:text-[#0f172a] hover:bg-[#f1f5fb] font-medium text-[14px] transition-all duration-150"
              >
                <Icon className="w-4 h-4 text-[#64748b]" />
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Mountain Landscape & Quote (Exactly like reference image) */}
      <div className="mt-8 pt-4">
        <div className="relative rounded-2xl overflow-hidden shadow-sm border border-[#e2e8f0]">
          {/* Stylized Mountain Gradient & Moon */}
          <div className="h-36 w-full bg-gradient-to-b from-[#182649] via-[#243b6b] to-[#121c35] p-3.5 flex flex-col justify-between text-white relative">
            <div className="absolute top-2 right-3 w-5 h-5 rounded-full bg-amber-100/30 blur-[2px]"></div>
            <div className="absolute top-3 right-4 w-3.5 h-3.5 rounded-full bg-amber-50"></div>
            
            {/* SVG Silhouette Peaks */}
            <svg
              className="absolute bottom-0 left-0 right-0 w-full h-16 text-[#0d1527]"
              viewBox="0 0 240 80"
              fill="currentColor"
              preserveAspectRatio="none"
            >
              <polygon points="0,80 30,35 60,65 110,25 150,55 190,15 240,80" />
            </svg>
            <svg
              className="absolute bottom-0 left-0 right-0 w-full h-10 text-[#090e1c] opacity-80"
              viewBox="0 0 240 50"
              fill="currentColor"
              preserveAspectRatio="none"
            >
              <polygon points="0,50 40,20 80,40 130,10 180,30 240,50" />
            </svg>

            <div className="z-10">
              <span className="text-[10px] font-semibold tracking-wider uppercase text-blue-200">
                CoursePilot
              </span>
            </div>
            
            <div className="z-10 pb-1">
              <p className="text-[12px] font-medium leading-tight text-white/90 italic">
                “Right courses today, a brighter tomorrow.”
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

