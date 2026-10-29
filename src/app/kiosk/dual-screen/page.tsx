import type { Metadata } from "next";
import Link from "next/link";
import { loadBootstrap } from "@/features/kiosk-session/services/bootstrap.service";
import { DualDisplay } from "@/features/dual-display/DualDisplay";

export const metadata: Metadata = {
  title: "Snap Coffee · Outdoor Drive-Thru",
  description: "An outdoor drive-through installation with menu signage beside the SnapOrder voice-ordering screen.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/kiosk/dual-screen" },
};

export default async function DualScreenPage() {
  const bootstrap = await loadBootstrap();

  if (!bootstrap.ok) {
    return (
      <main className="recovery">
        <h1>Let’s get your lane ready.</h1>
        <p role="alert">{bootstrap.message}</p>
        <Link href="/kiosk">Back to the kiosk</Link>
      </main>
    );
  }

  return <DualDisplay initialLocale={bootstrap.config.locale} branchName={bootstrap.config.branch.name} />;
}
