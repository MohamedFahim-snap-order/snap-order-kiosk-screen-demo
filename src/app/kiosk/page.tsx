import type { Metadata } from "next";
import { KioskExperience } from "@/features/conversation/components/KioskExperience";
import { KioskProviders } from "@/features/conversation/components/KioskProviders";
import { loadBootstrap } from "@/features/kiosk-session/services/bootstrap.service";
import { SignOutForm } from "@/features/auth/components/SignOutForm";
import { siteUrl } from "@/lib/site-url";
import { messages } from "@/shared/i18n/messages";

export async function generateMetadata(): Promise<Metadata> {
  const result = await loadBootstrap();
  const half = result.ok && result.config.templateId === "half-million";
  const vendor = result.ok ? result.config.vendor.name : "SnapOrder";

  return {
    title: half ? vendor : "Snap Coffee · Your coffee. Your way.",
    description: half
      ? "Half Million drive-thru lane. The screen is English. Light or dark comes from the kiosk account. Item names show English and Arabic."
      : "Snap Coffee drive-thru lane. The screen is English. Light or dark comes from the kiosk account. Item names show English and Arabic.",
    robots: { index: true, follow: true },
    alternates: { canonical: "/kiosk" },
  };
}

export default async function KioskPage() {
  const result = await loadBootstrap();

  if (!result.ok) {
    const copy = messages.en;
    return (
      <main className="recovery">
        <h1>{copy.bootstrapTitle}</h1>
        <p role="alert">{result.message}</p>
        <SignOutForm label={copy.signOut} pendingLabel="Closing the lane" />
      </main>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "SnapOrder Kiosk",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    inLanguage: [result.config.locale],
    url: new URL("/kiosk", siteUrl()).toString(),
    description: "Car-lane screen. The account chooses the lane template and light or dark. The screen stays English. Item names show English and Arabic.",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <KioskProviders>
        <KioskExperience config={result.config} />
      </KioskProviders>
    </>
  );
}
