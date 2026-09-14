"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  Calendar,
  Database,
  Camera,
  UserPlus,
  Edit3,
  Check
} from "lucide-react";
import { Student, NotificationItem } from "@/types";

interface TopNavProps {
  student: Student | null;
  notifications: NotificationItem[];
  isDemo: boolean;
  dataSourceLabel: string;
  allStudents?: Student[];
  onSearch: (query: string) => void;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  onOpenProfileSetup?: () => void;
  onOpenCreateStudent?: () => void;
  onSwitchStudent?: (studentId: string) => void;
}

const getInitials = (name?: string) => {
  if (!name) return "ST";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const TopNav: React.FC<TopNavProps> = ({
  student,
  notifications,
  isDemo,
  dataSourceLabel,
  allStudents = [],
  onSearch,
  onOpenNotifications,
  onOpenSettings,
  onOpenProfileSetup,
  onOpenCreateStudent,
  onSwitchStudent,
}) => {
  const [searchVal, setSearchVal] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(searchVal);
    }
  };

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu]);

  return (
    <header className="h-20 bg-white border-b border-[#eaeff8] px-8 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[#94a3b8] absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search courses, instructors, syllabus, prerequisites..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-[#f8fafc] border border-[#eaeff8] text-[13px] text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Real-time Data Source Badge */}
        <button
          onClick={onOpenSettings}
          title="University SIS API Connected"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold border transition-all bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 shadow-2xs"
        >
          <Database className="w-3.5 h-3.5" />
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{dataSourceLabel}</span>
        </button>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative w-10 h-10 rounded-2xl bg-[#f7f9fd] hover:bg-[#eef3fb] border border-[#e2e8f0] flex items-center justify-center text-[#475569] hover:text-[#0f172a] transition-all"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          )}
        </button>

        {/* Student Profile Dropdown Trigger */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            title="Click to Switch Student or Create New Profile"
            className="flex items-center gap-3 pl-2 pr-2 py-1 rounded-2xl hover:bg-slate-100/70 transition-all text-left group"
          >
            <div className="relative">
              {student?.avatar ? (
                <img
                  src={student.avatar}
                  alt={student.name || "Student"}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-100 group-hover:ring-indigo-300 transition-all"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 via-blue-600 to-purple-600 text-white font-bold text-[12px] flex items-center justify-center ring-2 ring-indigo-100 group-hover:ring-indigo-300 transition-all shadow-xs">
                  {getInitials(student?.name)}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-xs group-hover:text-indigo-600 group-hover:border-indigo-200 transition-all">
                <Camera className="w-2.5 h-2.5" />
              </div>
            </div>

            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1">
                <span className="text-[13px] font-bold text-[#0c142c] group-hover:text-indigo-600 transition-colors">
                  {student?.name || "Joyce Chen"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#64748b]" />
              </div>
              <p className="text-[10px] text-[#64748b] leading-tight">
                {student?.program || "Computer Science"} • Sem {student?.semester || 6}
              </p>
            </div>
          </button>

          {/* Interactive Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              {/* Active Student Header */}
              <div className="px-4 py-2 border-b border-slate-100">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Active Student Identity
                </div>
                <div className="flex items-center gap-3">
                  {student?.avatar ? (
                    <img
                      src={student.avatar}
                      alt={student.name || "Student"}
                      className="w-10 h-10 rounded-2xl object-cover ring-2 ring-indigo-100"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-purple-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                      {getInitials(student?.name)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-bold text-slate-900 truncate">
                      {student?.name || "Joyce Chen"}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {student?.id} • CGPA {student?.cgpa}
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      if (onOpenProfileSetup) onOpenProfileSetup();
                    }}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Edit3 className="w-3 h-3" />
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* Create New Student Profile Button */}
              <div className="p-2 border-b border-slate-100">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (onOpenCreateStudent) onOpenCreateStudent();
                  }}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 border border-indigo-200/80 text-indigo-700 font-bold text-[12px] transition-all flex items-center justify-between shadow-xs group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                      <UserPlus className="w-3.5 h-3.5" />
                    </div>
                    <span>Create New Student Profile</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase bg-white text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                    + New
                  </span>
                </button>
              </div>

              {/* Switch Between Existing Student Profiles */}
              {allStudents.length > 0 && (
                <div className="pt-2 px-2">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Student (One Profile per Student)
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                    {allStudents.map((s) => {
                      const isActive = s.id === student?.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => {
                            setShowProfileMenu(false);
                            if (onSwitchStudent && !isActive) {
                              onSwitchStudent(s.id);
                            }
                          }}
                          className={`w-full p-2 rounded-xl text-left transition-all flex items-center justify-between ${
                            isActive
                              ? "bg-indigo-50 text-indigo-900 font-bold border border-indigo-100"
                              : "hover:bg-slate-50 text-slate-700 font-medium"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {s.avatar ? (
                              <img
                                src={s.avatar}
                                alt={s.name}
                                className="w-7 h-7 rounded-xl object-cover shrink-0"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                                {getInitials(s.name)}
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="text-[12px] truncate">{s.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono truncate">
                                {s.id} • {s.program}
                              </div>
                            </div>
                          </div>
                          {isActive && (
                            <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Semester Pill */}
        <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#fef3ec] text-[#9a3412] border border-[#ffedd5] font-medium text-[13px] shadow-xs select-none">
          <Calendar className="w-4 h-4 text-[#ea580c]" />
          <span>Fall 2026</span>
        </div>
      </div>
    </header>
  );
};
