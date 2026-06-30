import type { MetadataRoute } from "next";
import { siteHost, siteUrl } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/cart"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteHost,
  };
}
