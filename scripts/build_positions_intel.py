import os
import json
import glob

print("=" * 60)
print("BUILDING POSITIONS INTELLIGENCE (STRICT THESI_ENTOP CHECK)")
print("=" * 60)

chunks = glob.glob("web/public/data/chunks/*.json")
print(f"Διαβάζω {len(chunks)} chunk files...")

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

        # ΑΠΟΛΥΤΟΣ ΕΛΕΓΧΟΣ ΕΝΤΟΠΙΟΤΗΤΑΣ:
        # Πρέπει ο κωδικός της θέσης να είναι ΜΕΣΑ στις θέσεις που αφορά η εντοπιότητα (kod_thesi_entop)!
        thesi_entop_str = str(r.get("kod_thesi_entop", "") or "").replace(".0", "")
        entop_positions_list = [x.strip() for x in thesi_entop_str.split("-") if x.strip()]
        
        entop_kod = str(r.get("kod_entopiotitas", "")).replace(".0", "").strip()
        
        # Ισχύει εντοπιότητα ΜΟΝΟ αν ο κωδικός της θέσης διορισμού είναι στη λίστα των θέσεων εντοπιότητας!
        is_entop = (entop_kod in ["6", "7"]) and (thesi_kod in entop_positions_list)

        # Έλεγχος ειδικής κατηγορίας
        raw_id = str(r.get("idiotita", "")).strip().upper()
        raw_eid = str(r.get("eidikes_idiotites", "")).strip().upper()
        is_spec = (raw_eid == "ΝΑΙ" or raw_id == "ΝΑΙ" or (raw_id not in ["", "ΟΧΙ", "NAN", "NONE"]))

        cand_info = {
            "am": str(r.get("am", "")).replace(".0", "").strip(),
            "name": f"{r.get('eponymo', '')} {r.get('onoma', '')}".strip(),
            "score": score,
            "entop": entop_kod if is_entop else None,
            "special": is_spec
        }

        if thesi_kod not in positions_intel:
            positions_intel[thesi_kod] = {
                "scores": [],
                "has_entopiotita": False,
                "entop_types": set(),
                "has_special": False,
                "candidates": []
            }

        positions_intel[thesi_kod]["scores"].append(score)
        positions_intel[thesi_kod]["candidates"].append(cand_info)
        
        if is_entop:
            positions_intel[thesi_kod]["has_entopiotita"] = True
            positions_intel[thesi_kod]["entop_types"].add(f"Κωδ. {entop_kod}")
        if is_spec:
            positions_intel[thesi_kod]["has_special"] = True

# 2. Τελική σύνοψη ανά κωδικό θέσης
final_output = {}
for kod, data in positions_intel.items():
    scores = data["scores"]
    final_output[kod] = {
        "min_score": round(min(scores), 2) if scores else 0,
        "max_score": round(max(scores), 2) if scores else 0,
        "count": len(scores),
        "has_entopiotita": data["has_entopiotita"],
        "entop_label": ", ".join(sorted(list(data["entop_types"]))) if data["entop_types"] else None,
        "has_special": data["has_special"],
        "top_candidate": data["candidates"][0]["name"] if data["candidates"] else None
    }

out_path = "web/public/data/positions_intel.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(final_output, f, ensure_ascii=False, indent=2)

print(f"✓ Δημιουργήθηκε επιτυχώς το {out_path} για {len(final_output)} κωδικούς θέσεων!")