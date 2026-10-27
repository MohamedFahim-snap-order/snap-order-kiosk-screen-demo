import "server-only";

import { runDemoLane } from "@/features/kiosk-session/demo/demo-lane";
import type { ZodType } from "zod";

export type KioskFailure = {
  ok: false;
  status: number;
  message: string;
  errors?: Record<string, string[]>;
};

export type KioskSuccess<T> = { ok: true; status: number; data: T };

type RequestOptions<T> = {
  method?: "GET" | "POST";
  token?: string;
  body?: unknown;
  schema: ZodType<T>;
};

function remoteApiBase() {
  const configured = process.env.KIOSK_API_URL?.trim();
  if (!configured || configured === "internal") return null;
  if (process.env.VERCEL && /localhost|127\.0\.0\.1/i.test(configured)) return null;
  return configured.replace(/\/$/, "");
}

export async function kioskRequest<T>(path: string, options: RequestOptions<T>): Promise<KioskSuccess<T> | KioskFailure> {
  const method = options.method ?? "GET";
  try {
    const remote = remoteApiBase();
    const result = remote ? await fetchRemote(remote, path, method, options) : await runDemoLane({ method, path, token: options.token, body: options.body });
    const json = result.body;

    if (result.status < 200 || result.status >= 300) {
      return {
        ok: false,
        status: result.status,
        message: readMessage(json) ?? "The lane service rejected the request.",
        errors: readErrors(json),
      };
    }

    const parsed = options.schema.safeParse(json);
    if (!parsed.success) {
      return { ok: false, status: 502, message: "The lane service returned a payload this screen cannot read." };
    }

    return { ok: true, status: result.status, data: parsed.data };
  } catch {
    return { ok: false, status: 503, message: "The lane service did not respond." };
  }
}

async function fetchRemote<T>(base: string, path: string, method: "GET" | "POST", options: RequestOptions<T>) {
  const response = await fetch(`${base}${path}`, {
    method,
    cache: "no-store",
    headers: {
      accept: "application/json",
      ...(options.body ? { "content-type": "application/json" } : {}),
      ...(options.token ? { authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const body: unknown = await response.json().catch(() => null);
  return { status: response.status, body };
}

function readMessage(json: unknown) {
  if (!json || typeof json !== "object" || !("message" in json)) return null;
  return typeof json.message === "string" ? json.message : null;
}

function readErrors(json: unknown) {
  if (!json || typeof json !== "object" || !("errors" in json)) return undefined;
  const errors = json.errors;
  if (!errors || typeof errors !== "object") return undefined;
  return errors as Record<string, string[]>;
}
