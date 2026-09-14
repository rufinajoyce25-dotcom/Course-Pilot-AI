import { NextRequest, NextResponse } from "next/server";
import { AgentTools } from "@/lib/agent/tools";
import { getDataProvider } from "@/lib/providers";

export async function GET(req: NextRequest) {
  try {
    const student = await AgentTools.get_current_student();
    const timetable = await AgentTools.get_live_timetable();
    const notifications = await AgentTools.get_notifications();
    const regWindow = await AgentTools.get_current_registration_window();
    const provider = getDataProvider();

    return NextResponse.json({
      student,
      timetable,
      notifications,
      registrationWindow: regWindow,
      dataSourceLabel: provider.getDataSourceLabel(),
      isDemo: provider.isDemoMode()
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

