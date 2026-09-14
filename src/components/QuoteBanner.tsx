"use client";

import React from "react";
import { Quote } from "lucide-react";

export const QuoteBanner: React.FC = () => {
  return (
    <div className="relative rounded-3xl overflow-hidden border border-[#e2e8f0] shadow-soft mt-4">
      {/* Background Mountain Photo Overlay */}
      <div
        className="h-28 w-full bg-cover bg-center relative p-5 flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(24, 38, 73, 0.65), rgba(18, 28, 53, 0.85)), url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80')`,
        }}
      >
        <div className="flex items-start gap-3 z-10">
          <Quote className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5 opacity-90" />
          <p className="text-[13px] font-medium text-white/95 leading-snug italic">
            Progress is the sum of small steps, repeated daily.
          </p>
        </div>
      </div>
    </div>
  );
};

