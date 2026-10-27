import "server-only";

import { cache } from "react";
import { bootstrapResponseSchema } from "@/features/kiosk-session/schemas/bootstrap.schema";
import { mapBootstrap } from "@/features/kiosk-session/mappers/bootstrap.mapper";
import type { KioskConfig } from "@/features/kiosk-session/types/kiosk-config";
import { kioskRequest } from "@/lib/api/kiosk-client";
import { readSessionToken } from "@/lib/auth/session";

export type BootstrapResult = { ok: true; config: KioskConfig } | { ok: false; message: string };

export const loadBootstrap = cache(async (): Promise<BootstrapResult> => {
  const token = await readSessionToken();
  if (!token) return { ok: false, message: "Sign in to open this lane." };

  const result = await kioskRequest("/api/v1/kiosk/bootstrap", {
    token,
    schema: bootstrapResponseSchema,
  });

  if (!result.ok) return { ok: false, message: result.message };
  return { ok: true, config: mapBootstrap(result.data.data) };
});
