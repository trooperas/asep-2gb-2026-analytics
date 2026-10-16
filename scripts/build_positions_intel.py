import os
import json
import glob
import pandas as pd

print("=" * 65)
print("BUILDING BULLETPROOF POSITIONS INTEL DIRECTLY FROM MASTER EXCEL")
print("=" * 65)

# 1. Φόρτωση Master ΔΙΟΡΙΣΤΕΟΙ
dior_files = [
    f for f in glob.glob("raw_excel/*ΔΙΟΡΙΣΤΕΟΙ*.xlsx") 
    if not os.path.basename(f).startswith("~$")
]
if not dior_files:
    print("❌ Δεν βρέθηκε το αρχείο raw_excel/ΠΕ_ΔΙΟΡΙΣΤΕΟΙ.xlsx")
    exit(1)

dior_file = dior_files[0]
print(f"Διαβάζω Master αρχείο: {dior_file}")

df_raw = pd.read_excel(dior_file, header=None)
h_idx = 4
for i in range(min(12, len(df_raw))):
    vals = [str(x).upper() for x in df_raw.iloc[i].values]
    if any("Α.Μ" in x or "Α/Α" in x for x in vals):
        h_idx = i
        break

df_dior = pd.read_excel(dior_file, header=h_idx)

# Εντοπισμός στηλών
thesi_col = [c for c in df_dior.columns if "ΘΕΣΗ" in str(c).upper()][0]
vath_col = [c for c in df_dior.columns if "ΒΑΘΜ" in str(c).upper()][0]
entop_col = [c for c in df_dior.columns if "ΕΝΤΟΠ" in str(c).upper()][0]
eidikes_col = [c for c in df_dior.columns if "ΕΙΔΙΚ" in str(c).upper() or "ΙΔΙΟΤ" in str(c).upper()][0]

# Συλλογή θέσεων από το master αρχείο
positions_intel = {}

for _, row in df_dior.iterrows():
    if pd.isna(row[thesi_col]):
        continue
    thesi_kod = str(row[thesi_col]).replace(".0", "").strip()
    
    try:
        score = float(str(row[vath_col]).replace(",", ".").strip())
    except:
        continue

    is_spec = "ΝΑΙ" in str(row[eidikes_col]).upper() if pd.notna(row[eidikes_col]) else False
    entop_val = str(row[entop_col]).replace(".0", "").strip() if pd.notna(row[entop_col]) else "0"
    is_entop = entop_val in ["6", "7"]

    if thesi_kod not in positions_intel:
        positions_intel[thesi_kod] = {
            "scores": [],
            "has_entopiotita": False,
            "entop_types": set(),
            "has_special": False,
        }

    positions_intel[thesi_kod]["scores"].append(score)
    if is_spec:
        positions_intel[thesi_kod]["has_special"] = True
    if is_entop:
        positions_intel[thesi_kod]["has_entopiotita"] = True
        positions_intel[thesi_kod]["entop_types"].add(f"Κωδ. {entop_val}")

# Τελική σύνοψη
final_output = {}
for kod, data in positions_intel.items():
    scores = data["scores"]
    final_output[kod] = {
        "min_score": round(min(scores), 2) if scores else 0,
        "max_score": round(max(scores), 2) if scores else 0,
        "count": len(scores),
        "has_entopiotita": data["has_entopiotita"],
        "entop_label": ", ".join(sorted(list(data["entop_types"]))) if data["entop_types"] else None,
        "has_special": data["has_special"], # 👈 100% ΑΛΗΘΕΙΑ ΑΠΟ ΤΟ MASTER ΕΞΕΛ!
    }

out_path = "web/public/data/positions_intel.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(final_output, f, ensure_ascii=False, indent=2)

print(f"✓ Δημιουργήθηκε επιτυχώς το {out_path} για {len(final_output)} κωδικούς θέσεων!")