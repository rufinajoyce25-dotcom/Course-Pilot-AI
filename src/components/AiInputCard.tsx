"use client";

import React, { useState } from "react";
import { Paperclip, Send, ChevronDown, Sparkles, ListPlus, GitBranch, Calendar } from "lucide-react";

interface AiInputCardProps {
  onSendMessage: (msg: string, model?: string) => void;
  isLoading: boolean;
}

export const AiInputCard: React.FC<AiInputCardProps> = ({ onSendMessage, isLoading }) => {
  const [inputVal, setInputVal] = useState("");
  const [selectedModel, setSelectedModel] = useState("CoursePilot Agent");
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isLoading) return;
    onSendMessage(inputVal, selectedModel);
    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const quickActions = [
    { label: "Find eligible courses", icon: Sparkles, query: "Find AI electives I am eligible for" },
    { label: "Build my registration plan", icon: ListPlus, query: "Build my Fall 2026 registration plan" },
    { label: "Check prerequisites", icon: GitBranch, query: "Can I register for Machine Learning?" },
    { label: "Check timetable conflicts", icon: Calendar, query: "Check whether my courses have timetable conflicts" },
  ];

  return (
    <div className="mb-6">
      {/* Main Input Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#e2e8f0] shadow-soft transition-all focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10">
        <textarea
          rows={2}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask CoursePilot anything... (e.g., 'Can I register for Machine Learning?')"
          className="w-full text-[15px] text-[#0f172a] placeholder-[#94a3b8] resize-none outline-none border-none bg-transparent"
        />

        {/* Bottom Bar: Attachment, Model Selector, Send Button */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#f1f5f9]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-9 h-9 rounded-xl hover:bg-[#f1f5fb] text-[#64748b] hover:text-[#0f172a] flex items-center justify-center transition-colors"
              title="Attach academic transcript or syllabus"
            >
              <Paperclip className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Model Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f7f9fd] hover:bg-[#eef3fb] border border-[#e2e8f0] text-[12px] font-semibold text-[#334155] transition-colors"
              >
                <span>{selectedModel}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#64748b]" />
              </button>

              {showModelDropdown && (
                <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-2xl shadow-xl border border-[#e2e8f0] py-2 z-30">
                  {["CoursePilot Agent", "GPT-4o", "Gemini 1.5 Pro", "Academic Rules Engine"].map(
                    (model) => (
                      <button
                        key={model}
                        onClick={() => {
                          setSelectedModel(model);
                          setShowModelDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-[13px] hover:bg-[#f8fafc] flex items-center justify-between ${
                          selectedModel === model ? "font-bold text-indigo-600" : "text-[#334155]"
                        }`}
                      >
                        <span>{model}</span>
                        {selectedModel === model && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Send Button */}
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={!inputVal.trim() || isLoading}
              className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center justify-center shadow-md shadow-indigo-300/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-4 h-4 text-white transform translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Chips Below Input */}
      <div className="flex flex-wrap items-center gap-2.5 mt-3">
        {quickActions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <button
              key={idx}
              onClick={() => onSendMessage(action.query)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white hover:bg-[#f1f5fb] border border-[#e2e8f0] text-[#334155] hover:text-[#0c142c] text-[12px] font-medium shadow-2xs hover:shadow-xs transition-all"
            >
              <Icon className="w-3.5 h-3.5 text-indigo-600" />
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

