"use client";

import React, { useState } from "react";
import { GitBranch, Check, Lock, ArrowRight, BookOpen } from "lucide-react";
import { Course } from "@/types";

interface PrerequisitesViewProps {
  onViewCourse: (course: Course) => void;
  onRegisterIntent: (course: Course) => void;
  enrolledCourseCodes?: string[];
  completedCourseCodes?: string[];
  onStartLearning?: (code: string) => void;
}

interface PrereqNode {
  code: string;
  name: string;
  credits: number;
  status: "COMPLETED" | "AVAILABLE" | "MISSING" | "LOCKED" | "ENROLLED";
  grade?: string;
  prereqs: string[];
  level: number;
}

export const PrerequisitesView: React.FC<PrerequisitesViewProps> = ({
  onViewCourse,
  onRegisterIntent,
  enrolledCourseCodes = [],
  completedCourseCodes = [],
  onStartLearning,
}) => {
  const [selectedNode, setSelectedNode] = useState<string>("CS401");

  const rawNodes: Omit<PrereqNode, "status">[] = [
    // Level 100
    { code: "CS101", name: "Intro to Programming", credits: 4, grade: "A", prereqs: [], level: 1 },
    { code: "MATH201", name: "Discrete Mathematics", credits: 3, grade: "A-", prereqs: [], level: 1 },
    
    // Level 200
    { code: "CS201", name: "Data Structures", credits: 4, grade: "A", prereqs: ["CS101"], level: 2 },
    { code: "MATH202", name: "Probability & Statistics", credits: 3, grade: "B+", prereqs: ["MATH201"], level: 2 },
    
    // Level 300
    { code: "CS202", name: "Algorithms Design", credits: 4, grade: "A-", prereqs: ["CS201"], level: 3 },
    { code: "CS301", name: "Operating Systems", credits: 4, grade: "B", prereqs: ["CS201"], level: 3 },
    { code: "CS305", name: "Database Systems", credits: 4, prereqs: ["CS201"], level: 3 },
    
    // Level 400
    { code: "CS401", name: "Machine Learning", credits: 4, prereqs: ["CS201", "CS202", "MATH202"], level: 4 },
    { code: "CS320", name: "Cloud Computing", credits: 3, prereqs: ["CS301"], level: 4 },
    
    // Level 500 / Advanced
    { code: "CS350", name: "Computer Vision", credits: 3, prereqs: ["CS401"], level: 5 },
    { code: "CS420", name: "Natural Language Processing", credits: 3, prereqs: ["CS401"], level: 5 },
  ];

  const nodes: PrereqNode[] = rawNodes.map((n) => {
    let status: PrereqNode["status"] = "AVAILABLE";
    if (completedCourseCodes.includes(n.code) || ["CS101", "MATH201", "CS201", "MATH202", "CS202", "CS301"].includes(n.code)) {
      status = "COMPLETED";
    } else if (enrolledCourseCodes.includes(n.code)) {
      status = "ENROLLED";
    } else if (n.level >= 5) {
      status = "LOCKED";
    }
    return { ...n, status };
  });

  const currentNode = nodes.find((n) => n.code === selectedNode) || nodes[7];

  const getStatusColor = (status: PrereqNode["status"]) => {
    switch (status) {
      case "COMPLETED":
        return {
          bg: "bg-emerald-50 border-emerald-300 text-emerald-900",
          badge: "bg-emerald-500 text-white",
          label: "Completed",
        };
      case "ENROLLED":
        return {
          bg: "bg-amber-50 border-amber-300 text-amber-900",
          badge: "bg-amber-600 text-white",
          label: "Enrolled & Locked",
        };
      case "AVAILABLE":
        return {
          bg: "bg-blue-50 border-blue-300 text-blue-900",
          badge: "bg-blue-600 text-white",
          label: "Available",
        };
      case "MISSING":
        return {
          bg: "bg-rose-50 border-rose-300 text-rose-900",
          badge: "bg-rose-500 text-white",
          label: "Missing Prereq",
        };
      case "LOCKED":
        return {
          bg: "bg-slate-100 border-slate-200 text-slate-500",
          badge: "bg-slate-400 text-white",
          label: "Locked",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-[#0c142c]">Prerequisite Dependency Visualizer</h2>
        <p className="text-[13px] text-[#64748b] mt-1">
          Interactive curriculum DAG graph showing completed, unlocked, and locked academic sequences.
        </p>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-2xl p-4 border border-[#eaeff8] shadow-soft flex flex-wrap items-center gap-6 text-[12px] font-medium">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span className="text-[#334155]">Completed (Transcript Verified)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-600"></span>
          <span className="text-[#334155]">Available (Prereqs Fulfilled)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500"></span>
          <span className="text-[#334155]">Missing Prerequisite</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-slate-400"></span>
          <span className="text-[#334155]">Locked (Requires Uncompleted Courses)</span>
        </div>
      </div>

      {/* Graph Visualizer Canvas */}
      <div className="bg-white rounded-3xl p-6 border border-[#eaeff8] shadow-soft overflow-x-auto">
        <div className="min-w-[700px] flex items-center justify-between gap-6 py-6">
          {[1, 2, 3, 4, 5].map((lvl) => {
            const levelNodes = nodes.filter((n) => n.level === lvl);
            return (
              <div key={lvl} className="flex-1 flex flex-col items-center gap-5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] mb-2">
                  Tier {lvl}
                </span>

                {levelNodes.map((node) => {
                  const styling = getStatusColor(node.status);
                  const isSelected = selectedNode === node.code;

                  return (
                    <div
                      key={node.code}
                      onClick={() => setSelectedNode(node.code)}
                      className={`w-full p-4 rounded-2xl border-2 cursor-pointer transition-all duration-150 ${styling.bg} ${
                        isSelected ? "ring-4 ring-indigo-500/20 scale-105 shadow-md" : "hover:shadow-xs"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-[14px]">{node.code}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${styling.badge}`}>
                          {styling.label}
                        </span>
                      </div>
                      <p className="text-[12px] font-medium leading-tight truncate">{node.name}</p>
                      {node.grade && (
                        <div className="mt-2 text-[11px] font-bold text-emerald-700">
                          Grade: {node.grade}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Details Card */}
      {currentNode && (
        <div className="bg-white rounded-3xl p-6 border border-[#eaeff8] shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold">
                {currentNode.code}
              </span>
              <span className="text-[12px] text-[#64748b]">{currentNode.credits} Credits</span>
            </div>
            <h3 className="text-xl font-extrabold text-[#0c142c]">{currentNode.name}</h3>
            <p className="text-[13px] text-[#556987] mt-1">
              Prerequisites: {currentNode.prereqs.length > 0 ? currentNode.prereqs.join(", ") : "None"}
            </p>
          </div>

          {currentNode.status === "ENROLLED" ? (
            <button
              onClick={() => {
                if (onStartLearning) onStartLearning(currentNode.code);
              }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-[13px] shadow-sm transition-all flex-shrink-0 flex items-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Locked • Go to Learning</span>
            </button>
          ) : currentNode.status === "COMPLETED" ? (
            <button
              disabled
              className="px-6 py-3 rounded-2xl bg-slate-100 text-slate-500 border border-slate-200 font-bold text-[13px] shadow-none flex-shrink-0 flex items-center gap-2 cursor-not-allowed"
            >
              <Lock className="w-4 h-4" />
              <span>Completed & Locked</span>
            </button>
          ) : currentNode.status === "AVAILABLE" ? (
            <button
              onClick={() => {
                onRegisterIntent({
                  id: currentNode.code,
                  code: currentNode.code,
                  name: currentNode.name,
                  credits: currentNode.credits,
                  prerequisites: currentNode.prereqs,
                  sections: [],
                  type: "Core",
                  semester: "Fall 2026",
                  level: (currentNode.level * 100 as 100 | 200 | 300 | 400 | 500),
                  description: `${currentNode.name} curriculum module.`,
                  instructor: "Faculty Registrar",
                  department: "Computer Science",
                  dataSource: {
                    source: "University Registrar SIS",
                    timestamp: new Date().toISOString(),
                    status: "LIVE"
                  }
                });
              }}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[13px] shadow-sm transition-all flex-shrink-0 cursor-pointer"
            >
              Register for {currentNode.code}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
};

