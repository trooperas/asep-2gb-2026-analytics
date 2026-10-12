import { MetadataRoute } from "next";
import { readFileSync } from "fs";
import { join } from "path";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://asep-2gb-2026.vercel.app";

  // Στατικές σελίδες
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/xartis`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/stats`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/chat`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  // Δυναμικές σελίδες για όλες τις 52 ειδικότητες
  let eidikotitesPages: MetadataRoute.Sitemap = [];
  try {
    const indexPath = join(process.cwd(), "public", "data", "eidikotites_index.json");
    const eidikotites = JSON.parse(readFileSync(indexPath, "utf-8"));
    
    eidikotitesPages = eidikotites.map((e: { slug: string }) => ({
      url: `${baseUrl}/eidikotita/${e.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));
  } catch (err) {
    console.error("Sitemap generation error:", err);
  }

  return [...staticPages, ...eidikotitesPages];
}