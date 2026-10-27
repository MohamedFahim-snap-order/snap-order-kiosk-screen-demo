"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

const STORAGE_KEY = "kiosk-auth-theme";

export type AuthTheme = "light" | "dark";

function nextTheme(current: AuthTheme): AuthTheme {
  return current === "dark" ? "light" : "dark";
}

export function useAuthTheme() {
  const [theme, setTheme] = useState<AuthTheme>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") setTheme(stored);
  }, []);

  function toggle() {
    const apply = () => {
      flushSync(() => {
        setTheme((current) => {
          const next = nextTheme(current);
          window.localStorage.setItem(STORAGE_KEY, next);
          return next;
        });
      });
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce && typeof document.startViewTransition === "function") {
      document.startViewTransition(apply);
      return;
    }

    apply();
  }

  return { theme, toggle };
}
