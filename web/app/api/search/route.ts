import { NextResponse } from "next/server";
import { fetchDataJson } from "@/lib/data-assets";

let searchIndexCache: Promise<any[]> | null = null;
let slugMapCache: Promise<Record<string, string>> | null = null;
let positionsListCache: Promise<any[]> | null = null;

function getSearchIndex(request: Request): Promise<any[]> {
  if (!searchIndexCache) {
    searchIndexCache = fetchDataJson<any[]>("search_index.json", {
      request,
    }).catch((error) => {
      searchIndexCache = null;
      throw error;
    });
  }
  return searchIndexCache;
}

function getPositionsList(request: Request): Promise<any[]> {
  if (!positionsListCache) {
    positionsListCache = fetchDataJson<any[]>("positions.json", {
      request,
    }).catch((error) => {
      positionsListCache = null;
      throw error;
    });
  }
  return positionsListCache;
}

function getSlugMap(request: Request): Promise<Record<string, string>> {
  if (!slugMapCache) {
    slugMapCache = fetchDataJson<any[]>("eidikotites_index.json", { request })
      .then((list) => {
        const map: Record<string, string> = {};
        for (const item of list) {
          if (item.slug && item.eidikotita) {
            map[item.slug] = item.eidikotita;
          }
        }
        return map;
      })
      .catch((error) => {
        slugMapCache = null;
        throw error;
      });
  }
  return slugMapCache;
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
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ results: [], matchedPositions: [] });
  }

  const queryNorm = normalize(q);

  try {
    const [index, slugMap, positionsList] = await Promise.all([
      getSearchIndex(request),
      getSlugMap(request),
      getPositionsList(request),
    ]);

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
  } catch (error) {
    console.error("[api/search] Failed to load data assets:", error);
    return NextResponse.json(
      {
        error: "Search data unavailable",
        detail:
          error instanceof Error ? error.message : "Unknown data loading error",
      },
      { status: 500 }
    );
  }
}
