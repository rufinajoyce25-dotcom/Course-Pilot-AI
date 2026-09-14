"use client";

import React, { useState } from "react";
import { Calendar, Clock, MapPin, User, AlertTriangle, Check, Sparkles } from "lucide-react";
import { TimetableSlot } from "@/types";

interface TimetableViewProps {
  slots: TimetableSlot[];
}

export const TimetableView: React.FC<TimetableViewProps> = ({ slots }) => {
  const [simulateConflict, setSimulateConflict] = useState(false);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;
  const hours = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
  ];

  // If no enrolled slots yet, show sample planned schedule for Fall 2026
  const activeSlots: TimetableSlot[] = slots.length > 0 ? slots : [
    {
      day: "Monday",
      startTime: "10:00",
      endTime: "11:00",
      courseCode: "CS401",
      courseName: "Machine Learning",
      sectionCode: "Section A",
      room: "Turing 302",
      instructor: "Dr. Elena Rostova",
      color: "#4f46e5"
    },
    {
      day: "Wednesday",
      startTime: "10:00",
      endTime: "11:00",
      courseCode: "CS401",
      courseName: "Machine Learning",
      sectionCode: "Section A",
      room: "Turing 302",
      instructor: "Dr. Elena Rostova",
      color: "#4f46e5"
    },
    {
      day: "Monday",
      startTime: "13:00",
      endTime: "14:30",
      courseCode: "CS305",
      courseName: "Database Systems",
      sectionCode: "Section A",
      room: "Hopper 210",
      instructor: "Prof. Marcus Vance",
      color: "#2563eb"
    },
    {
      day: "Wednesday",
      startTime: "13:00",
      endTime: "14:30",
      courseCode: "CS305",
      courseName: "Database Systems",
      sectionCode: "Section A",
      room: "Hopper 210",
      instructor: "Prof. Marcus Vance",
      color: "#2563eb"
    },
    {
      day: "Tuesday",
      startTime: "10:00",
      endTime: "11:30",
      courseCode: "CS320",
      courseName: "Cloud Computing",
      sectionCode: "Section A",
      room: "Berners-Lee 101",
      instructor: "Dr. Aisha Patel",
      color: "#d97706"
    },
    {
      day: "Thursday",
      startTime: "10:00",
      endTime: "11:30",
      courseCode: "CS320",
      courseName: "Cloud Computing",
      sectionCode: "Section A",
      room: "Berners-Lee 101",
      instructor: "Dr. Aisha Patel",
      color: "#d97706"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0c142c]">Weekly Timetable & Schedule</h2>
          <p className="text-[13px] text-[#64748b] mt-1">
            Real-time schedule with automated slot overlap detection and AI conflict resolution.
          </p>
        </div>

        <button
          onClick={() => setSimulateConflict(!simulateConflict)}
          className={`px-4 py-2 rounded-2xl text-[12px] font-bold border transition-all ${
            simulateConflict
              ? "bg-amber-500 text-white border-amber-600 shadow-sm"
              : "bg-white text-[#475569] border-[#e2e8f0] hover:bg-[#f8fafc]"
          }`}
        >
          {simulateConflict ? "Clear Simulated Conflict" : "Simulate Timetable Conflict"}
        </button>
      </div>

      {/* Conflict Warning Alert */}
      {simulateConflict && (
        <div className="p-4 rounded-3xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-3.5 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-[14px] font-bold">⚠️ Timetable Conflict Detected</h4>
            <p className="text-[12px] text-amber-800 mt-0.5">
              CS401 (Section B) and CS320 (Section A) have overlapping slots on Tuesday 10:00–11:00 AM.
            </p>
            <div className="mt-2.5 p-3 rounded-xl bg-white/80 border border-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[12px] font-medium text-[#0c142c]">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>AI Suggested Resolution: Switch CS401 to Section A (Mon/Wed 10:00–11:00 AM)</span>
              </div>
              <button
                onClick={() => setSimulateConflict(false)}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-lg shadow-xs"
              >
                Apply Fix
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timetable Grid */}
      <div className="bg-white rounded-3xl p-6 border border-[#eaeff8] shadow-soft overflow-x-auto">
        <div className="min-w-[750px]">
          {/* Day Headers */}
          <div className="grid grid-cols-6 gap-3 pb-3 border-b border-[#f1f5f9] text-center">
            <div className="text-[12px] font-bold text-[#94a3b8] uppercase">Time</div>
            {days.map((d) => (
              <div key={d} className="text-[13px] font-bold text-[#0c142c]">
                {d.slice(0, 3)}
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="space-y-3 pt-3">
            {hours.map((hour) => (
              <div key={hour} className="grid grid-cols-6 gap-3 min-h-[72px] items-stretch">
                {/* Hour Label */}
                <div className="text-[11px] font-semibold text-[#94a3b8] flex items-center justify-center border-r border-[#f1f5f9]">
                  {hour}
                </div>

                {/* Day Columns */}
                {days.map((day) => {
                  const matchingSlots = activeSlots.filter(
                    (s) => s.day === day && s.startTime.startsWith(hour.slice(0, 2))
                  );

                  return (
                    <div
                      key={day}
                      className="p-1 rounded-2xl bg-[#fafbfd] border border-dashed border-[#e2e8f0] flex flex-col justify-center"
                    >
                      {matchingSlots.map((slot, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-xl text-white shadow-xs space-y-0.5"
                          style={{ backgroundColor: slot.color || "#4f46e5" }}
                        >
                          <div className="flex items-center justify-between text-[11px] font-extrabold">
                            <span>{slot.courseCode}</span>
                            <span className="opacity-80 text-[9px]">{slot.sectionCode}</span>
                          </div>
                          <p className="text-[10px] font-medium opacity-90 truncate">
                            {slot.courseName}
                          </p>
                          <div className="text-[9px] opacity-75 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            <span>
                              {slot.startTime}–{slot.endTime}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

