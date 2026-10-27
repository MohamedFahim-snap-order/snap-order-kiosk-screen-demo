import type { CSSProperties } from "react";
import type { KioskTheme } from "@/features/kiosk-session/types/kiosk-config";

export function applyTheme(theme: KioskTheme): CSSProperties {
  return {
    "--kiosk-brand": theme.brand,
    "--kiosk-brand-soft": theme.brandSoft,
    "--kiosk-surface": theme.surface,
    "--kiosk-surface-raised": theme.surfaceRaised,
    "--kiosk-ink": theme.ink,
    "--kiosk-muted": theme.muted,
    "--kiosk-accent": theme.accent,
    "--kiosk-danger": theme.danger,
    "--kiosk-radius": theme.radius,
    "--kiosk-on-brand": theme.onBrand,
  } as CSSProperties;
}
