"use client";

import Image from "next/image";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { useAuthTheme } from "@/features/auth/hooks/useAuthTheme";
import styles from "@/features/auth/styles/auth-page.module.css";
import type { ChromeMessages } from "@/shared/i18n/messages";

const highlights = ["Branch-aware menu control", "AI ordering behaviour", "Live service analytics"];

type AuthScreenProps = {
  messages: ChromeMessages;
};

export function AuthScreen({ messages }: AuthScreenProps) {
  const { theme, toggle } = useAuthTheme();

  return (
    <div className={styles.authPage} lang="en" dir="ltr" data-theme={theme}>
      <main className={styles.authMain}>
        <section className={styles.authFrame} aria-label="SnapOrder authentication">
          <aside className={styles.visualPanel} aria-labelledby="auth-visual-title">
            <div className={styles.visualTop}>
              <Image src="/snaporder-horizontal.png" width={655} height={120} alt="SnapOrder" priority className={styles.visualLogo} />
            </div>
            <div className={styles.visualCopy}>
              <span>Kiosk screen</span>
              <h2 id="auth-visual-title">Restaurant operations, intelligently connected.</h2>
              <p>Manage branches, menus, AI ordering, and live performance from one SnapOrder workspace.</p>
            </div>
            <div className={styles.visualScene}>
              <div className={styles.liveCard}>
                <span>Live operations</span>
                <strong>24</strong>
                <small>active orders</small>
              </div>
              <div className={styles.imageOrb}>
                <Image
                  src="/assets/auth/restaurant-combo-1.png"
                  width={480}
                  height={480}
                  sizes="(max-width: 991px) min(32vw, 320px), 480px"
                  alt="Illustrated restaurant order item from the SnapOrder asset library."
                  priority
                  className={styles.productImage}
                />
              </div>
              <div className={styles.analyticsPreview} aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
            <ul className={styles.visualHighlights}>
              {highlights.map((highlight) => (
                <li key={highlight}>
                  <span aria-hidden="true" />
                  {highlight}
                </li>
              ))}
            </ul>
          </aside>
          <div className={styles.formPanel}>
            <header className={styles.authHeader}>
              <button
                type="button"
                className={styles.iconButton}
                onClick={toggle}
                aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              >
                <Image
                  src={theme === "dark" ? "/assets/auth/theme-sun.svg" : "/assets/auth/theme-moon.svg"}
                  width={theme === "dark" ? 28 : 23}
                  height={theme === "dark" ? 28 : 23}
                  alt=""
                  aria-hidden="true"
                  unoptimized
                  className={theme === "dark" ? styles.themeIconLight : styles.themeIconDark}
                />
              </button>
            </header>
            <div className={styles.formBrand}>
              <Image src="/snaporder-horizontal.png" width={655} height={120} alt="SnapOrder" priority className={styles.formLogo} />
            </div>
            <div className={styles.formContent}>
              <section className={styles.card} aria-labelledby="sign-in-title">
                <p className={styles.badge}>
                  <span className={styles.dot} aria-hidden="true" />
                  Secure access
                </p>
                <h1 id="sign-in-title" className={styles.title}>
                  Kiosk screen
                </h1>
                <LoginForm messages={messages} />
              </section>
            </div>
            <p className={styles.legal}>
              © 2026 <strong>SnapOrder</strong> — a <strong>FekraHub</strong> company product.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
