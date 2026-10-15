import os
import json
import glob

print("Building fast AM lookup index...")
chunk_files = glob.glob("web/public/data/chunks/*.json")
am_map = {}

for c_path in chunk_files:
    fname = os.path.basename(c_path)
    with open(c_path, "r", encoding="utf-8") as f:
        records = json.load(f)
    for idx, r in enumerate(records):
        am_str = str(r.get("am", "")).replace(".0", "").strip()
        if am_str:
            if am_str not in am_map:
                am_map[am_str] = []
            am_map[am_str].append(fname)

out_file = "web/public/data/am_lookup.json"
with open(out_file, "w", encoding="utf-8") as f:
    json.dump(am_map, f)

print(f"✓ Created {out_file} with {len(am_map)} AMs!")