"use client";

import { Eye, EyeOff } from "lucide-react";
import { LaneTransit } from "@/features/auth/components/LaneTransit";
import { DEMO_ACCOUNTS } from "@/features/auth/constants/demo-accounts";
import { useLoginForm } from "@/features/auth/hooks/useLoginForm";
import styles from "@/features/auth/styles/auth-page.module.css";
import type { ChromeMessages } from "@/shared/i18n/messages";

type LoginFormProps = {
  messages: ChromeMessages;
};

export function LoginForm({ messages }: LoginFormProps) {
  const screen = useLoginForm();

  return (
    <form className={styles.form} onSubmit={screen.submit} noValidate>
      <div className={styles.field}>
        <label htmlFor="work-email">
          Work email <span className={styles.req}>*</span>
        </label>
        <input id="work-email" type="email" autoComplete="email" placeholder="you@yourbrand.com" aria-invalid={Boolean(screen.errors.email)} aria-describedby={screen.errors.email ? "work-email-error" : undefined} {...screen.register("email")} />
        {screen.errors.email ? (
          <p id="work-email-error" className={styles.fieldError}>
            {screen.errors.email.message ?? messages.required}
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
            type={screen.visible ? "text" : "password"}
            autoComplete="current-password"
            aria-invalid={Boolean(screen.errors.password)}
            aria-describedby={screen.errors.password ? "password-error" : undefined}
            {...screen.register("password")}
          />
          <button className={styles.ghost} type="button" aria-pressed={screen.visible} onClick={() => screen.setVisible((current) => !current)}>
            {screen.visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
            <span className="sr-only">{screen.visible ? messages.hidePassword : messages.showPassword}</span>
          </button>
        </div>
        {screen.errors.password ? (
          <p id="password-error" className={styles.fieldError}>
            {screen.errors.password.message ?? messages.required}
          </p>
        ) : null}
      </div>
      {screen.rootError ? (
        <p className={styles.alert} role="alert">
          {screen.rootError}
        </p>
      ) : null}
      <label className={styles.remember}>
        <input type="checkbox" name="remember" />
        <span>Keep me signed in</span>
      </label>
      <button className={styles.submit} type="submit" disabled={screen.isSubmitting || screen.leaving}>
        {screen.isSubmitting || screen.leaving ? messages.pending : "Sign in →"}
      </button>
      <div className={styles.demo}>
        <h2>{messages.demoTitle}</h2>
        <p className={styles.note}>{messages.demoNote}</p>
        <div className={styles.accounts}>
          {DEMO_ACCOUNTS.map((account) => (
            <button key={account.email} className={styles.account} type="button" onClick={() => screen.fillEmail(account.email)}>
              <span>{account.email}</span>
              <span>{account.en}</span>
            </button>
          ))}
        </div>
      </div>
      {screen.leaving ? <LaneTransit label={messages.pending} /> : null}
    </form>
  );
}
