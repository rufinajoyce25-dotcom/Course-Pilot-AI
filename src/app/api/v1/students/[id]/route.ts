import { NextRequest, NextResponse } from "next/server";
import { globalUnivDb } from "@/lib/server/universityDatabase";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const studentId = params.id;
  const student = (studentId === "me" || studentId === "active")
    ? globalUnivDb.getActiveStudent()
    : (globalUnivDb.getStudent(studentId) || globalUnivDb.getActiveStudent());

  const transcript = globalUnivDb.getStudentTranscript(student.id);

  return NextResponse.json({
    ...student,
    transcript,
    dataSource: {
      source: "University Student Information System (Oracle SIS Live)",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      status: "LIVE"
    }
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const studentId = params.id;
    const body = await req.json();

    const targetId = (studentId === "me" || studentId === "active")
      ? globalUnivDb.activeStudentId
      : studentId;

    const updated = globalUnivDb.updateStudentProfile(targetId, body);
    const transcript = globalUnivDb.getStudentTranscript(updated.id);

    return NextResponse.json({
      success: true,
      student: updated,
      transcript,
      message: "Student profile synchronized to live University SIS.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update student profile" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const studentId = params.id;
    const body = await req.json();
    const targetId = (studentId === "me" || studentId === "active")
      ? globalUnivDb.activeStudentId
      : studentId;

    if (body.action === "add_completed_course") {
      const student = globalUnivDb.addCompletedCourse(targetId, body.course);
      const transcript = globalUnivDb.getStudentTranscript(student.id);
      return NextResponse.json({ success: true, student, transcript });
    }

    if (body.action === "remove_completed_course") {
      const student = globalUnivDb.removeCompletedCourse(targetId, body.courseCode);
      const transcript = globalUnivDb.getStudentTranscript(student.id);
      return NextResponse.json({ success: true, student, transcript });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to process student action" },
      { status: 500 }
    );
  }
}
