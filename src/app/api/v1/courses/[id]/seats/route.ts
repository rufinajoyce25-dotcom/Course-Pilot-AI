import { NextRequest, NextResponse } from "next/server";
import { globalUnivDb } from "@/lib/server/universityDatabase";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const code = params.id;
  const course = globalUnivDb.courses.get(code) ||
                 globalUnivDb.courses.get(code.toUpperCase()) ||
                 globalUnivDb.courses.get(code.toLowerCase());

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const sec = course.sections[0];
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return NextResponse.json({
    courseCode: course.code,
    sectionCode: sec.sectionCode,
    capacity: sec.capacity,
    occupied: sec.occupied,
    available: sec.available,
    source: "University Registration API",
    timestamp: now,
    status: "LIVE"
  });
}

