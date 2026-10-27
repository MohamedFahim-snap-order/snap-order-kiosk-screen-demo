import type { bootstrapResponseSchema } from "@/features/kiosk-session/schemas/bootstrap.schema";
import type { KioskConfig } from "@/features/kiosk-session/types/kiosk-config";
import type { z } from "zod";

type BootstrapPayload = z.infer<typeof bootstrapResponseSchema>["data"];

export function mapBootstrap(payload: BootstrapPayload): KioskConfig {
  return {
    kiosk: payload.kiosk,
    branch: payload.branch,
    vendor: payload.vendor,
    locale: payload.locale,
    dir: payload.dir,
    templateId: payload.template_id,
    theme: {
      brand: payload.theme.brand,
      brandSoft: payload.theme.brand_soft,
      surface: payload.theme.surface,
      surfaceRaised: payload.theme.surface_raised,
      ink: payload.theme.ink,
      muted: payload.theme.muted,
      accent: payload.theme.accent,
      danger: payload.theme.danger,
      radius: payload.theme.radius,
      onBrand: payload.theme.on_brand,
      scheme: payload.theme.scheme,
    },
    agent: payload.agent,
    copy: {
      idleTitle: payload.copy.idle_title,
      idleHint: payload.copy.idle_hint,
      listening: payload.copy.listening,
      speaking: payload.copy.speaking,
      carArrived: payload.copy.car_arrived,
      endLane: payload.copy.end_lane,
      fallbackNotice: payload.copy.fallback_notice,
    },
  };
}
