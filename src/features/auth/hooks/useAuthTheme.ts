"use client";

import { useSyncExternalStore } from "react";
import { flushSync } from "react-dom";

const STORAGE_KEY = "kiosk-auth-theme";

export type AuthTheme = "light" | "dark";

const listeners = new Set<() => void>();

function readTheme(): AuthTheme {
  return window.localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function writeTheme(next: AuthTheme) {
  window.localStorage.setItem(STORAGE_KEY, next);
  listeners.forEach((listener) => listener());
}

export function useAuthTheme() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "light" as AuthTheme);

  function toggle() {
    const apply = () => {
      flushSync(() => {
        writeTheme(theme === "dark" ? "light" : "dark");
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
