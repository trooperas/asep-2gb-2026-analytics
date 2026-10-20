import { MetadataRoute } from "next";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://asepanalytics.app";

  // Στατικές σελίδες
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/proetoimasia`, lastModified: new Date(), changeFrequency: "daily", priority: 0.98 },
    { url: `${baseUrl}/xartis`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/kenes-theseis`, lastModified: new Date(), changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/zitisi`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/stats`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  // 11 Κατηγορίες Προετοιμασίας
  try {
    const catPath = join(process.cwd(), "public", "data", "quiz_categories.json");
    if (existsSync(catPath)) {
      const cats = JSON.parse(readFileSync(catPath, "utf-8"));
      cats.forEach((c: any) => {
        staticPages.push({
          url: `${baseUrl}/proetoimasia/${c.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.9,
        });
      });
    }
  } catch (err) {
    console.error("Sitemap category error:", err);
  }

  // 52 Ειδικότητες
  let eidikotitesPages: MetadataRoute.Sitemap = [];
  try {
    const indexPath = join(process.cwd(), "public", "data", "eidikotites_index.json");
    if (existsSync(indexPath)) {
      const eidikotites = JSON.parse(readFileSync(indexPath, "utf-8"));
      eidikotitesPages = eidikotites.map((e: { slug: string }) => ({
        url: `${baseUrl}/eidikotita/${e.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.85,
      }));
    }
  } catch (err) {
    console.error("Sitemap eidikotita error:", err);
  }

  // Προσθήκη όλων των ερωτήσεων προετοιμασίας στο sitemap
  try {
    const quizzesPath = join(process.cwd(), "public", "data", "quizzes_clean.json");
    if (existsSync(quizzesPath)) {
      const questions = JSON.parse(readFileSync(quizzesPath, "utf-8")) as Array<{
        id: string;
        category_slug: string;
      }>;

      for (const q of questions) {
        staticPages.push({
          url: `${baseUrl}/proetoimasia/${q.category_slug}/${q.id}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.5,
        });
      }
    }
  } catch (e) {
    console.error("Sitemap questions error:", e);
  }

  return [...staticPages, ...eidikotitesPages];
}