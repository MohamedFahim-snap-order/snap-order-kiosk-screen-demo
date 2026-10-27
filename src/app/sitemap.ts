import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [{ url: new URL("/sign-in", base).toString(), changeFrequency: "monthly", priority: 0.6 }];
}
