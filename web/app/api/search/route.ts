import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

let searchIndexCache: any[] | null = null;
let slugMapCache: Record<string, string> | null = null;
let positionsListCache: any[] | null = null;

function getSearchIndex(): any[] {
  if (!searchIndexCache) {
    try {
      const p = join(process.cwd(), "public", "data", "search_index.json");
      searchIndexCache = JSON.parse(readFileSync(p, "utf-8"));
    } catch {
      searchIndexCache = [];
    }
  }
  return searchIndexCache || [];
}

function getPositionsList(): any[] {
  if (!positionsListCache) {
    try {
      const p = join(process.cwd(), "public", "data", "positions.json");
      positionsListCache = JSON.parse(readFileSync(p, "utf-8"));
    } catch {
      positionsListCache = [];
    }
  }
  return positionsListCache || [];
}

function getSlugMap(): Record<string, string> {
  if (!slugMapCache) {
    try {
      const p = join(process.cwd(), "public", "data", "eidikotites_index.json");
      const list = JSON.parse(readFileSync(p, "utf-8"));
      slugMapCache = {};
      for (const item of list) {
        if (item.slug && item.eidikotita) {
          slugMapCache[item.slug] = item.eidikotita;
        }
      }
    } catch {
      slugMapCache = {};
    }
  }
  return slugMapCache || {};
}

function cleanGreekTitle(slug: string, slugMap: Record<string, string>): string {
  if (slugMap[slug]) {
    return slugMap[slug]
      .replace(/^ΠΕ\s+ΓΕΩΤΕΧΝΙΚΩΝ\s+ΕΙΔ\.\s+/i, "")
      .replace(/^ΠΕ\s+ΜΗΧΑΝΙΚΩΝ\s+ΕΙΔ\.\s+/i, "")
      .replace(/^ΠΕ\s+ΔΙΟΙΚΗΤΙΚΟΥ-ΟΙΚΟΝΟΜΙΚΟΥ\s+ΕΙΔ\.\s+/i, "")
      .replace(/^ΠΕ\s+/i, "ΠΕ ");
  }

  return slug
    .replace(/^pe-geotechnikon-eid-pe-/, "ΠΕ ")
    .replace(/^pe-michanikon-eid-pe-/, "ΠΕ ")
    .replace(/^pe-dioikitikoy-oikonomikoy-eid-pe-/, "ΠΕ ")
    .replace(/^pe-/, "ΠΕ ")
    .replace(/-/g, " ")
    .toUpperCase();
}

function normalize(text: string): string {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ results: [], matchedPositions: [] });
  }

  const queryNorm = normalize(q);
  const index = getSearchIndex();
  const slugMap = getSlugMap();

  // 1. Εύρεση Υποψηφίων
  const matches = index.filter((item) => {
    const amNorm = String(item.am || "").replace(/\.0$/, "").trim();
    const epNorm = normalize(item.eponymo || "");
    const onNorm = normalize(item.onoma || "");
    const fullName = `${epNorm} ${onNorm}`;

    return (
      amNorm.startsWith(queryNorm) ||
      epNorm.includes(queryNorm) ||
      onNorm.includes(queryNorm) ||
      fullName.includes(queryNorm)
    );
  });

  // 2. Deduplication υποψηφίων ανά Α.Μ.
  const uniqueCandidatesMap = new Map<string, any>();

  for (const m of matches) {
    const cleanAm = String(m.am).replace(/\.0$/, "").trim();
    const cleanSpecialtyName = cleanGreekTitle(m.slug || "", slugMap);

    if (!uniqueCandidatesMap.has(cleanAm)) {
      uniqueCandidatesMap.set(cleanAm, {
        am: cleanAm,
        eponymo: m.eponymo,
        onoma: m.onoma,
        patronymo: m.patronymo,
        specialties: [cleanSpecialtyName],
        slug: m.slug,
        thesi_diorismou: m.thesi_diorismou || null,
        vathmologia: m.vathmologia || null,
        aa: m.aa,
      });
    } else {
      const existing = uniqueCandidatesMap.get(cleanAm);
      if (!existing.specialties.includes(cleanSpecialtyName)) {
        existing.specialties.push(cleanSpecialtyName);
      }
      if (m.thesi_diorismou && !existing.thesi_diorismou) {
        existing.thesi_diorismou = m.thesi_diorismou;
        existing.slug = m.slug;
        existing.vathmologia = m.vathmologia;
      }
    }
  }

  const results = Array.from(uniqueCandidatesMap.values()).slice(0, 30);

  // 3. Εύρεση Θέσεων αν η αναζήτηση περιέχει κωδικό θέσης (αριθμό)
  const positionsList = getPositionsList();
  const matchedPositions = positionsList
    .filter((p: any) =>
      String(p.kod_thesis || "").replace(/\.0$/, "").trim().startsWith(queryNorm)
    )
    .slice(0, 4)
    .map((p: any) => ({
      kod_thesis: String(p.kod_thesis).replace(/\.0$/, "").trim(),
      foreas: p.foreas,
      eidikotita: p.eidikotita,
      perifereia: p.perifereia,
      theseis: p.theseis,
    }));

  return NextResponse.json(
    { results, matchedPositions },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}