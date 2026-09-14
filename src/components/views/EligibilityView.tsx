"use client";

import React, { useState } from "react";
import { ShieldCheck, Check, X, AlertTriangle, Sparkles, BookOpen, Lock } from "lucide-react";
import { Course, EligibilityResult } from "@/types";

interface EligibilityViewProps {
  courses: Course[];
  enrolledCourseCodes?: string[];
  completedCourseCodes?: string[];
  onRegisterIntent: (course: Course) => void;
  onStartLearning?: (course: Course) => void;
}

export const EligibilityView: React.FC<EligibilityViewProps> = ({
  courses,
  enrolledCourseCodes = [],
  completedCourseCodes = [],
  onRegisterIntent,
  onStartLearning,
}) => {
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>("CS401");
  const [auditResult, setAuditResult] = useState<EligibilityResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleRunAudit = async (code: string) => {
    setSelectedCourseCode(code);
    setIsEvaluating(true);
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: `Check eligibility for ${code}` }),
      });
      const data = await res.json();
      if (data.data?.eligibility) {
        setAuditResult(data.data.eligibility);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  React.useEffect(() => {
    handleRunAudit("CS401");
  }, []);

  const selectedCourse = courses.find((c) => c.code === selectedCourseCode) || courses[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-[#0c142c]">Academic Eligibility Engine</h2>
        <p className="text-[13px] text-[#64748b] mt-1">
          Automated rule-by-rule academic validation pipeline verifying 12 university standing & prerequisite criteria.
        </p>
      </div>

      {/* Select Course to Audit */}
      <div className="bg-white rounded-3xl p-5 border border-[#eaeff8] shadow-soft">
        <label className="text-[12px] font-bold uppercase tracking-wider text-[#64748b] block mb-3">
          Select Course for Academic Audit
        </label>
        <div className="flex flex-wrap gap-2.5">
          {courses.map((c) => (
            <button
              key={c.id}
              onClick={() => handleRunAudit(c.code)}
              className={`px-4 py-2.5 rounded-2xl text-[13px] font-bold border transition-all ${
                selectedCourseCode === c.code
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200"
                  : "bg-[#f8fafc] text-[#334155] border-[#e2e8f0] hover:bg-[#eef3fb]"
              }`}
            >
              {c.code} — {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Result Card */}
      {auditResult && (() => {
        const isEnrolled = enrolledCourseCodes.includes(selectedCourseCode);
        const isCompleted = completedCourseCodes.includes(selectedCourseCode);

        return (
          <div className="bg-white rounded-3xl p-6 border border-[#eaeff8] shadow-soft space-y-6">
            {/* Status Banner */}
            <div
              className={`p-5 rounded-2xl border flex items-center justify-between ${
                isEnrolled
                  ? "bg-amber-50 border-amber-200 text-amber-950"
                  : isCompleted
                  ? "bg-slate-100 border-slate-200 text-slate-900"
                  : auditResult.isEligible
                  ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                  : "bg-rose-50 border-rose-200 text-rose-950"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    isEnrolled
                      ? "bg-amber-500 text-white"
                      : isCompleted
                      ? "bg-slate-500 text-white"
                      : auditResult.isEligible
                      ? "bg-emerald-500 text-white"
                      : "bg-rose-500 text-white"
                  }`}
                >
                  {isEnrolled || isCompleted ? (
                    <Lock className="w-6 h-6 stroke-[2.5]" />
                  ) : auditResult.isEligible ? (
                    <Check className="w-6 h-6 stroke-[3]" />
                  ) : (
                    <X className="w-6 h-6 stroke-[3]" />
                  )}
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">
                    Eligibility Status
                  </span>
                  <h3 className="text-xl font-extrabold">
                    {isEnrolled
                      ? "🔒 REGISTRATION LOCKED (ALREADY ENROLLED)"
                      : isCompleted
                      ? "🔒 REGISTRATION LOCKED (COMPLETED)"
                      : auditResult.isEligible
                      ? "🟢 ELIGIBLE TO REGISTER"
                      : "🔴 NOT ELIGIBLE"}
                  </h3>
                </div>
              </div>

              {isEnrolled ? (
                <button
                  onClick={() => (onStartLearning ? onStartLearning(selectedCourse) : onRegisterIntent(selectedCourse))}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-[13px] shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Locked • Go to Learning Hub</span>
                </button>
              ) : isCompleted ? (
                <button
                  disabled
                  className="px-5 py-2.5 rounded-2xl bg-slate-200 text-slate-600 font-bold text-[13px] cursor-not-allowed flex items-center gap-1.5"
                >
                  <Lock className="w-4 h-4" />
                  <span>Course Completed</span>
                </button>
              ) : auditResult.isEligible && selectedCourse ? (
                <button
                  onClick={() => onRegisterIntent(selectedCourse)}
                  className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[13px] shadow-sm transition-all cursor-pointer"
                >
                  Proceed to Register
                </button>
              ) : null}
            </div>

          {/* AI Explanation */}
          <div className="p-4 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0]">
            <h4 className="text-[13px] font-bold text-[#0c142c] mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Academic Advisor Rationale</span>
            </h4>
            <p className="text-[13px] text-[#475569] leading-relaxed">{auditResult.summary}</p>
          </div>

          {/* Rule-by-rule Checklist */}
          <div>
            <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#64748b] mb-3">
              Rule Verification Breakdown
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(auditResult.checks || []).map((rule, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl border border-[#eef2f8] bg-white flex items-start gap-3"
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 ${
                      rule.passed ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                    }`}
                  >
                    {rule.passed ? (
                      <Check className="w-3 h-3 stroke-[3]" />
                    ) : (
                      <X className="w-3 h-3 stroke-[3]" />
                    )}
                  </div>
                  <div>
                    <span className="text-[13px] font-bold text-[#0c142c] block">
                      {rule.ruleName}
                    </span>
                    <p className="text-[12px] text-[#64748b] mt-0.5">{rule.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        );
      })()}
    </div>
  );
};

