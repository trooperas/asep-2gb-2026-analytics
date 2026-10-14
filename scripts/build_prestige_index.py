import os
import json
import glob
from collections import defaultdict

print("=" * 60)
print("BUILDING PRESTIGE & DEMAND INDEX (ΟΔΗΓΟΣ ΣΤΡΑΤΗΓΙΚΗΣ 2027)")
print("=" * 60)

# 1. Φόρτωση metadata θέσεων (φορέας, περιφέρεια)
with open("web/public/data/positions.json", "r", encoding="utf-8") as f:
    positions_list = json.load(f)

positions_meta = {}
for p in positions_list:
    kod = str(p.get("kod_thesis", "")).replace(".0", "").strip()
    positions_meta[kod] = p

# 2. Ανάλυση σειρών προτίμησης από όλα τα chunks
chunks = glob.glob("web/public/data/chunks/*.json")
print(f"Διαβάζω {len(chunks)} chunk files...")

thesi_demand = defaultdict(lambda: {"first_choices": 0, "top3_choices": 0, "total_mentions": 0})
foreas_demand = defaultdict(lambda: {"first_choices": 0, "total_mentions": 0, "total_positions": set()})

candidates_analyzed = 0

for c_path in chunks:
    with open(c_path, "r", encoding="utf-8") as f:
        records = json.load(f)

    for r in records:
        candidates_analyzed += 1
        protimiseis_str = r.get("protimiseis")
        if not protimiseis_str:
            continue

        prefs = [x.replace(".0", "").strip() for x in protimiseis_str.split("-") if x.strip()]
        
        for idx, kod in enumerate(prefs):
            thesi_demand[kod]["total_mentions"] += 1
            pos_info = positions_meta.get(kod)
            foreas_name = pos_info.get("foreas", "Άγνωστος Φορέας") if pos_info else "Άγνωστος Φορέας"
            
            foreas_demand[foreas_name]["total_mentions"] += 1
            foreas_demand[foreas_name]["total_positions"].add(kod)

            if idx == 0:
                thesi_demand[kod]["first_choices"] += 1
                foreas_demand[foreas_name]["first_choices"] += 1
            if idx < 3:
                thesi_demand[kod]["top3_choices"] += 1

# 3. Ταξινόμηση Top Θέσεων
top_positions_demand = []
for kod, counts in thesi_demand.items():
    pos_info = positions_meta.get(kod, {})
    top_positions_demand.append({
        "kod_thesis": kod,
        "foreas": pos_info.get("foreas", "Άγνωστος"),
        "eidikotita": pos_info.get("eidikotita", ""),
        "perifereia": pos_info.get("perifereia", ""),
        "first_choices": counts["first_choices"],
        "top3_choices": counts["top3_choices"],
        "total_mentions": counts["total_mentions"],
    })

top_positions_demand.sort(key=lambda x: -x["first_choices"])

# 4. Ταξινόμηση Top Φορέων (Prestige Index)
top_foreis = []
for foreas, data in foreas_demand.items():
    if foreas == "Άγνωστος Φορέας":
        continue
    top_foreis.append({
        "foreas": foreas,
        "first_choices": data["first_choices"],
        "total_mentions": data["total_mentions"],
        "positions_count": len(data["total_positions"])
    })

top_foreis.sort(key=lambda x: -x["first_choices"])

output_data = {
    "total_candidates_analyzed": candidates_analyzed,
    "top_foreis": top_foreis[:20],
    "top_positions": top_positions_demand[:30]
}

out_file = "web/public/data/prestige_index.json"
with open(out_file, "w", encoding="utf-8") as f:
    json.dump(output_data, f, ensure_ascii=False, indent=2)

print(f"✓ Αναλύθηκαν {candidates_analyzed} υποψήφιοι!")
print(f"✓ Αποθηκεύτηκαν {len(top_foreis)} φορείς και {len(top_positions_demand)} θέσεις στο {out_file}!")