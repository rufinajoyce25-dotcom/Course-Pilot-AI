"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Loader2, Sparkles, Calendar, MapPin, Award, ArrowRight, Download, Check } from "lucide-react";
import confetti from "canvas-confetti";

export interface EnrollmentResultData {
  transactionId: string;
  courseCode: string;
  courseName: string;
  sectionCode: string;
  room: string;
  schedule: string;
  credits: number;
  seatsRemaining: number;
  completedCreditsNow: number;
  degreeProgressNow: number;
  timestamp: string;
}

interface EnrollmentProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: EnrollmentResultData | null;
  onViewTimetable?: () => void;
  onStartLearning?: (courseCode: string) => void;
}

export const EnrollmentProgressModal: React.FC<EnrollmentProgressModalProps> = ({
  isOpen,
  onClose,
  result,
  onViewTimetable,
  onStartLearning,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (isOpen && result) {
      setCurrentStep(1);
      setIsDone(false);

      const t1 = setTimeout(() => setCurrentStep(2), 600);
      const t2 = setTimeout(() => setCurrentStep(3), 1200);
      const t3 = setTimeout(() => setCurrentStep(4), 1800);
      const t4 = setTimeout(() => {
        setCurrentStep(5);
        setIsDone(true);
        // Trigger celebration confetti
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // Ignore
        }
      }, 2400);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }
  }, [isOpen, result]);

  if (!isOpen || !result) return null;

  const steps = [
    { num: 1, title: "Prerequisite Audit", desc: "Transcript verified with zero deficiencies" },
    { num: 2, title: "Timetable & Room Validation", desc: "No schedule overlaps or room collisions" },
    { num: 3, title: "Live Seat Reservation", desc: `Secured seat (Seats: ${result.seatsRemaining + 1} → ${result.seatsRemaining})` },
    { num: 4, title: "Registrar Transaction Ledger", desc: `Recorded with ID: ${result.transactionId}` },
    { num: 5, title: "Enrollment Complete", desc: "Official academic confirmation synchronized" }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-navy-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-[#eaeff8] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 pb-4 bg-gradient-to-r from-navy-900 via-indigo-900 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xs">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-[17px] font-extrabold text-white">Live Enrollment Pipeline</h2>
              <p className="text-[12px] text-indigo-200">Automated multi-step university registration gateway</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
            ● LIVE
          </span>
        </div>

        <div className="p-6 space-y-6">
          {/* Progress Timeline */}
          <div className="space-y-3">
            {steps.map((s) => {
              const isCompleted = currentStep > s.num || isDone;
              const isCurrent = currentStep === s.num && !isDone;
              const isPending = currentStep < s.num;

              return (
                <div
                  key={s.num}
                  className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                    isCompleted
                      ? "bg-emerald-50/60 border-emerald-200 text-emerald-950"
                      : isCurrent
                      ? "bg-indigo-50/60 border-indigo-300 text-indigo-950 shadow-xs ring-2 ring-indigo-100"
                      : "bg-slate-50/60 border-slate-100 text-slate-400 opacity-60"
                  }`}
                >
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : isCurrent ? (
                      <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                    ) : (
                      <span className="w-5 h-5 rounded-full border border-slate-300 text-[11px] font-bold text-slate-400 flex items-center justify-center">
                        {s.num}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold truncate">{s.title}</div>
                    <div className="text-[11px] text-slate-500 truncate">{s.desc}</div>
                  </div>
                  {isCompleted && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                      VERIFIED
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Official Receipt Card (Shown on completion) */}
          {isDone && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#fafbfd] to-indigo-50/30 border border-indigo-100 space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-2 border-b border-indigo-100/70">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Official Registration Receipt
                </span>
                <span className="font-mono text-[11px] font-bold text-indigo-700">
                  {result.transactionId}
                </span>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <div className="text-base font-extrabold text-[#0c142c]">
                    {result.courseCode} — {result.courseName}
                  </div>
                  <div className="text-[12px] text-slate-600 mt-0.5 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                      {result.room} ({result.sectionCode})
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                      {result.schedule}
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-indigo-100 text-indigo-800 text-[11px] font-extrabold">
                  +{result.credits} Credits
                </span>
              </div>

              <div className="pt-2 border-t border-indigo-100/70 flex items-center justify-between text-[11px] text-slate-600">
                <div>
                  Updated Completed Credits: <strong className="text-[#0c142c]">{result.completedCreditsNow} / 140</strong>
                </div>
                <div>
                  Degree Progress: <strong className="text-emerald-700 font-bold">{result.degreeProgressNow}%</strong>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {isDone ? (
              <>
                {onStartLearning && (
                  <button
                    onClick={() => {
                      onClose();
                      onStartLearning(result.courseCode);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-[13px] font-bold flex items-center gap-2 transition-all shadow-sm"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Start Learning (Videos & Labs)</span>
                  </button>
                )}
                {onViewTimetable && (
                  <button
                    onClick={() => {
                      onClose();
                      onViewTimetable();
                    }}
                    className="px-4 py-2.5 rounded-xl border border-indigo-200 text-indigo-700 hover:bg-indigo-50 text-[13px] font-bold flex items-center gap-2 transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>View in Timetable</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-bold transition-all shadow-md"
                >
                  Done
                </button>
              </>
            ) : (
              <span className="text-[12px] font-medium text-slate-400 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                Connecting to live university registrar...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

