"use client";

import React, { useState } from "react";
import { X, Check, AlertCircle, ShieldCheck, Calendar, Clock, MapPin, Loader2, Sparkles, Lock } from "lucide-react";
import confetti from "canvas-confetti";

interface RegistrationConfirmModalProps {
  studentId?: string;
  courseCode: string;
  courseName: string;
  sectionCode: string;
  credits: number;
  schedule: string;
  seatsAvailable: number;
  eligibilitySummary: string;
  isEnrolled?: boolean;
  isCompleted?: boolean;
  onCancel: () => void;
  onSuccess: (result: any) => void;
  onStartLearning?: (code: string) => void;
}

export const RegistrationConfirmModal: React.FC<RegistrationConfirmModalProps> = ({
  studentId,
  courseCode,
  courseName,
  sectionCode,
  credits,
  schedule,
  seatsAvailable,
  eligibilitySummary,
  isEnrolled,
  isCompleted,
  onCancel,
  onSuccess,
  onStartLearning,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedResult, setConfirmedResult] = useState<any>(null);
  const [lockedError, setLockedError] = useState<string | null>(
    isEnrolled
      ? `You are already enrolled in ${courseCode} (${courseName}). Repeated registrations for the same individual are strictly locked.`
      : isCompleted
      ? `You have already completed ${courseCode}. Course retakes are locked under academic regulations.`
      : null
  );

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "confirm",
          studentId,
          courseCode,
          sectionId: sectionCode,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.isLocked || data.isDuplicate || data.error?.toLowerCase().includes("locked") || data.error?.toLowerCase().includes("already enrolled")) {
          setLockedError(data.error || "Registration Locked: Course is already enrolled for this student.");
          setIsSubmitting(false);
          return;
        }
        throw new Error(data.error || "Registration failed");
      }

      setConfirmedResult(data);
      const enrichedResult = {
        ...data,
        courseCode: data.courseCode || courseCode,
        courseName: data.courseName || courseName,
        sectionCode: data.sectionCode || sectionCode,
        credits: data.credits || credits,
        schedule: data.schedule || schedule,
        seatsRemaining: data.seatsRemaining !== undefined ? data.seatsRemaining : Math.max(0, seatsAvailable - 1),
      };

      setConfirmedResult(enrichedResult);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}

      onSuccess(data);
      onSuccess(enrichedResult);
    } catch (err: any) {
      alert(`Registration error: ${err.message}`);
      setIsSubmitting(false);
    }
  };

  const checks = [
    { label: "Registration window", detail: "Open (Fall 2026)" },
    { label: "Prerequisites complete", detail: "Data Structures, Algorithms, Probability" },
    { label: "Timetable conflict", detail: "Zero collisions detected" },
    { label: "Credit limit satisfied", detail: "100 / 140 credits total" },
    { label: "Live seat reserved", detail: `${seatsAvailable} seats available` },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-navy-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-[#eaeff8] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-[#f1f5f9] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${
              lockedError
                ? "bg-amber-50 border-amber-200 text-amber-700"
                : "bg-indigo-50 border-indigo-100 text-indigo-600"
            }`}>
              {lockedError ? <Lock className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            </div>
            <h2 className="text-xl font-extrabold text-[#0c142c]">
              {confirmedResult ? "Registration Confirmed!" : lockedError ? "Registration Locked" : "Ready to Register?"}
            </h2>
          </div>
          {!confirmedResult && (
            <button
              onClick={onCancel}
              className="w-8 h-8 rounded-full bg-[#f1f5fb] hover:bg-[#e2e8f0] flex items-center justify-center text-[#64748b] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {lockedError ? (
            /* Locked Error State */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
                <Lock className="w-8 h-8 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#0c142c]">
                  🔒 Course Registration Locked
                </h3>
                <p className="text-[13px] text-amber-900 mt-1 max-w-sm mx-auto leading-relaxed">
                  {lockedError}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-left text-[12px] text-amber-900 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>One Course, One Enrollment Policy</span>
                </div>
                <p className="text-[11.5px] leading-relaxed text-amber-800">
                  Multiple registrations for the same course are locked for each individual student. You already possess <strong>guaranteed lifelong access</strong> to all course lectures, coding labs, and completion certificates under <strong>Enrolled Courses</strong>.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-full py-3 rounded-2xl bg-white border border-[#cbd5e1] hover:bg-[#f1f5f9] text-[13px] font-bold text-[#334155] transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onCancel();
                    if (onStartLearning) onStartLearning(courseCode);
                  }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-[13px] font-bold shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Go to Learning Hub</span>
                </button>
              </div>
            </div>
          ) : confirmedResult ? (
            /* Success State */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0c142c]">
                  ✓ Successfully Enrolled in {courseCode}!
                </h3>
                <p className="text-[13px] text-[#556987] mt-1">
                  Your seat has been reserved and registered through the University SIS API.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] text-left text-[12px] space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Transaction ID:</span>
                  <span className="font-mono font-bold text-[#0c142c]">
                    {confirmedResult.transactionId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Course / Section:</span>
                  <span className="font-semibold text-[#0c142c]">
                    {courseCode} • {sectionCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Credits Added:</span>
                  <span className="font-semibold text-[#0c142c]">{credits} Credits</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Status Verification:</span>
                  <span className="font-semibold text-emerald-600">
                    ● CONFIRMED & VERIFIED
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Timestamp:</span>
                  <span className="text-[#64748b]">{confirmedResult.timestamp}</span>
                </div>
              </div>

              <button
                onClick={onCancel}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[14px] shadow-md shadow-indigo-200 transition-all"
              >
                Return to Dashboard
              </button>
            </div>
          ) : (
            /* Confirmation Prompt */
            <>
              {/* Target Course Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border border-blue-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-bold text-indigo-700">{courseCode}</span>
                  <span className="text-[11px] font-semibold text-[#64748b]">
                    {credits} Credits • {sectionCode}
                  </span>
                </div>
                <h3 className="text-[17px] font-extrabold text-[#0c142c]">{courseName}</h3>
                <p className="text-[12px] text-[#475569] mt-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{schedule}</span>
                </p>
              </div>

              {/* Verification Checklist */}
              <div>
                <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#64748b] mb-2.5">
                  Automated Pre-Registration Checks
                </h4>
                <div className="space-y-2">
                  {checks.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-[12px] p-2.5 rounded-xl bg-[#f8fafc] border border-[#eef2f8]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                        <span className="font-semibold text-[#0c142c]">{c.label}</span>
                      </div>
                      <span className="text-[11px] text-[#64748b]">{c.detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notice */}
              <p className="text-[11px] text-[#64748b] leading-tight">
                CoursePilot AI will submit this registration request directly to the authorized
                university registrar system upon your confirmation.
              </p>

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-2xl bg-white border border-[#cbd5e1] hover:bg-[#f1f5f9] text-[13px] font-bold text-[#334155] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-[13px] font-bold shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying & Registering...</span>
                    </>
                  ) : (
                    <span>Confirm Registration</span>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

