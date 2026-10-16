import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

let amLookupCache: Record<string, string[]> | null = null;
let chunkIndexCache: Record<string, string[]> | null = null;
let positionsListCache: any[] | null = null;

function getAmLookup(): Record<string, string[]> {
  if (!amLookupCache) {
    try {
      const p = join(process.cwd(), "public", "data", "am_lookup.json");
      amLookupCache = JSON.parse(readFileSync(p, "utf-8"));
    } catch {
      amLookupCache = {};
    }
  }
  return amLookupCache || {};
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
  return chunkIndexCache || {};
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const am = searchParams.get("am");

  if (!am) {
    return NextResponse.json({ error: "Missing am" }, { status: 400 });
  }

  const cleanAm = String(am).replace(/\.0$/, "").trim();
  const lookup = getAmLookup();
  const chunkFiles = lookup[cleanAm];

  if (!chunkFiles || chunkFiles.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const chunksDir = join(process.cwd(), "public", "data", "chunks");
  const matchingRecords: any[] = [];

  for (const chunkName of chunkFiles) {
    try {
      const chunkData = JSON.parse(
        readFileSync(join(chunksDir, chunkName), "utf-8")
      );
      for (const r of chunkData) {
        if (String(r.am).replace(/\.0$/, "").trim() === cleanAm) {
          matchingRecords.push(r);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (matchingRecords.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const positionsList = getPositionsList();
  const chunkIndex = getChunkIndex();

  // ΑΥΣΤΗΡΟΣ ΔΙΑΧΩΡΙΣΜΟΣ ΔΙΟΡΙΣΜΟΥ ΑΝΑ ΕΙΔΙΚΟΤΗΤΑ
  for (const rec of matchingRecords) {
    const recThesi = String(rec.thesi_diorismou || "").replace(/\.0$/, "").trim();
    const recSlug = rec.slug || "";

    let isAppointedHere = false;

    if (recThesi && recSlug) {
      // 1. Βρίσκουμε αν η θέση στο positions.json αντιστοιχεί σε αυτό το slug
      const posMeta = positionsList.find(
        (p) => String(p.kod_thesis).replace(/\.0$/, "").trim() === recThesi
      );

      if (posMeta) {
        const posEidNorm = String(posMeta.eidikotita || "").toLowerCase();
        const specRoot = recSlug.replace(/^pe-/, "").split("-")[0];
        if (posEidNorm.includes(specRoot)) {
          isAppointedHere = true;
        }
      }

      // 2. Συμπληρωματικός έλεγχος μέσω των θέσεων της ομάδας προσόντων
      const theseisOmadas = String(rec.theseis_idias_omadas || "");
      if (theseisOmadas && theseisOmadas.includes(recThesi)) {
        isAppointedHere = true;
      }
    }

    // ΚΑΘΑΡΙΣΜΟΣ: Αν ΔΕΝ διορίστηκε σε ΑΥΤΗ την ειδικότητα, μηδενίζουμε τον διορισμό εδώ!
    if (!isAppointedHere) {
      rec.thesi_diorismou = null;
      rec.appointed_rank = null;
      rec.total_appointed_in_specialty = null;
    } else {
      // Αν διορίστηκε εδώ, υπολογίζουμε τη σειρά ανάμεσα στους διοριστέους ΑΥΤΗΣ της ειδικότητας
      const specChunks = chunkIndex[recSlug] || [];
      const specAppointed: any[] = [];

      for (const cf of specChunks) {
        const p = join(chunksDir, cf);
        if (existsSync(p)) {
          const cData = JSON.parse(readFileSync(p, "utf-8"));
          for (const item of cData) {
            if (item.thesi_diorismou) {
              specAppointed.push({
                am: String(item.am).replace(/\.0$/, "").trim(),
                vath: parseFloat(item.vathmologia) || 0,
                klirosi: parseFloat(item.seira_klirosis) || 99999999,
              });
            }
          }
        }
      }

      // Ταξινόμηση ΑΣΕΠ: 1) Βαθμός φθίνων, 2) Κλήρωση αύξουσα
      specAppointed.sort((a, b) => {
        if (b.vath !== a.vath) return b.vath - a.vath;
        return a.klirosi - b.klirosi;
      });

      const myAppointedRank = specAppointed.findIndex((x) => x.am === cleanAm);
      if (myAppointedRank >= 0) {
        rec.appointed_rank = myAppointedRank + 1;
        rec.total_appointed_in_specialty = specAppointed.length;
      }
    }
  }

  // Ταξινόμηση: πρώτη καρτέλα να είναι πάντα αυτή στην οποία ΔΙΟΡΙΣΤΗΚΕ!
  matchingRecords.sort((a, b) => {
    if (a.thesi_diorismou && !b.thesi_diorismou) return -1;
    if (!a.thesi_diorismou && b.thesi_diorismou) return 1;
    return 0;
  });

  return NextResponse.json(
    {
      primary: matchingRecords[0],
      all: matchingRecords,
      count: matchingRecords.length,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    }
  );
}