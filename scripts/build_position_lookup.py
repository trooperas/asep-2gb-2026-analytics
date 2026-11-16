"""
Precompute the per-position lookup used by /api/position.

Run from the repository root AFTER the chunks are final:

    python scripts/optimize_data.py
    python scripts/unify_and_clean_data.py
    python scripts/optimize_data.py
    python scripts/enrich_dioristeoi.py
    python scripts/build_position_lookup.py

Inputs:
    web/public/data/chunks/*.json
    web/public/data/chunk_index.json
    web/public/data/positions.json

Outputs:
    web/public/data/position_lookup_index.json
        {
          "generated_at": "...",
          "total_positions": N,
          "shard_count": N,
          "shard_target_bytes": 2097152,
          "applicant_limit": 350,
          "eidikotites": ["..."],
          "slugs": ["..."],
          "positions": {"401": "position_lookup_0.json", ...}
        }

    web/public/data/position_lookup_<n>.json
        {"positions": {"401": {"candidates": [...], "applicants": [...],
                               "totalApplicantsCount": N, "stats": {...}}}}

Rows are stored compactly to keep the artifact small; the API expands them back
to the original object shape. Shards are capped at 2 MiB (well below the 20 MB
trigger and Cloudflare's 25 MiB per-asset limit) so one /api/position request
only parses a small payload and stays far under the Worker's subrequest budget.
"""

import json
import re
import sys
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

# Windows consoles often default to cp1253, which cannot encode the ✓ marker.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

WEB_DATA = Path("web/public/data")
CHUNKS_DIR = WEB_DATA / "chunks"
CHUNK_INDEX_FILE = WEB_DATA / "chunk_index.json"
POSITIONS_FILE = WEB_DATA / "positions.json"
INDEX_FILE = WEB_DATA / "position_lookup_index.json"

APPLICANT_LIMIT = 350
SHARD_TARGET_BYTES = 2 * 1024 * 1024  # 2 MiB
MAX_ASSET_BYTES = 25 * 1024 * 1024   # Cloudflare per-asset limit

PREF_SPLIT_RE = re.compile(r"[-,\s]+")
LEADING_NUMBER_RE = re.compile(r"\s*[+-]?(?:\d+\.?\d*|\.\d+)")


def clean_code(value) -> str:
    """Match the API: String(value || '').replace(/\\.0$/, '').trim()."""
    return str(value or "").replace(".0", "").strip()


def parse_score(value) -> float:
    """Match JS parseFloat(...) || 0 for the values used in the dataset."""
    match = LEADING_NUMBER_RE.match(str(value if value is not None else ""))
    if not match:
        return 0.0
    try:
        return float(match.group(0))
    except ValueError:
        return 0.0


def json_number(value):
    """Keep integral scores as ints, matching JSON.stringify(parseFloat(...))."""
    if isinstance(value, float) and value.is_integer():
        return int(value)
    return value


def parse_preferences(value):
    """Split protimiseis and return each code with its first 1-based position."""
    tokens = [
        token.replace(".0", "").strip()
        for token in PREF_SPLIT_RE.split(str(value or ""))
        if token.strip()
    ]
    first_index = {}
    for i, code in enumerate(tokens):
        if code and code not in first_index:
            first_index[code] = i + 1
    return first_index


def main() -> None:
    if not POSITIONS_FILE.exists():
        raise SystemExit(f"Missing {POSITIONS_FILE}; run the ETL first.")
    if not CHUNKS_DIR.exists():
        raise SystemExit(f"Missing {CHUNKS_DIR}; run optimize_data.py first.")

    positions = json.loads(POSITIONS_FILE.read_text(encoding="utf-8"))
    position_codes = {
        clean_code(p.get("kod_thesis"))
        for p in positions
        if clean_code(p.get("kod_thesis"))
    }

    chunk_index = json.loads(CHUNK_INDEX_FILE.read_text(encoding="utf-8"))
    file_to_slug = {
        filename: slug
        for slug, filenames in chunk_index.items()
        for filename in filenames
    }

    chunk_paths = sorted(CHUNKS_DIR.glob("*.json"))
    print(f"Loading {len(chunk_paths):,} chunks for {len(position_codes):,} positions...")

    # kod -> am -> tuple. Ties keep the first record, matching the old Map logic.
    appointed = defaultdict(dict)
    applicants = defaultdict(dict)

    records = 0
    for chunk_path in chunk_paths:
        slug = file_to_slug.get(
            chunk_path.name, chunk_path.name.rsplit("__", 1)[0]
        )
        records_batch = json.loads(chunk_path.read_text(encoding="utf-8"))
        records += len(records_batch)

        for record in records_batch:
            am = clean_code(record.get("am"))
            if not am:
                continue

            score = parse_score(record.get("vathmologia"))
            thesi = clean_code(record.get("thesi_diorismou"))
            eidikotita = record.get("eidikotita") or ""
            eponymo = record.get("eponymo")
            onoma = record.get("onoma")
            patronymo = record.get("patronymo")
            aa = record.get("aa")

            candidate = (
                am, eponymo, onoma, patronymo, score, aa,
                eidikotita, slug, thesi,
            )

            if thesi and thesi in position_codes:
                previous = appointed[thesi].get(am)
                if previous is None or score > previous[4]:
                    appointed[thesi][am] = candidate

            for code, pref_number in parse_preferences(
                record.get("protimiseis")
            ).items():
                if code not in position_codes:
                    continue

                applicant = (
                    am, eponymo, onoma, patronymo, score, aa,
                    eidikotita, slug, thesi, pref_number,
                )
                previous = applicants[code].get(am)
                if previous is None or score > previous[4]:
                    applicants[code][am] = applicant

    print(f"  ✓ {records:,} records")
    print(f"  ✓ {sum(len(v) for v in appointed.values()):,} appointed rows")
    print(f"  ✓ {sum(len(v) for v in applicants.values()):,} unique applicant rows")

    # Shared string tables keep repeated Greek names and long slugs out of rows.
    eidikotites = set()
    slugs = set()
    for bucket in (appointed, applicants):
        for by_am in bucket.values():
            for row in by_am.values():
                if row[6]:
                    eidikotites.add(row[6])
                if row[7]:
                    slugs.add(row[7])

    eidikotites = sorted(eidikotites)
    slugs = sorted(slugs)
    eid_index = {value: i for i, value in enumerate(eidikotites)}
    slug_index = {value: i for i, value in enumerate(slugs)}

    def eid_id(value):
        return eid_index.get(value, -1)

    def slug_id(value):
        return slug_index.get(value, -1)

    print("Building position entries...")
    entries = {}
    for kod in position_codes:
        candidates = sorted(
            appointed.get(kod, {}).values(), key=lambda row: -row[4]
        )
        applicant_map = applicants.get(kod, {})
        total_applicants = len(applicant_map)
        applicant_rows = sorted(
            applicant_map.values(), key=lambda row: -row[4]
        )[:APPLICANT_LIMIT]

        scores = [row[4] for row in candidates if row[4] > 0]
        stats = {
            "total": len(candidates),
            "min_vath": json_number(min(scores)) if scores else None,
            "max_vath": json_number(max(scores)) if scores else None,
            "avg_vath": (sum(scores) / len(scores)) if scores else None,
        }

        entries[kod] = {
            "candidates": [
                [
                    row[0], row[1], row[2], row[3], json_number(row[4]),
                    row[5], eid_id(row[6]), slug_id(row[7]), row[8],
                ]
                for row in candidates
            ],
            "applicants": [
                [
                    row[0], row[1], row[2], row[3], json_number(row[4]),
                    row[5], eid_id(row[6]), slug_id(row[7]), row[8], row[9],
                ]
                for row in applicant_rows
            ],
            "totalApplicantsCount": total_applicants,
            "stats": stats,
        }

    print(f"  ✓ {len(entries):,} position entries")

    # Numeric codes sort naturally; fall back to strings for anything else.
    def sort_key(kod: str):
        try:
            return (0, int(kod))
        except ValueError:
            return (1, kod)

    sorted_codes = sorted(entries.keys(), key=sort_key)

    # Greedy pack serialized entries into shards.
    shards = []
    current = []
    current_bytes = len('{"positions":{}}')
    for kod in sorted_codes:
        entry_json = json.dumps(
            entries[kod], ensure_ascii=False, separators=(",", ":")
        )
        item_bytes = len(entry_json.encode("utf-8")) + len(kod) + 6
        if current and current_bytes + item_bytes > SHARD_TARGET_BYTES:
            shards.append(current)
            current = []
            current_bytes = len('{"positions":{}}')
        current.append((kod, entry_json))
        current_bytes += item_bytes
    if current:
        shards.append(current)

    # Remove previous lookup artifacts so stale shards cannot be served.
    for old_file in WEB_DATA.glob("position_lookup_*.json"):
        old_file.unlink()

    positions_map = {}
    shard_sizes = []
    for shard_number, shard in enumerate(shards):
        filename = f"position_lookup_{shard_number}.json"
        body = (
            '{"positions":{'
            + ",".join(
                f"{json.dumps(kod)}:{entry_json}"
                for kod, entry_json in shard
            )
            + "}}"
        )
        encoded = body.encode("utf-8")
        if len(encoded) > MAX_ASSET_BYTES:
            raise SystemExit(
                f"{filename} is {len(encoded) / 1024 / 1024:.2f} MB, "
                f"above the {MAX_ASSET_BYTES / 1024 / 1024:.0f} MiB asset limit"
            )
        (WEB_DATA / filename).write_text(body, encoding="utf-8")
        shard_sizes.append(len(encoded))
        for kod, _ in shard:
            positions_map[kod] = filename

    index = {
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "total_positions": len(entries),
        "shard_count": len(shards),
        "shard_target_bytes": SHARD_TARGET_BYTES,
        "applicant_limit": APPLICANT_LIMIT,
        "eidikotites": eidikotites,
        "slugs": slugs,
        "positions": positions_map,
    }
    INDEX_FILE.write_text(
        json.dumps(index, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    total_shard_bytes = sum(shard_sizes)
    print("\n" + "=" * 60)
    print(f"position_lookup_index.json: {INDEX_FILE.stat().st_size / 1024:.1f} KB")
    print(
        f"shards: {len(shards)} | total {total_shard_bytes / 1024 / 1024:.2f} MB "
        f"| largest {max(shard_sizes) / 1024 / 1024:.2f} MB"
    )
    print(f"positions: {len(entries):,} | mapped codes: {len(positions_map):,}")
    print("=" * 60)


if __name__ == "__main__":
    main()
