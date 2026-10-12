from pathlib import Path
import re

content = Path("./prokiriksi.md").read_text(encoding="utf-8")

print(f"Συνολικοί χαρακτήρες: {len(content):,}")
print(f"Συνολικές γραμμές: {content.count(chr(10)):,}")

# Βρες γραμμές που ξεκινάνε με | + 3-4 ψηφία
pattern = r'^\|\s*(\d{3,4})\s*\|'
matches = re.findall(pattern, content, re.MULTILINE)

print(f"\nΓραμμές με κωδικό θέσης (3-4 ψηφία): {len(matches):,}")
print(f"Πρώτοι 5 κωδικοί: {matches[:5]}")
print(f"Τελευταίοι 5 κωδικοί: {matches[-5:]}")

# Δες τη δομή μιας γραμμής
sample = re.search(r'^\|\s*\d{3,4}\s*\|.*$', content, re.MULTILINE)
if sample:
    print(f"\nΔείγμα γραμμής:")
    print(sample.group(0))
    print(f"\nΣτήλες (split by |): {sample.group(0).count('|')}")