import json

try:
    with open('data/all_candidates.json', 'r', encoding='utf-8') as f:
        candidates = json.load(f)

    for c in candidates:
        if 'ΚΙΛΕΤΣΗ' in str(c.get('eponymo', '')):
            print("=== ΒΡΕΘΗΚΕ Η ΚΙΛΕΤΣΗ ===")
            for k, v in c.items():
                if v:
                    print(f"{k}: {v}")
            break
    else:
        print("Δεν βρέθηκε η ΚΙΛΕΤΣΗ.")
except Exception as e:
    print(f"Σφάλμα: {e}")