import { NextRequest, NextResponse } from "next/server";
import { globalUnivDb } from "@/lib/server/universityDatabase";

export async function GET(
  req: NextRequest,
  { params }: { params: { studentId: string } }
) {
  return NextResponse.json({
    timetable: globalUnivDb.timetable,
    dataSource: {
      source: "University Timetable & Room Scheduling System",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      status: "LIVE"
    }
  });
}

