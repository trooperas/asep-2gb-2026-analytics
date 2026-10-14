import os
import json
import glob

print("=" * 60)
print("EXTRACTING 928 UNCLAIMED POSITIONS (ΚΕΝΕΣ ΘΕΣΕΙΣ)")
print("=" * 60)

# 1. Φόρτωση όλων των προκηρυχθεισών θέσεων
with open("web/public/data/positions.json", "r", encoding="utf-8") as f:
    positions = json.load(f)

print(f"Συνολικές προκηρυχθείσες θέσεις στο σύστημα: {len(positions)}")

# 2. Μέτρηση διορισμών ανά κωδικό θέσης από όλα τα chunks
chunks = glob.glob("web/public/data/chunks/*.json")
appointed_counts = {}

for c_path in chunks:
    with open(c_path, "r", encoding="utf-8") as f:
        records = json.load(f)
    for r in records:
        thesi = r.get("thesi_diorismou")
        if thesi:
            kod = str(thesi).replace(".0", "").strip()
            appointed_counts[kod] = appointed_counts.get(kod, 0) + 1

# 3. Εντοπισμός κενών θέσεων
kenes_theseis = []
total_vacant_slots = 0

for p in positions:
    kod = str(p.get("kod_thesis", "")).replace(".0", "").strip()
    total_slots = int(p.get("theseis", 1) or 1)
    appointed = appointed_counts.get(kod, 0)
    
    vacant = total_slots - appointed
    if vacant > 0:
        total_vacant_slots += vacant
        kenes_theseis.append({
            "kod_thesis": kod,
            "foreas": p.get("foreas", ""),
            "eidikotita": p.get("eidikotita", ""),
            "perifereia": p.get("perifereia", ""),
            "dimos": p.get("dimos", ""),
            "nomos": p.get("nomos", ""),
            "edra": p.get("edra", ""),
            "titloi": p.get("titloi", ""),
            "prosonta": p.get("prosonta", ""),
            "entopiotita": p.get("entopiotita", ""),
            "total_slots": total_slots,
            "appointed": appointed,
            "vacant": vacant
        })

# Ταξινόμηση ανά πλήθος κενών θέσεων (φθίνουσα)
kenes_theseis.sort(key=lambda x: -x["vacant"])

out_file = "web/public/data/kenes_theseis.json"
with open(out_file, "w", encoding="utf-8") as f:
    json.dump({
        "total_vacant_slots": total_vacant_slots,
        "total_unclaimed_codes": len(kenes_theseis),
        "positions": kenes_theseis
    }, f, ensure_ascii=False, indent=2)

print(f"✓ Βρέθηκαν {len(kenes_theseis)} κωδικοί θέσεων με {total_vacant_slots} συνολικά κενές θέσεις!")
print(f"✓ Αποθηκεύτηκαν στο {out_file}")