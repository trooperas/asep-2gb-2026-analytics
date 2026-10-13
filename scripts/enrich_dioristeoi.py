import os
import json
import glob
import pandas as pd

print("=" * 60)
print("ENRICHING CANDIDATES WITH 'ΕΙΔΙΚΕΣ ΙΔΙΟΤΗΤΕΣ' FROM ΔΙΟΡΙΣΤΕΟΙ")
print("=" * 60)

dior_files = [
    f for f in glob.glob("raw_excel/*ΔΙΟΡΙΣΤΕΟΙ*.xlsx") 
    if not os.path.basename(f).startswith("~$")
]

if not dior_files:
    print("❌ Δεν βρέθηκε το αρχείο raw_excel/ΠΕ_ΔΙΟΡΙΣΤΕΟΙ.xlsx")
    exit(1)

dior_file = dior_files[0]
print(f"Διαβάζω: {dior_file}")

# Διαβάζουμε πρώτα χωρίς header για να βρούμε σε ποια γραμμή είναι το Α/Α ή Α.Μ.
df_raw = pd.read_excel(dior_file, header=None)

header_idx = None
for i in range(min(15, len(df_raw))):
    row_vals = [str(x).upper() for x in df_raw.iloc[i].values]
    if any("Α.Μ" in x or "Α/Α" in x or "ΕΠΩΝΥΜΟ" in x for x in row_vals):
        header_idx = i
        break

if header_idx is None:
    header_idx = 4  # Default fallback

print(f"Το header βρέθηκε στη γραμμή: {header_idx + 1}")

# Ξαναδιαβάζουμε με το σωστό header
df = pd.read_excel(dior_file, header=header_idx)

am_col = None
eidikes_col = None

for col in df.columns:
    col_str = str(col).upper()
    if "Α.Μ" in col_str or "ΑΜ" in col_str:
        am_col = col
    if "ΕΙΔΙΚΕΣ" in col_str or "ΙΔΙΟΤΗΤ" in col_str:
        eidikes_col = col

print(f"Στήλη Α.Μ.: '{am_col}'")
print(f"Στήλη Ειδικών Ιδιοτήτων: '{eidikes_col}'")

if not am_col or not eidikes_col:
    print("❌ Δεν βρέθηκαν οι στήλες. Διαθέσιμες στήλες:", list(df.columns))
    exit(1)

# Φτιάχνουμε λεξικό: { '13421': 'ΝΑΙ' }
dior_special = {}
for _, row in df.iterrows():
    val_am = str(row[am_col]).replace(".0", "").strip() if pd.notna(row[am_col]) else ""
    val_eid = str(row[eidikes_col]).strip().upper() if pd.notna(row[eidikes_col]) else ""
    if val_am and ("ΝΑΙ" in val_eid):
        dior_special[val_am] = "ΝΑΙ"

print(f"Βρέθηκαν {len(dior_special)} υποψήφιοι με ΕΙΔΙΚΕΣ ΙΔΙΟΤΗΤΕΣ = ΝΑΙ.")

# Ενημέρωση των chunks
chunk_files = glob.glob("web/public/data/chunks/*.json")
updated_chunks = 0
updated_candidates = 0

for c_path in chunk_files:
    with open(c_path, "r", encoding="utf-8") as f:
        records = json.load(f)
    
    changed = False
    for r in records:
        am_str = str(r.get("am", "")).replace(".0", "").strip()
        if am_str in dior_special:
            r["eidikes_idiotites"] = "ΝΑΙ"
            r["idiotita"] = "ΝΑΙ"
            changed = True
            updated_candidates += 1
            
    if changed:
        with open(c_path, "w", encoding="utf-8") as f:
            json.dump(records, f, ensure_ascii=False, indent=2)
        updated_chunks += 1

print(f"✓ Ενημερώθηκαν {updated_candidates} εγγραφές σε {updated_chunks} chunk files!")