"use client";

import React, { useState } from "react";
import { Lightbulb, ArrowRight, AlertTriangle, CheckCircle, Sparkles, RefreshCw } from "lucide-react";
import { WhatIfSimulationResult } from "@/types";

export const WhatIfSimulatorView: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<string>("drop-cs305");
  const [result, setResult] = useState<WhatIfSimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const scenarios = [
    {
      id: "drop-cs305",
      title: "What if I drop Database Systems (CS305)?",
      description: "Analyze downstream prerequisite blocking and graduation date impacts.",
    },
    {
      id: "swap-cloud",
      title: "What if I swap CS320 for Cybersecurity (CS380)?",
      description: "Compare specialization pathway alignment and elective fulfillment.",
    },
    {
      id: "overload-18",
      title: "What if I take 18 credits (Overload Plan)?",
      description: "Audit Dean's Honor Roll eligibility and workload feasibility.",
    },
  ];

  const runSimulation = async (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    setIsSimulating(true);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: scenarioId === "drop-cs305"
            ? "What happens if I drop Database Systems?"
            : scenarioId === "swap-cloud"
            ? "What if I swap Cloud Computing for Cybersecurity?"
            : "What if I take 18 credits this semester?",
        }),
      });
      const data = await res.json();
      if (data.data?.simulation) {
        setResult(data.data.simulation);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  React.useEffect(() => {
    runSimulation("drop-cs305");
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-[#0c142c]">What-If Academic Sandbox</h2>
        <p className="text-[13px] text-[#64748b] mt-1">
          Simulate drop, swap, and credit overload changes safely without affecting your official registration records.
        </p>
      </div>

      {/* Scenario Pickers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map((sc) => (
          <div
            key={sc.id}
            onClick={() => runSimulation(sc.id)}
            className={`p-5 rounded-3xl border-2 cursor-pointer transition-all ${
              selectedScenario === sc.id
                ? "bg-indigo-50/70 border-indigo-600 shadow-md"
                : "bg-white border-[#eaeff8] hover:border-indigo-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className={`w-4 h-4 ${selectedScenario === sc.id ? "text-indigo-600" : "text-[#94a3b8]"}`} />
              <h4 className="text-[14px] font-bold text-[#0c142c]">{sc.title}</h4>
            </div>
            <p className="text-[12px] text-[#556987] leading-relaxed">{sc.description}</p>
          </div>
        ))}
      </div>

      {/* Simulation Results */}
      {result && (
        <div className="bg-white rounded-3xl p-6 border border-[#eaeff8] shadow-soft space-y-6">
          {/* Comparison Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] block">
                Total Credits
              </span>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xl font-bold text-[#64748b]">{result.originalCredits} cr</span>
                <ArrowRight className="w-4 h-4 text-[#94a3b8]" />
                <span className="text-2xl font-extrabold text-[#0c142c]">
                  {result.simulatedCredits} cr
                </span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] block">
                Degree Progress
              </span>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xl font-bold text-[#64748b]">{result.originalProgress}%</span>
                <ArrowRight className="w-4 h-4 text-[#94a3b8]" />
                <span className="text-2xl font-extrabold text-indigo-600">
                  {result.simulatedProgress}%
                </span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] block">
                Graduation Timeline
              </span>
              <div className="mt-1 flex items-center gap-2">
                {result.graduationDelayRisk ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-[12px] font-bold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Delayed by 1 Semester
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[12px] font-bold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    On Track for May 2027
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* AI Explanation & Advisory */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50/60 to-indigo-50/60 border border-blue-100 space-y-3">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-[14px]">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>AI Advisor Simulation Analysis</span>
            </div>
            <p className="text-[13px] text-[#334155] leading-relaxed">{result.explanation}</p>
            <div className="pt-2 border-t border-indigo-100/80">
              <span className="text-[12px] font-bold text-indigo-950">Recommendation: </span>
              <span className="text-[12px] text-indigo-800 font-medium">{result.aiRecommendation}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

