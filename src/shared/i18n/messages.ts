export type Locale = "ar" | "en";

export type ChromeMessages = {
  signInTitle: string;
  signInLead: string;
  email: string;
  password: string;
  showPassword: string;
  hidePassword: string;
  submit: string;
  pending: string;
  demoTitle: string;
  demoNote: string;
  visualTitle: string;
  visualBody: string;
  localeLabel: string;
  english: string;
  arabic: string;
  signOut: string;
  streamError: string;
  retry: string;
  bootstrapTitle: string;
  required: string;
};

export const messages: Record<Locale, ChromeMessages> = {
  en: {
    signInTitle: "Sign in",
    signInLead: "This account opens one branch lane.",
    email: "Work email",
    password: "Password",
    showPassword: "Show password",
    hidePassword: "Hide password",
    submit: "Open lane",
    pending: "Opening lane",
    demoTitle: "Demo accounts",
    demoNote: "Shared password demo-lane. These accounts are demo data.",
    visualTitle: "The lane speaks when a car arrives.",
    visualBody: "Layout, language, and color follow the vendor tied to this kiosk.",
    localeLabel: "Language",
    english: "English",
    arabic: "العربية",
    signOut: "Sign out",
    streamError: "The lane lost the agent response.",
    retry: "Try again",
    bootstrapTitle: "This lane could not load.",
    required: "Required",
  },
  ar: {
    signInTitle: "تسجيل الدخول",
    signInLead: "هذا الحساب يفتح مسار فرع واحد.",
    email: "البريد الوظيفي",
    password: "كلمة المرور",
    showPassword: "إظهار كلمة المرور",
    hidePassword: "إخفاء كلمة المرور",
    submit: "افتح المسار",
    pending: "جار فتح المسار",
    demoTitle: "حسابات تجريبية",
    demoNote: "كلمة المرور المشتركة demo-lane. هذه الحسابات بيانات تجريبية.",
    visualTitle: "المسار يتحدث عندما تصل سيارة.",
    visualBody: "التخطيط واللغة والألوان تتبع التاجر المرتبط بهذا الكشك.",
    localeLabel: "اللغة",
    english: "English",
    arabic: "العربية",
    signOut: "تسجيل الخروج",
    streamError: "انقطع رد الوكيل عن المسار.",
    retry: "حاول مرة أخرى",
    bootstrapTitle: "تعذر تحميل هذا المسار.",
    required: "مطلوب",
  },
};
