import os
import json
import glob
import pandas as pd

print("=" * 65)
print("BUILDING POSITIONS INTEL DIRECTLY FROM MASTER ΔΙΟΡΙΣΤΕΟΙ EXCEL")
print("=" * 65)

# 1. Φόρτωση Master αρχείου ΔΙΟΡΙΣΤΕΟΙ
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

df = pd.read_excel(dior_file, header=h_idx)

# Στοχευμένη επιλογή των ακριβών στηλών
thesi_col = "ΚΩΔΙΚΟΣ ΘΕΣΗΣ" if "ΚΩΔΙΚΟΣ ΘΕΣΗΣ" in df.columns else [c for c in df.columns if "ΘΕΣΗ" in str(c).upper()][0]
vath_col = "ΒΑΘΜΟΛΟΓΙΑ" if "ΒΑΘΜΟΛΟΓΙΑ" in df.columns else [c for c in df.columns if "ΒΑΘΜ" in str(c).upper()][0]
entop_col = "ΕΝΤΟΠΙΟΤΗΤΑ" if "ΕΝΤΟΠΙΟΤΗΤΑ" in df.columns else [c for c in df.columns if "ΕΝΤΟΠ" in str(c).upper()][0]
eidikes_col = "ΕΙΔΙΚΕΣ ΙΔΙΟΤΗΤΕΣ" if "ΕΙΔΙΚΕΣ ΙΔΙΟΤΗΤΕΣ" in df.columns else [c for c in df.columns if "ΕΙΔΙΚΕΣ" in str(c).upper()][0]

print(f"✓ Στήλη Θέσης: '{thesi_col}'")
print(f"✓ Στήλη Βαθμολογίας: '{vath_col}'")
print(f"✓ Στήλη Εντοπιότητας: '{entop_col}'")
print(f"✓ Στήλη Ειδικών Ιδιοτήτων: '{eidikes_col}' (Ακριβής στήλη!)")

positions_intel = {}
special_positions_count = 0
entop_positions_count = 0

for _, row in df.iterrows():
    if pd.isna(row[thesi_col]):
        continue
    
    thesi_kod = str(row[thesi_col]).replace(".0", "").strip()
    if not thesi_kod:
        continue

    try:
        score = float(str(row[vath_col]).replace(",", ".").strip())
    except:
        continue

    # Εντοπιότητα (6 ή 7)
    entop_val = str(row[entop_col]).replace(".0", "").strip() if pd.notna(row[entop_col]) else "0"
    is_entop = entop_val in ["6", "7"]

    # Ειδική Κατηγορία: ΜΟΝΟ ΑΠΟ ΤΗ ΣΤΗΛΗ 'ΕΙΔΙΚΕΣ ΙΔΙΟΤΗΤΕΣ'
    is_spec = False
    if pd.notna(row[eidikes_col]):
        val_str = str(row[eidikes_col]).strip().upper()
        if "ΝΑΙ" in val_str or val_str == "ΝΑΙ":
            is_spec = True

    if thesi_kod not in positions_intel:
        positions_intel[thesi_kod] = {
            "scores": [],
            "has_entopiotita": False,
            "entop_types": set(),
            "has_special": False,
        }

    positions_intel[thesi_kod]["scores"].append(score)
    
    if is_entop:
        positions_intel[thesi_kod]["has_entopiotita"] = True
        positions_intel[thesi_kod]["entop_types"].add(f"Κωδ. {entop_val}")
        entop_positions_count += 1
        
    if is_spec:
        positions_intel[thesi_kod]["has_special"] = True
        special_positions_count += 1

# Τελική σύνοψη ανά κωδικό θέσης
final_output = {}
for kod, data in positions_intel.items():
    scores = data["scores"]
    final_output[kod] = {
        "min_score": round(min(scores), 2) if scores else 0,
        "max_score": round(max(scores), 2) if scores else 0,
        "count": len(scores),
        "has_entopiotita": data["has_entopiotita"],
        "entop_label": ", ".join(sorted(list(data["entop_types"]))) if data["entop_types"] else None,
        "has_special": data["has_special"], # 👈 True για τις 793 περιπτώσεις!
    }

out_path = "web/public/data/positions_intel.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(final_output, f, ensure_ascii=False, indent=2)

print("\n" + "=" * 65)
print(f"✓ Δημιουργήθηκε επιτυχώς το {out_path} για {len(final_output)} κωδικούς θέσεων!")
print(f"✓ Βρέθηκαν {special_positions_count} διορισμοί με ΕΙΔΙΚΗ ΚΑΤΗΓΟΡΙΑ (ΝΑΙ)!")
print(f"✓ Βρέθηκαν {entop_positions_count} διορισμοί με ΕΝΤΟΠΙΟΤΗΤΑ (Κωδ. 6/7)!")
print("=" * 65)