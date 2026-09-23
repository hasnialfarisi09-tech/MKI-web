import type { MetadataRoute } from "next";
import { company } from "@/constants/company";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Allow all major crawlers
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",            // API routes (none currently, future-proof)
          "/admin/",          // Admin panel (none currently, future-proof)
          "/*.json$",         // Raw JSON files
        ],
      },
    ],
    sitemap: `${company.siteUrl}/sitemap.xml`,
    host: company.siteUrl,
  };
}

