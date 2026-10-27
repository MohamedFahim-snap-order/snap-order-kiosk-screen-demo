"use server";

import { endResponseSchema, presenceResponseSchema } from "@/features/kiosk-session/schemas/bootstrap.schema";
import { kioskRequest } from "@/lib/api/kiosk-client";
import { readSessionToken } from "@/lib/auth/session";

export async function startPresenceAction(): Promise<{ ok: true; conversationId: string } | { ok: false; message: string }> {
  const token = await readSessionToken();
  if (!token) return { ok: false, message: "Sign in to open this lane." };

  const result = await kioskRequest("/api/v1/kiosk/sensor/presence", {
    method: "POST",
    token,
    body: { present: true },
    schema: presenceResponseSchema,
  });

  if (!result.ok) return { ok: false, message: result.message };
  return { ok: true, conversationId: result.data.data.conversation_id };
}

export async function endConversationAction(conversationId: string) {
  const token = await readSessionToken();
  if (!token) return { ok: false as const, message: "Sign in to open this lane." };

  const result = await kioskRequest(`/api/v1/kiosk/conversations/${conversationId}/end`, {
    method: "POST",
    token,
    schema: endResponseSchema,
  });

  if (!result.ok) return { ok: false as const, message: result.message };
  return { ok: true as const };
}
