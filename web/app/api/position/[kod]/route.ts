import { NextResponse } from "next/server";
import { fetchDataJson } from "@/lib/data-assets";

type LookupIndex = {
  generated_at: string;
  total_positions: number;
  shard_count: number;
  shard_target_bytes: number;
  applicant_limit: number;
  eidikotites: string[];
  slugs: string[];
  positions: Record<string, string>;
};

type PositionEntry = {
  candidates: any[][];
  applicants: any[][];
  totalApplicantsCount: number;
  stats: {
    total: number;
    min_vath: number | null;
    max_vath: number | null;
    avg_vath: number | null;
  };
};

type LookupShard = {
  positions: Record<string, PositionEntry>;
};

const MAX_CACHED_SHARDS = 4;

let positionsCache: Promise<any[]> | null = null;
let lookupIndexCache: Promise<LookupIndex> | null = null;
const shardCache = new Map<string, Promise<LookupShard>>();

function getPositions(request: Request): Promise<any[]> {
  if (!positionsCache) {
    positionsCache = fetchDataJson<any[]>("positions.json", { request }).catch(
      (error) => {
        positionsCache = null;
        throw error;
      }
    );
  }
  return positionsCache;
}

function getLookupIndex(request: Request): Promise<LookupIndex> {
  if (!lookupIndexCache) {
    lookupIndexCache = fetchDataJson<LookupIndex>(
      "position_lookup_index.json",
      { request }
    ).catch((error) => {
      lookupIndexCache = null;
      throw error;
    });
  }
  return lookupIndexCache;
}

function getLookupShard(
  fileName: string,
  request: Request
): Promise<LookupShard> {
  const cached = shardCache.get(fileName);
  if (cached) return cached;

  const pending = fetchDataJson<LookupShard>(fileName, { request }).catch(
    (error) => {
      shardCache.delete(fileName);
      throw error;
    }
  );

  shardCache.set(fileName, pending);
  if (shardCache.size > MAX_CACHED_SHARDS) {
    const oldest = shardCache.keys().next().value;
    if (oldest) shardCache.delete(oldest);
  }

  return pending;
}

const EMPTY_ENTRY: PositionEntry = {
  candidates: [],
  applicants: [],
  totalApplicantsCount: 0,
  stats: { total: 0, min_vath: null, max_vath: null, avg_vath: null },
};

function expandCandidates(
  rows: any[][],
  eidikotites: string[],
  slugs: string[]
) {
  return rows.map((row) => ({
    am: row[0],
    eponymo: row[1],
    onoma: row[2],
    patronymo: row[3],
    vathmologia: row[4],
    aa: row[5],
    eidikotita: row[6] >= 0 ? eidikotites[row[6]] ?? null : null,
    slug: row[7] >= 0 ? slugs[row[7]] ?? null : null,
    kod_thesis: row[8],
    cleanScore: row[4],
  }));
}

function expandApplicants(
  rows: any[][],
  targetKod: string,
  eidikotites: string[],
  slugs: string[]
) {
  return rows.map((row) => {
    const thesi = row[8];

    return {
      am: row[0],
      eponymo: row[1],
      onoma: row[2],
      patronymo: row[3],
      vathmologia: row[4],
      aa: row[5],
      eidikotita: row[6] >= 0 ? eidikotites[row[6]] ?? null : null,
      slug: row[7] >= 0 ? slugs[row[7]] ?? null : null,
      kod_thesis: thesi,
      cleanScore: row[4],
      prefNumber: row[9],
      isAppointedHere: thesi === targetKod,
      // Preserve the old route's shape: "" when there is no appointment code.
      isAppointedElsewhere: thesi ? thesi !== targetKod : "",
      appointedElsewhereCode:
        thesi && thesi !== targetKod ? thesi : null,
    };
  });
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
    const [positionsList, lookupIndex] = await Promise.all([
      getPositions(request),
      getLookupIndex(request),
    ]);

    const posMeta = positionsList.find(
      (p: any) => String(p.kod_thesis).replace(/\.0$/, "").trim() === targetKod
    );

    if (!posMeta) {
      return NextResponse.json({ error: "Position not found" }, { status: 404 });
    }

    const shardName = lookupIndex.positions[targetKod];
    let entry = EMPTY_ENTRY;

    if (shardName) {
      const shard = await getLookupShard(shardName, request);
      entry = shard.positions[targetKod] ?? EMPTY_ENTRY;
    }

    const eidikotites = lookupIndex.eidikotites ?? [];
    const slugs = lookupIndex.slugs ?? [];
    const candidates = expandCandidates(
      entry.candidates ?? [],
      eidikotites,
      slugs
    );
    const applicants = expandApplicants(
      entry.applicants ?? [],
      targetKod,
      eidikotites,
      slugs
    );

    return NextResponse.json(
      {
        position: posMeta,
        candidates,
        applicants,
        totalApplicantsCount:
          entry.totalApplicantsCount ?? applicants.length,
        stats: entry.stats ?? EMPTY_ENTRY.stats,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      }
    );
  } catch (error: any) {
    console.error("[api/position] Failed to load position lookup:", error);
    return NextResponse.json(
      {
        error: "Position data unavailable",
        detail: error?.message || "Unknown data loading error",
      },
      { status: 500 }
    );
  }
}
