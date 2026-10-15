import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

let amLookupCache: Record<string, string[]> | null = null;
let chunkIndexCache: Record<string, string[]> | null = null;

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

  // ΥΠΟΛΟΓΙΣΜΟΣ ΠΡΑΓΜΑΤΙΚΗΣ ΣΕΙΡΑΣ ΔΙΟΡΙΣΜΟΥ (APPOINTED RANK ME TIE-BREAKING ΚΛΗΡΩΣΗΣ)
  const chunkIndex = getChunkIndex();

  for (const rec of matchingRecords) {
    if (rec.thesi_diorismou && rec.slug) {
      const specChunks = chunkIndex[rec.slug] || [];
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

      // Ταξινόμηση ΑΣΕΠ: 1) Βαθμολογία φθίνουσα, 2) Σειρά Κλήρωσης αύξουσα
      specAppointed.sort((a, b) => {
        if (b.vath !== a.vath) return b.vath - a.vath;
        return a.klirosi - b.klirosi;
      });

      const myAppointedRank = specAppointed.findIndex((x) => x.am === cleanAm);
      if (myAppointedRank >= 0) {
        rec.appointed_rank = myAppointedRank + 1; // 👈 1-based σειρά διορισμού!
        rec.total_appointed_in_specialty = specAppointed.length;
      }
    }
  }

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