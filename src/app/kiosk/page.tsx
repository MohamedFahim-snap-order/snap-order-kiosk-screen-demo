import type { Metadata } from "next";
import { KioskExperience } from "@/features/conversation/components/KioskExperience";
import { KioskProviders } from "@/features/conversation/components/KioskProviders";
import { loadBootstrap } from "@/features/kiosk-session/services/bootstrap.service";
import { signOutAction } from "@/features/auth/actions/auth.actions";
import { messages } from "@/shared/i18n/messages";

export const metadata: Metadata = {
  title: "Lane",
};

export default async function KioskPage() {
  const result = await loadBootstrap();

  if (!result.ok) {
    const copy = messages.en;
    return (
      <main className="recovery">
        <h1>{copy.bootstrapTitle}</h1>
        <p role="alert">{result.message}</p>
        <form action={signOutAction}>
          <button type="submit">{copy.signOut}</button>
        </form>
      </main>
    );
  }

  return (
    <KioskProviders>
      <KioskExperience config={result.config} />
    </KioskProviders>
  );
}
