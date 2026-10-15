import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

// In-memory cache για θέσεις και chunks
let positionsCache: any[] | null = null;
let chunkIndexCache: Record<string, string[]> | null = null;

function getPositions(): any[] {
  if (!positionsCache) {
    try {
      const p = join(process.cwd(), "public", "data", "positions.json");
      positionsCache = JSON.parse(readFileSync(p, "utf-8"));
    } catch {
      positionsCache = [];
    }
  }
  return positionsCache!;
}

function getChunkIndex(): Record<string, string[]> {
  if (!chunkIndexCache) {
    try {
      const p = join(process.cwd(), "public", "data", "chunk_index.json");
      chunkIndexCache = JSON.parse(readFileSync(p, "utf-8"));
    } catch {
      chunkIndexCache = {};
    }
  }
  return chunkIndexCache!;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const chunkIndex = getChunkIndex();
  const chunkFiles = chunkIndex[slug];

  if (!chunkFiles || chunkFiles.length === 0) {
    return NextResponse.json({ error: "Specialty not found" }, { status: 404 });
  }

  try {
    const chunksDir = join(process.cwd(), "public", "data", "chunks");
    const allRecords: any[] = [];

    // Φόρτωση όλων των εγγραφών της ειδικότητας
    for (const chunkName of chunkFiles) {
      const cPath = join(chunksDir, chunkName);
      if (existsSync(cPath)) {
        const chunkData = JSON.parse(readFileSync(cPath, "utf-8"));
        allRecords.push(...chunkData);
      }
    }

    if (allRecords.length === 0) {
      return NextResponse.json({ error: "No records found" }, { status: 404 });
    }

    // 1. Βρίσκουμε ποιες θέσεις ανήκουν ΠΡΑΓΜΑΤΙΚΑ σε αυτή την ειδικότητα
    // από το positions.json (ή από τα groups προσόντων)
    const positionsList = getPositions();
    const specialtyPositionsSet = new Set<string>();

    // Προσθήκη θέσεων από το positions.json που έχουν αυτό το slug/ειδικότητα
    positionsList.forEach((pos: any) => {
      // Ελέγχουμε αν το όνομα ειδικότητας ταιριάζει
      const posSlug = String(pos.eidikotita || "").toLowerCase();
      if (posSlug.includes(slug.replace(/^pe-/, "").split("-")[0])) {
        specialtyPositionsSet.add(String(pos.kod_thesis).replace(/\.0$/, "").trim());
      }
    });

    // Συμπληρωματικά: θέσεις που αναφέρονται στις ίδιες ομάδες προσόντων των υποψηφίων
    allRecords.forEach((r) => {
      const theseisOmadas = String(r.theseis_idias_omadas || "");
      if (theseisOmadas) {
        theseisOmadas.split(/[-,\s]+/).forEach((k) => {
          const cleanK = k.replace(/\.0$/, "").trim();
          if (cleanK) specialtyPositionsSet.add(cleanK);
        });
      }
    });

    // 2. ΦΙΛΤΡΑΡΙΣΜΑ: Διοριστέος στην ειδικότητα θεωρείται ΜΟΝΟ όποιος διορίστηκε
    // σε θέση που ανήκει σε ΑΥΤΗΝ την ειδικότητα!
    const realAppointedInThisSpecialty = allRecords.filter((r) => {
      if (!r.thesi_diorismou) return false;
      const thesiKod = String(r.thesi_diorismou).replace(/\.0$/, "").trim();
      
      // Πρέπει η θέση διορισμού του να είναι στις θέσεις αυτής της ειδικότητας!
      return specialtyPositionsSet.has(thesiKod);
    });

    // 3. Στατιστικά και Top 20 Διοριστέοι
    // Ταξινόμηση διοριστέων κατά φθίνουσα βαθμολογία
    realAppointedInThisSpecialty.sort(
      (a, b) => (parseFloat(b.vathmologia) || 0) - (parseFloat(a.vathmologia) || 0)
    );

    const appointedScores = realAppointedInThisSpecialty
      .map((r) => parseFloat(r.vathmologia))
      .filter((s) => !isNaN(s) && s > 0);

    const totalCount = allRecords.length;
    const dioristoiCount = realAppointedInThisSpecialty.length;
    const pososto = totalCount > 0 ? (dioristoiCount / totalCount) * 100 : 0;

    const min_vath = appointedScores.length ? Math.min(...appointedScores) : 0;
    const max_vath = appointedScores.length ? Math.max(...appointedScores) : 0;
    const avg_vath = appointedScores.length
      ? appointedScores.reduce((a, b) => a + b, 0) / appointedScores.length
      : 0;

    // Κατανομή βαθμολογίας
    const distribution: Record<string, number> = {
      "0-49": 0, "50-59": 0, "60-69": 0, "70-79": 0,
      "80-89": 0, "90-99": 0, "100-109": 0, "110-119": 0,
      "120-129": 0, "130-139": 0, "140+": 0,
    };

    allRecords.forEach((r) => {
      const v = parseFloat(r.vathmologia) || 0;
      if (v < 50) distribution["0-49"]++;
      else if (v < 60) distribution["50-59"]++;
      else if (v < 70) distribution["60-69"]++;
      else if (v < 80) distribution["70-79"]++;
      else if (v < 90) distribution["80-89"]++;
      else if (v < 100) distribution["90-99"]++;
      else if (v < 110) distribution["100-109"]++;
      else if (v < 120) distribution["110-119"]++;
      else if (v < 130) distribution["120-129"]++;
      else if (v < 140) distribution["130-139"]++;
      else distribution["140+"]++;
    });

    // Εντοπιότητα
    const entopiotita: Record<string, number> = {};
    allRecords.forEach((r) => {
      const k = String(r.kod_entopiotitas || "0").replace(".0", "").trim() || "0";
      entopiotita[k] = (entopiotita[k] || 0) + 1;
    });

    // Θέσεις με διορισμούς στην ειδικότητα
    const theseisMap: Record<string, number> = {};
    realAppointedInThisSpecialty.forEach((r) => {
      const kod = String(r.thesi_diorismou).replace(/\.0$/, "").trim();
      theseisMap[kod] = (theseisMap[kod] || 0) + 1;
    });

    const theseisList = Object.entries(theseisMap)
      .map(([kod, count]) => ({ kod, count }))
      .sort((a, b) => b.count - a.count);

    // Τίτλοι & Προσόντα
    let metaptyxiako = 0;
    let didaktoriko = 0;
    let xeni_glossa = 0;
    let empeiria = 0;

    allRecords.forEach((r) => {
      if (r.metaptyxiako) metaptyxiako++;
      if (r.didaktoriko) didaktoriko++;
      if (r.xeni_glossa) xeni_glossa++;
      if (r.monades_empeirias && parseFloat(r.monades_empeirias) > 0) empeiria++;
    });

    return NextResponse.json(
      {
        slug,
        stats: {
          count: totalCount,
          dioristoi: dioristoiCount,
          pososto,
          min_vath,
          max_vath,
          avg_vath,
          me_metaptyxiako: metaptyxiako,
          me_didaktoriko: didaktoriko,
          me_entopiotita: (entopiotita["6"] || 0) + (entopiotita["7"] || 0),
        },
        distribution,
        entopiotita,
        theseis: theseisList,
        topDioristoi: realAppointedInThisSpecialty.slice(0, 20), // 👈 ΜΟΝΟ ΟΣΟΙ ΔΙΟΡΙΣΤΗΚΑΝ ΣΕ ΑΥΤΗΝ ΤΗΝ ΕΙΔΙΚΟΤΗΤΑ!
        titloi: {
          metaptyxiako,
          didaktoriko,
          xeni_glossa,
          empeiria,
        },
        totalRecords: totalCount,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      }
    );
  } catch (error: any) {
    console.error("Specialty API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}