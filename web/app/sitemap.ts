import type { MetadataRoute } from "next";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const baseUrl = "https://asepanalytics.app";

/**
 * Canonical static routes only.
 * Excluded on purpose: /ypopsifios/* (noindex), /chat (paused), /search
 * (noindex) and redirect URLs.
 */
const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: `${baseUrl}/`, changeFrequency: "daily", priority: 1.0 },
  { url: `${baseUrl}/proetoimasia`, changeFrequency: "daily", priority: 0.98 },
  { url: `${baseUrl}/proetoimasia/ergasiakes-deksiotites`, changeFrequency: "weekly", priority: 0.95 },
  { url: `${baseUrl}/proetoimasia/epagogikos-syllogismos`, changeFrequency: "weekly", priority: 0.95 },
  { url: `${baseUrl}/stats`, changeFrequency: "weekly", priority: 0.8 },
  { url: `${baseUrl}/xartis`, changeFrequency: "weekly", priority: 0.9 },
  { url: `${baseUrl}/kenes-theseis`, changeFrequency: "daily", priority: 0.95 },
  { url: `${baseUrl}/zitisi`, changeFrequency: "weekly", priority: 0.9 },
  { url: `${baseUrl}/data`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${baseUrl}/privacy`, changeFrequency: "monthly", priority: 0.3 },
];

function readDataFile<T>(fileName: string): T | null {
  try {
    const filePath = join(process.cwd(), "public", "data", fileName);
    if (!existsSync(filePath)) return null;
    return JSON.parse(readFileSync(filePath, "utf-8")) as T;
  } catch (error) {
    console.error(`Sitemap: could not read ${fileName}`, error);
    return null;
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const pages: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    ...route,
    lastModified,
  }));

  // 11 κατηγορίες προετοιμασίας: /proetoimasia/${slug}
  const categories = readDataFile<Array<{ slug?: string }>>(
    "quiz_categories.json"
  );
  for (const { slug } of categories ?? []) {
    if (!slug) continue;
    pages.push({
      url: `${baseUrl}/proetoimasia/${encodeURIComponent(slug)}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  // Ερωτήσεις προετοιμασίας: /proetoimasia/${category_slug}/${id}
  const questions = readDataFile<
    Array<{ id?: string | number; category_slug?: string }>
  >("quizzes_clean.json");
  const seenQuestions = new Set<string>();
  for (const { id, category_slug } of questions ?? []) {
    const questionId = String(id ?? "").trim();
    const categorySlug = String(category_slug ?? "").trim();
    if (!questionId || !categorySlug) continue;

    const key = `${categorySlug}/${questionId}`;
    if (seenQuestions.has(key)) continue;
    seenQuestions.add(key);

    pages.push({
      url: `${baseUrl}/proetoimasia/${encodeURIComponent(
        categorySlug
      )}/${encodeURIComponent(questionId)}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  // 52 ειδικότητες: /eidikotita/${slug}
  const eidikotites = readDataFile<Array<{ slug?: string }>>(
    "eidikotites_index.json"
  );
  for (const { slug } of eidikotites ?? []) {
    if (!slug) continue;
    pages.push({
      url: `${baseUrl}/eidikotita/${encodeURIComponent(slug)}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.85,
    });
  }

  // 2.723 θέσεις: /thesi/${kod_thesis}
  const positions = readDataFile<Array<{ kod_thesis?: string | number }>>(
    "positions.json"
  );
  const seenCodes = new Set<string>();
  for (const { kod_thesis } of positions ?? []) {
    const kod = String(kod_thesis ?? "").trim();
    if (!kod || seenCodes.has(kod)) continue;
    seenCodes.add(kod);
    pages.push({
      url: `${baseUrl}/thesi/${encodeURIComponent(kod)}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return pages;
}
