import os
import json
import glob

print("=" * 60)
print("BUILDING DEDUPLICATED POSITIONS INTEL")
print("=" * 60)

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

        # Έλεγχος εντοπιότητας (ΜΟΝΟ αν η θέση είναι στο kod_thesi_entop)
        thesi_entop_str = str(r.get("kod_thesi_entop", "") or "").replace(".0", "")
        entop_positions_list = [x.strip() for x in thesi_entop_str.split("-") if x.strip()]
        entop_kod = str(r.get("kod_entopiotitas", "")).replace(".0", "").strip()
        is_entop = (entop_kod in ["6", "7"]) and (thesi_kod in entop_positions_list)

        # Έλεγχος ειδικής κατηγορίας
        raw_id = str(r.get("idiotita", "")).strip().upper()
        raw_eid = str(r.get("eidikes_idiotites", "")).strip().upper()
        is_spec = (raw_eid == "ΝΑΙ" or raw_id == "ΝΑΙ" or (raw_id not in ["", "ΟΧΙ", "NAN", "NONE"]))

        if thesi_kod not in positions_intel:
            positions_intel[thesi_kod] = {
                "candidates_by_am": {}, # 👈 DEDUPLICATION BY AM!
                "has_entopiotita": False,
                "entop_types": set(),
                "has_special": False,
            }

        pos_data = positions_intel[thesi_kod]

        # Αν υπάρχει ήδη ο υποψήφιος, κρατάμε τη ΜΕΓΙΣΤΗ βαθμολογία του!
        if clean_am not in pos_data["candidates_by_am"]:
            pos_data["candidates_by_am"][clean_am] = score
        else:
            pos_data["candidates_by_am"][clean_am] = max(pos_data["candidates_by_am"][clean_am], score)

        if is_entop:
            pos_data["has_entopiotita"] = True
            pos_data["entop_types"].add(f"Κωδ. {entop_kod}")
        if is_spec:
            pos_data["has_special"] = True

# Τελική σύνοψη με μοναδικούς υποψηφίους ανά θέση
final_output = {}
for kod, data in positions_intel.items():
    scores = list(data["candidates_by_am"].values())
    final_output[kod] = {
        "min_score": round(min(scores), 2) if scores else 0,
        "max_score": round(max(scores), 2) if scores else 0,
        "count": len(scores), # 👈 Αληθινό πλήθος μοναδικών προσώπων!
        "has_entopiotita": data["has_entopiotita"],
        "entop_label": ", ".join(sorted(list(data["entop_types"]))) if data["entop_types"] else None,
        "has_special": data["has_special"],
    }

out_path = "web/public/data/positions_intel.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(final_output, f, ensure_ascii=False, indent=2)

print(f"✓ Δημιουργήθηκε επιτυχώς το {out_path} για {len(final_output)} κωδικούς θέσεων!")