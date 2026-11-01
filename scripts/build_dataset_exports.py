"""CSV exports derived from public ASEP 2ΓΒ/2026 announcements.

These exports are published under CC BY 4.0.
"""

import csv
import json
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DATA = REPO_ROOT / "web" / "public" / "data"
OUT = DATA / "dataset"

POSITIONS_KEYS = [
    "kod_thesis",
    "eidikotita",
    "kod_organogrammatos",
    "foreas",
    "foreas_main",
    "edra",
    "perifereia",
    "dimos",
    "nomos",
    "titloi",
    "prosonta",
    "entopiotita",
    "theseis",
]

KENES_KEYS = [
    "kod_thesis",
    "foreas",
    "eidikotita",
    "perifereia",
    "dimos",
    "nomos",
    "edra",
    "titloi",
    "prosonta",
    "entopiotita",
    "total_slots",
    "appointed",
    "vacant",
]

EIDIKOTITES_HEADER = [
    "slug",
    "eidikotita",
    "count",
    "dioristoi",
    "pososto",
    "min_vath",
    "max_vath",
    "avg_vath",
    "me_metaptyxiako",
    "me_didaktoriko",
    "me_entopiotita",
]

STATS_KEYS = [
    "count",
    "dioristoi",
    "pososto",
    "min_vath",
    "max_vath",
    "avg_vath",
    "me_metaptyxiako",
    "me_didaktoriko",
    "me_entopiotita",
]


def value_for_csv(value):
    if value is None:
        return ""
    if isinstance(value, float):
        return value
    if isinstance(value, int):
        return value
    return str(value)


def write_csv(path, header, rows):
    with open(path, "w", encoding="utf-8-sig", newline="") as f:
        writer = csv.writer(f, lineterminator="\r\n", quoting=csv.QUOTE_MINIMAL)
        writer.writerow(header)
        for row in rows:
            writer.writerow([value_for_csv(row.get(k)) for k in header])


def main():
    OUT.mkdir(parents=True, exist_ok=True)

    with open(DATA / "positions.json", "r", encoding="utf-8") as f:
        positions = json.load(f)
    assert isinstance(positions, list), "positions.json must be a list"
    assert len(positions) == 2723, f"Expected 2723 positions, got {len(positions)}"

    with open(DATA / "kenes_theseis.json", "r", encoding="utf-8") as f:
        kenes_data = json.load(f)
    assert isinstance(kenes_data, dict), "kenes_theseis.json must be an object"
    kenes_positions = kenes_data.get("positions", [])
    assert isinstance(kenes_positions, list), "kenes_theseis.json['positions'] must be a list"
    assert len(kenes_positions) == 551, f"Expected 551 kenes positions, got {len(kenes_positions)}"

    with open(DATA / "eidikotites_index.json", "r", encoding="utf-8") as f:
        eid_index = json.load(f)
    assert isinstance(eid_index, list), "eidikotites_index.json must be a list"
    assert len(eid_index) == 52, f"Expected 52 eidikotites, got {len(eid_index)}"

    with open(DATA / "eidikotites_stats.json", "r", encoding="utf-8") as f:
        eid_stats = json.load(f)
    assert isinstance(eid_stats, dict), "eidikotites_stats.json must be an object"

    positions_path = OUT / "asep-2gb2026-theseis.csv"
    write_csv(positions_path, POSITIONS_KEYS, positions)
    print(f"Wrote {positions_path} ({len(positions)} rows, {positions_path.stat().st_size} bytes)")

    kenes_path = OUT / "asep-2gb2026-kenes-theseis.csv"
    write_csv(kenes_path, KENES_KEYS, kenes_positions)
    print(f"Wrote {kenes_path} ({len(kenes_positions)} rows, {kenes_path.stat().st_size} bytes)")

    eid_rows = []
    for item in eid_index:
        slug = item["slug"]
        stats = eid_stats.get(slug, {})
        row = {"slug": slug, "eidikotita": item.get("eidikotita", "")}
        for key in STATS_KEYS:
            row[key] = stats.get(key)
        eid_rows.append(row)

    eid_path = OUT / "asep-2gb2026-eidikotites.csv"
    write_csv(eid_path, EIDIKOTITES_HEADER, eid_rows)
    print(f"Wrote {eid_path} ({len(eid_rows)} rows, {eid_path.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
