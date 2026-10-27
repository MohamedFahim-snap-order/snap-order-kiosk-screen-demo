import type { Metadata } from "next";
import { Noto_Sans_Arabic, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { loadBootstrap } from "@/features/kiosk-session/services/bootstrap.service";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

const arabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: "SnapOrder Kiosk", template: "%s · SnapOrder Kiosk" },
  description: "Sign in to a SnapOrder car-lane kiosk. The lane layout, language, and colors come from the vendor tied to that kiosk account.",
  applicationName: "SnapOrder Kiosk",
  robots: { index: true, follow: true },
  alternates: { canonical: "/sign-in" },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const bootstrap = await loadBootstrap();
  const locale = bootstrap.ok ? bootstrap.config.locale : "en";
  const dir = bootstrap.ok ? bootstrap.config.dir : "ltr";

  return (
    <html lang={locale} dir={dir} className={`${jakarta.variable} ${arabic.variable}`}>
      <body>
        {children}
        <Toaster position="top-center" theme="system" richColors closeButton />
      </body>
    </html>
  );
}
