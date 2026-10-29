import type { bootstrapResponseSchema } from "@/features/kiosk-session/schemas/bootstrap.schema";
import type { KioskConfig } from "@/features/kiosk-session/types/kiosk-config";
import type { z } from "zod";

type BootstrapPayload = z.infer<typeof bootstrapResponseSchema>["data"];

export function mapBootstrap(payload: BootstrapPayload): KioskConfig {
  return {
    vendor: payload.vendor,
    agent: payload.agent,
    branch: payload.branch,
    locale: payload.locale,
    dir: payload.dir,
    templateId: payload.template_id,
    theme: { scheme: payload.theme.scheme },
    copy: { fallbackNotice: payload.copy.fallback_notice },
  };
}
