import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

let searchIndexCache: any[] | null = null;

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
    return NextResponse.json({ results: [] });
  }

  const queryNorm = normalize(q);
  const index = getSearchIndex();

  // 1. Βρίσκουμε όλες τις εγγραφές που ταιριάζουν
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

  // 2. DEDUPLICATION ΑΝΑ Α.Μ. (Μία κάρτα ανά φυσικό πρόσωπο)
  const uniqueCandidatesMap = new Map<string, any>();

  for (const m of matches) {
    const cleanAm = String(m.am).replace(/\.0$/, "").trim();

    if (!uniqueCandidatesMap.has(cleanAm)) {
      uniqueCandidatesMap.set(cleanAm, {
        am: cleanAm,
        eponymo: m.eponymo,
        onoma: m.onoma,
        patronymo: m.patronymo,
        specialties: [m.eidikotita || m.slug],
        slug: m.slug,
        thesi_diorismou: m.thesi_diorismou || null,
        vathmologia: m.vathmologia || null,
        aa: m.aa,
      });
    } else {
      // Αν υπάρχει ήδη, πρόσθεσε την επιπλέον ειδικότητα στη λίστα του!
      const existing = uniqueCandidatesMap.get(cleanAm);
      const specName = m.eidikotita || m.slug;
      if (specName && !existing.specialties.includes(specName)) {
        existing.specialties.push(specName);
      }
      // Αν σε αυτή τη γραμμή είναι διοριστέος, κράτα τη θέση διορισμού
      if (m.thesi_diorismou && !existing.thesi_diorismou) {
        existing.thesi_diorismou = m.thesi_diorismou;
        existing.slug = m.slug;
      }
    }
  }

  const results = Array.from(uniqueCandidatesMap.values()).slice(0, 30);

  return NextResponse.json(
    { results },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}