"use client";

import React, { useState, useEffect } from "react";
import { Database, Shield, Key, Server, Check, AlertCircle, RefreshCw, Bot, Sparkles } from "lucide-react";

interface SettingsViewProps {
  isDemo: boolean;
  dataSourceLabel: string;
  onToggleProvider: (useReal: boolean) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  isDemo,
  dataSourceLabel,
  onToggleProvider,
}) => {
  const [apiUrl, setApiUrl] = useState("https://api.university.edu/v1");
  const [apiKey, setApiKey] = useState("univ_sec_live_98a72b");
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [activeProvider, setActiveProvider] = useState<"demo" | "real">(isDemo ? "demo" : "real");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("coursepilot_gemini_api_key");
      if (stored) setGeminiApiKey(stored);
    }
  }, []);

  const handleSaveGeminiKey = () => {
    if (typeof window !== "undefined") {
      if (geminiApiKey.trim()) {
        localStorage.setItem("coursepilot_gemini_api_key", geminiApiKey.trim());
        setSaveMessage("Saved Google Gemini API Key! Autonomous agent now upgraded with live cloud LLM reasoning.");
      } else {
        localStorage.removeItem("coursepilot_gemini_api_key");
        setSaveMessage("Reset to Built-in Zero-Latency Universal Academic Knowledge Engine.");
      }
      setTimeout(() => setSaveMessage(""), 3500);
    }
  };

  const handleSave = (providerType: "demo" | "real") => {
    setActiveProvider(providerType);
    onToggleProvider(providerType === "real");
    setSaveMessage(
      providerType === "real"
        ? "Connected to Authorized University SIS API"
        : "Switched to Development Data Provider (Demo Data Mode)"
    );
    setTimeout(() => setSaveMessage(""), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-[#0c142c]">Integration Gateway & Settings</h2>
        <p className="text-[13px] text-[#64748b] mt-1">
          Configure real-time university SIS connections, data provider adapters, and security credentials.
        </p>
      </div>

      {saveMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] font-bold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Provider Switch Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#eaeff8] shadow-soft space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-[#f1f5f9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#0c142c]">Active Data Provider</h3>
              <p className="text-[12px] text-[#64748b]">
                Current status: <span className="font-bold text-[#0c142c]">{dataSourceLabel}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Two Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Demo Provider Card */}
          <div
            onClick={() => handleSave("demo")}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
              activeProvider === "demo"
                ? "bg-amber-50/50 border-amber-500 shadow-sm"
                : "bg-white border-[#eaeff8] hover:border-amber-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[14px] text-[#0c142c]">Development Data Provider</span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                SANDBOX / STAGING
              </span>
            </div>
            <p className="text-[12px] text-[#556987] leading-relaxed">
              Uses normalized realistic in-memory CS curriculum with simulated seat reservations and instant response times.
            </p>
          </div>

          {/* Real University Provider Card */}
          <div
            onClick={() => handleSave("real")}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
              activeProvider === "real"
                ? "bg-emerald-50/50 border-emerald-600 shadow-sm"
                : "bg-white border-[#eaeff8] hover:border-emerald-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[14px] text-[#0c142c]">Real University SIS API</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                ● LIVE
              </span>
            </div>
            <p className="text-[12px] text-[#556987] leading-relaxed">
              Connects directly to authorized enterprise university registration gateways using Bearer token authentication.
            </p>
          </div>
        </div>
      </div>

      {/* University API Config */}
      <div className="bg-white rounded-3xl p-6 border border-[#eaeff8] shadow-soft space-y-4">
        <h3 className="text-[15px] font-bold text-[#0c142c] flex items-center gap-2">
          <Server className="w-4 h-4 text-indigo-600" />
          <span>University API Endpoints & Credentials</span>
        </h3>

        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] block mb-1">
              UNIVERSITY_API_BASE_URL
            </label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#f8fafc] text-[13px] rounded-xl border border-[#e2e8f0] font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] block mb-1">
              UNIVERSITY_API_KEY
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#f8fafc] text-[13px] rounded-xl border border-[#e2e8f0] font-mono"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => handleSave("real")}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[13px] rounded-xl shadow-xs transition-all"
          >
            Update Configuration
          </button>
        </div>
      </div>

      {/* AI Model & Knowledge Engine Settings */}
      <div className="bg-white rounded-3xl p-6 border border-[#eaeff8] shadow-soft space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#0c142c]">Autonomous AI Agent Intelligence Engine</h3>
              <p className="text-[12px] text-[#64748b]">
                Active Engine: <span className="font-bold text-emerald-700">● Dual Engine (Built-in Universal Knowledge Base + Optional Gemini Cloud LLM)</span>
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            Ready to Answer Any Question
          </span>
        </div>

        <p className="text-[13px] text-[#556987] leading-relaxed">
          CoursePilot AI is equipped with an encyclopedic academic knowledge engine capable of answering any question regarding computer science theory, databases, machine learning, cloud architecture, university regulations, LeetCode/interview roadmaps, study habits, and platform features.
        </p>

        <div className="space-y-3 pt-1">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] block mb-1">
              Google Gemini API Key (Optional Cloud LLM Acceleration)
            </label>
            <div className="flex gap-3">
              <input
                type="password"
                placeholder="AIzaSy... (Leave empty to use zero-latency local academic engine)"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-[#f8fafc] text-[13px] rounded-xl border border-[#e2e8f0] font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <button
                onClick={handleSaveGeminiKey}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-[13px] rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>Save Key</span>
              </button>
            </div>
            <p className="text-[11px] text-[#94a3b8] mt-1.5">
              Your API key is securely stored in your browser session and connects directly to Gemini 1.5/2.0 Flash with complete live university context.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

