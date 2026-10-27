"use server";

import { redirect } from "next/navigation";
import { loginResponseSchema } from "@/features/kiosk-session/schemas/bootstrap.schema";
import { signInSchema, type SignInValues } from "@/features/auth/schemas/sign-in.schema";
import { kioskRequest } from "@/lib/api/kiosk-client";
import { clearSessionToken, writeSessionToken, writeUiLocale } from "@/lib/auth/session";
import type { Locale } from "@/shared/i18n/messages";

export type SignInFailure = {
  ok: false;
  message: string;
  fieldErrors?: { email?: string; password?: string };
};

export async function signInAction(values: SignInValues): Promise<SignInFailure | void> {
  const parsed = signInSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: "Enter the work email and password." };
  }

  const result = await kioskRequest("/api/v1/kiosk/login", {
    method: "POST",
    body: parsed.data,
    schema: loginResponseSchema,
  });

  if (!result.ok) {
    return {
      ok: false,
      message: result.message,
      fieldErrors: {
        email: result.errors?.email?.[0],
        password: result.errors?.password?.[0],
      },
    };
  }

  await writeSessionToken(result.data.data.token);
  redirect("/kiosk");
}

export async function signOutAction() {
  await clearSessionToken();
  redirect("/sign-in");
}

export async function setLocaleAction(formData: FormData) {
  const locale: Locale = formData.get("locale") === "ar" ? "ar" : "en";
  await writeUiLocale(locale);
  redirect("/sign-in");
}
