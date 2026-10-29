export type Locale = "ar" | "en";

export type ChromeMessages = {
  showPassword: string;
  hidePassword: string;
  pending: string;
  demoTitle: string;
  demoNote: string;
  signOut: string;
  bootstrapTitle: string;
  required: string;
};

export const messages: Record<"en", ChromeMessages> = {
  en: {
    showPassword: "Show password",
    hidePassword: "Hide password",
    pending: "Opening lane",
    demoTitle: "Demo accounts",
    demoNote: "Shared password demo-lane. These accounts are demo data.",
    signOut: "Sign out",
    bootstrapTitle: "This lane could not load.",
    required: "Required",
  },
};
