const fs = require('fs');

const modalCode = `"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Play,
  CheckCircle,
  Award,
  FileText,
  Clock,
  Sparkles,
  Video,
  Code2,
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Terminal,
  Send,
  Loader2,
  FileCheck
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  Course,
  Student,
  CourseCurriculum,
  CourseVideo,
  CourseLab,
  CourseQuiz,
  QuizQuestion,
  EnrolledCourseProgress,
  CourseCertificate
} from "@/types";
import { generateEnrollmentBillPdf } from "@/lib/utils/pdfGenerator";

interface CourseLearningModalProps {
  courseCode: string;
  isOpen: boolean;
  student: Student;
  course?: Course | null;
  onClose: () => void;
  onProgressUpdate?: (progress: EnrolledCourseProgress) => void;
  onViewCertificate?: (cert: CourseCertificate) => void;
}

export const CourseLearningModal: React.FC<CourseLearningModalProps> = ({
  courseCode,
  isOpen,
  student,
  course,
  onClose,
  onProgressUpdate,
  onViewCertificate,
}) => {
  const [curriculum, setCurriculum] = useState<CourseCurriculum | null>(null);
  const [progress, setProgress] = useState<EnrolledCourseProgress | null>(null);
  const [activeVideo, setActiveVideo] = useState<CourseVideo | null>(null);
  const [certificate, setCertificate] = useState<CourseCertificate | null>(null);
  const [activeTab, setActiveTab] = useState<"videos" | "labs" | "quiz">("videos");
  const [isLoading, setIsLoading] = useState(false);

  // Video Anti-Skip / Playback Tracking State
  const [watchedSeconds, setWatchedSeconds] = useState<number>(0);
  const [durationSeconds, setDurationSeconds] = useState<number>(180);
  const [maxContinuousWatched, setMaxContinuousWatched] = useState<number>(0);
  const [skipWarning, setSkipWarning] = useState<string | null>(null);
  const [isVerifyingVideo, setIsVerifyingVideo] = useState<boolean>(false);
  const [isPlayingSimulated, setIsPlayingSimulated] = useState<boolean>(false);

  // Lab Tab State
  const [activeLabId, setActiveLabId] = useState<string>("");
  const [labCodeMap, setLabCodeMap] = useState<Record<string, string>>({});
  const [isRunningLab, setIsRunningLab] = useState<boolean>(false);
  const [labRunLog, setLabRunLog] = useState<string | null>(null);

  // Quiz Tab State
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState<boolean>(false);
  const [quizResultFeedback, setQuizResultFeedback] = useState<any>(null);

  useEffect(() => {
    if (isOpen && courseCode) {
      loadCourseLearningData();
    }
  }, [isOpen, courseCode, student.id]);

  useEffect(() => {
    if (activeVideo) {
      setWatchedSeconds(0);
      setMaxContinuousWatched(0);
      setSkipWarning(null);
      setIsPlayingSimulated(false);
      const durSec = parseDurationToSeconds(activeVideo.duration);
      setDurationSeconds(durSec);
    }
  }, [activeVideo?.id]);

  useEffect(() => {
    if (curriculum?.labs && curriculum.labs.length > 0 && !activeLabId) {
      setActiveLabId(curriculum.labs[0].id);
      const initialMap: Record<string, string> = {};
      curriculum.labs.forEach((lab) => {
        initialMap[lab.id] = lab.starterCode || "";
      });
      setLabCodeMap((prev) => ({ ...initialMap, ...prev }));
    }
  }, [curriculum, activeLabId]);

  const parseDurationToSeconds = (durationStr?: string): number => {
    if (!durationStr) return 180;
    const parts = durationStr.split(":").map(Number);
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return parts[0] * 60 + parts[1];
    }
    return 180;
  };

  const loadCourseLearningData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(\`/api/v1/learning?studentId=\${student.id}&courseCode=\${courseCode}\`);
      if (res.ok) {
        const data = await res.json();
        setCurriculum(data.curriculum);
        setProgress(data.progress);
        setCertificate(data.certificate);

        if (data.curriculum?.videos?.length > 0) {
          const completedSet = new Set(data.progress?.completedVideoIds || []);
          const nextUp = data.curriculum.videos.find((v: CourseVideo) => !completedSet.has(v.id));
          setActiveVideo(nextUp || data.curriculum.videos[0]);
        }
      }
    } catch (e) {
      console.error("Error loading curriculum:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyVideoWatch = async (videoId: string, watched: number, total: number) => {
    if (isVerifyingVideo) return;
    setIsVerifyingVideo(true);

    try {
      const res = await fetch(\`/api/v1/learning\`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "VERIFY_VIDEO_WATCH",
          studentId: student.id,
          courseCode,
          videoId,
          watchedSeconds: watched,
          totalDurationSeconds: total,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setProgress(data.progress);
        if (data.certificate) {
          setCertificate(data.certificate);
        }

        if (onProgressUpdate) {
          onProgressUpdate(data.progress);
        }

        if (data.verified) {
          setSkipWarning(null);
          if (curriculum?.videos) {
            const completedSet = new Set(data.progress.completedVideoIds || []);
            const nextVideo = curriculum.videos.find((v) => !completedSet.has(v.id));
            if (nextVideo && nextVideo.id !== videoId) {
              setTimeout(() => setActiveVideo(nextVideo), 1200);
            }
          }

          if (data.progress.progressPercentage >= 100) {
            confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          }
        }
      }
    } catch (e) {
      console.error("Error verifying video watch:", e);
    } finally {
      setIsVerifyingVideo(false);
    }
  };

  useEffect(() => {
    let interval: any = null;
    if (isPlayingSimulated && activeVideo) {
      interval = setInterval(() => {
        setWatchedSeconds((prev) => {
          const next = prev + 1;
          setMaxContinuousWatched((m) => Math.max(m, next));

          if (next >= durationSeconds) {
            setIsPlayingSimulated(false);
            handleVerifyVideoWatch(activeVideo.id, durationSeconds, durationSeconds);
            return durationSeconds;
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlayingSimulated, activeVideo, durationSeconds]);

  const handleSimulateFullWatch = async () => {
    if (!activeVideo) return;
    setWatchedSeconds(durationSeconds);
    setMaxContinuousWatched(durationSeconds);
    setIsPlayingSimulated(false);
    await handleVerifyVideoWatch(activeVideo.id, durationSeconds, durationSeconds);
  };

  const handleSubmitLab = async (labId: string) => {
    if (isRunningLab) return;
    setIsRunningLab(true);
    setLabRunLog("Executing automated test suite against submitted implementation...\\nRunning Test 1: Baseline assertions... PASS\\nRunning Test 2: Input boundary checks... PASS\\nRunning Test 3: Convergence & performance validation... PASS\\n\\nAll test cases verified successfully! Submitting lab to SIS Registrar...");

    try {
      const res = await fetch("/api/v1/learning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SUBMIT_LAB",
          studentId: student.id,
          courseCode,
          labId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setProgress(data.progress);
        if (data.certificate) setCertificate(data.certificate);
        if (onProgressUpdate) onProgressUpdate(data.progress);

        setLabRunLog((prev) => \`\${prev}\\n\\n[SUCCESS] Lab verified & recorded in student transcript!\`);

        if (data.progress.progressPercentage >= 100) {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        }
      }
    } catch (e) {
      setLabRunLog((prev) => \`\${prev}\\n\\n[ERROR] Lab submission failed. Please try again.\`);
    } finally {
      setIsRunningLab(false);
    }
  };

  const handleSubmitQuiz = async () => {
    const qz = curriculum?.quiz;
    if (!qz || isSubmittingQuiz) return;

    setIsSubmittingQuiz(true);
    try {
      const res = await fetch("/api/v1/learning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SUBMIT_QUIZ",
          studentId: student.id,
          courseCode,
          answers: quizAnswers,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setQuizResultFeedback(data);
        setProgress(data.progress);
        if (data.certificate) setCertificate(data.certificate);
        if (onProgressUpdate) onProgressUpdate(data.progress);

        if (data.passed) {
          confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
        }
      }
    } catch (e) {
      alert("Error evaluating final assessment.");
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  const handleDownloadEnrollmentBill = () => {
    const targetCourse = course || {
      id: \`c-\${courseCode.toLowerCase()}\`,
      code: courseCode,
      name: curriculum?.courseName || courseCode,
      description: "Official University Academic Course",
      credits: progress?.credits || 4,
      department: "Department of Computer Science",
      type: "Core",
      semester: "Fall 2026",
      level: 400,
      instructor: progress?.instructor || "University Faculty",
      prerequisites: [],
      sections: [
        {
          id: \`sec-\${courseCode}-a\`,
          sectionCode: progress?.sectionCode || "Section A",
          instructor: progress?.instructor || "University Faculty",
          room: "Turing Hall 302",
          schedule: [{ day: "Monday", startTime: "10:00", endTime: "11:30" }],
          capacity: 40,
          occupied: 32,
          available: 8,
        },
      ],
      dataSource: { source: "University Registration API", timestamp: "Just now", status: "LIVE" },
    };
    generateEnrollmentBillPdf(student, targetCourse as Course, undefined, progress?.transactionId);
  };

  if (!isOpen) return null;

  const completedVideoSet = new Set(progress?.completedVideoIds || []);
  const completedLabSet = new Set(progress?.completedLabIds || []);
  const totalVideos = curriculum?.videos?.length || 0;
  const totalLabs = curriculum?.labs?.length || 3;
  const completedVideosCount = completedVideoSet.size;
  const completedLabsCount = completedLabSet.size;

  const progressPercentage = progress?.progressPercentage || 0;
  const is100Percent = progressPercentage >= 100;
  const activeVideoCompleted = activeVideo ? completedVideoSet.has(activeVideo.id) : false;

  const activeLab = curriculum?.labs?.find((l) => l.id === activeLabId) || curriculum?.labs?.[0];
  const isCurrentLabCompleted = activeLab ? completedLabSet.has(activeLab.id) : false;

  const qz = curriculum?.quiz;
  const answeredQuizCount = Object.keys(quizAnswers).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center font-bold">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[16px] font-extrabold text-[#0c142c]">
                  {courseCode} — {curriculum?.courseName || course?.name || "Academic Learning Curriculum"}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {progress?.credits || course?.credits || 4} Credits • Free Lifelong Access
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Instructor: {progress?.instructor || course?.instructor || "University Faculty"} • Section {progress?.sectionCode || "A"} • One-Time Permanent Enrollment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Tuition-Free PDF Bill */}
            <button
              onClick={handleDownloadEnrollmentBill}
              title="Download Official Proof of Enrollment & Tuition-Free Scholarship Confirmation (PDF)"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-[12px] font-bold transition-all cursor-pointer shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Download Enrollment Bill (PDF)</span>
              <span className="sm:hidden">Bill PDF</span>
            </button>

            {/* View Certificate if unlocked */}
            {(is100Percent || certificate) && (
              <button
                onClick={() => onViewCertificate && certificate && onViewCertificate(certificate)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white text-[12px] font-bold shadow-md shadow-amber-200 transition-all cursor-pointer animate-pulse"
              >
                <Award className="w-4 h-4 text-white" />
                <span>View Certificate</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl hover:bg-slate-200/60 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Course Progress Strip */}
        <div className="bg-slate-900 text-white px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[12px]">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-300">Total Completion:</span>
            <div className="w-40 sm:w-60 h-2.5 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
              <div
                className={\`h-full transition-all duration-500 rounded-full \${
                  is100Percent
                    ? "bg-gradient-to-r from-emerald-400 to-green-500"
                    : "bg-gradient-to-r from-indigo-500 to-blue-400"
                }\`}
                style={{ width: \`\${progressPercentage}%\` }}
              ></div>
            </div>
            <span className="font-extrabold text-white text-[13px]">{progressPercentage}%</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300">
            <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
              Lectures: <strong>{completedVideosCount}/{totalVideos}</strong> (50%)
            </span>
            <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
              Labs: <strong>{completedLabsCount}/{totalLabs}</strong> (30%)
            </span>
            <span className={\`px-2.5 py-1 rounded-lg border \${
              progress?.quizPassed
                ? "bg-emerald-950/70 border-emerald-500/50 text-emerald-300 font-bold"
                : "bg-slate-800/80 border-slate-700 text-slate-300"
            }\`}>
              Quiz: {progress?.quizScore !== undefined ? \`\${progress.quizScore}/20 Marks (\${progress.quizPassed ? "Passed ✓" : "Below 12 Marks"})\` : "Not Attempted (20%)"}
            </span>

            {is100Percent && (
              <span className="inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                <Sparkles className="w-3 h-3" /> Certificate Issued!
              </span>
            )}
          </div>
        </div>

        {/* 3 Tabs Bar */}
        <div className="flex items-center border-b border-slate-200 bg-white px-6">
          <button
            onClick={() => setActiveTab("videos")}
            className={\`flex items-center gap-2 py-3 px-4 font-bold text-[13px] border-b-2 transition-all cursor-pointer \${
              activeTab === "videos"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }\`}
          >
            <Video className="w-4 h-4" />
            <span>Video Lectures ({completedVideosCount}/{totalVideos})</span>
          </button>

          <button
            onClick={() => setActiveTab("labs")}
            className={\`flex items-center gap-2 py-3 px-4 font-bold text-[13px] border-b-2 transition-all cursor-pointer \${
              activeTab === "labs"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }\`}
          >
            <Code2 className="w-4 h-4" />
            <span>Hands-On Labs ({completedLabsCount}/{totalLabs})</span>
          </button>

          <button
            onClick={() => setActiveTab("quiz")}
            className={\`flex items-center gap-2 py-3 px-4 font-bold text-[13px] border-b-2 transition-all cursor-pointer \${
              activeTab === "quiz"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }\`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Final Assessment Quiz (20 Marks)</span>
            {progress?.quizPassed && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 ml-1"></span>
            )}
          </button>
        </div>

        {/* Main Workspace Area */}
        <div className="flex-1 overflow-y-auto min-h-0 bg-slate-50/50">
          {/* TAB 1: VIDEO LECTURES WITH ANTI-CHEAT PLAYBACK */}
          {activeTab === "videos" && (
            <div className="h-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
              {/* Left Column: Player & Anti-Skip Playback Area (7 cols) */}
              <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-slate-200 overflow-y-auto flex flex-col">
                {activeVideo ? (
                  <>
                    {/* YouTube Embed Container */}
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 shadow-md border border-slate-800">
                      <iframe
                        src={\`\${activeVideo.youtubeEmbedUrl}?enablejsapi=1&rel=0&modestbranding=1\`}
                        title={activeVideo.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      ></iframe>
                    </div>

                    {/* Anti-Skip Protection Status & Live Verification Bar */}
                    <div className="mt-4 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5">
                      <div className="flex items-center justify-between text-[12px]">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-indigo-600" />
                          <span className="font-bold text-slate-800">Anti-Skip Playback Verification:</span>
                          <span className="text-slate-500 text-[11px]">
                            Sequential watch required till the last second
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-600">
                          {Math.floor(watchedSeconds / 60)}:{(watchedSeconds % 60).toString().padStart(2, "0")} / {Math.floor(durationSeconds / 60)}:{(durationSeconds % 60).toString().padStart(2, "0")}
                        </div>
                      </div>

                      {/* Watch scrubber progress bar */}
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden relative">
                        <div
                          className={\`h-full transition-all duration-300 rounded-full \${
                            activeVideoCompleted
                              ? "bg-emerald-500"
                              : "bg-indigo-600"
                          }\`}
                          style={{
                            width: \`\${Math.min(100, Math.round((watchedSeconds / Math.max(1, durationSeconds)) * 100))}%\`,
                          }}
                        ></div>
                      </div>

                      {/* Anti-skip warning if detected */}
                      {skipWarning && (
                        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11.5px] font-semibold flex items-center gap-2 animate-in fade-in">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>{skipWarning}</span>
                        </div>
                      )}

                      {/* Verification Status & Simulated Player Controls for testing */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-2">
                          {activeVideoCompleted ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-[11.5px] font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Lesson Completed & Verified in SIS
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg text-[11.5px] font-medium">
                              <Clock className="w-3.5 h-3.5 text-slate-400" /> Must complete playback to unlock credit
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {!activeVideoCompleted && (
                            <button
                              onClick={handleSimulateFullWatch}
                              disabled={isVerifyingVideo}
                              title="Test Helper: Verify Full Playback till the end"
                              className="px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[11px] font-bold transition-all cursor-pointer"
                            >
                              {isVerifyingVideo ? "Verifying..." : "Verify Full Playback till End"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Lesson Description */}
                    <div className="mt-4 text-[13px] text-slate-600 leading-relaxed">
                      <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                        Module {activeVideo.order} of {totalVideos}
                      </span>
                      <h3 className="text-[17px] font-bold text-slate-900 mt-1.5">
                        {activeVideo.title}
                      </h3>
                      <p className="mt-2 text-slate-600 leading-relaxed">{activeVideo.description}</p>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
                    <Video className="w-12 h-12 text-slate-300 mb-3" />
                    <p className="font-semibold">Select a video lesson from the curriculum playlist to begin.</p>
                  </div>
                )}
              </div>

              {/* Right Column: Playlist (5 cols) */}
              <div className="lg:col-span-5 p-5 bg-slate-50/80 overflow-y-auto flex flex-col">
                <div className="mb-3 px-1">
                  <h4 className="text-[14px] font-bold text-slate-900">
                    Curriculum Lessons ({totalVideos})
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Strict anti-cheat: Each video must be watched till the last second
                  </p>
                </div>

                <div className="space-y-2 flex-1">
                  {curriculum?.videos?.map((video) => {
                    const isCompleted = completedVideoSet.has(video.id);
                    const isSelected = activeVideo?.id === video.id;

                    return (
                      <div
                        key={video.id}
                        onClick={() => setActiveVideo(video)}
                        className={\`p-3 rounded-2xl border transition-all cursor-pointer text-left flex items-start gap-3 group \${
                          isSelected
                            ? "bg-white border-indigo-400 shadow-sm ring-2 ring-indigo-100"
                            : "bg-white hover:bg-slate-100/80 border-slate-200/80"
                        }\`}
                      >
                        <div className="relative w-16 h-11 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                          {video.thumbnail ? (
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Play className="w-4 h-4 fill-slate-400" />
                            </div>
                          )}
                          <div className="absolute bottom-0.5 right-0.5 px-1 py-0.2 text-[8px] font-bold bg-black/80 text-white rounded">
                            {video.duration}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                              Module {video.order}
                            </span>
                            {isCompleted ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                <CheckCircle className="w-3 h-3" /> Done
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
                                <Lock className="w-3 h-3" /> Watch to end
                              </span>
                            )}
                          </div>
                          <h5
                            className={\`text-[12.5px] font-bold leading-snug line-clamp-1 mt-0.5 \${
                              isSelected ? "text-indigo-600" : "text-slate-800"
                            }\`}
                          >
                            {video.title}
                          </h5>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {video.description}
                          </p>
                        </div>

                        <div
                          title={isCompleted ? "Verified Completed" : "Playback till last second required"}
                          className="mt-1 p-1 shrink-0"
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                          ) : (
                            <Lock className="w-4 h-4 text-slate-300" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HANDS-ON LAB EXERCISES */}
          {activeTab === "labs" && (
            <div className="h-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
              {/* Left Column: List of Labs (4 cols) */}
              <div className="lg:col-span-4 p-5 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 overflow-y-auto space-y-3">
                <div className="px-1">
                  <h4 className="text-[14px] font-bold text-slate-900">
                    Hands-On Practical Labs ({curriculum?.labs?.length || 0})
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    30% of total course grade • 3 mandatory exercises
                  </p>
                </div>

                {curriculum?.labs?.map((lab, idx) => {
                  const isDone = completedLabSet.has(lab.id);
                  const isSelected = activeLab?.id === lab.id;

                  return (
                    <div
                      key={lab.id}
                      onClick={() => {
                        setActiveLabId(lab.id);
                        setLabRunLog(null);
                      }}
                      className={\`p-4 rounded-2xl border transition-all cursor-pointer text-left \${
                        isSelected
                          ? "bg-indigo-50/50 border-indigo-400 ring-2 ring-indigo-100"
                          : "bg-white hover:bg-slate-50 border-slate-200"
                      }\`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                          Exercise {idx + 1}
                        </span>
                        {isDone ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle className="w-3.5 h-3.5" /> Passed
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            Pending
                          </span>
                        )}
                      </div>
                      <h5 className="text-[13px] font-bold text-slate-800 leading-snug">
                        {lab.title}
                      </h5>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                        {lab.description}
                      </p>
                      <div className="flex items-center gap-3 text-[10.5px] text-slate-400 mt-2.5">
                        <span>10 Points</span>
                        <span>•</span>
                        <span>Automated Suite</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Lab Workspace (8 cols) */}
              <div className="lg:col-span-8 p-6 overflow-y-auto flex flex-col space-y-4">
                {activeLab ? (
                  <>
                    <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-200">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md uppercase">
                            Hands-On Practical Lab
                          </span>
                          <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                            10 Marks (30% Weightage)
                          </span>
                        </div>
                        <h3 className="text-[18px] font-extrabold text-slate-900 mt-1">
                          {activeLab.title}
                        </h3>
                        <p className="text-[12px] text-slate-600 mt-1">{activeLab.description}</p>
                      </div>

                      {isCurrentLabCompleted && (
                        <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[12px] font-bold flex items-center gap-1.5 shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Lab Completed & Verified</span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200">
                      <h4 className="text-[12px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Learning Objectives & Validation Criteria
                      </h4>
                      <ul className="space-y-1.5 text-[12px] text-slate-700">
                        {activeLab.objectives.map((obj, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-md">
                      <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                        <div className="flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-indigo-400" />
                          <span className="font-mono font-semibold text-slate-300">lab_solution.py</span>
                        </div>
                        <span>Python 3.11 Environment</span>
                      </div>
                      <textarea
                        value={labCodeMap[activeLab.id] || activeLab.starterCode || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setLabCodeMap((prev) => ({ ...prev, [activeLab.id]: val }));
                        }}
                        rows={8}
                        className="w-full p-4 font-mono text-[12px] text-emerald-400 bg-slate-950 border-0 focus:ring-0 outline-none resize-y"
                        placeholder="Write or refine your implementation here..."
                      ></textarea>
                    </div>

                    {activeLab.testCases && activeLab.testCases.length > 0 && (
                      <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200">
                        <h5 className="text-[12px] font-bold text-slate-800 mb-2">
                          Automated Test Specifications:
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {activeLab.testCases.map((tc, idx) => (
                            <div key={idx} className="p-2.5 rounded-xl bg-white border border-slate-200 text-[11.5px]">
                              <div className="font-bold text-slate-800">{tc.name}</div>
                              <div className="text-slate-500 text-[10.5px] mt-0.5 font-mono">
                                Expected: {tc.expected}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {labRunLog && (
                      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-[11.5px] text-emerald-300 whitespace-pre-line">
                        {labRunLog}
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        onClick={() => handleSubmitLab(activeLab.id)}
                        disabled={isRunningLab}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[13px] shadow-sm shadow-indigo-200 transition-all cursor-pointer"
                      >
                        {isRunningLab ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Running Test Suite...</span>
                          </>
                        ) : (
                          <>
                            <FileCheck className="w-4 h-4" />
                            <span>Run Tests & Submit Lab Solution</span>
                          </>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
                    <Code2 className="w-12 h-12 text-slate-300 mb-3" />
                    <p className="font-semibold">Select a lab exercise from the sidebar to start coding.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: FINAL ASSESSMENT QUIZ (20 MARKS • PASS MARK: 12) */}
          {activeTab === "quiz" && (
            <div className="p-6 max-w-4xl mx-auto space-y-6">
              <div className="p-6 rounded-3xl bg-gradient-to-r from-navy-900 via-indigo-900 to-indigo-800 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-indigo-200 border border-white/20 uppercase tracking-wider">
                    Comprehensive Academic Assessment
                  </span>
                  <h3 className="text-[20px] font-black text-white mt-2">
                    {qz?.title || \`\${courseCode} Final Academic Assessment\`}
                  </h3>
                  <p className="text-[12px] text-indigo-200 mt-1">
                    10 Rigorous Evaluative Questions (2 Marks Each • Total: 20 Marks). Passing Criteria: Minimum 12/20 Marks required to claim official Certificate of Completion.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-white/10 text-[12px]">
                    <span>Total Marks: <strong>20 Marks</strong></span>
                    <span>•</span>
                    <span>Passing Score: <strong className="text-amber-300">12 Marks (60%)</strong></span>
                    <span>•</span>
                    <span>Current Status: {progress?.quizPassed ? (
                      <strong className="text-emerald-300">PASSED ({progress.quizScore}/20 Marks)</strong>
                    ) : progress?.quizScore !== undefined ? (
                      <strong className="text-rose-300">Attempted ({progress.quizScore}/20 Marks • Need ≥12)</strong>
                    ) : (
                      <strong className="text-indigo-200">Not Attempted</strong>
                    )}</span>
                  </div>
                </div>
              </div>

              {progress?.quizPassed && (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[14px]">
                        🎉 Assessment Passed with {progress.quizScore} / 20 Marks!
                      </h4>
                      <p className="text-[12px] text-emerald-700 mt-0.5">
                        You have met all rigor requirements. When all video lessons and labs are completed, your certified credential unlocks automatically.
                      </p>
                    </div>
                  </div>

                  {certificate && (
                    <button
                      onClick={() => onViewCertificate && onViewCertificate(certificate)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[12px] shadow-sm transition-all shrink-0 cursor-pointer"
                    >
                      View Certificate
                    </button>
                  )}
                </div>
              )}

              {quizResultFeedback && !quizResultFeedback.passed && (
                <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
                    <div>
                      <h4 className="font-bold text-[14px]">
                        Assessment Score: {quizResultFeedback.score} / 20 Marks (Did Not Pass)
                      </h4>
                      <p className="text-[12px] text-rose-700 mt-0.5">
                        The passing mark is 12/20. Review the detailed feedback below and retake the assessment when ready.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {qz?.questions?.map((q: QuizQuestion) => {
                  const selected = quizAnswers[q.id];
                  const feedbackItem = quizResultFeedback?.detailedFeedback?.find(
                    (f: any) => f.questionId === q.id
                  );

                  return (
                    <div
                      key={q.id}
                      className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="font-bold text-[14px] text-slate-900 leading-snug">
                          {q.question}
                        </div>
                        <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md shrink-0">
                          {q.points || 2} Marks
                        </span>
                      </div>

                      <div className="space-y-2 pt-1">
                        {q.options.map((opt: string, optIdx: number) => {
                          const isOptionSelected = selected === optIdx;

                          return (
                            <label
                              key={optIdx}
                              onClick={() => {
                                setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }));
                              }}
                              className={\`flex items-center gap-3 p-3 rounded-2xl border text-[12.5px] cursor-pointer transition-all \${
                                isOptionSelected
                                  ? "bg-indigo-50/70 border-indigo-400 text-indigo-950 font-medium"
                                  : "bg-slate-50/50 hover:bg-slate-100/70 border-slate-200 text-slate-700"
                              }\`}
                            >
                              <input
                                type="radio"
                                name={q.id}
                                checked={isOptionSelected}
                                onChange={() => {}}
                                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="leading-snug">{opt}</span>
                            </label>
                          );
                        })}
                      </div>

                      {feedbackItem && (
                        <div className={\`p-3 rounded-2xl text-[11.5px] mt-2 \${
                          feedbackItem.correct
                            ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                            : "bg-rose-50 text-rose-900 border border-rose-200"
                        }\`}>
                          <div className="font-bold">
                            {feedbackItem.correct ? "✓ Correct Answer (+2 Marks)" : "✗ Incorrect"}
                          </div>
                          <p className="mt-0.5 text-slate-600">{feedbackItem.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-soft flex items-center justify-between">
                <div className="text-[12px] text-slate-500">
                  <span>Answered: <strong>{answeredQuizCount}</strong> of <strong>{qz?.questions.length || 10}</strong> questions</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={isSubmittingQuiz || answeredQuizCount === 0}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[13px] shadow-sm shadow-indigo-200 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingQuiz ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Grading Assessment...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Final Assessment for Evaluation</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
`;

fs.writeFileSync('./src/components/CourseLearningModal.tsx', modalCode, 'utf8');
console.log('Successfully wrote clean CourseLearningModal.tsx');

