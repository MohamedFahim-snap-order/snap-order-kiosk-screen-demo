import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import { loadBootstrap } from "@/features/kiosk-session/services/bootstrap.service";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const jakarta = localFont({
  src: "./fonts/jakarta-latin.woff2",
  weight: "400 700",
  variable: "--font-jakarta",
  display: "swap",
});

const arabic = localFont({
  src: "./fonts/noto-arabic.woff2",
  weight: "400 700",
  variable: "--font-arabic",
  display: "swap",
});

const description = "Sign in to a SnapOrder car-lane kiosk. The lane layout, language, and colors come from the vendor tied to that kiosk account.";

export async function generateViewport(): Promise<Viewport> {
  const bootstrap = await loadBootstrap();
  const dark = bootstrap.ok && bootstrap.config.theme.scheme === "dark";
  const half = bootstrap.ok && bootstrap.config.templateId === "half-million";
  return { themeColor: dark ? (half ? "#0b1012" : "#2b2825") : "#f8f8f2" };
}

export async function generateMetadata(): Promise<Metadata> {
  const bootstrap = await loadBootstrap();
  const locale = bootstrap.ok ? bootstrap.config.locale : "en";

  return {
    metadataBase: new URL(siteUrl()),
    title: { default: "SnapOrder Kiosk", template: "%s · SnapOrder Kiosk" },
    description,
    applicationName: "SnapOrder Kiosk",
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    openGraph: {
      type: "website",
      siteName: "SnapOrder Kiosk",
      title: "SnapOrder Kiosk",
      description,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      alternateLocale: [locale === "ar" ? "en_US" : "ar_SA"],
    },
    twitter: { card: "summary", title: "SnapOrder Kiosk", description },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const bootstrap = await loadBootstrap();
  const locale = bootstrap.ok ? bootstrap.config.locale : "en";
  const dir = bootstrap.ok ? bootstrap.config.dir : "ltr";
  const scheme = bootstrap.ok ? bootstrap.config.theme.scheme : "light";

  return (
    <html lang={locale} dir={dir} data-scheme={scheme} className={`${jakarta.variable} ${arabic.variable}`}>
      <body>
        {children}
        <Toaster position="top-center" theme={scheme} richColors closeButton />
      </body>
    </html>
  );
}
