"use client";

import React from "react";
import { Sparkles, Check, Compass, Calendar, GraduationCap, BookOpen } from "lucide-react";

export const HeroSection: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-br from-white via-[#f8faff] to-[#edf3ff] rounded-3xl p-8 border border-[#eaeff8] shadow-soft overflow-hidden mb-6">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
        {/* Left Typography & Hero Copy */}
        <div className="max-w-xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/80 text-blue-700 text-[12px] font-semibold mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI-Powered Academic Advisor</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-[44px] font-extrabold tracking-tight leading-[1.15] text-[#0c142c]">
            Your Goals.{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Our Guidance.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-[15px] text-[#556987] leading-relaxed mt-3 max-w-lg">
            Get personalized course recommendations, check eligibility, and plan your
            academic journey with the power of AI.
          </p>
        </div>

        {/* Right Illustration: Academic AI Robot + Floating Badges */}
        <div className="relative w-72 h-60 flex-shrink-0 flex items-center justify-center">
          {/* Floating Badge 1: Check Eligibility */}
          <div className="absolute top-2 -left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-blue-100 shadow-md shadow-blue-500/10 flex items-center gap-2 z-20 float-hero-card">
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <div className="text-left">
              <span className="text-[11px] font-bold text-[#0c142c] block leading-none">
                Check Eligibility
              </span>
            </div>
          </div>

          {/* Floating Badge 2: Explore Opportunities */}
          <div className="absolute bottom-6 -left-8 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-indigo-100 shadow-md shadow-indigo-500/10 flex items-center gap-2 z-20 float-hero-card-delay">
            <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Compass className="w-3.5 h-3.5 stroke-[2]" />
            </div>
            <div className="text-left">
              <span className="text-[11px] font-bold text-[#0c142c] block leading-none">
                Explore Opportunities
              </span>
            </div>
          </div>

          {/* Floating Badge 3: Plan Schedule */}
          <div className="absolute top-10 -right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-purple-100 shadow-md shadow-purple-500/10 flex items-center gap-2 z-20 float-hero-card">
            <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <Calendar className="w-3.5 h-3.5 stroke-[2]" />
            </div>
            <div className="text-left">
              <span className="text-[11px] font-bold text-[#0c142c] block leading-none">
                Plan Schedule
              </span>
            </div>
          </div>

          {/* Floating Sub-badge: Smarter Students */}
          <div className="absolute bottom-2 right-0 text-[10px] text-right font-medium text-indigo-600/80 leading-tight select-none">
            <span>Smarter Students</span>
            <br />
            <span className="font-semibold text-purple-700">Brighter Futures</span>
          </div>

          {/* Academic Robot Vector Artwork */}
          <div className="relative w-44 h-48 flex items-center justify-center">
            {/* Glowing Backdrop */}
            <div className="absolute w-36 h-36 rounded-full bg-gradient-to-tr from-blue-400/20 via-indigo-400/20 to-purple-400/20 blur-xl"></div>

            {/* Academic Robot SVG */}
            <svg
              className="w-40 h-44 drop-shadow-xl relative z-10"
              viewBox="0 0 200 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Graduation Cap */}
              <polygon points="100,20 160,35 100,50 40,35" fill="#1e293b" />
              <polygon points="100,50 160,35 155,42 100,57" fill="#0f172a" />
              <rect x="70" y="45" width="60" height="12" rx="4" fill="#0f172a" />
              <path d="M150,37 L165,55 L165,80" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
              <circle cx="165" cy="82" r="4" fill="#d97706" />

              {/* Robot Head */}
              <rect x="50" y="58" width="100" height="76" rx="38" fill="url(#robot-head-grad)" stroke="#dbeafe" strokeWidth="3" />
              {/* Head Antenna / Ears */}
              <circle cx="48" cy="96" r="6" fill="#6366f1" />
              <circle cx="152" cy="96" r="6" fill="#6366f1" />

              {/* Visor Screen */}
              <rect x="64" y="76" width="72" height="42" rx="21" fill="#0b1329" />
              {/* Glowing Visor Eyes */}
              <circle cx="85" cy="97" r="7" fill="#38bdf8">
                <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="115" cy="97" r="7" fill="#38bdf8">
                <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
              </circle>
              <path d="M93,107 Q100,111 107,107" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" fill="transparent" />

              {/* Neck */}
              <rect x="90" y="134" width="20" height="10" rx="3" fill="#cbd5e1" />

              {/* Robot Body */}
              <rect x="42" y="142" width="116" height="74" rx="32" fill="url(#robot-body-grad)" stroke="#e2e8f0" strokeWidth="2" />
              {/* Chest Badge / Core */}
              <circle cx="100" cy="172" r="14" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" />
              <polygon points="100,164 104,171 112,172 106,177 108,185 100,181 92,185 94,177 88,172 96,171" fill="#a5b4fc" />

              {/* Holding Open Book */}
              <path d="M72,185 L100,192 L128,185 L128,212 L100,218 L72,212 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
              <line x1="100" y1="192" x2="100" y2="218" stroke="#6366f1" strokeWidth="2" />
              <line x1="78" y1="196" x2="94" y2="199" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
              <line x1="78" y1="202" x2="94" y2="205" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
              <line x1="106" y1="199" x2="122" y2="196" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
              <line x1="106" y1="205" x2="122" y2="202" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />

              {/* Gradients */}
              <defs>
                <linearGradient id="robot-head-grad" x1="50" y1="58" x2="150" y2="134" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#ffffff" />
                  <stop offset="0.7" stopColor="#f1f5f9" />
                  <stop offset="1" stopColor="#e2e8f0" />
                </linearGradient>
                <linearGradient id="robot-body-grad" x1="42" y1="142" x2="158" y2="216" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#ffffff" />
                  <stop offset="1" stopColor="#e6edf8" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

