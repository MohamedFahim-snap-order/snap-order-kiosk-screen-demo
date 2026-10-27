import { z } from "zod";

const themeSchema = z.object({
  brand: z.string(),
  brand_soft: z.string(),
  surface: z.string(),
  surface_raised: z.string(),
  ink: z.string(),
  muted: z.string(),
  accent: z.string(),
  danger: z.string(),
  radius: z.string(),
  on_brand: z.string(),
  scheme: z.enum(["light", "dark"]),
});

export const bootstrapResponseSchema = z.object({
  data: z.object({
    kiosk: z.object({ id: z.string(), name: z.string() }),
    branch: z.object({ id: z.string(), name: z.string() }),
    vendor: z.object({ id: z.string(), name: z.string() }),
    locale: z.enum(["ar", "en"]),
    dir: z.enum(["rtl", "ltr"]),
    template_id: z.string(),
    theme: themeSchema,
    agent: z.object({ name: z.string() }),
    copy: z.object({
      idle_title: z.string(),
      idle_hint: z.string(),
      listening: z.string(),
      speaking: z.string(),
      car_arrived: z.string(),
      end_lane: z.string(),
      fallback_notice: z.string(),
    }),
  }),
});

export const loginResponseSchema = z.object({
  data: z.object({
    token: z.string(),
    kiosk: z.object({ id: z.string(), name: z.string() }),
    branch_id: z.string(),
    vendor_id: z.string(),
  }),
});

export const presenceResponseSchema = z.object({
  data: z.object({
    conversation_id: z.string(),
    state: z.string(),
  }),
});

export const eventsResponseSchema = z.object({
  data: z.object({
    cursor: z.number(),
    events: z.array(
      z.object({
        id: z.number(),
        type: z.enum(["agent.state", "agent.transcript"]),
        state: z.string().optional(),
        text: z.string().optional(),
        final: z.boolean().optional(),
      }),
    ),
  }),
});

export const endResponseSchema = z.object({
  data: z.object({
    conversation_id: z.string(),
    state: z.string(),
  }),
});
