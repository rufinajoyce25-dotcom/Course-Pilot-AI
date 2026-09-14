"use client";

import React from "react";
import { Check, Loader2, AlertTriangle, XCircle, Sparkles, Radio } from "lucide-react";
import { AgentStepEvent } from "@/types";

interface AgentActivityProps {
  events: AgentStepEvent[];
  isLive: boolean;
}

export const AgentActivity: React.FC<AgentActivityProps> = ({ events, isLive }) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-[#eaeff8] shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#6366f1]" />
          <h3 className="text-[15px] font-bold text-[#0c142c]">Agent Activity</h3>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Live</span>
        </div>
      </div>

      {/* Steps Timeline */}
      <div className="space-y-4 relative before:absolute before:left-[13px] before:top-2 before:bottom-3 before:w-[2px] before:bg-[#eef2f8]">
        {events.map((event, idx) => {
          const isCompleted = event.status === "COMPLETED";
          const isActive = event.status === "ACTIVE";
          const isWarning = event.status === "WARNING";
          const isError = event.status === "ERROR";

          return (
            <div key={event.eventId || idx} className="relative flex items-start gap-3 pl-1 group">
              {/* Icon Node */}
              <div className="relative z-10 flex-shrink-0 mt-0.5">
                {isCompleted && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                )}
                {isActive && (
                  <div className="w-6 h-6 rounded-full border-2 border-indigo-600 bg-white flex items-center justify-center agent-node-active">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping"></div>
                  </div>
                )}
                {isWarning && (
                  <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                )}
                {isError && (
                  <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center text-white">
                    <XCircle className="w-3.5 h-3.5" />
                  </div>
                )}
                {event.status === "PENDING" && (
                  <div className="w-6 h-6 rounded-full border-2 border-[#cbd5e1] bg-[#f8fafc]"></div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4
                    className={`text-[13px] font-semibold truncate ${
                      isActive
                        ? "text-indigo-600 font-bold"
                        : isCompleted
                        ? "text-[#0f172a]"
                        : "text-[#64748b]"
                    }`}
                  >
                    {event.step}
                  </h4>
                  <span className="text-[10px] text-[#94a3b8] font-medium ml-1 flex-shrink-0">
                    {event.timestamp}
                  </span>
                </div>
                <p className="text-[11px] text-[#64748b] leading-relaxed mt-0.5 break-words">
                  {event.detail}
                </p>
                {event.durationMs && (
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-[#94a3b8]">
                    <span>{event.source}</span>
                    <span>•</span>
                    <span>{event.durationMs}ms</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

