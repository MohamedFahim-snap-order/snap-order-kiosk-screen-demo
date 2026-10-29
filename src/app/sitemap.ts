import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const lastModified = new Date();
  return [
    { url: new URL("/sign-in", base).toString(), lastModified, changeFrequency: "monthly", priority: 1 },
    { url: new URL("/kiosk", base).toString(), lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: new URL("/kiosk/dual-screen", base).toString(), lastModified, changeFrequency: "monthly", priority: 0.5 },
  ];
}
