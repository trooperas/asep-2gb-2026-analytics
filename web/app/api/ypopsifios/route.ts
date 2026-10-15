import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

// In-memory cache του lookup για να μην διαβάζεται καν από τον δίσκο σε κάθε request
let amLookupCache: Record<string, string[]> | null = null;

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

  // Ανοίγουμε ΜΟΝΟ τα 1-2 chunks που ξέρουμε ήδη ότι περιέχουν τον υποψήφιο!
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

  return NextResponse.json(
    {
      primary: matchingRecords[0],
      all: matchingRecords,
      count: matchingRecords.length,
    },
    {
      headers: {
        // 👈 VERCEL CDN CACHING: Σερβίρεται από τη μνήμη cache για 24 ώρες! (0 CPU)
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    }
  );
}