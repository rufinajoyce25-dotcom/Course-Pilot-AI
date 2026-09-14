import { AgentStepEvent } from "@/types";

type Listener<T> = (data: T) => void;

class RealtimeEventBus {
  private agentListeners: Set<Listener<AgentStepEvent>> = new Set();
  private seatListeners: Set<Listener<{ courseCode: string; sectionId: string; available: number; timestamp: string }>> = new Set();
  private notificationListeners: Set<Listener<any>> = new Set();
  private recentEvents: AgentStepEvent[] = [
    {
      eventId: "ev-init-1",
      timestamp: "11:32 AM",
      timeExact: "11:32:05 AM",
      step: "Understanding your request",
      detail: "Analyzing your query...",
      tool: "intent_detector",
      status: "COMPLETED",
      durationMs: 42,
      source: "Agent Orchestrator"
    },
    {
      eventId: "ev-init-2",
      timestamp: "11:32 AM",
      timeExact: "11:32:12 AM",
      step: "Student profile retrieved",
      detail: "Loaded academic records",
      tool: "get_current_student",
      status: "COMPLETED",
      durationMs: 110,
      source: "University SIS API"
    },
    {
      eventId: "ev-init-3",
      timestamp: "11:33 AM",
      timeExact: "11:33:01 AM",
      step: "Course catalog retrieved",
      detail: "Found 128 courses",
      tool: "search_courses",
      status: "COMPLETED",
      durationMs: 145,
      source: "Course Catalog Service"
    },
    {
      eventId: "ev-init-4",
      timestamp: "11:33 AM",
      timeExact: "11:33:18 AM",
      step: "Checking prerequisites",
      detail: "Validating completion status",
      tool: "check_prerequisites",
      status: "COMPLETED",
      durationMs: 68,
      source: "Rules Engine"
    }
  ];

  subscribeAgentEvents(listener: Listener<AgentStepEvent>): () => void {
    this.agentListeners.add(listener);
    return () => this.agentListeners.delete(listener);
  }

  subscribeSeatEvents(listener: Listener<{ courseCode: string; sectionId: string; available: number; timestamp: string }>): () => void {
    this.seatListeners.add(listener);
    return () => this.seatListeners.delete(listener);
  }

  subscribeNotifications(listener: Listener<any>): () => void {
    this.notificationListeners.add(listener);
    return () => this.notificationListeners.delete(listener);
  }

  emitAgentEvent(event: AgentStepEvent) {
    this.recentEvents.push(event);
    if (this.recentEvents.length > 50) this.recentEvents.shift();
    this.agentListeners.forEach(fn => fn(event));
  }

  emitSeatChange(courseCode: string, sectionId: string, available: number) {
    const data = {
      courseCode,
      sectionId,
      available,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    this.seatListeners.forEach(fn => fn(data));
  }

  emitNotification(notification: any) {
    this.notificationListeners.forEach(fn => fn(notification));
  }

  getRecentEvents(): AgentStepEvent[] {
    return [...this.recentEvents];
  }
}

export const eventBus = new RealtimeEventBus();

