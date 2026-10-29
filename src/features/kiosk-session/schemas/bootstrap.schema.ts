import { z } from "zod";

export const bootstrapResponseSchema = z.object({
  data: z.object({
    vendor: z.object({ id: z.string(), name: z.string() }),
    agent: z.object({ name: z.string() }),
    branch: z.object({ id: z.string(), name: z.string() }),
    locale: z.enum(["ar", "en"]),
    dir: z.enum(["rtl", "ltr"]),
    template_id: z.string(),
    theme: z.object({ scheme: z.enum(["light", "dark"]) }),
    copy: z.object({ fallback_notice: z.string() }),
  }),
});

export const loginResponseSchema = z.object({
  data: z.object({
    token: z.string(),
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
