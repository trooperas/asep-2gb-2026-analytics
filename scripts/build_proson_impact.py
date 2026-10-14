import os
import json
import glob

print("=" * 60)
print("COMPUTING QUALIFICATIONS & LOCALITY IMPACT (BONUS POINTS ROI)")
print("=" * 60)

chunks = glob.glob("web/public/data/chunks/*.json")
total_appointed = 0
appointed_with_metapt = 0
appointed_with_didakt = 0
appointed_with_entop = 0
appointed_with_empeiria = 0
appointed_with_xeni = 0

entop_by_category = {"6": 0, "7": 0}

for c_path in chunks:
    with open(c_path, "r", encoding="utf-8") as f:
        records = json.load(f)

    for r in records:
        if not r.get("thesi_diorismou"):
            continue
        
        total_appointed += 1
        
        # Μεταπτυχιακό
        if r.get("metaptyxiako"):
            appointed_with_metapt += 1
        
        # Διδακτορικό
        if r.get("didaktoriko"):
            appointed_with_didakt += 1
            
        # Εμπειρία
        if r.get("monades_empeirias") and float(r.get("monades_empeirias") or 0) > 0:
            appointed_with_empeiria += 1
            
        # Ξένη Γλώσσα
        if r.get("xeni_glossa"):
            appointed_with_xeni += 1
            
        # Εντοπιότητα (πραγματική)
        thesi_kod = str(r.get("thesi_diorismou", "")).replace(".0", "").strip()
        thesi_entop_str = str(r.get("kod_thesi_entop", "") or "").replace(".0", "")
        entop_positions = [x.strip() for x in thesi_entop_str.split("-") if x.strip()]
        entop_kod = str(r.get("kod_entopiotitas", "")).replace(".0", "").strip()
        
        if (entop_kod in ["6", "7"]) and (thesi_kod in entop_positions):
            appointed_with_entop += 1
            entop_by_category[entop_kod] = entop_by_category.get(entop_kod, 0) + 1

output_data = {
    "total_appointed": total_appointed,
    "appointed_with_metapt": appointed_with_metapt,
    "metapt_pct": round((appointed_with_metapt / total_appointed) * 100, 1) if total_appointed else 0,
    "appointed_with_didakt": appointed_with_didakt,
    "didakt_pct": round((appointed_with_didakt / total_appointed) * 100, 1) if total_appointed else 0,
    "appointed_with_empeiria": appointed_with_empeiria,
    "empeiria_pct": round((appointed_with_empeiria / total_appointed) * 100, 1) if total_appointed else 0,
    "appointed_with_xeni": appointed_with_xeni,
    "xeni_pct": round((appointed_with_xeni / total_appointed) * 100, 1) if total_appointed else 0,
    "appointed_with_entop": appointed_with_entop,
    "entop_pct": round((appointed_with_entop / total_appointed) * 100, 1) if total_appointed else 0,
    "entop_by_category": entop_by_category
}

out_file = "web/public/data/proson_impact.json"
with open(out_file, "w", encoding="utf-8") as f:
    json.dump(output_data, f, ensure_ascii=False, indent=2)

print(f"✓ Συνολικοί Διοριστέοι που αναλύθηκαν: {total_appointed}")
print(f"✓ Μεταπτυχιακό: {appointed_with_metapt} ({output_data['metapt_pct']}%)")
print(f"✓ Εντοπιότητα (Κωδ. 6/7): {appointed_with_entop} ({output_data['entop_pct']}%)")
print(f"✓ Αποθηκεύτηκε στο {out_file}!")