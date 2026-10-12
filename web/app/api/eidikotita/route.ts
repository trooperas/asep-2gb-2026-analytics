import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

let chunkIndex: Record<string, string[]> | null = null;

function getChunkIndex(): Record<string, string[]> {
  if (!chunkIndex) {
    const path = join(process.cwd(), "public", "data", "chunk_index.json");
    chunkIndex = JSON.parse(readFileSync(path, "utf-8"));
  }
  return chunkIndex!;
}

function getEidikotitaStats(): Record<string, any> {
  const path = join(
    process.cwd(),
    "public",
    "data",
    "eidikotites_stats.json"
  );
  return JSON.parse(readFileSync(path, "utf-8"));
}

function loadAllRecords(slug: string): any[] {
  const chunksDir = join(process.cwd(), "public", "data", "chunks");
  const index = getChunkIndex();
  const chunks = index[slug];

  if (!chunks) return [];

  const all: any[] = [];
  for (const chunkName of chunks) {
    const chunkPath = join(chunksDir, chunkName);
    const chunk = JSON.parse(readFileSync(chunkPath, "utf-8"));
    all.push(...chunk);
  }
  return all;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const stats = getEidikotitaStats()[slug];
  if (!stats) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const records = loadAllRecords(slug);

  // Κατανομή βαθμολογίας σε bins των 10
  const bins: Record<string, number> = {};
  for (let i = 0; i <= 150; i += 10) {
    bins[`${i}-${i + 9}`] = 0;
  }
  for (const r of records) {
    const v = r.vathmologia;
    if (typeof v === "number") {
      const bin = Math.floor(v / 10) * 10;
      const key = `${bin}-${bin + 9}`;
      if (bins[key] !== undefined) bins[key]++;
    }
  }

  // Κατανομή ανά κωδικό εντοπιότητας
  const entopiotita: Record<string, number> = {};
  for (const r of records) {
    const k = r.kod_entopiotitas || "—";
    entopiotita[k] = (entopiotita[k] || 0) + 1;
  }

  // Top κωδικοί θέσης
  const theseis: Record<string, number> = {};
  for (const r of records) {
    const k = r.thesi_diorismou;
    if (k) theseis[k] = (theseis[k] || 0) + 1;
  }

  // Top 10 διοριστέοι
  const topDioristoi = records
    .filter((r) => r.vathmologia != null)
    .sort((a, b) => (b.vathmologia || 0) - (a.vathmologia || 0))
    .slice(0, 20)
    .map((r) => ({
      am: r.am,
      eponymo: r.eponymo,
      onoma: r.onoma,
      vathmologia: r.vathmologia,
      aa: r.aa,
      thesi_diorismou: r.thesi_diorismou,
    }));

  // Φύλο/ηλικία δεν έχουμε, αλλά έχουμε:
  // - Μεταπτυχιακό/Διδακτορικό/Ξένες γλώσσες
  const titloi = {
    metaptyxiako: records.filter((r) => r.metaptyxiako).length,
    didaktoriko: records.filter((r) => r.didaktoriko).length,
    xeni_glossa: records.filter((r) => r.xeni_glossa).length,
    empeiria: records.filter((r) => (r.minas_empeirias || 0) > 0).length,
  };

  return NextResponse.json({
    slug,
    stats,
    distribution: bins,
    entopiotita,
    theseis: Object.entries(theseis)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([kod, count]) => ({ kod, count })),
    topDioristoi,
    titloi,
    totalRecords: records.length,
  });
}