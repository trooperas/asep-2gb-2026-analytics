import json

# Φόρτωσε τα positions
positions = json.load(open("data/positions.json", encoding="utf-8"))

print(f"Σύνολο θέσεων: {len(positions)}")

# Πόσες έχουν κενό perifereia
empty = [p for p in positions if not p.get("perifereia")]
print(f"Κενά perifereia: {len(empty)}")

# Πόσες έχουν perifereia = "ΛΑΡΙΣΑΣ"
larisas = [p for p in positions if p.get("perifereia") == "ΛΑΡΙΣΑΣ"]
print(f"Με perifereia='ΛΑΡΙΣΑΣ': {len(larisas)}")

# Πόσες έχουν perifereia που περιέχει "ΛΑΡΙΣ"
laris_any = [p for p in positions if "ΛΑΡΙΣ" in (p.get("perifereia") or "")]
print(f"Που περιέχουν 'ΛΑΡΙΣ': {len(laris_any)}")

# Δείγματα
print("\n--- Δείγματα με 'ΛΑΡΙΣ' ---")
for p in laris_any[:3]:
    print(f"  {p['kod_thesis']}: perifereia='{p['perifereia']}', edra='{p['edra']}'")

# Πόσες έχουν perifereia = "" αλλά edra != ""
print("\n--- Κενά perifereia με edra ---")
for p in empty[:5]:
    print(f"  {p['kod_thesis']}: edra='{p['edra']}'")

# Πόσες έχουν perifereia = "ΘΕΣΣΑΛΙΑΣ"
thessalias = [p for p in positions if p.get("perifereia") == "ΘΕΣΣΑΛΙΑΣ"]
print(f"\nΜε perifereia='ΘΕΣΣΑΛΙΑΣ': {len(thessalias)}")

# Δες όλες τις μοναδικές perifereia
perifereies = set(p.get("perifereia") for p in positions if p.get("perifereia"))
print(f"\nΜοναδικές perifereia ({len(perifereies)}):")
for p in sorted(perifereies):
    print(f"  '{p}'")