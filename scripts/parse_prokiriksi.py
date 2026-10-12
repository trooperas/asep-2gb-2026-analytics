"""
Parser για την προκήρυξη 2ΓΒ/2026 (md αρχείο)
Εξάγει όλες τις θέσεις σε positions.json
"""

import re
import json
from pathlib import Path
from collections import Counter

MD_FILE = Path("data/prokiriksi.md")
OUT_FILE = Path("data/positions.json")


def clean(text: str) -> str:
    """Καθαρίζει ένα string από περιττά κενά."""
    if text is None:
        return ""
    return str(text).strip().replace("\u00a0", " ")


def parse_edra(edra: str) -> dict:
    """
    Parse έδρα:
    'ΛΕΣΒΟΥ (ν. Λέσβος)' → {perifereia: 'ΛΕΣΒΟΥ', dimos: '', nomos: 'Λέσβος'}
    'ΞΑΝΘΗΣ (Δ. Αβδήρων)' → {perifereia: 'ΞΑΝΘΗΣ', dimos: 'Αβδήρων', nomos: ''}
    'ΚΕΝΤΡΙΚΟΥ ΤΟΜΕΑ ΑΘΗΝΩΝ' → {perifereia: 'ΚΕΝΤΡΙΚΟΥ ΤΟΜΕΑ ΑΘΗΝΩΝ', dimos: '', nomos: ''}
    """
    result = {"perifereia": "", "dimos": "", "nomos": ""}

    edra = clean(edra)
    if not edra:
        return result

    if "(" in edra and ")" in edra:
        main = edra.split("(")[0].strip()
        inside = edra.split("(")[1].split(")")[0].strip()

        result["perifereia"] = main

        if inside.startswith("Δ.") or inside.startswith("ΔΗΜΟΣ"):
            result["dimos"] = inside.replace("Δ.", "").replace("ΔΗΜΟΣ", "").strip()
        elif inside.startswith("ν.") or inside.startswith("Ν."):
            result["nomos"] = inside.replace("ν.", "").replace("Ν.", "").strip()
        else:
            result["dimos"] = inside
    else:
        result["perifereia"] = edra

    return result


def parse_positions() -> list:
    """
    Διαβάζει το md και εξάγει όλες τις θέσεις.
    
    Formats:
    - 10 pipes (9 columns): standard
    - 11 pipes (10 columns): 1 υπο-τμήμα
    - 12 pipes (11 columns): 2 υπο-τμήματα
    - 13 pipes (12 columns): 3 υπο-τμήματα
    """
    content = MD_FILE.read_text(encoding="utf-8")
    lines = content.split("\n")

    positions = []
    seen = set()

    for line in lines:
        if not line.startswith("|"):
            continue

        if not re.match(r"^\|\s*\d{3,4}\s*\|", line):
            continue

        parts = [clean(p) for p in line.split("|")[1:-1]]

        try:
            if len(parts) < 9:
                # Δεν είναι αρκετά
                continue

            # Σταθερές θέσεις: 1=kod, 2=eid, 3=organogram
            kod_thesis = parts[0]
            eidikotita = parts[1]
            kod_organogrammatos = parts[2]

            # Οι τελευταίες 4 στήλες: titloi, prosonta, entopiotita, theseis
            # Δηλαδή τα indices: -4, -3, -2, -1
            if len(parts) >= 9:
                titloi = parts[-4]
                prosonta = parts[-3]
                entopiotita = parts[-2]
                theseis = parts[-1]
            else:
                continue

            # Οι μεσαίες στήλες: foreas + (optional) υπο-τμήματα + edra
            # Δηλαδή τα indices: 3 έως (len - 4)
            middle = parts[3:-4]
            
            # Πάντα: foreas + edra (min 2 στήλες)
            if len(middle) < 2:
                continue

            foreas = middle[0]
            # Αν έχει παραπάνω, είναι υπο-τμήματα
            if len(middle) > 2:
                sub_departments = middle[1:-1]
                foreas_full = foreas + " — " + " — ".join(sub_departments)
            else:
                foreas_full = foreas

            edra_raw = middle[-1]

            # Έλεγχος
            if not kod_thesis.isdigit() or not theseis.isdigit():
                continue

        except (ValueError, IndexError):
            continue

        # Dedup
        if kod_thesis in seen:
            continue
        seen.add(kod_thesis)

        edra = parse_edra(edra_raw)

        positions.append({
            "kod_thesis": kod_thesis,
            "eidikotita": eidikotita,
            "kod_organogrammatos": kod_organogrammatos,
            "foreas": foreas_full,
            "foreas_main": foreas,  # Το κύριο, χωρίς υπο-τμήματα
            "edra": edra_raw,
            "perifereia": edra["perifereia"],
            "dimos": edra["dimos"],
            "nomos": edra["nomos"],
            "titloi": titloi,
            "prosonta": prosonta,
            "entopiotita": entopiotita,
            "theseis": int(theseis),
        })

    return positions


def main():
    print("=" * 60)
    print("Parser Προκήρυξης 2ΓΒ/2026")
    print("=" * 60)

    print(f"\nΔιάβασμα: {MD_FILE}")
    print(f"Μέγεθος: {MD_FILE.stat().st_size:,} bytes")

    positions = parse_positions()

    print(f"\nΒρέθηκαν: {len(positions):,} μοναδικές θέσεις")

    total_theseis = sum(p["theseis"] for p in positions)
    print(f"Συνολικές θέσεις (άθροισμα): {total_theseis:,}")

    # Top 10 φορείς
    foreis = Counter(p["foreas"] for p in positions)
    print(f"\nTop 10 φορείς (μοναδικές θέσεις):")
    for f, c in foreis.most_common(10):
        print(f"  {c:>5}  {f}")

    # Top 10 ειδικότητες
    eidikotites = Counter(p["eidikotita"] for p in positions)
    print(f"\nTop 10 ειδικότητες (μοναδικές θέσεις):")
    for e, c in eidikotites.most_common(10):
        print(f"  {c:>5}  {e}")

    # Top 10 περιφέρειες
    perifereies = Counter(p["perifereia"] for p in positions if p["perifereia"])
    print(f"\nTop 10 περιφέρειες (μοναδικές θέσεις):")
    for p, c in perifereies.most_common(10):
        print(f"  {c:>5}  {p}")

    # Save
    OUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT_FILE, "w", encoding="utf-8") as f:
        json.dump(positions, f, ensure_ascii=False, indent=2)

    print(f"\n✓ Αποθηκεύτηκαν στο: {OUT_FILE}")
    print(f"✓ Μέγεθος: {OUT_FILE.stat().st_size:,} bytes")

    # Δείγμα - δες διάφορα formats
    print("\n=== ΔΕΙΓΜΑΤΑ ===")
    for p in positions[:3]:
        print(json.dumps(p, ensure_ascii=False, indent=2))
        print("-" * 40)


if __name__ == "__main__":
    main()