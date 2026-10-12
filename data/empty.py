from pathlib import Path
import re

content = Path("./prokiriksi.md").read_text(encoding="utf-8")

# Πάρε όλες τις γραμμές με κωδικό
lines = content.split("\n")
with_kod = [l for l in lines if re.match(r'^\|\s*\d{3,4}\s*\|', l)]

print(f"Σύνολο: {len(with_kod)}")

# Πόσες πιάνει το regex μου;
my_pattern = re.compile(
    r"^\|\s*(\d{3,4})\s*\|"
    r"\s*([^|]+?)\s*\|"
    r"\s*(\d+)\s*\|"
    r"\s*([^|]+?)\s*\|"
    r"\s*([^|]+?)\s*\|"
    r"\s*([^|]*?)\s*\|"
    r"\s*([^|]*?)\s*\|"
    r"\s*([^|]*?)\s*\|"
    r"\s*(\d+)\s*\|"
)

matched = [l for l in with_kod if my_pattern.match(l)]
not_matched = [l for l in with_kod if not my_pattern.match(l)]

print(f"Matched: {len(matched)}")
print(f"NOT matched: {len(not_matched)}")

print("\n=== Πρώτες 10 που ΔΕΝ πιάστηκαν ===")
for l in not_matched[:10]:
    print(f"\n[{l.count('|')} pipes]")
    print(l[:250])