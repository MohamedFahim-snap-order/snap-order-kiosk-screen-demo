import { eventsResponseSchema } from "@/features/kiosk-session/schemas/bootstrap.schema";
import { kioskRequest } from "@/lib/api/kiosk-client";
import { readSessionToken } from "@/lib/auth/session";

export async function GET(request: Request) {
  const token = await readSessionToken();
  if (!token) return Response.json({ message: "Sign in to open this lane." }, { status: 401 });

  const url = new URL(request.url);
  const conversationId = url.searchParams.get("conversationId") ?? "";
  const after = url.searchParams.get("after") ?? "0";

  if (!/^conv_[a-z0-9]+$/i.test(conversationId)) {
    return Response.json({ message: "Missing conversation." }, { status: 400 });
  }

  const result = await kioskRequest(`/api/v1/kiosk/conversations/${conversationId}/events?after=${encodeURIComponent(after)}`, {
    token,
    schema: eventsResponseSchema,
  });

  if (!result.ok) return Response.json({ message: result.message }, { status: result.status });
  return Response.json(result.data.data);
}
