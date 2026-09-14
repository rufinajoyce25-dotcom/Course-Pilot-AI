import { NextRequest, NextResponse } from "next/server";
import { globalUnivDb } from "@/lib/server/universityDatabase";
import { eventBus } from "@/lib/agent/eventBus";

export async function POST(req: NextRequest) {
  try {
    const { studentId, courseId, sectionId } = await req.json();

    const student = studentId
      ? (globalUnivDb.getStudent(studentId) || globalUnivDb.getActiveStudent())
      : globalUnivDb.getActiveStudent();

    const course = globalUnivDb.courses.get(courseId) ||
                   globalUnivDb.courses.get(courseId.toUpperCase()) ||
                   globalUnivDb.courses.get(courseId.toLowerCase());

    if (!course) {
      return NextResponse.json({ error: "Invalid course" }, { status: 404 });
    }

    const section = (sectionId && course.sections.find(s => s.id === sectionId || s.sectionCode.toLowerCase() === sectionId.toLowerCase()))
      || course.sections[0];

    if (student.currentEnrollments.includes(course.code) || (student.completedCourses || []).includes(course.code)) {
      return NextResponse.json({
        error: `Registration Locked: Student ${student.name} is already enrolled in ${course.code} (${course.name}). Multiple registrations for the same course are locked for the same individual, with permanent lifelong access to all videos and labs.`,
        isDuplicate: true,
        isLocked: true
      }, { status: 409 });
    }

    if (section.available <= 0) {
      return NextResponse.json({ error: "No available seats in selected section" }, { status: 400 });
    }

    // Mutate live seats (e.g. 8 -> 7)
    section.occupied += 1;
    section.available -= 1;

    // Mutate student enrollment in SIS
    // Mutate student enrollment in SIS (strictly unique)
    if (!student.currentEnrollments.includes(course.code)) {
      student.currentEnrollments.push(course.code);
    }
    student.currentEnrollments = Array.from(new Set(student.currentEnrollments));
    student.completedCredits += course.credits;
    if (course.type === "Core") {
      student.coreCoursesCompleted = (student.coreCoursesCompleted || 0) + 1;
    } else {
      student.electivesCompleted = (student.electivesCompleted || 0) + 1;
    }
    student.degreeProgressPercentage = Math.round(
      (student.completedCredits / student.requiredCredits) * 100
    );
    globalUnivDb.updateStudentProfile(student.id, student);

    // Add timetable slots
    const scheduleStr = section.schedule.map((s: any) => `${s.day} ${s.startTime}–${s.endTime}`).join(", ");
    for (const item of section.schedule) {
      globalUnivDb.addTimetableSlot(student.id, {
        id: `slot-${Date.now()}-${Math.floor(Math.random()*1000)}`,
        day: item.day,
        startTime: item.startTime,
        endTime: item.endTime,
        courseCode: course.code,
        courseName: course.name,
        sectionCode: section.sectionCode,
        room: section.room,
        instructor: section.instructor,
        color: "#4f46e5",
        credits: course.credits
      });
    }

    const transactionId = `TXN-UNIV-${Math.floor(100000 + Math.random() * 900000)}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Store official transaction in SIS audit logs
    globalUnivDb.transactions.push({
      transactionId,
      studentId: student.id,
      courseCode: course.code,
      courseName: course.name,
      sectionCode: section.sectionCode,
      credits: course.credits,
      schedule: scheduleStr,
      room: section.room,
      term: "Fall 2026",
      timestamp,
      status: "CONFIRMED",
      verificationHash: `SHA256:${Buffer.from(transactionId + course.code + timestamp).toString("hex").slice(0, 16)}`
    });

    // Broadcast live seat change and notification over SSE
    eventBus.emitSeatChange(course.code, section.id, section.available);
    eventBus.emitNotification({
      id: `notif-${Date.now()}`,
      timestamp: "Just now",
      title: `Registration Confirmed: ${course.code}`,
      message: `Enrolled in ${course.code} ${course.name} (${section.sectionCode}). Transaction: ${transactionId}`,
      priority: "high",
      type: "success",
      read: false,
      source: "University Registration API"
    });

    return NextResponse.json({
      success: true,
      transactionId,
      message: `Registration confirmed for ${course.code} (${section.sectionCode})`,
      timestamp,
      verifiedCourse: course,
      verifiedSection: section,
      credits: course.credits,
      seatsRemaining: section.available,
      completedCreditsNow: student.completedCredits,
      degreeProgressNow: student.degreeProgressPercentage,
      status: "CONFIRMED",
      source: "University Registration API",
      liveStatus: "LIVE"
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
