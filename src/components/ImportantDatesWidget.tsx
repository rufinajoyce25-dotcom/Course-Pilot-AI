"use client";

import React from "react";
import { Calendar, ArrowRight } from "lucide-react";

interface ImportantDatesWidgetProps {
  onViewAll: () => void;
}

export const ImportantDatesWidget: React.FC<ImportantDatesWidgetProps> = ({ onViewAll }) => {
  const dates = [
    {
      id: "d1",
      title: "Course Registration Begins",
      date: "Oct 10, 2026",
      dotColor: "bg-blue-600",
    },
    {
      id: "d2",
      title: "Last Date to Add Courses",
      date: "Oct 17, 2026",
      dotColor: "bg-purple-600",
    },
    {
      id: "d3",
      title: "Course Withdrawal Deadline",
      date: "Nov 05, 2026",
      dotColor: "bg-rose-500",
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 border border-[#eaeff8] shadow-soft mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#6366f1]" />
          <h3 className="text-[15px] font-bold text-[#0c142c]">Important Dates</h3>
        </div>
        <button
          onClick={onViewAll}
          className="text-[12px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Date rows */}
      <div className="space-y-3">
        {dates.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-[12px]">
            <div className="flex items-center gap-2.5">
              <span className={`w-2 h-2 rounded-full ${item.dotColor}`}></span>
              <span className="text-[#334155] font-medium">{item.title}</span>
            </div>
            <span className="font-semibold text-[#0c142c]">{item.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

