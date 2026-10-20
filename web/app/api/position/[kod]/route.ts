import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

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
    const positionsList = getPositions();
    const posMeta = positionsList.find(
      (p: any) => String(p.kod_thesis).replace(/\.0$/, "").trim() === targetKod
    );

    if (!posMeta) {
      return NextResponse.json({ error: "Position not found" }, { status: 404 });
    }

    const chunkIndexPath = join(process.cwd(), "public", "data", "chunk_index.json");
    if (!existsSync(chunkIndexPath)) {
      return NextResponse.json({ error: "Data index missing" }, { status: 500 });
    }

    const chunkIndex: Record<string, string[]> = JSON.parse(
      readFileSync(chunkIndexPath, "utf-8")
    );
    const chunksDir = join(process.cwd(), "public", "data", "chunks");

    // 1. Διορισθέντες στη θέση (Deduplicated ανά AM)
    const uniqueAppointedMap = new Map<string, any>();
    // 2. Όλοι όσοι δήλωσαν τη θέση στις προτιμήσεις τους (Applicants)
    const uniqueApplicantsMap = new Map<string, any>();

    for (const [slug, chunks] of Object.entries(chunkIndex)) {
      for (const chunkName of chunks) {
        const chunkPath = join(chunksDir, chunkName);
        if (!existsSync(chunkPath)) continue;

        const chunk = JSON.parse(readFileSync(chunkPath, "utf-8"));
        for (const r of chunk) {
          const thesi = String(r.thesi_diorismou || "").replace(/\.0$/, "").trim();
          const cleanAm = String(r.am).replace(/\.0$/, "").trim();
          const currentScore = parseFloat(r.vathmologia) || 0;
          const protimiseisStr = String(r.protimiseis || "");

          const candidateObj = {
            am: cleanAm,
            eponymo: r.eponymo,
            onoma: r.onoma,
            patronymo: r.patronymo,
            vathmologia: currentScore,
            aa: r.aa,
            eidikotita: r.eidikotita,
            slug,
            kod_thesis: thesi,
            cleanScore: currentScore,
          };

          // Έλεγχος διορισμού
          if (thesi === targetKod) {
            if (!uniqueAppointedMap.has(cleanAm)) {
              uniqueAppointedMap.set(cleanAm, candidateObj);
            } else {
              const existing = uniqueAppointedMap.get(cleanAm);
              if (currentScore > existing.cleanScore) {
                uniqueAppointedMap.set(cleanAm, candidateObj);
              }
            }
          }

          // Έλεγχος αν δήλωσε τη θέση στις προτιμήσεις του
          if (protimiseisStr && protimiseisStr.includes(targetKod)) {
            const prefs = protimiseisStr.split(/[-,\s]+/).map((k) => k.replace(/\.0$/, "").trim());
            const prefIndex = prefs.indexOf(targetKod);
            if (prefIndex !== -1) {
              const appObj = {
                ...candidateObj,
                prefNumber: prefIndex + 1,
                isAppointedHere: thesi === targetKod,
                isAppointedElsewhere: thesi && thesi !== targetKod,
                appointedElsewhereCode: thesi && thesi !== targetKod ? thesi : null,
              };

              if (!uniqueApplicantsMap.has(cleanAm)) {
                uniqueApplicantsMap.set(cleanAm, appObj);
              } else {
                const existing = uniqueApplicantsMap.get(cleanAm);
                if (currentScore > existing.cleanScore) {
                  uniqueApplicantsMap.set(cleanAm, appObj);
                }
              }
            }
          }
        }
      }
    }

    // Ταξινόμηση διορισμένων
    const uniqueAppointed = Array.from(uniqueAppointedMap.values()).sort(
      (a, b) => b.cleanScore - a.cleanScore
    );

    // Ταξινόμηση όλων των διεκδικητών κατά φθίνουσα βαθμολογία
    const uniqueApplicants = Array.from(uniqueApplicantsMap.values()).sort(
      (a, b) => b.cleanScore - a.cleanScore
    );

    const scores = uniqueAppointed.map((c) => c.cleanScore).filter((s) => s > 0);
    const total = uniqueAppointed.length;
    const min_vath = scores.length ? Math.min(...scores) : null;
    const max_vath = scores.length ? Math.max(...scores) : null;
    const avg_vath = scores.length
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : null;

    return NextResponse.json(
      {
        position: posMeta,
        candidates: uniqueAppointed,
        applicants: uniqueApplicants.slice(0, 80), // 👈 Όλοι όσοι δήλωσαν τη θέση (top 80)
        totalApplicantsCount: uniqueApplicants.length,
        stats: {
          total,
          min_vath,
          max_vath,
          avg_vath,
        },
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