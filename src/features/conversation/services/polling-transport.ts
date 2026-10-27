import type { AgentEvent, AgentTransport } from "@/features/conversation/types/agent-event";

function isEvent(value: unknown): value is AgentEvent {
  if (!value || typeof value !== "object") return false;
  const event = value as AgentEvent;
  return typeof event.id === "number" && (event.type === "agent.state" || event.type === "agent.transcript");
}

export const pollingTransport: AgentTransport = {
  async poll(conversationId, after) {
    const response = await fetch(`/api/kiosk/events?conversationId=${encodeURIComponent(conversationId)}&after=${after}`, {
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    const json: unknown = await response.json().catch(() => null);
    const message =
      json && typeof json === "object" && "message" in json && typeof json.message === "string"
        ? json.message
        : "The lane lost the agent response.";

    if (!response.ok || !json || typeof json !== "object" || !("events" in json) || !Array.isArray(json.events) || !json.events.every(isEvent)) {
      throw new Error(message);
    }

    const cursor = "cursor" in json && typeof json.cursor === "number" ? json.cursor : after;
    return { events: json.events, cursor };
  },
};
