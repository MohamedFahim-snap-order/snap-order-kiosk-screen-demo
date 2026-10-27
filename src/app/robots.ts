import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: ["/sign-in"], disallow: ["/kiosk", "/api/"] }],
    sitemap: new URL("/sitemap.xml", siteUrl()).toString(),
  };
}
