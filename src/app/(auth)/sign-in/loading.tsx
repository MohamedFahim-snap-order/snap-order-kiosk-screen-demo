import { LaneTransit } from "@/features/auth/components/LaneTransit";
import { readTransitLocale } from "@/lib/auth/session";

export default async function SignInLoading() {
  const locale = await readTransitLocale();
  const label = locale === "ar" ? "جارٍ إغلاق المسار" : "Closing the lane";
  return <LaneTransit label={label} />;
}
