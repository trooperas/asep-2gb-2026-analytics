import json
from pathlib import Path
from collections import Counter

data = json.loads(Path("data/all_candidates.json").read_text(encoding="utf-8"))

# Πόσοι έχουν θέση διορισμού
dioristoi = [r for r in data if r.get("thesi_diorismou")]
print(f"Σύνολο υποψηφίων: {len(data):,}")
print(f"Διοριστέοι: {len(dioristoi):,}")
print(f"Ποσοστό: {len(dioristoi)/len(data)*100:.1f}%")

# Top 10 ειδικότητες
print("\n=== Top 10 ειδικότητες ===")
c = Counter(r["eidikotita"] for r in data)
for eid, cnt in c.most_common(10):
    print(f"  {cnt:>5}  {eid}")

# Κατανομή βαθμολογίας διοριστέων
vaths = [r["vathmologia"] for r in dioristoi if r.get("vathmologia")]
if vaths:
    print(f"\n=== Βαθμολογίες διοριστέων ===")
    print(f"  Min: {min(vaths):.2f}")
    print(f"  Max: {max(vaths):.2f}")
    print(f"  Μέση: {sum(vaths)/len(vaths):.2f}")

# Πόσοι με εντοπιότητα
entop = [r for r in data if r.get("kod_entopiotitas")]
print(f"\n=== Εντοπιότητα ===")
print(f"  Με κωδικό εντοπιότητας: {len(entop):,}")

# Πόσοι με μεταπτυχιακό/διδακτορικό
met = [r for r in data if r.get("metaptyxiako")]
did = [r for r in data if r.get("didaktoriko")]
print(f"\n=== Τίτλοι ===")
print(f"  Με μεταπτυχιακό: {len(met):,}")
print(f"  Με διδακτορικό: {len(did):,}")