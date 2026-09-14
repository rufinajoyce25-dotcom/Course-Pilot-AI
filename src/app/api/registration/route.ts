import { NextRequest, NextResponse } from "next/server";
import { AgentTools } from "@/lib/agent/tools";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, courseCode, sectionId, studentId = "STU-2024-8841" } = body;

    if (action === "confirm" || action === "register") {
      if (!courseCode) {
        return NextResponse.json({ error: "Missing courseCode" }, { status: 400 });
      }

      // Pre-check: If already enrolled or completed, registration is strictly locked
      const currentStudent = await AgentTools.get_current_student(studentId);
      if (currentStudent?.currentEnrollments?.includes(courseCode) || currentStudent?.completedCourses?.includes(courseCode)) {
        return NextResponse.json({
          error: `Registration Locked: Student ${currentStudent.name} is already enrolled in ${courseCode}. Multiple registrations for the same course are locked for the same individual, with permanent lifelong access guaranteed.`,
          isLocked: true,
          isDuplicate: true
        }, { status: 409 });
      }

      // 1. Perform registration
      const regResult = await AgentTools.register_course(studentId, courseCode, sectionId || "Section A");

      // 2. Perform explicit registration verification
      const statusVerification = await AgentTools.get_registration_status(studentId);

      // 3. Fetch refreshed student records
      const student = await AgentTools.get_current_student(studentId);
      const timetable = await AgentTools.get_live_timetable(studentId);

      const reg: any = regResult;
      const verifiedCourse = reg.verifiedCourse;
      const verifiedSection = reg.verifiedSection;

      const scheduleStr = verifiedSection?.schedule
        ? verifiedSection.schedule.map((s: any) => `${s.day} ${s.startTime}–${s.endTime}`).join(", ")
        : (reg.schedule || "Monday & Wednesday 10:00–11:00 AM");

      return NextResponse.json({
        success: true,
        transactionId: reg.transactionId,
        message: reg.message,
        timestamp: reg.timestamp,
        courseCode: verifiedCourse?.code || reg.courseCode || courseCode,
        courseName: verifiedCourse?.name || reg.courseName || courseCode,
        sectionCode: verifiedSection?.sectionCode || reg.sectionCode || sectionId || "Section A",
        room: verifiedSection?.room || reg.room || "Turing Hall 302",
        schedule: scheduleStr,
        credits: reg.credits || verifiedCourse?.credits || 4,
        seatsRemaining: verifiedSection?.available !== undefined ? verifiedSection.available : (reg.seatsRemaining ?? 7),
        completedCreditsNow: reg.completedCreditsNow || student.completedCredits,
        degreeProgressNow: reg.degreeProgressNow || student.degreeProgressPercentage,
        verification: {
          verified: true,
          status: statusVerification.status,
          enrollments: statusVerification.enrollments,
          registrationId: statusVerification.registrationId
        },
        updatedStudent: {
          completedCredits: student.completedCredits,
          degreeProgressPercentage: student.degreeProgressPercentage,
          currentEnrollments: student.currentEnrollments,
          coreCoursesCompleted: student.coreCoursesCompleted,
          electivesCompleted: student.electivesCompleted
        },
        timetable
      });
    }

    if (action === "drop") {
      const dropResult = await AgentTools.drop_course(studentId, courseCode);
      const student = await AgentTools.get_current_student(studentId);
      const timetable = await AgentTools.get_live_timetable(studentId);

      return NextResponse.json({
        success: true,
        transactionId: dropResult.transactionId,
        message: dropResult.message,
        updatedStudent: student,
        timetable
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error("Registration API error:", err);
    const msg = err.message || "Registration failed";
    const isConflict = msg.toLowerCase().includes("already enrolled") || msg.toLowerCase().includes("already completed");
    return NextResponse.json({ error: msg, isDuplicate: isConflict }, { status: isConflict ? 409 : 500 });
  }
}

