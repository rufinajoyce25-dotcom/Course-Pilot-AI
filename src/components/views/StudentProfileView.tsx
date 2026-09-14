"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  User, Mail, GraduationCap, Award, BookOpen, CheckCircle,
  Calendar, Edit3, Save, Plus, Trash2, RefreshCw, Check, Sparkles, AlertCircle,
  Camera, Upload
} from "lucide-react";
import { Student } from "@/types";

interface StudentProfileViewProps {
  student: Student | null;
  onStudentUpdated?: (updated: Student) => void;
  onRefreshData?: () => void;
  onOpenCreateStudent?: () => void;
}

interface TranscriptItem {
  code: string;
  title: string;
  credits: number;
  grade: string;
  semester: string;
}

const AVATAR_PRESETS = [
  { id: "av-1", label: "Scholar", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
  { id: "av-2", label: "Developer", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
  { id: "av-3", label: "Researcher", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" },
  { id: "av-4", label: "Architect", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" },
  { id: "av-5", label: "Technologist", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" },
  { id: "av-6", label: "Engineer", url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80" },
];

const getInitials = (n?: string) => {
  if (!n) return "ST";
  const parts = n.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  student,
  onStudentUpdated,
  onRefreshData,
  onOpenCreateStudent,
}) => {
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  // Edit form state
  const [name, setName] = useState(student?.name || "");
  const [avatar, setAvatar] = useState(student?.avatar || "");
  const [email, setEmail] = useState(student?.email || "");
  const [program, setProgram] = useState(student?.program || "");
  const [department, setDepartment] = useState(student?.department || "");
  const [semester, setSemester] = useState(student?.semester || 6);
  const [cgpa, setCgpa] = useState(student?.cgpa || 8.7);
  const [careerGoal, setCareerGoal] = useState(student?.careerGoal || "AI/ML Engineer");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Add course modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCourseCode, setNewCourseCode] = useState("");
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseCredits, setNewCourseCredits] = useState(4);
  const [newCourseGrade, setNewCourseGrade] = useState("A");
  const [newCourseTerm, setNewCourseTerm] = useState("Spring 2025");

  // Sync state when student prop changes
  useEffect(() => {
    if (student) {
      setName(student.name);
      setAvatar(student.avatar || "");
      setEmail(student.email);
      setProgram(student.program);
      setDepartment(student.department);
      setSemester(student.semester);
      setCgpa(student.cgpa);
      setCareerGoal(student.careerGoal);
      fetchTranscript(student.id);
    }
  }, [student]);

  // Load all students for switcher
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/v1/students");
      const data = await res.json();
      if (data.students) setAllStudents(data.students);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTranscript = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/students/${id}`);
      const data = await res.json();
      if (data.transcript) setTranscript(data.transcript);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSwitchStudent = async (id: string) => {
    try {
      const res = await fetch("/api/v1/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "switch_active", studentId: id })
      });
      const data = await res.json();
      if (data.activeStudent) {
        if (onStudentUpdated) onStudentUpdated(data.activeStudent);
        if (onRefreshData) onRefreshData();
        setSaveSuccessMsg(`Switched active profile to ${data.activeStudent.name}!`);
        setTimeout(() => setSaveSuccessMsg(""), 3500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatar("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveProfile = async () => {
    if (!student) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/v1/students/${student.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          avatar,
          email,
          program,
          department,
          semester: Number(semester),
          cgpa: Number(cgpa),
          careerGoal
        })
      });
      const data = await res.json();
      if (data.student) {
        if (onStudentUpdated) onStudentUpdated(data.student);
        if (onRefreshData) onRefreshData();
        setIsEditing(false);
        setSaveSuccessMsg("Profile updated & synchronized with University SIS!");
        setTimeout(() => setSaveSuccessMsg(""), 3500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectGoal = async (goal: string) => {
    setCareerGoal(goal);
    if (!student) return;
    try {
      const res = await fetch(`/api/v1/students/${student.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ careerGoal: goal })
      });
      const data = await res.json();
      if (data.student) {
        if (onStudentUpdated) onStudentUpdated(data.student);
        if (onRefreshData) onRefreshData();
        setSaveSuccessMsg(`Career goal updated to ${goal}. Course recommendations refreshed!`);
        setTimeout(() => setSaveSuccessMsg(""), 3500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !newCourseCode || !newCourseTitle) return;
    try {
      const res = await fetch(`/api/v1/students/${student.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_completed_course",
          course: {
            code: newCourseCode.toUpperCase().trim(),
            title: newCourseTitle.trim(),
            credits: Number(newCourseCredits),
            grade: newCourseGrade,
            semester: newCourseTerm
          }
        })
      });
      const data = await res.json();
      if (data.transcript) {
        setTranscript(data.transcript);
        if (data.student && onStudentUpdated) onStudentUpdated(data.student);
        if (onRefreshData) onRefreshData();
        setShowAddModal(false);
        setNewCourseCode("");
        setNewCourseTitle("");
        setSaveSuccessMsg(`Added ${newCourseCode.toUpperCase()} to official transcript!`);
        setTimeout(() => setSaveSuccessMsg(""), 3500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveCourse = async (code: string) => {
    if (!student) return;
    try {
      const res = await fetch(`/api/v1/students/${student.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "remove_completed_course",
          courseCode: code
        })
      });
      const data = await res.json();
      if (data.transcript) {
        setTranscript(data.transcript);
        if (data.student && onStudentUpdated) onStudentUpdated(data.student);
        if (onRefreshData) onRefreshData();
        setSaveSuccessMsg(`Removed ${code} from transcript.`);
        setTimeout(() => setSaveSuccessMsg(""), 3500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const careerGoals = [
    { label: "AI/ML Engineer", color: "bg-indigo-50 border-indigo-200 text-indigo-700" },
    { label: "Cybersecurity Specialist", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
    { label: "Cloud Solutions Architect", color: "bg-amber-50 border-amber-200 text-amber-700" },
    { label: "Full-Stack Software Engineer", color: "bg-rose-50 border-rose-200 text-rose-700" },
    { label: "Data Scientist & Analyst", color: "bg-purple-50 border-purple-200 text-purple-700" },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {saveSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* 1. Student Profile Switcher Header */}
      <div className="bg-white rounded-3xl p-6 border border-[#eaeff8] shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#f1f5f9]">
          <div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-[#0c142c]">Select Active Student Profile</h2>
            </div>
            <p className="text-[12px] text-[#64748b] mt-0.5">
              Switch between different student records to test prerequisite chains, credit caps, and tailored course suggestions.
            </p>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-auto">
            {onOpenCreateStudent && (
              <button
                onClick={onOpenCreateStudent}
                className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[12px] transition-all flex items-center gap-1.5 shadow-sm shadow-indigo-200"
              >
                <Plus className="w-4 h-4" />
                <span>+ Create New Student Profile</span>
              </button>
            )}
            <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              ● LIVE • SIS Connected
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {allStudents.map((s) => {
            const isActive = s.id === student?.id;
            return (
              <div
                key={s.id}
                onClick={() => handleSwitchStudent(s.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3.5 ${
                  isActive
                    ? "bg-indigo-50/50 border-indigo-600 shadow-sm"
                    : "bg-white border-[#eaeff8] hover:border-indigo-300"
                }`}
              >
                {s.avatar ? (
                  <img
                    src={s.avatar}
                    alt={s.name}
                    className="w-11 h-11 rounded-xl object-cover ring-2 ring-indigo-100 shrink-0"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-[12px] flex items-center justify-center ring-2 ring-indigo-100 shadow-2xs shrink-0">
                    {getInitials(s.name)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[13px] text-[#0c142c] truncate">{s.name}</span>
                    {isActive && (
                      <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white text-[9px] font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#64748b] truncate">{s.careerGoal}</div>
                  <div className="text-[10px] text-[#94a3b8] mt-0.5 font-medium">
                    CGPA {s.cgpa} • Sem {s.semester} • {s.completedCredits} cr
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Main Profile Card (Editable) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#eaeff8] shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-[#f1f5f9]">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            {student?.avatar ? (
              <img
                src={student.avatar}
                alt={student?.name || "Student"}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-indigo-50 shadow-md shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-purple-600 text-white font-black text-[24px] flex items-center justify-center ring-4 ring-indigo-50 shadow-md shrink-0">
                {getInitials(student?.name)}
              </div>
            )}
            <div className="text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h2 className="text-2xl font-extrabold text-[#0c142c]">{student?.name || "Joyce Chen"}</h2>
                <span className="px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                  {student?.academicStanding || "Honor Roll"}
                </span>
              </div>
              <p className="text-[13px] text-[#64748b]">
                Student ID: <span className="font-mono font-semibold text-[#0c142c]">{student?.id}</span> • {student?.program}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[12px] font-bold flex items-center gap-2 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-[12px] font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-bold flex items-center gap-2 transition-all shadow-sm"
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save to SIS</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Details (Read or Edit Mode) */}
        {!isEditing ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#fafbfd] border border-[#eaeff8]">
              <div className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Department</div>
              <div className="text-[13px] font-bold text-[#0c142c] mt-1 truncate">{student?.department}</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#fafbfd] border border-[#eaeff8]">
              <div className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Current Semester</div>
              <div className="text-[13px] font-bold text-[#0c142c] mt-1">Semester {student?.semester}</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#fafbfd] border border-[#eaeff8]">
              <div className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Cumulative GPA</div>
              <div className="text-[13px] font-bold text-[#0c142c] mt-1">{student?.cgpa} / 10.0</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#fafbfd] border border-[#eaeff8]">
              <div className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Credits Completed</div>
              <div className="text-[13px] font-bold text-[#0c142c] mt-1">
                {student?.completedCredits} / {student?.requiredCredits} ({student?.degreeProgressPercentage}%)
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100">
            <div>
              <label className="block text-[11px] font-bold text-[#0c142c] mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-[13px] focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#0c142c] mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-[13px] focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#0c142c] mb-1">Program / Major</label>
              <input
                type="text"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-[13px] focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#0c142c] mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-[13px] focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#0c142c] mb-1">Current Semester</label>
              <input
                type="number"
                min="1"
                max="8"
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-[13px] focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#0c142c] mb-1">Cumulative GPA (CGPA)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={cgpa}
                onChange={(e) => setCgpa(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-[13px] focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}

        {/* Interactive Career Goal Selector */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-[14px] font-extrabold text-[#0c142c]">Target Career Goal & Specialization</h3>
            <span className="text-[11px] text-[#64748b]">• Directly drives AI course recommendations</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {careerGoals.map((g) => {
              const isSelected = student?.careerGoal === g.label;
              return (
                <button
                  key={g.label}
                  onClick={() => handleSelectGoal(g.label)}
                  className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold border transition-all ${
                    isSelected
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-sm ring-2 ring-indigo-200"
                      : "bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-slate-50"
                  }`}
                >
                  {isSelected && "✓ "}
                  {g.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Official Completed Course Record (Interactive Transcript) */}
      <div className="bg-white rounded-3xl p-6 border border-[#eaeff8] shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#f1f5f9]">
          <div>
            <h3 className="text-lg font-bold text-[#0c142c]">Official Academic Transcript & Course Ledger</h3>
            <p className="text-[12px] text-[#64748b]">
              Used by AI agent to audit prerequisite chains for Fall 2026 course enrollment
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[12px] font-bold flex items-center gap-1.5 transition-colors border border-emerald-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Completed Course</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#f1f5f9] text-[#64748b] text-[11px] font-bold uppercase tracking-wider">
                <th className="pb-3">Course Code</th>
                <th className="pb-3">Course Title</th>
                <th className="pb-3">Credits</th>
                <th className="pb-3">Term</th>
                <th className="pb-3 text-center">Grade</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f8fafc]">
              {transcript.map((item) => (
                <tr key={item.code} className="hover:bg-[#fafbfd] transition-colors">
                  <td className="py-3 font-extrabold text-[#0c142c]">{item.code}</td>
                  <td className="py-3 font-medium text-[#334155]">{item.title}</td>
                  <td className="py-3 text-[#64748b]">{item.credits} cr</td>
                  <td className="py-3 text-[#64748b]">{item.semester}</td>
                  <td className="py-3 text-center">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                      {item.grade}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleRemoveCourse(item.code)}
                      title="Remove course to test missing prerequisite handling"
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Completed Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-navy-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#eaeff8] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#0c142c]">Add Completed Course to Transcript</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCourse} className="space-y-3 text-[13px]">
              <div>
                <label className="block text-[11px] font-bold text-[#0c142c] mb-1">Course Code (e.g. CS202)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS202"
                  value={newCourseCode}
                  onChange={(e) => setNewCourseCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 uppercase font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#0c142c] mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Algorithms Design & Complexity"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#0c142c] mb-1">Credits</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={newCourseCredits}
                    onChange={(e) => setNewCourseCredits(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#0c142c] mb-1">Grade</label>
                  <select
                    value={newCourseGrade}
                    onChange={(e) => setNewCourseGrade(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B">B</option>
                    <option value="C+">C+</option>
                    <option value="C">C</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#0c142c] mb-1">Term</label>
                  <input
                    type="text"
                    value={newCourseTerm}
                    onChange={(e) => setNewCourseTerm(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 font-medium text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
