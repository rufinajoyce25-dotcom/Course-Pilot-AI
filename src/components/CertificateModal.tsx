"use client";

import React from "react";
import { X, Download, Printer, Award, ShieldCheck, CheckCircle2 } from "lucide-react";
import { CourseCertificate } from "@/types";
import { generateCertificatePdf } from "@/lib/utils/pdfGenerator";

interface CertificateModalProps {
  certificate: CourseCertificate | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !certificate) return null;

  const handleDownloadPdf = () => {
    generateCertificatePdf(certificate);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-slate-900 leading-tight">
                Verified Academic Certificate of Completion
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Issued by University Registrar • ID: {certificate.certificateId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-bold shadow-sm shadow-indigo-200 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[12px] font-semibold transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl hover:bg-slate-200/60 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all ml-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Rendering Box */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-100 flex items-center justify-center">
          <div className="w-full max-w-3xl bg-white rounded-2xl p-8 sm:p-12 shadow-xl border-4 border-amber-600/30 relative text-center select-none">
            {/* Inner Golden Border */}
            <div className="absolute inset-3 border-2 border-amber-500/40 rounded-xl pointer-events-none"></div>

            {/* University Crest / Title */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1 text-amber-500 font-bold tracking-widest text-[11px] uppercase mb-1">
                ★ ★ ★ ★ ★
              </div>
              <h2 className="text-[18px] sm:text-[22px] font-extrabold tracking-tight text-slate-900 uppercase">
                National Institute of Higher Computing & Technology
              </h2>
              <p className="text-[11px] sm:text-[12px] text-slate-500 tracking-wide uppercase font-medium mt-0.5">
                {certificate.department} • Faculty of Academic Affairs
              </p>
            </div>

            {/* Certificate Heading */}
            <div className="my-6">
              <span className="text-[11px] uppercase tracking-widest font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Official Credential
              </span>
              <h1 className="text-[24px] sm:text-[32px] font-black text-indigo-950 tracking-tight mt-3">
                CERTIFICATE OF COMPLETION
              </h1>
              <p className="text-[13px] text-slate-500 mt-1 italic font-serif">
                This certifies that the following candidate has demonstrated academic mastery:
              </p>
            </div>

            {/* Student Name */}
            <div className="my-6">
              <h3 className="text-[28px] sm:text-[36px] font-black text-indigo-600 tracking-tight underline decoration-indigo-300 underline-offset-8">
                {certificate.studentName}
              </h3>
            </div>

            {/* Course Accomplishment Details */}
            <div className="max-w-xl mx-auto space-y-2 text-slate-700">
              <p className="text-[13px]">
                has successfully fulfilled all curriculum requirements, comprehensive lectures, and practical assignments for
              </p>
              <div className="text-[18px] sm:text-[20px] font-bold text-slate-900 bg-slate-50 py-2.5 px-4 rounded-xl border border-slate-200">
                {certificate.courseCode} — {certificate.courseName}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 text-[12px] font-medium text-slate-600 pt-2">
                <span>Earned Credits: <strong>{certificate.credits} Units</strong></span>
                <span>•</span>
                <span>Final Grade: <strong>{certificate.grade}</strong></span>
                <span>•</span>
                <span>Final Assessment: <strong className="text-indigo-700 font-bold">{certificate.quizScore || 18} / {certificate.quizMaxScore || 20} Marks</strong> (Passed • Criteria: ≥12/20)</span>
                <span>•</span>
                <span>Standing: <strong className="text-emerald-700">{certificate.honors}</strong></span>
              </div>
            </div>

            {/* Signatures & Seal */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end mt-12 pt-8 border-t border-slate-100">
              <div className="text-center">
                <div className="h-9 font-serif italic text-indigo-900 text-[16px] font-bold">
                  {certificate.instructorName}
                </div>
                <div className="border-t border-slate-300 pt-1 text-[11px] font-bold text-slate-700">
                  Lead Course Faculty
                </div>
                <div className="text-[10px] text-slate-400">Department Instructor</div>
              </div>

              {/* Official Gold Seal */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 shadow-md flex items-center justify-center border-2 border-amber-600 text-amber-950">
                  <div className="text-center leading-none">
                    <ShieldCheck className="w-5 h-5 mx-auto text-amber-900 mb-0.5" />
                    <span className="text-[7px] font-black uppercase tracking-wider block">OFFICIAL</span>
                    <span className="text-[7px] font-black tracking-wider block">SEAL</span>
                  </div>
                </div>
                <span className="text-[10px] text-amber-700 font-bold mt-1">Verified Credential</span>
              </div>

              <div className="text-center">
                <div className="h-9 font-serif italic text-indigo-900 text-[16px] font-bold">
                  Prof. Victoria Sterling
                </div>
                <div className="border-t border-slate-300 pt-1 text-[11px] font-bold text-slate-700">
                  Dean of Academic Affairs
                </div>
                <div className="text-[10px] text-slate-400">Office of the University Registrar</div>
              </div>
            </div>

            {/* Verification Footer */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 gap-2">
              <span>Date Issued: {certificate.completionDate}</span>
              <span className="font-mono bg-slate-50 px-2.5 py-1 rounded border border-slate-200 text-slate-600">
                Hash: {certificate.verificationCode}
              </span>
              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                <CheckCircle2 className="w-3 h-3" /> Verifiable on University SIS
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

