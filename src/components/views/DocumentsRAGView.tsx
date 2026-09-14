"use client";

import React, { useState } from "react";
import { Search, FileText, Sparkles, BookOpen, ExternalLink } from "lucide-react";
import { UniversityDocument } from "@/types";

export const DocumentsRAGView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const initialDocs: UniversityDocument[] = [
    {
      id: "doc-1",
      title: "Academic Regulations 2026",
      category: "Regulations",
      section: "Section 4.2 - Credit Load & Overloads",
      content: "Undergraduate students in good standing (CGPA ≥ 6.0) may register for a maximum of 18 credits per regular semester. Students on the Dean's Honor Roll (CGPA ≥ 8.5) may petition for an overload up to 21 credits with academic advisor approval. Minimum full-time registration is 12 credits.",
      lastUpdated: "Fall 2026",
      sourceFile: "Regulations_2026_RevB.pdf"
    },
    {
      id: "doc-2",
      title: "Course Registration Policy",
      category: "Policy",
      section: "Section 2.1 - Add/Drop Periods & Live Seat Allocation",
      content: "Course registration takes place through the automated portal. Course seats are reserved on a verified first-come-first-served basis upon student confirmation. The last date to add courses without penalty is Oct 17, 2026. Drops before Oct 25, 2026 will not appear on official academic transcripts.",
      lastUpdated: "Aug 2026",
      sourceFile: "Registration_Policy_Fall2026.pdf"
    },
    {
      id: "doc-3",
      title: "Degree Requirements: B.S. Computer Science",
      category: "Requirements",
      section: "AI/ML Specialization Track",
      content: "To graduate with an AI/ML Specialization track, students must complete: CS401 Machine Learning (Core, 4 credits), CS350 Computer Vision (Elective, 3 credits) or CS420 Natural Language Processing (Elective, 3 credits), and complete a capstone project with AI focus. Prerequisites CS201, CS202, and MATH202 must be satisfied prior to CS401.",
      lastUpdated: "Fall 2026",
      sourceFile: "BS_CS_Degree_Requirements_2026.pdf"
    },
    {
      id: "doc-4",
      title: "Prerequisite Enforcement Rules",
      category: "Handbook",
      section: "Section 3.5 - Mandatory Prerequisite Verification",
      content: "Prerequisites are verified automatically at the point of registration. A course marked as prerequisite must have a recorded passing grade (Grade ≥ C / 2.0). Co-requisites may be registered simultaneously provided both course sections do not create timetable collisions.",
      lastUpdated: "Fall 2026",
      sourceFile: "Course_Handbook_2026.pdf"
    }
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: `Search documents: ${searchQuery}` }),
      });
      const data = await res.json();
      if (data.data?.documents) {
        setSearchResults(data.data.documents);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-[#0c142c]">Academic Documents & RAG Knowledge Base</h2>
        <p className="text-[13px] text-[#64748b] mt-1">
          Search verified university handbooks, graduation rules, and credit regulations with citation-backed answers.
        </p>
      </div>

      {/* RAG Search Bar */}
      <form onSubmit={handleSearch} className="bg-white rounded-3xl p-5 border border-[#eaeff8] shadow-soft">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-[#94a3b8] absolute left-4" />
          <input
            type="text"
            placeholder="Ask a policy question (e.g., 'What is the credit overload limit for Honor Roll?')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-32 py-3 bg-[#f8fafc] text-[14px] text-[#0f172a] rounded-2xl border border-[#e2e8f0] focus:border-indigo-500 outline-none"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="absolute right-2.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-bold rounded-xl shadow-xs transition-all"
          >
            {isSearching ? "Searching..." : "Search Docs"}
          </button>
        </div>
      </form>

      {/* Search Results / Document Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {(searchResults.length > 0 ? searchResults.map((r) => r.document) : initialDocs).map(
          (doc: UniversityDocument) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl p-6 border border-[#eaeff8] shadow-soft academic-card-hover flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                      {doc.category}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#94a3b8]">{doc.lastUpdated}</span>
                </div>

                <h3 className="text-lg font-bold text-[#0c142c] mb-1">{doc.title}</h3>
                <h4 className="text-[12px] font-semibold text-indigo-600 mb-3">{doc.section}</h4>
                <p className="text-[13px] text-[#475569] leading-relaxed mb-4">{doc.content}</p>
              </div>

              <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-[11px] text-[#64748b]">
                <span className="font-mono">{doc.sourceFile}</span>
                <span className="text-emerald-700 font-semibold">● Verified University Source</span>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

