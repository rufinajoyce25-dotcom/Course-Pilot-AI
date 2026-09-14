"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Check,
  User,
  GraduationCap,
  Award,
  BookOpen,
  Sparkles,
  Database,
  ArrowRight,
  Camera,
  Upload,
  Trash2,
  Image as ImageIcon
} from "lucide-react";
import { Student } from "@/types";

interface StudentProfileSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStudent: Student | null;
  onProfileSaved: (updatedStudent: Student) => void;
}

const AVAILABLE_PREREQ_COURSES = [
  { code: "CS101", title: "Introduction to Computer Science", credits: 4 },
  { code: "MATH201", title: "Discrete Mathematics", credits: 3 },
  { code: "CS102", title: "Object-Oriented Programming (Java)", credits: 4 },
  { code: "MATH202", title: "Probability & Statistics", credits: 3 },
  { code: "CS201", title: "Data Structures & Algorithms", credits: 4 },
  { code: "CS205", title: "Computer Architecture", credits: 4 },
  { code: "CS202", title: "Algorithms Design & Complexity", credits: 4 },
  { code: "CS301", title: "Operating Systems Principles", credits: 4 },
  { code: "CS302", title: "Software Engineering", credits: 4 },
  { code: "CS304", title: "Theory of Computation", credits: 3 },
];

const AVATAR_PRESETS = [
  { id: "av-1", label: "Scholar", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
  { id: "av-2", label: "Developer", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
  { id: "av-3", label: "Researcher", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" },
  { id: "av-4", label: "Architect", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" },
  { id: "av-5", label: "Technologist", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" },
  { id: "av-6", label: "Engineer", url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80" },
];

const getInitials = (nameStr?: string) => {
  if (!nameStr) return "ST";
  const parts = nameStr.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const StudentProfileSetupModal: React.FC<StudentProfileSetupModalProps> = ({
  isOpen,
  onClose,
  currentStudent,
  onProfileSaved,
}) => {
  const [name, setName] = useState(currentStudent?.name || "Joyce");
  const [avatar, setAvatar] = useState(currentStudent?.avatar || "");
  const [studentId, setStudentId] = useState(currentStudent?.id || "STU-2026-9901");
  const [program, setProgram] = useState(currentStudent?.program || "Computer Science");
  const [department, setDepartment] = useState(currentStudent?.department || "School of Computing & Data Science");
  const [semester, setSemester] = useState(currentStudent?.semester || 6);
  const [cgpa, setCgpa] = useState(currentStudent?.cgpa || 8.8);
  const [careerGoal, setCareerGoal] = useState(currentStudent?.careerGoal || "AI/ML Engineer");
  const [completedCourses, setCompletedCourses] = useState<string[]>(
    currentStudent?.completedCourses || ["CS101", "CS102", "CS201", "CS202", "MATH201", "MATH202"]
  );
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (currentStudent) {
      setName(currentStudent.name);
      setAvatar(currentStudent.avatar || "");
      setStudentId(currentStudent.id);
      setProgram(currentStudent.program);
      setDepartment(currentStudent.department);
      setSemester(currentStudent.semester);
      setCgpa(currentStudent.cgpa);
      setCareerGoal(currentStudent.careerGoal);
      if (currentStudent.completedCourses) {
        setCompletedCourses(currentStudent.completedCourses);
      }
    }
  }, [currentStudent]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (under 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Please select an image smaller than 5MB");
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

  const toggleCourse = (code: string) => {
    if (completedCourses.includes(code)) {
      setCompletedCourses(completedCourses.filter((c) => c !== code));
    } else {
      setCompletedCourses([...completedCourses, code]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const completedCredits = completedCourses.reduce((sum, code) => {
        const item = AVAILABLE_PREREQ_COURSES.find((c) => c.code === code);
        return sum + (item ? item.credits : 4);
      }, 60);

      const payload = {
        name,
        avatar,
        id: studentId,
        program,
        department,
        semester: Number(semester),
        cgpa: Number(cgpa),
        careerGoal,
        completedCourses,
        completedCredits,
        academicStanding: Number(cgpa) >= 8.5 ? "Dean's List" : Number(cgpa) >= 7.0 ? "Good Standing" : "Probation",
      };

      const res = await fetch(`/api/v1/students/active`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.student) {
        if (typeof window !== "undefined") {
          localStorage.setItem("coursepilot_user_profile", JSON.stringify(data.student));
        }
        onProfileSaved(data.student);
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const careerOptions = [
    "AI/ML Engineer",
    "Cybersecurity Specialist",
    "Cloud Solutions Architect",
    "Full-Stack Software Engineer",
    "Data Scientist & Analyst",
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#eaeff8] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 pb-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xs">
              <User className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Student Profile & Photo Settings</h2>
              <p className="text-[12px] text-indigo-200">Configure your real academic identity, photo, and transcript</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 max-h-[75vh] overflow-y-auto space-y-6 text-[13px]">
          {/* Section: Profile Photo Management */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Profile Photo & Avatar
            </h3>
            
            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Avatar Preview */}
              <div className="relative shrink-0">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={name}
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-md"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 via-blue-600 to-purple-600 text-white font-extrabold text-[24px] flex items-center justify-center ring-4 ring-white shadow-md">
                    {getInitials(name)}
                  </div>
                )}
              </div>

              {/* Photo Actions */}
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  {/* Upload from Library/Device */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="profile-photo-upload"
                  />
                  <label
                    htmlFor="profile-photo-upload"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-bold shadow-xs cursor-pointer transition-all"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photo from Library</span>
                  </label>

                  {/* Remove Photo */}
                  {avatar && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-200 text-[12px] font-bold transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Photo</span>
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-slate-500">
                  {avatar
                    ? "Custom student photo active. You can replace it or remove it to use your official initials badge."
                    : "No photo set. Your profile displays an official academic initials badge. Upload an image or select from the presets below."}
                </p>

                {/* Avatar Library Presets */}
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Or select from University Avatar Library:
                  </span>
                  <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                    {AVATAR_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setAvatar(preset.url)}
                        className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                          avatar === preset.url ? "border-indigo-600 ring-2 ring-indigo-300 scale-110" : "border-slate-200 hover:border-indigo-400"
                        }`}
                        title={preset.label}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Identity Section */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">1. Student Identity</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0c142c] mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Joyce"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-[#0c142c] focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0c142c] mb-1">University Student ID</label>
                <input
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. STU-2026-9901"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-[#0c142c] focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0c142c] mb-1">Academic Program / Major</label>
                <input
                  type="text"
                  required
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-[#0c142c] focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0c142c] mb-1">School / Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. School of Computing & Data Science"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-[#0c142c] focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Academic Standing & Grades */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">2. Academic Status</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0c142c] mb-1">Current Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-[#0c142c] focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0c142c] mb-1">Cumulative GPA (out of 10.0)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10.0"
                  required
                  value={cgpa}
                  onChange={(e) => setCgpa(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-[#0c142c] focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Career Path / Specialization Target */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">3. Career Trajectory Target</h3>
            <p className="text-[11px] text-slate-400 mb-2">CoursePilot AI dynamically scores elective fit based on this choice</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {careerOptions.map((goal) => (
                <button
                  type="button"
                  key={goal}
                  onClick={() => setCareerGoal(goal)}
                  className={`px-3.5 py-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                    careerGoal === goal
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          {/* Prerequisite Courses Transcript */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">4. Completed Transcript Courses</h3>
              <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                {completedCourses.length} Completed
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Check all prerequisite courses you have successfully finished. The agent checks these in real time to grant enrollment eligibility.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-100 rounded-2xl bg-slate-50/50">
              {AVAILABLE_PREREQ_COURSES.map((course) => {
                const isDone = completedCourses.includes(course.code);
                return (
                  <div
                    key={course.code}
                    onClick={() => toggleCourse(course.code)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer select-none transition-all ${
                      isDone
                        ? "bg-white border-indigo-500 text-indigo-900 shadow-xs"
                        : "bg-white/70 border-slate-200/80 text-slate-600 hover:bg-white"
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs">{course.code}</span>
                      <span className="text-[11px] text-slate-500 block truncate max-w-[180px]">{course.title}</span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                        isDone ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-300"
                      }`}
                    >
                      {isDone && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold shadow-md shadow-indigo-200 transition-all flex items-center gap-2 cursor-pointer"
            >
              {isSaving ? "Saving Profile..." : "Save & Sync with Live Agent"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
