import { NextRequest, NextResponse } from "next/server";
import { globalUnivDb } from "@/lib/server/universityDatabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId") || globalUnivDb.activeStudentId;
    const courseCode = searchParams.get("courseCode");

    if (courseCode) {
      const curriculum = globalUnivDb.getCourseCurriculum(courseCode);
      const studentProgressList = globalUnivDb.getEnrolledCoursesWithProgress(studentId);
      const progress = studentProgressList.find(p => p.courseCode.toUpperCase() === courseCode.toUpperCase()) || null;
      const certificates = globalUnivDb.getStudentCertificates(studentId);
      const certificate = certificates.find(c => c.courseCode.toUpperCase() === courseCode.toUpperCase()) || null;

      return NextResponse.json({
        success: true,
        curriculum,
        progress,
        certificate
      });
    }

    // Return all enrolled progress
    const enrolledCourses = globalUnivDb.getEnrolledCoursesWithProgress(studentId);
    const certificates = globalUnivDb.getStudentCertificates(studentId);

    return NextResponse.json({
      success: true,
      enrolledCourses,
      certificates
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, studentId, courseCode, videoId, watchedSeconds, totalDurationSeconds, labId, answers, code } = body;

    const sid = studentId || globalUnivDb.activeStudentId;

    if (action === "VERIFY_VIDEO_WATCH") {
      if (!courseCode || !videoId) {
        return NextResponse.json({ error: "Missing courseCode or videoId" }, { status: 400 });
      }

      const result = globalUnivDb.verifyVideoWatch(
        sid,
        courseCode,
        videoId,
        watchedSeconds || 0,
        totalDurationSeconds || 100
      );
      const certificates = globalUnivDb.getStudentCertificates(sid);
      const cert = certificates.find((c) => c.courseCode.toUpperCase() === courseCode.toUpperCase()) || null;

      return NextResponse.json({
        success: true,
        verified: result.verified,
        message: result.message,
        progress: result.progress,
        certificate: cert
      });
    }

    if (action === "SUBMIT_LAB") {
      if (!courseCode || !labId) {
        return NextResponse.json({ error: "Missing courseCode or labId" }, { status: 400 });
      }

      const result = globalUnivDb.submitCourseLab(sid, courseCode, labId, code);
      const certificates = globalUnivDb.getStudentCertificates(sid);
      const cert = certificates.find((c) => c.courseCode.toUpperCase() === courseCode.toUpperCase()) || null;

      return NextResponse.json({
        success: result.success,
        message: result.message,
        progress: result.progress,
        certificate: cert
      }, { status: result.success ? 200 : 400 });
    }

    if (action === "SUBMIT_QUIZ") {
      if (!courseCode || !answers) {
        return NextResponse.json({ error: "Missing courseCode or answers" }, { status: 400 });
      }

      const result = globalUnivDb.submitCourseQuiz(sid, courseCode, answers);

      return NextResponse.json({
        success: !result.isLocked,
        score: result.score,
        maxScore: result.maxScore,
        passingMarks: result.passingMarks,
        passed: result.passed,
        certificateIssued: result.certificateIssued,
        progress: result.progress,
        certificate: result.certificate,
        detailedFeedback: result.detailedFeedback,
        attemptsUsed: result.attemptsUsed,
        maxAttempts: result.maxAttempts,
        canReattempt: result.canReattempt,
        isLocked: result.isLocked,
        error: result.error
      });
    }

    if (action === "TOGGLE_VIDEO") {
      if (!courseCode || !videoId) {
        return NextResponse.json({ error: "Missing courseCode or videoId" }, { status: 400 });
      }

      const updatedProgress = globalUnivDb.toggleVideoCompleted(sid, courseCode, videoId);
      const certificates = globalUnivDb.getStudentCertificates(sid);
      const cert = certificates.find((c) => c.courseCode.toUpperCase() === courseCode.toUpperCase()) || null;

      return NextResponse.json({
        success: true,
        progress: updatedProgress,
        certificate: cert
      });
    }

    if (action === "GET_CERTIFICATE") {
      if (!courseCode) {
        return NextResponse.json({ error: "Missing courseCode" }, { status: 400 });
      }

      const cert = globalUnivDb.issueCourseCertificate(sid, courseCode);
      return NextResponse.json({
        success: true,
        certificate: cert
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

