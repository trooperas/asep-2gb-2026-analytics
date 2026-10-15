import os
import json
import glob
import pandas as pd
from pathlib import Path

print("=" * 65)
print("ASEP 2ΓΒ/2026 - MASTER DATA UNIFIER & DEDUPLICATOR")
print("Aligning Specialty Records with Official ΔΙΟΡΙΣΤΕΟΙ Master File")
print("=" * 65)

# 1. Φόρτωση του Master Excel ΔΙΟΡΙΣΤΕΟΙ
dior_files = [
    f for f in glob.glob("raw_excel/*ΔΙΟΡΙΣΤΕΟΙ*.xlsx") 
    if not os.path.basename(f).startswith("~$")
]
if not dior_files:
    print("❌ Δεν βρέθηκε το αρχείο raw_excel/ΠΕ_ΔΙΟΡΙΣΤΕΟΙ.xlsx")
    exit(1)

dior_file = dior_files[0]
print(f"1. Διαβάζω Master ΔΙΟΡΙΣΤΕΟΙ: {dior_file}")

# Βρίσκουμε το header row του ΔΙΟΡΙΣΤΕΟΙ
df_raw = pd.read_excel(dior_file, header=None)
h_idx = 4
for i in range(min(12, len(df_raw))):
    vals = [str(x).upper() for x in df_raw.iloc[i].values]
    if any("Α.Μ" in x or "Α/Α" in x for x in vals):
        h_idx = i
        break

df_dior = pd.read_excel(dior_file, header=h_idx)

# Καθαρισμός στηλών Διοριστέων
am_col = [c for c in df_dior.columns if "Α.Μ" in str(c).upper() or "ΑΜ" in str(c).upper()][0]
thesi_col = [c for c in df_dior.columns if "ΘΕΣΗ" in str(c).upper()][0]
vath_col = [c for c in df_dior.columns if "ΒΑΘΜ" in str(c).upper()][0]
entop_col = [c for c in df_dior.columns if "ΕΝΤΟΠ" in str(c).upper()][0]
eidikes_col = [c for c in df_dior.columns if "ΕΙΔΙΚ" in str(c).upper() or "ΙΔΙΟΤ" in str(c).upper()][0]

master_dioristeoi = {}
for _, row in df_dior.iterrows():
    if pd.isna(row[am_col]):
        continue
    am_clean = str(row[am_col]).replace(".0", "").strip()
    thesi_clean = str(row[thesi_col]).replace(".0", "").strip()
    
    try:
        score_val = float(str(row[vath_col]).replace(",", ".").strip())
    except:
        score_val = 0.0

    entop_val = str(row[entop_col]).replace(".0", "").strip() if pd.notna(row[entop_col]) else "0"
    is_spec = "ΝΑΙ" in str(row[eidikes_col]).upper() if pd.notna(row[eidikes_col]) else False

    master_dioristeoi[am_clean] = {
        "thesi": thesi_clean,
        "score": score_val,
        "entopiotita": entop_val,
        "is_special": is_spec
    }

print(f"   ✓ Φορτώθηκαν {len(master_dioristeoi)} επίσημοι διοριστέοι από το master αρχείο.")

# 2. Επεξεργασία και Deduplication όλων των chunks
chunk_files = sorted(glob.glob("web/public/data/chunks/*.json"))
print(f"\n2. Επεξεργασία {len(chunk_files)} chunk files...")

# Ομαδοποίηση όλων των εγγραφών ανά (AM, slug)
all_cleaned_records = []
am_slug_groups = {}

for c_path in chunk_files:
    with open(c_path, "r", encoding="utf-8") as f:
        records = json.load(f)
    
    for r in records:
        am_clean = str(r.get("am", "")).replace(".0", "").strip()
        slug = r.get("slug", "")
        if not am_clean or not slug:
            continue
        
        key = (am_clean, slug)
        if key not in am_slug_groups:
            am_slug_groups[key] = []
        am_slug_groups[key].append(r)

print(f"   ✓ Βρέθηκαν {len(am_slug_groups)} μοναδικά ζεύγη (Υποψήφιος, Ειδικότητα).")

# 3. Επιλογή της ΜΙΑΣ και μοναδικής σωστής γραμμής ανά ειδικότητα
total_duplicates_removed = 0

for (am_clean, slug), rows in am_slug_groups.items():
    if len(rows) == 1:
        chosen_row = rows[0]
    else:
        total_duplicates_removed += (len(rows) - 1)
        # Αν είναι διοριστέος στο master αρχείο
        if am_clean in master_dioristeoi:
            official = master_dioristeoi[am_clean]
            # Ψάχνουμε τη γραμμή που ταιριάζει ΑΠΟΛΥΤΑ με την επίσημη βαθμολογία ή τη θέση
            matched = None
            for row in rows:
                row_thesi = str(row.get("thesi_diorismou", "")).replace(".0", "").strip()
                row_vath = float(row.get("vathmologia") or 0)
                if row_thesi == official["thesi"] and abs(row_vath - official["score"]) < 0.05:
                    matched = row
                    break
            
            if not matched:
                # Fallback: ταίριασμα με τη θέση
                for row in rows:
                    if str(row.get("thesi_diorismou", "")).replace(".0", "").strip() == official["thesi"]:
                        matched = row
                        break
            
            chosen_row = matched if matched else rows[0]
        else:
            # Μη διοριστέος: κράτα τη βασική γραμμή (χωρίς έξτρα εντοπιότητα)
            # δηλαδή αυτή με τη μικρότερη βαθμολογία ή με kod_entopiotitas == '0'
            matched = None
            for row in rows:
                if str(row.get("kod_entopiotitas", "")).strip() in ["0", "", "None"]:
                    matched = row
                    break
            chosen_row = matched if matched else rows[-1]

    # Εμπλουτισμός / Διόρθωση με βάση το Master αρχείο Διοριστέων
    if am_clean in master_dioristeoi:
        off = master_dioristeoi[am_clean]
        chosen_row["thesi_diorismou"] = off["thesi"]
        chosen_row["vathmologia"] = off["score"]
        if off["is_special"]:
            chosen_row["eidikes_idiotites"] = "ΝΑΙ"
            chosen_row["idiotita"] = "ΝΑΙ"
        else:
            chosen_row["eidikes_idiotites"] = "ΟΧΙ"
            chosen_row["idiotita"] = ""
    else:
        chosen_row["thesi_diorismou"] = None

    all_cleaned_records.append(chosen_row)

print(f"   ✓ Αφαιρέθηκαν {total_duplicates_removed} διπλότυπες εγγραφές εντός της ίδιας ειδικότητας!")

# 4. Αποθήκευση καθαρού all_candidates.json
with open("data/all_candidates.json", "w", encoding="utf-8") as f:
    json.dump(all_cleaned_records, f, ensure_ascii=False, indent=2)
print("   ✓ Ενημερώθηκε το data/all_candidates.json")

# 5. Αναδημιουργία των chunks ανά 1.000 records
from collections import defaultdict
by_slug = defaultdict(list)
for r in all_cleaned_records:
    by_slug[r["slug"]].append(r)

chunk_index = {}
CHUNK_SIZE = 1000

# Καθαρισμός παλιών chunks
chunks_dir = Path("web/public/data/chunks")
chunks_dir.mkdir(parents=True, exist_ok=True)
for old_f in chunks_dir.glob("*.json"):
    try:
        os.remove(old_f)
    except:
        pass

for slug, recs in by_slug.items():
    # Ταξινόμηση ανά βαθμολογία φθίνουσα
    recs.sort(key=lambda x: float(x.get("vathmologia") or 0), reverse=True)
    # Επανυπολογισμός σειράς (aa)
    for idx, item in enumerate(recs, 1):
        item["aa"] = idx

    chunk_index[slug] = []
    for i in range(0, len(recs), CHUNK_SIZE):
        chunk_slice = recs[i:i + CHUNK_SIZE]
        chunk_name = f"{slug}__{i // CHUNK_SIZE}.json"
        with open(chunks_dir / chunk_name, "w", encoding="utf-8") as f:
            json.dump(chunk_slice, f, ensure_ascii=False, indent=2)
        chunk_index[slug].append(chunk_name)

with open("web/public/data/chunk_index.json", "w", encoding="utf-8") as f:
    json.dump(chunk_index, f, ensure_ascii=False, indent=2)

print("   ✓ Αναδημιουργήθηκαν όλα τα chunks στο web/public/data/chunks/ με 100% καθαρά δεδομένα!")