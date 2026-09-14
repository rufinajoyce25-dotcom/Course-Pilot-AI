"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  User,
  GraduationCap,
  Award,
  BookOpen,
  Sparkles,
  Camera,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { Student } from "@/types";

interface CreateStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingStudents: Student[];
  onStudentCreated: (newStudent: Student) => void;
  onSwitchToStudent?: (studentId: string) => void;
}

const AVATAR_PRESETS = [
  { id: "av-1", label: "Scholar", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
  { id: "av-2", label: "Developer", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
  { id: "av-3", label: "Researcher", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" },
  { id: "av-4", label: "Architect", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" },
  { id: "av-5", label: "Technologist", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" },
  { id: "av-6", label: "Engineer", url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80" },
];

const AVAILABLE_ENROLLMENTS = [
  { code: "CS401", name: "Machine Learning", credits: 4 },
  { code: "CS305", name: "Database Systems", credits: 3 },
  { code: "CS320", name: "Cloud Computing", credits: 3 },
  { code: "CS380", name: "Cybersecurity", credits: 3 },
  { code: "CS350", name: "Computer Vision", credits: 4 },
  { code: "CS420", name: "Natural Language Processing", credits: 4 },
];

const COMMON_PREREQS = [
  { code: "CS101", title: "Intro to Computer Science" },
  { code: "CS102", title: "Object-Oriented Programming" },
  { code: "MATH201", title: "Discrete Mathematics" },
  { code: "MATH202", title: "Probability & Statistics" },
  { code: "CS201", title: "Data Structures & Algorithms" },
  { code: "CS205", title: "Computer Architecture" },
];

const getInitials = (n?: string) => {
  if (!n) return "ST";
  const parts = n.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const CreateStudentModal: React.FC<CreateStudentModalProps> = ({
  isOpen,
  onClose,
  existingStudents,
  onStudentCreated,
  onSwitchToStudent,
}) => {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [program, setProgram] = useState("Computer Science");
  const [department, setDepartment] = useState("School of Computing & Data Science");
  const [semester, setSemester] = useState(1);
  const [cgpa, setCgpa] = useState(8.2);
  const [careerGoal, setCareerGoal] = useState("AI/ML Engineer");
  const [avatar, setAvatar] = useState("");
  const [currentEnrollments, setCurrentEnrollments] = useState<string[]>(["CS401", "CS380"]);
  const [completedCourses, setCompletedCourses] = useState<string[]>(["CS101", "MATH201"]);

  const [errorMessage, setErrorMessage] = useState("");
  const [duplicateStudent, setDuplicateStudent] = useState<Student | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Generate random ID when opened
  useEffect(() => {
    if (isOpen) {
      setStudentId(`STU-2026-${Math.floor(1000 + Math.random() * 9000)}`);
      setName("");
      setAvatar("");
      setErrorMessage("");
      setDuplicateStudent(null);
      setCurrentEnrollments(["CS401", "CS380"]);
      setCompletedCourses(["CS101", "MATH201"]);
    }
  }, [isOpen]);

  // Real-time duplicate check
  useEffect(() => {
    if (!name.trim()) {
      setDuplicateStudent(null);
      setErrorMessage("");
      return;
    }
    const normalized = name.trim().toLowerCase();
    const foundByName = existingStudents.find(
      (s) => s.name.trim().toLowerCase() === normalized
    );
    const foundById = studentId.trim()
      ? existingStudents.find(
          (s) => s.id.trim().toUpperCase() === studentId.trim().toUpperCase()
        )
      : null;

    const match = foundByName || foundById;
    if (match) {
      setDuplicateStudent(match);
      setErrorMessage(
        `A student profile for '${match.name}' already exists (ID: ${match.id}). Each student can only have one profile.`
      );
    } else {
      setDuplicateStudent(null);
      setErrorMessage("");
    }
  }, [name, studentId, existingStudents]);

  if (!isOpen) return null;

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

  const handleToggleEnrollment = (code: string) => {
    if (currentEnrollments.includes(code)) {
      if (currentEnrollments.length === 1) {
        alert("Please select at least 1 starter course.");
        return;
      }
      setCurrentEnrollments(currentEnrollments.filter((c) => c !== code));
    } else {
      setCurrentEnrollments([...currentEnrollments, code]);
    }
  };

  const handleTogglePrereq = (code: string) => {
    if (completedCourses.includes(code)) {
      setCompletedCourses(completedCourses.filter((c) => c !== code));
    } else {
      setCompletedCourses([...completedCourses, code]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage("Student name is required.");
      return;
    }

    if (duplicateStudent) {
      setErrorMessage(
        `Cannot create duplicate profile: '${duplicateStudent.name}' already exists.`
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/v1/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_student",
          name: name.trim(),
          id: studentId.trim().toUpperCase(),
          program,
          department,
          semester: Number(semester),
          cgpa: Number(cgpa),
          careerGoal,
          avatar,
          completedCourses,
          currentEnrollments,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setErrorMessage(data.error || "A profile for this student already exists.");
          const existing = existingStudents.find(
            (s) => s.name.toLowerCase() === name.trim().toLowerCase()
          );
          if (existing) setDuplicateStudent(existing);
        } else {
          setErrorMessage(data.error || "Failed to create student profile.");
        }
        return;
      }

      if (data.student) {
        onStudentCreated(data.student);
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-100">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[17px] font-bold text-slate-900 leading-tight">
                  Create New Student Profile
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                  Single Profile Policy
                </span>
              </div>
              <p className="text-[12px] text-slate-500">
                Register a unique student profile with independent learning progress, certificates & bills.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-slate-200 flex items-center justify-center transition-colors shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          {/* Duplicate Profile Warning Banner */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-[13px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">One Student = One Profile Rule</div>
                  <div className="text-[12px] text-amber-800">{errorMessage}</div>
                </div>
              </div>
              {duplicateStudent && onSwitchToStudent && (
                <button
                  type="button"
                  onClick={() => {
                    onSwitchToStudent(duplicateStudent.id);
                    onClose();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[12px] shrink-0 transition-colors shadow-xs flex items-center gap-1.5"
                >
                  Switch to Existing Profile
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Photo & Identity Preview */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-center gap-5">
            <div className="relative group shrink-0">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Profile"
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-purple-600 text-white font-bold text-2xl flex items-center justify-center ring-4 ring-white shadow-md">
                  {getInitials(name)}
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="text-[13px] font-bold text-slate-800">
                Student Profile Photo
              </div>
              <div className="text-[11px] text-slate-500">
                Upload from device, choose from library presets below, or leave empty for an automatic initials badge.
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Upload className="w-3 h-3 text-indigo-600" />
                  Upload Photo
                </button>
                {avatar && (
                  <button
                    type="button"
                    onClick={() => setAvatar("")}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remove (Use Initials)
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Avatar Preset Library */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Or Select Avatar from Library
            </label>
            <div className="flex flex-wrap gap-2.5">
              {AVATAR_PRESETS.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setAvatar(p.url)}
                  className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                    avatar === p.url
                      ? "border-indigo-600 ring-2 ring-indigo-200 scale-105"
                      : "border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100"
                  }`}
                >
                  <img src={p.url} alt={p.label} className="w-10 h-10 object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Primary Identity Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-slate-700 mb-1">
                Full Student Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Liam Vance"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-slate-700 mb-1">
                University Student ID *
              </label>
              <input
                type="text"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                placeholder="e.g. STU-2026-4821"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-[13px] font-mono font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-slate-700 mb-1">
                Degree Program / Major
              </label>
              <select
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Cybersecurity & Information Assurance">Cybersecurity & Information Assurance</option>
                <option value="Cloud Systems & DevOps">Cloud Systems & DevOps</option>
                <option value="Data Science & Analytics">Data Science & Analytics</option>
                <option value="Artificial Intelligence Engineering">Artificial Intelligence Engineering</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-slate-700 mb-1">
                Current Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-slate-700 mb-1">
                Current CGPA (out of 10.0)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10.0"
                value={cgpa}
                onChange={(e) => setCgpa(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-slate-700 mb-1">
                Career Goal Trajectory
              </label>
              <input
                type="text"
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                placeholder="e.g. AI/ML Engineer"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Starter Enrolled Courses for Fall 2026 */}
          <div>
            <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
              Select Starter Enrolled Courses (with Video Curricula & Certificates)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AVAILABLE_ENROLLMENTS.map((c) => {
                const isSelected = currentEnrollments.includes(c.code);
                return (
                  <button
                    type="button"
                    key={c.code}
                    onClick={() => handleToggleEnrollment(c.code)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-indigo-50/70 border-indigo-300 text-indigo-950 font-semibold"
                        : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="text-[13px] font-bold">
                        {c.code} — {c.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {c.credits} Credits • Curated Video Lectures
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transcript / Completed Prerequisite Courses */}
          <div>
            <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
              Completed Prerequisites on Transcript
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {COMMON_PREREQS.map((p) => {
                const isChecked = completedCourses.includes(p.code);
                return (
                  <button
                    type="button"
                    key={p.code}
                    onClick={() => handleTogglePrereq(p.code)}
                    className={`px-3 py-2 rounded-xl border text-left text-[11px] transition-all flex items-center justify-between ${
                      isChecked
                        ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold"
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span>{p.code}</span>
                    {isChecked && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-[13px] font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || Boolean(duplicateStudent)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-[13px] font-bold shadow-md shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  <span>Registering Profile in SIS...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Create Student Profile & Launch Hub</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

