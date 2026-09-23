import type { MetadataRoute } from "next";
import { company } from "@/constants/company";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = company.siteUrl;

  return [
    {
      url: base,
      lastModified: new Date("2026-06-14"),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${base}/portfolio`,
      lastModified: new Date("2026-06-14"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
