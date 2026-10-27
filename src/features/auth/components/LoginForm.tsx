"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { signInAction } from "@/features/auth/actions/auth.actions";
import { DEMO_ACCOUNTS } from "@/features/auth/constants/demo-accounts";
import { signInSchema, type SignInValues } from "@/features/auth/schemas/sign-in.schema";
import styles from "@/features/auth/styles/auth-page.module.css";
import type { ChromeMessages } from "@/shared/i18n/messages";

type LoginFormProps = {
  messages: ChromeMessages;
};

export function LoginForm({ messages }: LoginFormProps) {
  const [visible, setVisible] = useState(false);
  const [rootError, setRootError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: SignInValues) {
    setRootError(null);
    const result = await signInAction(values);
    if (!result) return;
    if (result.fieldErrors?.email) setError("email", { message: result.fieldErrors.email });
    if (result.fieldErrors?.password) setError("password", { message: result.fieldErrors.password });
    if (!result.fieldErrors?.email && !result.fieldErrors?.password) {
      setRootError(result.message);
      toast.error(result.message);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.field}>
        <label htmlFor="work-email">
          Work email <span className={styles.req}>*</span>
        </label>
        <input id="work-email" type="email" autoComplete="email" placeholder="you@yourbrand.com" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "work-email-error" : undefined} {...register("email")} />
        {errors.email ? (
          <p id="work-email-error" className={styles.fieldError}>
            {errors.email.message ?? messages.required}
          </p>
        ) : null}
      </div>
      <div className={styles.field}>
        <label htmlFor="password">
          Password <span className={styles.req}>*</span>
        </label>
        <div className={styles.passwordRow}>
          <input
            id="password"
            type={visible ? "text" : "password"}
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
            {...register("password")}
          />
          <button className={styles.ghost} type="button" aria-pressed={visible} onClick={() => setVisible((current) => !current)}>
            {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
            <span className="sr-only">{visible ? messages.hidePassword : messages.showPassword}</span>
          </button>
        </div>
        {errors.password ? (
          <p id="password-error" className={styles.fieldError}>
            {errors.password.message ?? messages.required}
          </p>
        ) : null}
      </div>
      {rootError ? (
        <p className={styles.alert} role="alert">
          {rootError}
        </p>
      ) : null}
      <label className={styles.remember}>
        <input type="checkbox" name="remember" />
        <span>Keep me signed in</span>
      </label>
      <button className={styles.submit} type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing in…" : "Sign in →"}
      </button>
      <div className={styles.demo}>
        <h2>{messages.demoTitle}</h2>
        <p className={styles.note}>{messages.demoNote}</p>
        <div className={styles.accounts}>
          {DEMO_ACCOUNTS.map((account) => (
            <button key={account.email} className={styles.account} type="button" onClick={() => setValue("email", account.email, { shouldValidate: true })}>
              <span>{account.email}</span>
              <span>{account.en}</span>
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
