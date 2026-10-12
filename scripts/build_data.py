"""
ASEΡ 2ΓΒ/2026 - Data Pipeline
Διαβάζει 54 Excel, καθαρίζει, ενοποιεί, εξάγει JSON.
"""

import os
import re
import json
import glob
from pathlib import Path

import pandas as pd
import numpy as np

# ============ CONFIG ============
RAW_DIR = Path("raw_excel")
OUT_DIR = Path("data")
OUT_DIR.mkdir(exist_ok=True)

# Φύλλα που μας ενδιαφέρουν (το κύριο sheet κάθε Excel)
SHEET_PATTERN = "ΒΠ ΓΕΝ"  # Το κύριο sheet

# ============ HELPERS ============

def slugify(text: str) -> str:
    """Μετατρέπει ελληνικό κείμενο σε URL-friendly slug."""
    text = text.strip().lower()
    greek_map = {
        'α':'a','β':'v','γ':'g','δ':'d','ε':'e','ζ':'z','η':'i','θ':'th',
        'ι':'i','κ':'k','λ':'l','μ':'m','ν':'n','ξ':'x','ο':'o','π':'p',
        'ρ':'r','σ':'s','ς':'s','τ':'t','υ':'y','φ':'f','χ':'ch','ψ':'ps',
        'ω':'o','ά':'a','έ':'e','ή':'i','ί':'i','ό':'o','ύ':'y','ώ':'o',
        'ϊ':'i','ϋ':'y','ΐ':'i','ΰ':'y'
    }
    result = ''.join(greek_map.get(c, c) for c in text)
    result = re.sub(r'[^a-z0-9]+', '-', result)
    result = result.strip('-')
    return result


def clean_numeric(val):
    """Καθαρίζει αριθμητικές τιμές (π.χ. '80,78' -> 80.78)."""
    if pd.isna(val) or val == "":
        return None
    if isinstance(val, (int, float)):
        return float(val)
    try:
        return float(str(val).replace(',', '.').strip())
    except (ValueError, AttributeError):
        return None


def find_main_sheet(xls: pd.ExcelFile) -> str | None:
    """Βρίσκει το κύριο sheet (ΒΠ ΓΕΝ ή παρόμοιο)."""
    for sheet in xls.sheet_names:
        if "ΒΠ" in sheet.upper() and "ΓΕΝ" in sheet.upper():
            return sheet
    # fallback: πρώτο sheet
    return xls.sheet_names[0] if xls.sheet_names else None


# ============ LOADERS ============

def load_eidikotita(filepath: Path) -> dict | None:
    """Φορτώνει ένα Excel ειδικότητας και επιστρέφει dict με metadata + records."""
    try:
        xls = pd.ExcelFile(filepath)
    except Exception as e:
        print(f"  ✗ Σφάλμα ανάγνωσης {filepath.name}: {e}")
        return None

    sheet = find_main_sheet(xls)
    if not sheet:
        print(f"  ✗ Δεν βρέθηκε κύριο sheet στο {filepath.name}")
        return None

    # Διαβάζουμε χωρίς header γιατί οι πρώτες 6 γραμμές είναι τίτλοι
    df = pd.read_excel(xls, sheet_name=sheet, header=None)

    # Το όνομα της ειδικότητας βρίσκεται συνήθως στη γραμμή 5 (index 4)
    eidikotita_name = None
    for i in range(min(8, len(df))):
        val = df.iloc[i, 0]
        if isinstance(val, str) and val.startswith("ΠΕ "):
            eidikotita_name = val.strip()
            break
    if not eidikotita_name:
        eidikotita_name = filepath.stem.replace("_", " ")

    # Βρίσκουμε τη γραμμή header (περιέχει "Α/Α")
    header_row = None
    for i in range(len(df)):
        if df.iloc[i, 0] == "Α/Α":
            header_row = i
            break
    if header_row is None:
        print(f"  ✗ Δεν βρέθηκε header στο {filepath.name}")
        return None

    # Ξαναδιαβάζουμε με σωστό header
    df = pd.read_excel(xls, sheet_name=sheet, header=header_row)
    df = df.dropna(subset=["Α/Α"])
    df = df[pd.to_numeric(df["Α/Α"], errors="coerce").notna()]
    df["Α/Α"] = df["Α/Α"].astype(int)

    # Μετατροπή σε records
    records = []
    for _, row in df.iterrows():
        rec = {
            "aa": int(row["Α/Α"]),
            "am": str(row.get("Α.Μ. ΑΙΤΗΣΗΣ", "")).strip(),
            "eponymo": str(row.get("ΕΠΩΝΥΜΟ", "")).strip(),
            "onoma": str(row.get("ΟΝΟΜΑ", "")).strip(),
            "patronymo": str(row.get("ΠΑΤΡΩΝΥΜΟ", "")).strip(),
            "adt_masked": str(row.get("Α.Δ.Τ.", "")).strip(),  # ήδη ***972
            "omada_prosonton": str(row.get("ΟΜΑΔΑ ΠΡΟΣΟΝΤΩΝ", "")).strip(),
            "theseis_idias_omadas": str(row.get("ΘΕΣΕΙΣ ΠΟΥ ΑΦΟΡΟΥΝ ΤΗΝ ΙΔΙΑ ΟΜΑΔΑ ΠΡΟΣΟΝΤΩΝ", "")).strip(),
            "protimiseis": str(row.get("ΠΡΟΤΙΜΗΣΕΙΣ ΥΠΟΨΗΦΙΟΥ", "")).strip(),
            "thesi_diorismou": str(row.get("ΘΕΣΗ ΔΙΟΡΙΣΜΟΥ", "")).replace(".0", "").strip(),
            "idiotita": str(row.get("ΙΔΙΟΤΗΤΑ*", "")).strip(),
            "pinakas": str(row.get("ΠΙΝΑΚΑΣ", "")).strip(),
            "didaktoriko": str(row.get("ΔΙΔΑΚΤΟΡΙΚΟΣ ΤΙΤΛΟΣ", "")).strip(),
            "metaptyxiako": str(row.get("ΜΕΤΑΠΤΥΧΙΑΚΟΣ ΤΙΤΛΟΣ", "")).strip(),
            "enigaios_metaptyxiakos": str(row.get("ΕΝΙΑΙΟΣ ΚΑΙ ΑΔΙΑΣΠΑΣΤΟΣ ΤΙΤΛΟΣ ΜΕΤ. ΕΠΙΠΕΔΟΥ", "")).strip(),
            "xeni_glossa": str(row.get("ΑΡΙΣΤΗ ΓΝΩΣΗ ΞΕΝΗΣ ΓΛΩΣΣΑΣ", "")).strip(),
            "deuteri_xeni": str(row.get("ΔΕΥΤΕΡΗ ΑΡΙΣΤΗ ΓΝΩΣΗ ΞΕΝΗΣ ΓΛΩΣΣΑΣ", "")).strip(),
            "minas_empeirias": clean_numeric(row.get("ΑΡΙΘΜΟΣ ΜΗΝΩΝ ΕΜΠΕΙΡΙΑΣ")),
            "monades_empeirias": clean_numeric(row.get("ΜΟΝΑΔΕΣ ΓΙΑ ΤΗΝ ΕΜΠΕΙΡΙΑ")),
            "vevaiosi_kdbm": str(row.get("ΒΕΒΑΙΩΣΗ ΠΑΡΑΚΟΛΟΥΘΗΣΗΣ ΚΑΙ ΠΙΣΤΟΠΟΙΗΣΗΣ ΠΡΟΓΡΑΜΜΑΤΟΣ ΤΩΝ ΚΔΒΜ ΤΩΝ ΕΔ (άρθ.252, ν.5265/2026)", "")).strip(),
            "kod_entopiotitas": str(row.get("ΚΩΔΙΚΟΣ ΕΝΤΟΠΙΟΤΗΤΑΣ", "")).replace(".0", "").strip(),
            "kod_thesi_entop": str(row.get("ΚΩΔ. ΘΕΣΗΣ ΓΙΑ ΤΗΝ ΕΝΤΟΠΙΟΤΗΤΑ", "")).strip(),
            "monades_entop": clean_numeric(row.get("ΜΟΝΑΔΕΣ ΕΝΤΟΠΙΟΤΗΤΑΣ")),
            "math1": clean_numeric(row.get("Μαθ 1 : ΕΞΕΤΑΣΗ ΓΝΩΣΕΩΝ")),
            "math2": clean_numeric(row.get("Μαθ 2 : ΔΟΚΙΜΑΣΙΑ ΔΕΞΙΟΤΗΤΩΝ ΚΑΙ ΕΡΓΑΣΙΑΚΗΣ ΑΠΟΤΕΛΕΣΜΑΤΙΚΟΤΗΤΑΣ")),
            "synolo_graptou": clean_numeric(row.get("ΣΥΝΟΛΙΚΗ ΒΑΘΜΟΛΟΓΙΑ ΓΡΑΠΤΟΥ ΔΙΑΓΩΝΙΣΜΟΥ 1Γ/2025")),
            "seira_klirosis": clean_numeric(row.get("ΣΕΙΡΑ ΗΛΕΚΤΡΟΝΙΚΗΣ ΚΛΗΡΩΣΗΣ (παρ.4. άρθρ.15, ν.4765/2021)")),
            "vathmologia": clean_numeric(row.get("ΒΑΘΜΟΛΟΓΙΑ")),
        }
        # Καθάρισε κενά strings -> None
        for k, v in rec.items():
            if v == "" or v == "nan":
                rec[k] = None
        records.append(rec)

    return {
        "eidikotita": eidikotita_name,
        "slug": slugify(eidikotita_name),
        "source_file": filepath.name,
        "sheet_name": sheet,
        "count": len(records),
        "records": records,
    }


# ============ MAIN ============

def main():
    print("=" * 60)
    print("ASEΡ 2ΓΒ/2026 - Data Pipeline")
    print("=" * 60)

    excel_files = sorted(glob.glob(str(RAW_DIR / "*.xlsx")))
    print(f"\nΒρέθηκαν {len(excel_files)} Excel αρχεία.\n")

    eidikotites = []
    skipped = []

    for i, f in enumerate(excel_files, 1):
        filepath = Path(f)
        name = filepath.name
        print(f"[{i:02d}/{len(excel_files)}] {name}")

        # Παράλειψε τα 2 συγκεντρωτικά (θα τα χειριστούμε χωριστά)
        if "ΔΙΟΡΙΣΤΕΟΙ" in name.upper() or "ΑΠΟΡΡΙΠΤΕΟΙ" in name.upper():
            print(f"     → Παραλείπεται (συγκεντρωτικό)")
            skipped.append(name)
            continue

        data = load_eidikotita(filepath)
        if data:
            eidikotites.append(data)
            print(f"     ✓ {data['count']} εγγραφές | {data['eidikotita']}")

    # Αποθήκευση
    print("\n" + "=" * 60)
    print("Αποθήκευση JSON...")
    print("=" * 60)

    # 1. Όλες οι ειδικότητες
    all_eid = OUT_DIR / "eidikotites"
    all_eid.mkdir(exist_ok=True)
    for e in eidikotites:
        out = all_eid / f"{e['slug']}.json"
        with open(out, "w", encoding="utf-8") as fp:
            json.dump(e, fp, ensure_ascii=False, indent=2)
        print(f"  ✓ {out.name}")

    # 2. Index όλων των ειδικοτήτων
    index = [
        {
            "eidikotita": e["eidikotita"],
            "slug": e["slug"],
            "count": e["count"],
        }
        for e in eidikotites
    ]
    with open(OUT_DIR / "eidikotites_index.json", "w", encoding="utf-8") as fp:
        json.dump(index, fp, ensure_ascii=False, indent=2)

    # 3. Όλοι οι υποψήφιοι σε ένα flat αρχείο
    all_records = []
    for e in eidikotites:
        for rec in e["records"]:
            all_records.append({**rec, "eidikotita": e["eidikotita"], "slug": e["slug"]})

    with open(OUT_DIR / "all_candidates.json", "w", encoding="utf-8") as fp:
        json.dump(all_records, fp, ensure_ascii=False, indent=2)

    # 4. Στατιστικά
    total = sum(e["count"] for e in eidikotites)
    stats = {
        "total_eidikotites": len(eidikotites),
        "total_candidates": total,
        "top_eidikotites": sorted(index, key=lambda x: -x["count"])[:10],
    }
    with open(OUT_DIR / "stats_overview.json", "w", encoding="utf-8") as fp:
        json.dump(stats, fp, ensure_ascii=False, indent=2)

    print(f"\n✓ {len(eidikotites)} ειδικότητες, {total} υποψήφιοι")
    print(f"✓ Αποθηκεύτηκαν στο {OUT_DIR}/")


if __name__ == "__main__":
    main()