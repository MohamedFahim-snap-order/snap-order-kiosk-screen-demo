export type KioskTheme = {
  brand: string;
  brandSoft: string;
  surface: string;
  surfaceRaised: string;
  ink: string;
  muted: string;
  accent: string;
  danger: string;
  radius: string;
  onBrand: string;
  scheme: "light" | "dark";
};

export type KioskCopy = {
  idleTitle: string;
  idleHint: string;
  listening: string;
  speaking: string;
  carArrived: string;
  endLane: string;
  fallbackNotice: string;
};

export type KioskConfig = {
  kiosk: { id: string; name: string };
  branch: { id: string; name: string };
  vendor: { id: string; name: string };
  locale: "ar" | "en";
  dir: "rtl" | "ltr";
  templateId: string;
  theme: KioskTheme;
  agent: { name: string };
  copy: KioskCopy;
};
