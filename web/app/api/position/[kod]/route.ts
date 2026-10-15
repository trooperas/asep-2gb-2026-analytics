import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

// In-memory cache for positions metadata
let positionsCache: any[] | null = null;

function getPositions(): any[] {
  if (!positionsCache) {
    try {
      const path = join(process.cwd(), "public", "data", "positions.json");
      positionsCache = JSON.parse(readFileSync(path, "utf-8"));
    } catch {
      positionsCache = [];
    }
  }
  return positionsCache!;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ kod: string }> }
) {
  const { kod } = await params;
  if (!kod) {
    return NextResponse.json({ error: "Missing kod" }, { status: 400 });
  }

  const targetKod = String(kod).replace(/\.0$/, "").trim();

  try {
    // 1. Φόρτωση metadata θέσης από in-memory cache
    const positionsList = getPositions();
    const posMeta = positionsList.find(
      (p: any) => String(p.kod_thesis).replace(/\.0$/, "").trim() === targetKod
    );

    // 2. Φόρτωση διορισθέντων από τα chunks
    const chunkIndexPath = join(process.cwd(), "public", "data", "chunk_index.json");
    if (!existsSync(chunkIndexPath)) {
      return NextResponse.json({ error: "Data index missing" }, { status: 500 });
    }

    const chunkIndex: Record<string, string[]> = JSON.parse(
      readFileSync(chunkIndexPath, "utf-8")
    );
    const chunksDir = join(process.cwd(), "public", "data", "chunks");

    // Map με κλειδί το AM: ΑΠΟΚΛΕΙΣΜΟΣ ΔΙΠΛΟΤΥΠΩΝ & κράτημα μεγαλύτερης βαθμολογίας
    const uniqueCandidatesMap = new Map<string, any>();

    for (const [slug, chunks] of Object.entries(chunkIndex)) {
      for (const chunkName of chunks) {
        const chunkPath = join(chunksDir, chunkName);
        if (!existsSync(chunkPath)) continue;

        const chunk = JSON.parse(readFileSync(chunkPath, "utf-8"));
        for (const r of chunk) {
          const thesi = String(r.thesi_diorismou || "").replace(/\.0$/, "").trim();
          if (thesi === targetKod) {
            const cleanAm = String(r.am).replace(/\.0$/, "").trim();
            const currentScore = parseFloat(r.vathmologia) || 0;

            const candidateObj = {
              ...r,
              am: cleanAm,
              eponymo: r.eponymo,
              onoma: r.onoma,
              vathmologia: currentScore,
              aa: r.aa,
              eidikotita: r.eidikotita,
              slug,
              kod_thesis: thesi,
              cleanScore: currentScore,
            };

            if (!uniqueCandidatesMap.has(cleanAm)) {
              uniqueCandidatesMap.set(cleanAm, candidateObj);
            } else {
              // Αν υπάρχει ήδη, κράτα αυτό με το υψηλότερο σκορ (με την εντοπιότητα/προσόντα)
              const existing = uniqueCandidatesMap.get(cleanAm);
              if (currentScore > existing.cleanScore) {
                uniqueCandidatesMap.set(cleanAm, candidateObj);
              }
            }
          }
        }
      }
    }

    // Μετατροπή σε ταξινομημένη λίστα (φθίνουσα βαθμολογία)
    const uniqueCandidates = Array.from(uniqueCandidatesMap.values()).sort(
      (a, b) => b.cleanScore - a.cleanScore
    );

    // Υπολογισμός πραγματικών στατιστικών θέσης
    const scores = uniqueCandidates.map((c) => c.cleanScore).filter((s) => s > 0);
    const count = uniqueCandidates.length;
    const minScore = scores.length ? Math.min(...scores) : 0;
    const maxScore = scores.length ? Math.max(...scores) : 0;
    const avgScore = scores.length
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : 0;

    return NextResponse.json(
      {
        kod: targetKod,
        meta: posMeta || null,
        stats: {
          count,
          min: minScore,
          max: maxScore,
          avg: avgScore,
        },
        candidates: uniqueCandidates,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      }
    );
  } catch (error: any) {
    console.error("Position API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}