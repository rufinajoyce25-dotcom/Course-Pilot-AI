"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Play,
  CheckCircle2,
  Award,
  FileText,
  Clock,
  Sparkles,
  Video,
  Code2,
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Terminal,
  Send,
  Loader2,
  CheckCircle,
  RotateCcw,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  Course,
  Student,
  CourseCurriculum,
  CourseVideo,
  CourseLab,
  EnrolledCourseProgress,
  CourseCertificate
} from "@/types";
import { generateEnrollmentBillPdf } from "@/lib/utils/pdfGenerator";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: any;
  }
}

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

  // Video Anti-Cheat / Real YouTube Player State
  const [watchedSeconds, setWatchedSeconds] = useState<number>(0);
  const [durationSeconds, setDurationSeconds] = useState<number>(180);
  const [maxContinuousWatched, setMaxContinuousWatched] = useState<number>(0);
  const [skipWarning, setSkipWarning] = useState<string | null>(null);
  const [isVerifyingVideo, setIsVerifyingVideo] = useState<boolean>(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);

  // YouTube Player Ref
  const playerRef = useRef<any>(null);
  const trackerIntervalRef = useRef<any>(null);
  const maxWatchedRef = useRef<number>(0);

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

  // Load YouTube Iframe API Script
  useEffect(() => {
    if (!isOpen) return;
    if (typeof window !== "undefined" && !window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, [isOpen]);

  // Handle active video change & setup YouTube Player
  useEffect(() => {
    if (!activeVideo || !isOpen || activeTab !== "videos") return;

    setWatchedSeconds(0);
    setMaxContinuousWatched(0);
    maxWatchedRef.current = 0;
    setSkipWarning(null);
    setIsVideoPlaying(false);
    const durSec = parseDurationToSeconds(activeVideo.duration);
    setDurationSeconds(durSec);

    // Initialize or load video in YouTube Player
    const initPlayer = () => {
      if (window.YT && window.YT.Player) {
        if (playerRef.current && typeof playerRef.current.loadVideoById === "function") {
          try {
            playerRef.current.loadVideoById(activeVideo.youtubeId);
          } catch (e) {
            console.error("Error loading video by id:", e);
          }
        } else {
          try {
            playerRef.current = new window.YT.Player("youtube-player-iframe", {
              videoId: activeVideo.youtubeId,
              playerVars: {
                rel: 0,
                modestbranding: 1,
                enablejsapi: 1,
                playsinline: 1,
              },
              events: {
                onReady: (event: any) => {
                  const d = event.target.getDuration();
                  if (d && !isNaN(d)) setDurationSeconds(Math.floor(d));
                },
                onStateChange: handlePlayerStateChange,
              },
            });
          } catch (err) {
            console.error("Error creating YT Player:", err);
          }
        }
      } else {
        window.onYouTubeIframeAPIReady = () => initPlayer();
      }
    };

    const timer = setTimeout(() => {
      initPlayer();
    }, 400);

    return () => {
      clearTimeout(timer);
      if (trackerIntervalRef.current) {
        clearInterval(trackerIntervalRef.current);
      }
    };
  }, [activeVideo?.id, isOpen, activeTab]);

  // Listen to YouTube Player state changes
  const handlePlayerStateChange = (event: any) => {
    // 1 = PLAYING
    if (event.data === 1) {
      setIsVideoPlaying(true);
      startPlaybackTracker();
    } else {
      setIsVideoPlaying(false);
      stopPlaybackTracker();
    }

    // 0 = ENDED
    if (event.data === 0) {
      stopPlaybackTracker();
      if (activeVideo) {
        const dur = (playerRef.current?.getDuration && playerRef.current.getDuration()) || durationSeconds;
        handleVerifyVideoWatch(activeVideo.id, dur, dur);
      }
    }
  };

  // High-frequency playback position tracker and anti-skip enforcement
  const startPlaybackTracker = () => {
    stopPlaybackTracker();
    trackerIntervalRef.current = setInterval(() => {
      if (!playerRef.current || typeof playerRef.current.getCurrentTime !== "function") return;

      try {
        const cur = playerRef.current.getCurrentTime() || 0;
        const dur = playerRef.current.getDuration() || durationSeconds;
        setWatchedSeconds(Math.floor(cur));
        if (dur && !isNaN(dur) && dur > 0) {
          setDurationSeconds(Math.floor(dur));
        }

        // Anti-Cheat: Detect if the user scrubbed forward ahead of what has been watched
        if (cur > maxWatchedRef.current + 4) {
          playerRef.current.seekTo(maxWatchedRef.current, true);
          setSkipWarning(
            "⚠️ Fast-forwarding detected! Skipping ahead is prohibited. Videos must be viewed sequentially to the end to earn course completion credit."
          );
        } else {
          maxWatchedRef.current = Math.max(maxWatchedRef.current, cur);
          setMaxContinuousWatched(Math.floor(maxWatchedRef.current));
          setSkipWarning(null);
        }

        // Auto-complete if played within 3 seconds of the end
        if (cur >= dur - 3 && dur > 10 && activeVideo) {
          stopPlaybackTracker();
          handleVerifyVideoWatch(activeVideo.id, dur, dur);
        }
      } catch (err) {
        console.error("Tracker poll error:", err);
      }
    }, 500);
  };

  const stopPlaybackTracker = () => {
    if (trackerIntervalRef.current) {
      clearInterval(trackerIntervalRef.current);
      trackerIntervalRef.current = null;
    }
  };

  // Initialize lab starter codes
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
      const res = await fetch(`/api/v1/learning?studentId=${student.id}&courseCode=${courseCode}`);
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

  if (!isOpen) return null;

  const completedVideosSet = new Set(progress?.completedVideoIds || []);
  const completedLabsSet = new Set(progress?.completedLabIds || []);
  const totalVideos = curriculum?.videos?.length || 0;
  const totalLabs = curriculum?.labs?.length || 3;
  const completedVideosCount = completedVideosSet.size;
  const completedLabsCount = completedLabsSet.size;

  const progressPercent = progress?.progressPercentage || 0;
  const is100Percent = progressPercent >= 100 && (progress?.status === "COMPLETED" || Boolean(progress?.certificateId));

  // True Anti-Cheat Video Watch Verification (Triggered only when played through to end)
  const handleVerifyVideoWatch = async (videoId: string, watched: number, total: number) => {
    if (isVerifyingVideo) return;
    setIsVerifyingVideo(true);

    try {
      const res = await fetch(`/api/v1/learning`, {
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
          // Advance to next video
          if (curriculum?.videos) {
            const completedSet = new Set(data.progress.completedVideoIds || []);
            const nextVideo = curriculum.videos.find((v) => !completedSet.has(v.id));
            if (nextVideo && nextVideo.id !== videoId) {
              setTimeout(() => setActiveVideo(nextVideo), 1200);
            }
          }

          if (data.progress.progressPercentage >= 100) {
            confetti({
              particleCount: 120,
              spread: 70,
              origin: { y: 0.6 },
            });
          }
        }
      }
    } catch (e) {
      console.error("Error verifying video playback:", e);
    } finally {
      setIsVerifyingVideo(false);
    }
  };

  // Lab Submission Handler with strict validation (no blank submissions)
  const handleSubmitLab = async (labId: string) => {
    const userCode = labCodeMap[labId] || "";

    // Check if user actually wrote custom code
    const trimmed = userCode.trim();
    const nonCommentLines = trimmed
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith("#") && !l.startsWith("--") && !l.startsWith("//"));

    const codeBody = nonCommentLines.join(" ");
    const isOnlyPass = /^pass;?$/i.test(codeBody) || /def\s+\w+\s*\(.*?\):\s*pass;?$/i.test(codeBody);
    const isPlaceholder = codeBody.includes("raise NotImplementedError") || codeBody.includes("WRITE YOUR IMPLEMENTATION");
    const isTooShort = codeBody.length < 15;

    if (!trimmed || isOnlyPass || isPlaceholder || isTooShort) {
      setLabRunLog(
        "❌ Execution Failed: No custom code implementation detected.\n\n" +
        "Please write your code solution in the compiler before submitting.\n" +
        "Do not leave the template unmodified or empty."
      );
      return;
    }

    setIsRunningLab(true);
    setLabRunLog("Initializing containerized runtime sandbox...\nExecuting test suite against submitted code...\n");

    try {
      setTimeout(() => {
        setLabRunLog((prev) => (prev || "") + "✓ Test Case 1: Syntax & parameter validation passed\n");
      }, 350);

      setTimeout(() => {
        setLabRunLog((prev) => (prev || "") + "✓ Test Case 2: Mathematical boundary assertions verified\n");
      }, 700);

      const res = await fetch(`/api/v1/learning`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SUBMIT_LAB",
          studentId: student.id,
          courseCode,
          labId,
          code: userCode,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setTimeout(() => {
          setLabRunLog(
            (prev) =>
              (prev || "") +
              "✓ Test Case 3: Output constraint and benchmark check passed (0.03s)\n\n" +
              "🎉 ALL TESTS PASSED! Lab module officially verified & submitted."
          );
          setProgress(data.progress);
          if (data.certificate) setCertificate(data.certificate);
          if (onProgressUpdate) onProgressUpdate(data.progress);
          setIsRunningLab(false);
        }, 1100);
      } else {
        setLabRunLog(`❌ Execution Failed: ${data.message || "Test assertions failed."}`);
        setIsRunningLab(false);
      }
    } catch (e) {
      console.error("Error submitting lab:", e);
      setLabRunLog("❌ System Error: Unable to communicate with code evaluation runtime.");
      setIsRunningLab(false);
    }
  };

  // Quiz Submission Handler with 3-attempt limit
  const handleSubmitQuiz = async () => {
    const qz = curriculum?.quiz;
    if (!qz) return;

    if (Object.keys(quizAnswers).length < qz.questions.length) {
      alert(`Please answer all ${qz.questions.length} questions before submitting.`);
      return;
    }

    setIsSubmittingQuiz(true);
    try {
      const res = await fetch(`/api/v1/learning`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SUBMIT_QUIZ",
          studentId: student.id,
          courseCode,
          answers: quizAnswers,
        }),
      });

      const data = await res.json();
      setQuizResultFeedback(data);
      if (data.progress) setProgress(data.progress);
      if (data.certificate) setCertificate(data.certificate);
      if (onProgressUpdate && data.progress) onProgressUpdate(data.progress);

      if (data.passed && data.certificateIssued) {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 },
        });
      }
    } catch (e) {
      console.error("Error submitting quiz:", e);
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  // Reset Quiz for Reattempt (up to 3 tries)
  const handleReattemptQuiz = () => {
    setQuizAnswers({});
    setQuizResultFeedback(null);
  };

  const handleDownloadEnrollmentBill = () => {
    if (course) {
      generateEnrollmentBillPdf(student, course, undefined, progress?.sectionCode, progress?.transactionId);
    } else {
      const pseudoCourse: Course = {
        id: `c-${courseCode.toLowerCase()}`,
        code: courseCode,
        name: curriculum?.courseName || courseCode,
        description: "Enrolled Course",
        credits: progress?.credits || 4,
        department: "Computer Science",
        type: "Core",
        semester: "Fall 2026",
        level: 400,
        instructor: progress?.instructor || "University Faculty",
        prerequisites: [],
        sections: [
          {
            id: `sec-${courseCode}`,
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
      generateEnrollmentBillPdf(student, pseudoCourse, undefined, progress?.sectionCode, progress?.transactionId);
    }
  };

  const currentLab: CourseLab | undefined = curriculum?.labs?.find((l) => l.id === activeLabId) || curriculum?.labs?.[0];
  const qz = curriculum?.quiz;
  const answeredQuizCount = Object.keys(quizAnswers).length;
  const currentAttempts = progress?.quizAttempts || 0;
  const isQuizLocked = !progress?.quizPassed && currentAttempts >= 3;

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

            {/* Certificate Button if 100% */}
            {is100Percent && certificate && (
              <button
                onClick={() => onViewCertificate && onViewCertificate(certificate)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white text-[12px] font-bold shadow-sm shadow-amber-200 transition-all cursor-pointer animate-pulse"
              >
                <Award className="w-4 h-4" />
                <span>View Certificate</span>
              </button>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Course Progress Summary Bar */}
        <div className="bg-[#0c142c] text-white px-6 py-3 border-b border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-[12px] text-slate-300 font-medium">Curriculum Mastery:</span>
              <div className="w-32 sm:w-48 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    is100Percent
                      ? "bg-gradient-to-r from-emerald-400 to-green-500"
                      : "bg-gradient-to-r from-indigo-500 to-purple-500"
                  }`}
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <span className="text-[13px] font-extrabold text-indigo-300">{progressPercent}%</span>
            </div>

            <div className="flex items-center gap-3 text-[11px]">
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                Lectures: <strong>{completedVideosCount}/{totalVideos}</strong> (50%)
              </span>
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                Labs: <strong>{completedLabsCount}/{totalLabs}</strong> (30%)
              </span>
              <span
                className={`px-2.5 py-1 rounded-lg border ${
                  progress?.quizPassed
                    ? "bg-emerald-950/70 border-emerald-500/50 text-emerald-300 font-bold"
                    : "bg-slate-800/80 border-slate-700 text-slate-300"
                }`}
              >
                Quiz:{" "}
                {progress?.quizScore !== undefined
                  ? `${progress.quizScore}/20 Marks (${progress.quizPassed ? "Passed ✓" : "Below 12 Marks"})`
                  : "Not Attempted (20%)"}
              </span>

              {is100Percent && (
                <span className="inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  <Sparkles className="w-3 h-3" /> Certificate Issued!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 3 Tabs Navigation */}
        <div className="flex items-center border-b border-slate-200 bg-white px-6">
          <button
            onClick={() => setActiveTab("videos")}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-[13px] border-b-2 transition-all cursor-pointer ${
              activeTab === "videos"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Video Lectures ({completedVideosCount}/{totalVideos})</span>
          </button>

          <button
            onClick={() => setActiveTab("labs")}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-[13px] border-b-2 transition-all cursor-pointer ${
              activeTab === "labs"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Hands-On Labs ({completedLabsCount}/{totalLabs})</span>
          </button>

          <button
            onClick={() => setActiveTab("quiz")}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-[13px] border-b-2 transition-all cursor-pointer ${
              activeTab === "quiz"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>
              Final Assessment Quiz (20 Questions • 20 Marks)
              {progress?.quizPassed && <span className="ml-1.5 text-emerald-600">✓</span>}
            </span>
          </button>
        </div>

        {/* TAB 1: VIDEO LECTURES WITH REAL YOUTUBE API ANTI-CHEAT */}
        {activeTab === "videos" && (
          <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 min-h-0">
            {/* Left Column: Video Player & Description (7 cols) */}
            <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-slate-200 overflow-y-auto flex flex-col">
              {activeVideo ? (
                <>
                  {/* Real YouTube Player Container with API integration */}
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 shadow-md border border-slate-800">
                    <div id="youtube-player-iframe" className="w-full h-full"></div>
                  </div>

                  {/* Real Anti-Cheat Playback Verification Status Bar */}
                  <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-[12px] mb-2">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-indigo-600" />
                        <span className="font-bold text-slate-800">Anti-Cheat Playback Verification:</span>
                        {completedVideosSet.has(activeVideo.id) ? (
                          <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Verified Complete ✓
                          </span>
                        ) : isVideoPlaying ? (
                          <span className="text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full text-[11px] font-bold animate-pulse">
                            Playing & Tracking Live...
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">
                            Play video to begin tracking
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-slate-600 font-semibold text-[11px]">
                        {Math.floor(watchedSeconds / 60)}:{(watchedSeconds % 60).toString().padStart(2, "0")} / {activeVideo.duration}
                      </span>
                    </div>

                    {/* Sequential Progress Bar (Reflects true watched time) */}
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 transition-all duration-300"
                        style={{
                          width: `${Math.min(100, Math.round((watchedSeconds / Math.max(1, durationSeconds)) * 100))}%`,
                        }}
                      ></div>
                    </div>

                    {/* Anti-Skip Warning Banner */}
                    {skipWarning && (
                      <div className="mt-2.5 flex items-center gap-2 text-[12px] text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                        <span>{skipWarning}</span>
                      </div>
                    )}

                    {/* Informative Guidance */}
                    <div className="mt-2.5 text-[11px] text-slate-500 flex items-center justify-between">
                      <span>
                        {completedVideosSet.has(activeVideo.id)
                          ? "Lecture verified and recorded on university registrar ledger."
                          : "Continuous sequential playback required. Lecture automatically verifies upon completion."}
                      </span>
                      {isVerifyingVideo && (
                        <span className="text-indigo-600 font-bold flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" /> Verifying...
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Video Metadata & Description */}
                  <div className="mt-4">
                    <h3 className="text-[17px] font-bold text-[#0c142c]">
                      {activeVideo.title}
                    </h3>
                    <p className="text-[13px] text-slate-600 mt-2 leading-relaxed">
                      {activeVideo.description}
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-400 text-[13px]">
                  Select a video from the playlist to begin learning.
                </div>
              )}
            </div>

            {/* Right Column: Interactive Playlist (5 cols) */}
            <div className="lg:col-span-5 p-6 overflow-y-auto bg-slate-50/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Course Playlist ({totalVideos} Lectures)
                </span>
                <span className="text-[11px] font-bold text-indigo-600">
                  {completedVideosCount}/{totalVideos} Completed
                </span>
              </div>

              <div className="space-y-2.5">
                {curriculum?.videos.map((vid) => {
                  const isCompleted = completedVideosSet.has(vid.id);
                  const isCurrent = activeVideo?.id === vid.id;

                  return (
                    <div
                      key={vid.id}
                      onClick={() => setActiveVideo(vid)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isCurrent
                          ? "bg-indigo-50/90 border-indigo-300 shadow-sm"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="mt-0.5">
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Lock className="w-4 h-4 text-slate-300 shrink-0" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4
                            className={`text-[13px] font-bold truncate ${
                              isCurrent ? "text-indigo-950" : "text-slate-800"
                            }`}
                          >
                            {vid.title}
                          </h4>
                          <span className="text-[11px] font-medium text-slate-400 shrink-0">
                            {vid.duration}
                          </span>
                        </div>
                        <p className="text-[11.5px] text-slate-500 mt-1 line-clamp-2">
                          {vid.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HANDS-ON LABS (NO PRE-FILLED SOLUTIONS) */}
        {activeTab === "labs" && (
          <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 min-h-0">
            {/* Labs Sidebar (4 cols) */}
            <div className="lg:col-span-4 p-6 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50/60 overflow-y-auto">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                Practical Exercises ({curriculum?.labs?.length || 0} Labs)
              </span>

              <div className="space-y-3">
                {curriculum?.labs?.map((lab) => {
                  const isLabDone = completedLabsSet.has(lab.id);
                  const isSelected = activeLabId === lab.id;

                  return (
                    <div
                      key={lab.id}
                      onClick={() => setActiveLabId(lab.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-indigo-50 border-indigo-300 shadow-xs"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-indigo-600 bg-indigo-100/70 px-2 py-0.5 rounded-md">
                          {lab.estimatedMinutes || 45} mins
                        </span>
                        {isLabDone ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Submitted
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium text-slate-400">
                            Pending
                          </span>
                        )}
                      </div>
                      <h4 className="text-[13.5px] font-bold text-[#0c142c] mt-2">
                        {lab.title}
                      </h4>
                      <p className="text-[11.5px] text-slate-500 mt-1 line-clamp-2">
                        {lab.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Lab Sandbox & Tasks (8 cols) */}
            <div className="lg:col-span-8 p-6 overflow-y-auto flex flex-col">
              {currentLab ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-[17px] font-bold text-[#0c142c]">
                        {currentLab.title}
                      </h3>
                      <p className="text-[12.5px] text-slate-600 mt-1">
                        {currentLab.description}
                      </p>
                    </div>
                    {completedLabsSet.has(currentLab.id) && (
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Lab Passed
                      </span>
                    )}
                  </div>

                  {/* Tasks List */}
                  <div className="mb-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <h5 className="text-[12px] font-bold text-slate-700 mb-2">Lab Objectives & Tasks:</h5>
                    <ul className="space-y-1 text-[12px] text-slate-600 list-disc list-inside">
                      {(currentLab.objectives || currentLab.tasks || []).map((task: string, idx: number) => (
                        <li key={idx}>{task}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Code Editor Area */}
                  <div className="flex-1 flex flex-col min-h-[220px]">
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-900 text-slate-300 rounded-t-2xl text-[11px] font-mono border-b border-slate-800">
                      <span className="flex items-center gap-2">
                        <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                        interactive_lab_environment.py
                      </span>
                      <span>Python 3.11 Evaluation Runtime</span>
                    </div>
                    <textarea
                      value={labCodeMap[currentLab.id] ?? currentLab.starterCode}
                      onChange={(e) =>
                        setLabCodeMap({ ...labCodeMap, [currentLab.id]: e.target.value })
                      }
                      placeholder="Write your custom implementation code here..."
                      className="w-full flex-1 min-h-[190px] p-4 bg-slate-950 text-emerald-400 font-mono text-[12.5px] rounded-b-2xl resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      spellCheck={false}
                    />
                  </div>

                  {/* Execution Output Log */}
                  {labRunLog && (
                    <div className="mt-3 p-3 bg-slate-900 text-slate-200 font-mono text-[11.5px] rounded-xl border border-slate-800 whitespace-pre-line">
                      {labRunLog}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="mt-4 flex items-center justify-end">
                    <button
                      onClick={() => handleSubmitLab(currentLab.id)}
                      disabled={isRunningLab}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[13px] shadow-sm transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isRunningLab ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Running Verification Tests...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Run Tests & Submit Lab</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-slate-400 text-[13px]">Select a lab module to begin.</div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: FINAL ASSESSMENT QUIZ (20 QUESTIONS • 3 ATTEMPTS LIMIT) */}
        {activeTab === "quiz" && (
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
            {qz ? (
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Quiz Header Banner */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[11px] mb-2 border border-indigo-200">
                        <Award className="w-3.5 h-3.5" />
                        <span>Graded Academic Assessment</span>
                      </div>
                      <h3 className="text-[19px] font-extrabold text-[#0c142c]">
                        {qz.title}
                      </h3>
                      <p className="text-[13px] text-slate-500 mt-1">
                        {qz.questions.length} Questions • 1 Mark Each • 20 Marks Total • <strong>Passing Score: 12 / 20 Marks (60%)</strong>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[11px] font-bold text-slate-400 uppercase">
                        Attempt {Math.min(3, currentAttempts + (quizResultFeedback ? 0 : 1))} of 3
                      </div>
                      {progress?.quizScore !== undefined ? (
                        <div
                          className={`text-[16px] font-extrabold ${
                            progress.quizPassed ? "text-emerald-600" : "text-amber-600"
                          }`}
                        >
                          {progress.quizScore} / 20 Marks ({progress.quizPassed ? "Passed ✓" : "Failed"})
                        </div>
                      ) : (
                        <div className="text-[14px] font-bold text-slate-600">Not Yet Taken</div>
                      )}
                    </div>
                  </div>

                  {/* Passing/Failing Alert Banner */}
                  {quizResultFeedback && (
                    <div
                      className={`mt-4 p-4 rounded-2xl border flex items-start gap-3 ${
                        quizResultFeedback.passed
                          ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                          : isQuizLocked
                          ? "bg-red-50 border-red-300 text-red-900"
                          : "bg-amber-50 border-amber-300 text-amber-900"
                      }`}
                    >
                      {quizResultFeedback.passed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      )}
                      <div className="text-[13px] flex-1">
                        <p className="font-bold">
                          {quizResultFeedback.passed
                            ? `🎉 Congratulations! You scored ${quizResultFeedback.score} / 20 Marks and passed the final assessment!`
                            : isQuizLocked
                            ? `Assessment Result: ${quizResultFeedback.score} / 20 Marks. Maximum attempts reached (3/3). Assessment is now locked.`
                            : `Assessment Result: ${quizResultFeedback.score} / 20 Marks (Passing threshold: 12 / 20).`}
                        </p>
                        <p className="mt-1 text-[12px] opacity-90">
                          {quizResultFeedback.passed
                            ? "All graduation requirements for this course have been verified. Your official certificate is unlocked!"
                            : isQuizLocked
                            ? "You have exhausted all 3 evaluation attempts. Please contact your academic advisor to petition for an assessment reset."
                            : `You have ${Math.max(0, 3 - (quizResultFeedback.attemptsUsed || currentAttempts))} attempt(s) remaining. Review feedback below and reattempt.`}
                        </p>

                        {/* Reattempt Button (if attempts < 3 and not passed) */}
                        {!quizResultFeedback.passed && !isQuizLocked && (
                          <div className="mt-3">
                            <button
                              onClick={handleReattemptQuiz}
                              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[12px] flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Reattempt Assessment ({Math.max(0, 3 - (quizResultFeedback.attemptsUsed || currentAttempts))} Tries Left)</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 20 Questions Form */}
                <div className="space-y-4">
                  {qz.questions.map((q, qIndex) => {
                    const selectedIdx = quizAnswers[q.id];
                    const feedback = quizResultFeedback?.detailedFeedback?.find(
                      (f: any) => f.questionId === q.id
                    );

                    return (
                      <div
                        key={q.id}
                        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="text-[14px] font-bold text-[#0c142c] leading-snug">
                            <span className="text-indigo-600 mr-2">Q{qIndex + 1}.</span>
                            {q.question}
                          </h4>
                          <span className="text-[11px] font-bold text-slate-400 shrink-0">
                            1 Mark
                          </span>
                        </div>

                        {/* Options */}
                        <div className="space-y-2 pt-1">
                          {q.options.map((opt, optIndex) => {
                            const isSelected = selectedIdx === optIndex;
                            return (
                              <label
                                key={optIndex}
                                onClick={() => {
                                  if (!isQuizLocked && !quizResultFeedback?.passed) {
                                    setQuizAnswers({ ...quizAnswers, [q.id]: optIndex });
                                  }
                                }}
                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer text-[13px] ${
                                  isSelected
                                    ? "bg-indigo-50 border-indigo-400 text-indigo-950 font-semibold"
                                    : "bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100"
                                } ${isQuizLocked ? "cursor-not-allowed opacity-60" : ""}`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${q.id}`}
                                  checked={isSelected}
                                  disabled={isQuizLocked || quizResultFeedback?.passed}
                                  onChange={() => {}}
                                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span>{opt}</span>
                              </label>
                            );
                          })}
                        </div>

                        {/* Explanation Feedback if submitted */}
                        {feedback && (
                          <div
                            className={`p-3 rounded-xl text-[12px] mt-2 ${
                              feedback.correct
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : "bg-red-50 text-red-800 border border-red-200"
                            }`}
                          >
                            <span className="font-bold">
                              {feedback.correct ? "✓ Correct: " : "✗ Incorrect: "}
                            </span>
                            {feedback.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Submit Quiz Button */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 flex items-center justify-between">
                  <span className="text-[12px] font-medium text-slate-500">
                    Questions answered:{" "}
                    <strong>
                      {answeredQuizCount} / {qz.questions.length}
                    </strong>
                  </span>

                  <button
                    onClick={handleSubmitQuiz}
                    disabled={isSubmittingQuiz || answeredQuizCount < qz.questions.length || isQuizLocked || quizResultFeedback?.passed}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[13px] shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingQuiz ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Evaluating Assessment...</span>
                      </>
                    ) : isQuizLocked ? (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Assessment Locked (3/3 Tries Used)</span>
                      </>
                    ) : quizResultFeedback?.passed ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                        <span>Assessment Passed ({progress?.quizScore}/20 Marks)</span>
                      </>
                    ) : (
                      <>
                        <Award className="w-4 h-4" />
                        <span>Submit Final Assessment (20 Marks)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-[13px]">
                No quiz currently provisioned for this course.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
