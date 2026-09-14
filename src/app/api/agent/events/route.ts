import { NextRequest } from "next/server";
import { eventBus } from "@/lib/agent/eventBus";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send existing history first
      const recents = eventBus.getRecentEvents();
      for (const ev of recents) {
        controller.enqueue(encoder.encode(`event: agent_step\ndata: ${JSON.stringify(ev)}\n\n`));
      }

      // Subscribe to real-time events
      const unsubscribeAgent = eventBus.subscribeAgentEvents((event) => {
        try {
          controller.enqueue(encoder.encode(`event: agent_step\ndata: ${JSON.stringify(event)}\n\n`));
        } catch (e) {
          // stream closed
        }
      });

      const unsubscribeSeat = eventBus.subscribeSeatEvents((data) => {
        try {
          controller.enqueue(encoder.encode(`event: seat_update\ndata: ${JSON.stringify(data)}\n\n`));
        } catch (e) {
          // stream closed
        }
      });

      const unsubscribeNotifs = eventBus.subscribeNotifications((data) => {
        try {
          controller.enqueue(encoder.encode(`event: notification\ndata: ${JSON.stringify(data)}\n\n`));
        } catch (e) {
          // stream closed
        }
      });

      // Keepalive heartbeat every 15s
      const timer = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`));
        } catch (e) {
          clearInterval(timer);
        }
      }, 15000);

      req.signal.addEventListener("abort", () => {
        clearInterval(timer);
        unsubscribeAgent();
        unsubscribeSeat();
        unsubscribeNotifs();
        try {
          controller.close();
        } catch (e) {}
      });
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive"
    }
  });
}

