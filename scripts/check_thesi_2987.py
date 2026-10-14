import json
import glob

chunks = glob.glob("web/public/data/chunks/*.json")
found = []

for c_path in chunks:
    with open(c_path, "r", encoding="utf-8") as f:
        records = json.load(f)
    for r in records:
        if str(r.get("thesi_diorismou", "")).replace(".0", "").strip() == "2987":
            found.append({
                "am": r.get("am"),
                "name": f"{r.get('eponymo')} {r.get('onoma')}",
                "vathmologia": r.get("vathmologia"),
                "kod_entop": r.get("kod_entopiotitas"),
                "monades_entop": r.get("monades_entop"),
                "thesi_entop": r.get("kod_thesi_entop"),
                "special": r.get("eidikes_idiotites") or r.get("idiotita")
            })

print(f"Στη θέση 2987 διορίστηκαν {len(found)} άτομα:")
for c in found:
    print(c)