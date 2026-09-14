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

  return NextResponse.json({
    ...course,
    dataSource: {
      source: "University Registration API",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      status: "LIVE"
    }
  });
}

