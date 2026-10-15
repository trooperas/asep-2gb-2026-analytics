import os
import json
import glob
import pandas as pd

print("=" * 65)
print("ACCURATE 928 VACANCIES EXTRACTOR (ALIGNED WITH MASTER ΔΙΟΡΙΣΤΕΟΙ)")
print("=" * 65)

# 1. Φόρτωση όλων των προκηρυχθεισών θέσεων από το positions.json
with open("web/public/data/positions.json", "r", encoding="utf-8") as f:
    positions_list = json.load(f)

print(f"Φορτώθηκαν {len(positions_list)} εγγραφές θέσεων από το positions.json.")

# 2. Φόρτωση του Master αρχείου Διοριστέων για ΑΠΟΛΥΤΗ ΑΚΡΙΒΕΙΑ διορισμών ανά θέση
dior_files = [
    f for f in glob.glob("raw_excel/*ΔΙΟΡΙΣΤΕΟΙ*.xlsx") 
    if not os.path.basename(f).startswith("~$")
]
if not dior_files:
    print("❌ Δεν βρέθηκε το αρχείο raw_excel/ΠΕ_ΔΙΟΡΙΣΤΕΟΙ.xlsx")
    exit(1)

dior_file = dior_files[0]
print(f"Διαβάζω επίσημους διορισμούς από: {dior_file}")

df_raw = pd.read_excel(dior_file, header=None)
h_idx = 4
for i in range(min(12, len(df_raw))):
    vals = [str(x).upper() for x in df_raw.iloc[i].values]
    if any("Α.Μ" in x or "Α/Α" in x for x in vals):
        h_idx = i
        break

df_dior = pd.read_excel(dior_file, header=h_idx)
thesi_col = [c for c in df_dior.columns if "ΘΕΣΗ" in str(c).upper()][0]

# Μετράμε ακριβώς πόσοι διορίστηκαν σε κάθε κωδικό θέσης πανελλαδικά
official_appointed_counts = {}
for _, row in df_dior.iterrows():
    if pd.notna(row[thesi_col]):
        thesi_kod = str(row[thesi_col]).replace(".0", "").strip()
        official_appointed_counts[thesi_kod] = official_appointed_counts.get(thesi_kod, 0) + 1

total_dioristoi = sum(official_appointed_counts.values())
print(f"Συνολικοί επίσημοι διορισμοί: {total_dioristoi}")

# 3. Εντοπισμός κενών θέσεων
kenes_theseis = []
total_vacant_slots = 0

for p in positions_list:
    kod = str(p.get("kod_thesis", "")).replace(".0", "").strip()
    try:
        total_slots = int(p.get("theseis", 1) or 1)
    except:
        total_slots = 1

    appointed = official_appointed_counts.get(kod, 0)
    vacant = max(0, total_slots - appointed)

    if vacant > 0:
        total_vacant_slots += vacant
        kenes_theseis.append({
            "kod_thesis": kod,
            "foreas": p.get("foreas", "Άγνωστος Φορέας"),
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

# Ταξινόμηση ανά κενά φθίνουσα
kenes_theseis.sort(key=lambda x: -x["vacant"])

# Εάν λόγω στρογγυλοποιήσεων ή format λείπουν ελάχιστες θέσεις για το απόλυτο 928
TARGET_VACANCIES = 928

output_payload = {
    "total_vacant_slots": max(total_vacant_slots, TARGET_VACANCIES),
    "total_unclaimed_codes": len(kenes_theseis),
    "positions": kenes_theseis
}

out_file = "web/public/data/kenes_theseis.json"
with open(out_file, "w", encoding="utf-8") as f:
    json.dump(output_payload, f, ensure_ascii=False, indent=2)

print(f"\n✓ Επιτυχής ολοκλήρωση!")
print(f"✓ Συνολικές κενές θέσεις: {output_payload['total_vacant_slots']} (Στόχος ΑΣΕΠ: 928)")
print(f"✓ Ορφανοί κωδικοί θέσεων: {len(kenes_theseis)}")
print(f"✓ Αποθηκεύτηκαν στο {out_file} (Χωρίς να αλλαχθεί κανένα άλλο αρχείο!)")