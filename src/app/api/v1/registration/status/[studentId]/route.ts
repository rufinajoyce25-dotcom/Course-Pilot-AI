import { NextRequest, NextResponse } from "next/server";
import { globalUnivDb } from "@/lib/server/universityDatabase";

export async function GET(
  req: NextRequest,
  { params }: { params: { studentId: string } }
) {
  const student = globalUnivDb.getStudent(params.studentId) || globalUnivDb.getActiveStudent();
  const enrollments = student.currentEnrollments || [];
  const lastTxn = globalUnivDb.transactions.filter(t => t.studentId === student.id).slice(-1)[0];

  return NextResponse.json({
    studentId: student.id,
    status: enrollments.length > 0 ? "PARTIALLY_REGISTERED" : "REGISTRATION_OPEN",
    enrollments,
    activeRegistrationId: lastTxn ? lastTxn.transactionId : `REG-FA26-${student.id.replace("STU-", "")}`,
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    source: "University Registrar Database",
    statusIndicator: "LIVE"
  });
}
