import "server-only";

import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS, TRANSIT_COOKIE } from "@/lib/auth/constants";
import type { Locale } from "@/shared/i18n/messages";

export async function readSessionToken() {
  const jar = await cookies();
  return jar.get(SESSION_COOKIE)?.value ?? null;
}

export async function writeSessionToken(token: string) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearSessionToken() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function readTransitLocale(): Promise<Locale | null> {
  const jar = await cookies();
  const value = jar.get(TRANSIT_COOKIE)?.value;
  return value === "ar" || value === "en" ? value : null;
}

export async function writeTransitLocale(locale: Locale) {
  const jar = await cookies();
  jar.set(TRANSIT_COOKIE, locale, {
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 20,
  });
}
