"""
Βελτιστοποίηση δεδομένων για web:
1. Σπάει το all_candidates.json σε chunks των 1000 εγγραφών.
2. Δημιουργεί ένα ελαφρύ search index (Α.Μ. + Επώνυμο -> eidikotita + aa).
3. Δημιουργεί pre-aggregated stats για κάθε ειδικότητα.
"""

import json
from pathlib import Path
from collections import defaultdict

DATA_DIR = Path("data")
WEB_DATA = Path("web/public/data")
WEB_DATA.mkdir(parents=True, exist_ok=True)

print("Φόρτωση all_candidates.json...")
all_data = json.loads((DATA_DIR / "all_candidates.json").read_text(encoding="utf-8"))
print(f"  ✓ {len(all_data):,} εγγραφές")

# ============ 1. SEARCH INDEX ============
print("\nΔημιουργία search index...")
search_index = []
for r in all_data:
    am = r.get("am")
    if am:
        search_index.append({
            "am": str(am).replace('.0', ''),
            "slug": r["slug"],
            "aa": r["aa"],
            "eponymo": r["eponymo"],
            "onoma": r["onoma"],
        })

(WEB_DATA / "search_index.json").write_text(
    json.dumps(search_index, ensure_ascii=False, separators=(",", ":")),
    encoding="utf-8",
)
print(f"  ✓ {len(search_index):,} entries | {(WEB_DATA / 'search_index.json').stat().st_size / 1024 / 1024:.2f} MB")

# ============ 2. CHUNKS ============
print("\nΔημιουργία chunks...")
CHUNK_SIZE = 1000
chunks_dir = WEB_DATA / "chunks"
chunks_dir.mkdir(exist_ok=True)

by_slug = defaultdict(list)
slug_to_name = {}
for r in all_data:
    by_slug[r["slug"]].append(r)
    slug_to_name[r["slug"]] = r["eidikotita"]

chunk_index = {}
for slug, records in by_slug.items():
    for i in range(0, len(records), CHUNK_SIZE):
        chunk = records[i:i + CHUNK_SIZE]
        chunk_name = f"{slug}__{i // CHUNK_SIZE}.json"
        (chunks_dir / chunk_name).write_text(
            json.dumps(chunk, ensure_ascii=False, separators=(",", ":")),
            encoding="utf-8",
        )
        chunk_index.setdefault(slug, []).append(chunk_name)

(WEB_DATA / "chunk_index.json").write_text(
    json.dumps(chunk_index, ensure_ascii=False, indent=2),
    encoding="utf-8",
)
print(f"  ✓ {sum(len(v) for v in chunk_index.values())} chunks")

# ============ 3. STATS ΑΝΑ ΕΙΔΙΚΟΤΗΤΑ ============
print("\nΔημιουργία stats ανά ειδικότητα...")
eid_stats = {}
for slug, records in by_slug.items():
    vaths = [r["vathmologia"] for r in records if r.get("vathmologia")]
    dioristoi = [r for r in records if r.get("thesi_diorismou")]
    met = [r for r in records if r.get("metaptyxiako")]
    did = [r for r in records if r.get("didaktoriko")]
    entop = [r for r in records if r.get("kod_entopiotitas") and r["kod_entopiotitas"] != "0"]

    eid_stats[slug] = {
        "count": len(records),
        "dioristoi": len(dioristoi),
        "pososto": round(len(dioristoi) / len(records) * 100, 1) if records else 0,
        "min_vath": min(vaths) if vaths else None,
        "max_vath": max(vaths) if vaths else None,
        "avg_vath": round(sum(vaths) / len(vaths), 2) if vaths else None,
        "me_metaptyxiako": len(met),
        "me_didaktoriko": len(did),
        "me_entopiotita": len(entop),
    }

(WEB_DATA / "eidikotites_stats.json").write_text(
    json.dumps(eid_stats, ensure_ascii=False, indent=2),
    encoding="utf-8",
)
print(f"  ✓ {len(eid_stats)} ειδικότητες")

# ============ 4. GLOBAL STATS ============
print("\nΔημιουργία global stats...")
all_vaths = [r["vathmologia"] for r in all_data if r.get("vathmologia")]
all_dioristoi = [r for r in all_data if r.get("thesi_diorismou")]

global_stats = {
    "total_candidates": len(all_data),
    "total_dioristoi": len(all_dioristoi),
    "total_eidikotites": len(by_slug),
    "pososto_epityxias": round(len(all_dioristoi) / len(all_data) * 100, 1),
    "min_vath": min(all_vaths),
    "max_vath": max(all_vaths),
    "avg_vath": round(sum(all_vaths) / len(all_vaths), 2),
    "me_metaptyxiako": sum(1 for r in all_data if r.get("metaptyxiako")),
    "me_didaktoriko": sum(1 for r in all_data if r.get("didaktoriko")),
    "me_entopiotita": sum(1 for r in all_data if r.get("kod_entopiotitas") and r["kod_entopiotitas"] != "0"),
}

(WEB_DATA / "global_stats.json").write_text(
    json.dumps(global_stats, ensure_ascii=False, indent=2),
    encoding="utf-8",
)
print(f"  ✓ global_stats.json")

# ============ 5. EIDIKOTITES INDEX ============
print("\nΔημιουργία ειδικοτήτων index...")
eid_index = [
    {
        "eidikotita": slug_to_name.get(slug, slug),
        "slug": slug,
        "count": len(records),
    }
    for slug, records in by_slug.items()
]

(WEB_DATA / "eidikotites_index.json").write_text(
    json.dumps(eid_index, ensure_ascii=False, indent=2),
    encoding="utf-8",
)
print(f"  ✓ eidikotites_index.json ({len(eid_index)} ειδικότητες)")

print("\n" + "=" * 60)
print("ΟΛΟΚΛΗΡΩΘΗΚΕ!")
print("=" * 60)