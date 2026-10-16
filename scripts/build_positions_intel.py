import os
import json
import glob
import pandas as pd

print("=" * 65)
print("BUILDING TRUE POSITIONS INTEL (ACCURATE BASES & MASTER SPECIAL QUOTAS)")
print("=" * 65)

# 1. Φόρτωση Master ΔΙΟΡΙΣΤΕΟΙ για Ειδικές Κατηγορίες (793 ΝΑΙ)
dior_files = [f for f in glob.glob("raw_excel/*ΔΙΟΡΙΣΤΕΟΙ*.xlsx") if not os.path.basename(f).startswith("~$")]
df_raw = pd.read_excel(dior_files[0], header=None)
h_idx = 4
for i in range(min(12, len(df_raw))):
    vals = [str(x).upper() for x in df_raw.iloc[i].values]
    if any("Α.Μ" in x or "Α/Α" in x for x in vals):
        h_idx = i
        break

df_dior = pd.read_excel(dior_files[0], header=h_idx)
thesi_col = [c for c in df_dior.columns if "ΘΕΣΗ" in str(c).upper()][0]
eidikes_col = "ΕΙΔΙΚΕΣ ΙΔΙΟΤΗΤΕΣ" if "ΕΙΔΙΚΕΣ ΙΔΙΟΤΗΤΕΣ" in df_dior.columns else [c for c in df_dior.columns if "ΕΙΔΙΚ" in str(c).upper()][0]

special_positions_set = set()
for _, row in df_dior.iterrows():
    if pd.notna(row[thesi_col]) and pd.notna(row[eidikes_col]):
        if "ΝΑΙ" in str(row[eidikes_col]).strip().upper():
            special_positions_set.add(str(row[thesi_col]).replace(".0", "").strip())

print(f"✓ Βρέθηκαν {len(special_positions_set)} θέσεις με ΕΙΔΙΚΗ ΚΑΤΗΓΟΡΙΑ (ΝΑΙ) από το master αρχείο.")

# 2. Ανάγνωση πραγματικών βαθμολογιών από τα νέα καθαρά chunks
chunks = glob.glob("web/public/data/chunks/*.json")
positions_intel = {}

for c_path in chunks:
    with open(c_path, "r", encoding="utf-8") as f:
        records = json.load(f)

    for r in records:
        thesi = r.get("thesi_diorismou")
        if not thesi:
            continue
        
        thesi_kod = str(thesi).replace(".0", "").strip()
        score = r.get("vathmologia")
        if score is None:
            continue

        try:
            score = float(score)
        except:
            continue

        clean_am = str(r.get("am", "")).replace(".0", "").strip()

        # Έλεγχος εντοπιότητας: ΜΟΝΟ αν η θέση είναι στο kod_thesi_entop
        thesi_entop_str = str(r.get("kod_thesi_entop", "") or "").replace(".0", "")
        entop_positions_list = [x.strip() for x in thesi_entop_str.split("-") if x.strip()]
        entop_kod = str(r.get("kod_entopiotitas", "")).replace(".0", "").strip()
        is_entop = (entop_kod in ["6", "7"]) and (thesi_kod in entop_positions_list)

        if thesi_kod not in positions_intel:
            positions_intel[thesi_kod] = {
                "candidates_by_am": {},
                "has_entopiotita": False,
                "entop_types": set(),
                "has_special": thesi_kod in special_positions_set
            }

        pos_data = positions_intel[thesi_kod]
        pos_data["candidates_by_am"][clean_am] = score

        if is_entop:
            pos_data["has_entopiotita"] = True
            pos_data["entop_types"].add(f"Κωδ. {entop_kod}")

final_output = {}
for kod, data in positions_intel.items():
    scores = list(data["candidates_by_am"].values())
    final_output[kod] = {
        "min_score": round(min(scores), 2) if scores else 0,
        "max_score": round(max(scores), 2) if scores else 0,
        "count": len(scores),
        "has_entopiotita": data["has_entopiotita"],
        "entop_label": ", ".join(sorted(list(data["entop_types"]))) if data["entop_types"] else None,
        "has_special": data["has_special"],
    }

out_path = "web/public/data/positions_intel.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(final_output, f, ensure_ascii=False, indent=2)

print(f"✓ Δημιουργήθηκε επιτυχώς το {out_path} για {len(final_output)} κωδικούς θέσεων!")