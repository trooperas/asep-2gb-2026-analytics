import { NextResponse } from "next/server";
import { fetchDataJson } from "@/lib/data-assets";

let amLookupCache: Promise<Record<string, string[]>> | null = null;
let chunkIndexCache: Promise<Record<string, string[]>> | null = null;

function getAmLookup(request: Request): Promise<Record<string, string[]>> {
  if (!amLookupCache) {
    amLookupCache = fetchDataJson<Record<string, string[]>>("am_lookup.json", {
      request,
    }).catch((error) => {
      amLookupCache = null;
      throw error;
    });
  }
  return amLookupCache;
}

function getChunkIndex(request: Request): Promise<Record<string, string[]>> {
  if (!chunkIndexCache) {
    chunkIndexCache = fetchDataJson<Record<string, string[]>>("chunk_index.json", {
      request,
    }).catch((error) => {
      chunkIndexCache = null;
      throw error;
    });
  }
  return chunkIndexCache;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const am = searchParams.get("am");

  if (!am) {
    return NextResponse.json({ error: "Missing am" }, { status: 400 });
  }

  const cleanAm = String(am).replace(/\.0$/, "").trim();

  try {
    const lookup = await getAmLookup(request);
    const chunkFiles = lookup[cleanAm];

    if (!chunkFiles || chunkFiles.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const matchingRecordsMap = new Map<string, any>();

    // Ανάγνωση εγγραφών υποψηφίου με αποφυγή διπλοτύπων
    for (const chunkName of new Set(chunkFiles)) {
      const chunkData = await fetchDataJson<any[]>(`chunks/${chunkName}`, {
        request,
      });

      for (const r of chunkData) {
        if (String(r.am).replace(/\.0$/, "").trim() === cleanAm) {
          const uniqueKey = `${r.slug || r.eidikotita || ""}_${cleanAm}`;
          if (!matchingRecordsMap.has(uniqueKey)) {
            matchingRecordsMap.set(uniqueKey, r);
          }
        }
      }
    }

    const matchingRecords = Array.from(matchingRecordsMap.values());

    if (matchingRecords.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const chunkIndex = await getChunkIndex(request);

    // Υπολογισμός σειράς διορισμού ανά ειδικότητα
    for (const rec of matchingRecords) {
      const rawThesi = String(rec.thesi_diorismou || "").replace(/\.0$/, "").trim();
      const isValidThesi =
        rawThesi &&
        rawThesi !== "0" &&
        rawThesi !== "-" &&
        rawThesi !== "null" &&
        rawThesi !== "nan";
      const recSlug = rec.slug || "";

      // Αν έχει πραγματική θέση διορισμού στο chunk, είναι διοριστέος
      if (isValidThesi && recSlug) {
        rec.is_appointed_here = true;

        // Χρησιμοποιούμε Map για να εξασφαλίσουμε ότι κάθε Α.Μ. μετράει ΑΚΡΙΒΩΣ ΜΙΑ ΦΟΡΑ (όχι διπλοεγγραφές)
        const specChunks = chunkIndex[recSlug] || [];
        const specAppointedMap = new Map<
          string,
          { am: string; vath: number; klirosi: number }
        >();
        const loadedChunks = new Map<string, any[]>();

        for (const cf of new Set(specChunks)) {
          if (!loadedChunks.has(cf)) {
            loadedChunks.set(
              cf,
              await fetchDataJson<any[]>(`chunks/${cf}`, { request })
            );
          }
          const cData = loadedChunks.get(cf)!;

          for (const item of cData) {
            const itemThesi = String(item.thesi_diorismou || "")
              .replace(/\.0$/, "")
              .trim();
            const itemAm = String(item.am).replace(/\.0$/, "").trim();

            if (
              itemThesi &&
              itemThesi !== "0" &&
              itemThesi !== "-" &&
              itemThesi !== "null" &&
              itemThesi !== "nan"
            ) {
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
  } catch (error) {
    console.error("[api/ypopsifios] Failed to load data assets:", error);
    return NextResponse.json(
      {
        error: "Candidate data unavailable",
        detail:
          error instanceof Error ? error.message : "Unknown data loading error",
      },
      { status: 500 }
    );
  }
}
