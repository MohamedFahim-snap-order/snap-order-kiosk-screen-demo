export type KioskTheme = {
  scheme: "light" | "dark";
};

export type KioskCopy = {
  fallbackNotice: string;
};

export type KioskConfig = {
  vendor: { id: string; name: string };
  agent: { name: string };
  branch: { id: string; name: string };
  locale: "ar" | "en";
  dir: "rtl" | "ltr";
  templateId: string;
  theme: KioskTheme;
  copy: KioskCopy;
};
