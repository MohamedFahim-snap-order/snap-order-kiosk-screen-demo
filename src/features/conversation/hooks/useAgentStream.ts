"use client";

import { useQuery } from "@tanstack/react-query";
import { pollingTransport } from "@/features/conversation/services/polling-transport";
import type { AgentEvent } from "@/features/conversation/types/agent-event";

const streams = new Map<string, { after: number; events: AgentEvent[] }>();

export function useAgentStream(conversationId: string | null, active: boolean) {
  const query = useQuery({
    queryKey: ["kiosk-events", conversationId],
    enabled: Boolean(conversationId) && active,
    refetchInterval: active ? 700 : false,
    queryFn: async () => {
      const id = conversationId as string;
      const bucket = streams.get(id) ?? { after: 0, events: [] };
      const page = await pollingTransport.poll(id, bucket.after);
      if (page.events.length === 0) return bucket.events;
      const seen = new Set(bucket.events.map((event) => event.id));
      const fresh = page.events.filter((event) => !seen.has(event.id));
      bucket.events = fresh.length ? [...bucket.events, ...fresh] : bucket.events;
      bucket.after = page.cursor;
      streams.set(id, bucket);
      return bucket.events;
    },
  });

  return {
    events: query.data ?? [],
    isError: query.isError,
    message: query.error instanceof Error ? query.error.message : null,
    retry: () => void query.refetch(),
  };
}
