export type LaneLabels = {
  end: string;
  signOut: string;
  closing: string;
  categories: string;
  powered: string;
  order: string;
  empty: string;
  emptyHint: string;
  subtotal: string;
  total: string;
  checkout: string;
  start: string;
  listening: string;
  idle: string;
  listeningHint: string;
  confirmed: string;
  pay: string;
  window: string;
  next: string;
  cal: string;
  decrease: string;
  increase: string;
};

const en: LaneLabels = {
  end: "End session",
  signOut: "Sign out",
  closing: "Closing the lane",
  categories: "Categories",
  powered: "Powered by",
  order: "Order",
  empty: "Cart is empty",
  emptyHint: "Speak or tap to add items",
  subtotal: "Subtotal",
  total: "Total",
  checkout: "Checkout",
  start: "Start",
  listening: "Listening",
  idle: "Tap to begin voice ordering",
  listeningHint: "is listening.",
  confirmed: "Order confirmed",
  pay: "Total to pay",
  window: "Please proceed to the payment window.",
  next: "Next customer",
  cal: "cal",
  decrease: "Decrease",
  increase: "Increase",
};

const ar: LaneLabels = {
  end: "إنهاء الجلسة",
  signOut: "تسجيل الخروج",
  closing: "جارٍ إغلاق المسار",
  categories: "الأصناف",
  powered: "بدعم من",
  order: "الطلب",
  empty: "السلة فارغة",
  emptyHint: "تحدث أو اضغط لإضافة صنف",
  subtotal: "المجموع الفرعي",
  total: "الإجمالي",
  checkout: "الدفع",
  start: "ابدأ",
  listening: "نستمع",
  idle: "اضغط لبدء الطلب الصوتي",
  listeningHint: "يستمع الآن.",
  confirmed: "تم تأكيد الطلب",
  pay: "المبلغ المطلوب",
  window: "توجه إلى نافذة الدفع.",
  next: "العميل التالي",
  cal: "سعرة",
  decrease: "أنقص",
  increase: "زد",
};

export function laneLabels(locale: string): LaneLabels {
  return locale === "ar" ? ar : en;
}
