import { NextRequest, NextResponse } from "next/server";
import { globalUnivDb } from "@/lib/server/universityDatabase";
import { Course } from "@/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase() || "";
  const dept = searchParams.get("department")?.toLowerCase() || "";
  const studentId = searchParams.get("studentId");
  const recommendedOnly = searchParams.get("recommended") === "true";

  const student = studentId
    ? (globalUnivDb.getStudent(studentId) || globalUnivDb.getActiveStudent())
    : globalUnivDb.getActiveStudent();

  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // Get dynamically scored courses based on this student
  let list = globalUnivDb.getRecommendedCoursesForStudent(student);

  if (q) {
    list = list.filter(c =>
      c.code.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
    );
  }

  if (dept) {
    list = list.filter(c => c.department.toLowerCase().includes(dept));
  }

  if (recommendedOnly) {
    list = list.slice(0, 4);
  }

  const result = list.map(c => ({
    ...c,
    dataSource: {
      source: "University Registration API",
      timestamp: nowStr,
      status: "LIVE" as const
    }
  }));

  return NextResponse.json(result);
}
