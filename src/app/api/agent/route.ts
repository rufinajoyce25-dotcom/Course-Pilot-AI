import { NextRequest, NextResponse } from "next/server";
import { orchestrator } from "@/lib/agent/orchestrator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, studentId, apiKey, model } = body;
    const headerKey = req.headers.get("x-gemini-api-key");
    const effectiveApiKey = apiKey || headerKey || null;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Missing message query" }, { status: 400 });
    }

    const result = await orchestrator.processUserMessage(
      message,
      studentId || "STU-2024-8841",
      effectiveApiKey,
      model
    );
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Agent route error:", err);
    return NextResponse.json({ error: err.message || "Failed to process agent request" }, { status: 500 });
  }
}

