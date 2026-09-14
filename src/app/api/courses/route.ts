import { NextRequest, NextResponse } from "next/server";
import { AgentTools } from "@/lib/agent/tools";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const dept = searchParams.get("department") || undefined;
    const type = searchParams.get("type") || undefined;

    const courses = await AgentTools.search_courses(q, {
      department: dept,
      type: type
    });

    return NextResponse.json({ courses });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

