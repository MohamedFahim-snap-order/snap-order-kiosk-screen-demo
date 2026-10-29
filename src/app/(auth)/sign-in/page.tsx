import type { Metadata } from "next";
import { AuthScreen } from "@/features/auth/components/AuthScreen";
import { messages } from "@/shared/i18n/messages";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Staff sign-in for a SnapOrder car-lane kiosk. The customer in the car does not sign in.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/sign-in" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SnapOrder Kiosk",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: "Car-lane kiosk sign-in. After sign-in, layout and colors come from the vendor payload.",
};

export default function SignInPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AuthScreen messages={messages.en} />
    </>
  );
}
