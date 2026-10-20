import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { categories } from "@/content/categories";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");
  return [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/produtos`, changeFrequency: "monthly", priority: 0.9 },
    ...categories.map((c) => ({
      url: `${base}/produtos/${c.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${base}/politica-de-privacidade`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
