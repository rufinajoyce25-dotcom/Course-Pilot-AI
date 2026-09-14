import { NextRequest, NextResponse } from "next/server";
import { globalUnivDb } from "@/lib/server/universityDatabase";

export async function GET() {
  const students = globalUnivDb.listStudents();
  const activeStudent = globalUnivDb.getActiveStudent();

  return NextResponse.json({
    students,
    activeStudentId: activeStudent.id,
    activeStudent,
    dataSource: {
      source: "University Student Records SIS (Live Multi-Student Directory)",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      status: "LIVE"
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === "switch_active") {
      const activeStudent = globalUnivDb.setActiveStudent(body.studentId);
      const transcript = globalUnivDb.getStudentTranscript(activeStudent.id);
      return NextResponse.json({
        success: true,
        activeStudent,
        transcript,
        message: `Switched active student to ${activeStudent.name} (${activeStudent.id})`
      });
    }

    if (body.action === "create_student") {
      if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
        return NextResponse.json({ error: "Student name is required." }, { status: 400 });
      }

      try {
        const newStudent = globalUnivDb.createStudent({
          id: body.id,
          name: body.name,
          email: body.email,
          program: body.program,
          department: body.department,
          semester: Number(body.semester) || 1,
          cgpa: Number(body.cgpa) || 8.0,
          careerGoal: body.careerGoal,
          avatar: body.avatar || "",
          completedCourses: body.completedCourses,
          currentEnrollments: body.currentEnrollments,
        });

        const transcript = globalUnivDb.getStudentTranscript(newStudent.id);

        return NextResponse.json(
          {
            success: true,
            student: newStudent,
            activeStudent: newStudent,
            transcript,
            message: `Successfully created official student profile for ${newStudent.name} (${newStudent.id}).`
          },
          { status: 201 }
        );
      } catch (validationErr: any) {
        // Uniqueness violation -> return 409 Conflict
        return NextResponse.json(
          { error: validationErr.message, isDuplicate: true },
          { status: 409 }
        );
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

