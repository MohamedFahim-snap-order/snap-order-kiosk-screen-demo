import "server-only";

import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS, UI_LOCALE_COOKIE } from "@/lib/auth/constants";
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

export async function readUiLocale(): Promise<Locale> {
  const jar = await cookies();
  return jar.get(UI_LOCALE_COOKIE)?.value === "ar" ? "ar" : "en";
}

export async function writeUiLocale(locale: Locale) {
  const jar = await cookies();
  jar.set(UI_LOCALE_COOKIE, locale, {
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}
