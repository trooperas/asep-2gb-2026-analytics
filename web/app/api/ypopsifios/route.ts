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
  const matchingRecordsMap = new Map<string, any>();

  // Ανάγνωση εγγραφών υποψηφίου με αποφυγή διπλοτύπων
  for (const chunkName of chunkFiles) {
    try {
      const p = join(chunksDir, chunkName);
      if (existsSync(p)) {
        const chunkData = JSON.parse(readFileSync(p, "utf-8"));
        for (const r of chunkData) {
          if (String(r.am).replace(/\.0$/, "").trim() === cleanAm) {
            const uniqueKey = `${r.slug || r.eidikotita || ""}_${cleanAm}`;
            if (!matchingRecordsMap.has(uniqueKey)) {
              matchingRecordsMap.set(uniqueKey, r);
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  const matchingRecords = Array.from(matchingRecordsMap.values());

  if (matchingRecords.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const chunkIndex = getChunkIndex();

  // Υπολογισμός σειράς διορισμού ανά ειδικότητα
  for (const rec of matchingRecords) {
    const rawThesi = String(rec.thesi_diorismou || "").replace(/\.0$/, "").trim();
    const isValidThesi = rawThesi && rawThesi !== "0" && rawThesi !== "-" && rawThesi !== "null" && rawThesi !== "nan";
    const recSlug = rec.slug || "";

    // Αν έχει πραγματική θέση διορισμού στο chunk, είναι διοριστέος
    if (isValidThesi && recSlug) {
      rec.is_appointed_here = true;

      // Χρησιμοποιούμε Map για να εξασφαλίσουμε ότι κάθε Α.Μ. μετράει ΑΚΡΙΒΩΣ ΜΙΑ ΦΟΡΑ (όχι διπλοεγγραφές)
      const specChunks = chunkIndex[recSlug] || [];
      const specAppointedMap = new Map<string, { am: string; vath: number; klirosi: number }>();

      for (const cf of specChunks) {
        const p = join(chunksDir, cf);
        if (existsSync(p)) {
          const cData = JSON.parse(readFileSync(p, "utf-8"));
          for (const item of cData) {
            const itemThesi = String(item.thesi_diorismou || "").replace(/\.0$/, "").trim();
            const itemAm = String(item.am).replace(/\.0$/, "").trim();

            if (itemThesi && itemThesi !== "0" && itemThesi !== "-" && itemThesi !== "null" && itemThesi !== "nan") {
              if (!specAppointedMap.has(itemAm)) {
                specAppointedMap.set(itemAm, {
                  am: itemAm,
                  vath: parseFloat(item.vathmologia) || 0,
                  klirosi: parseFloat(item.seira_klirosis) || 99999999,
                });
              }
            }
          }
        }
      }

      const specAppointed = Array.from(specAppointedMap.values());

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
    } else {
      rec.thesi_diorismou = null;
      rec.appointed_rank = null;
      rec.is_appointed_here = false;
    }
  }

  // Ταξινόμηση: η καρτέλα διορισμού να είναι πάντα πρώτη
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