import glob
import os
import pandas as pd

dior_file = [
    f
    for f in glob.glob("raw_excel/*ΔΙΟΡΙΣΤΕΟΙ*.xlsx")
    if not os.path.basename(f).startswith("~$")
][0]
df = pd.read_excel(dior_file, header=4)

# Φιλτράρουμε μόνο Τοπογράφους
top = df[
    df["ΚΛΑΔΟΣ/ΕΙΔΙΚΟΤΗΤΑ"].str.contains("ΤΟΠΟΓΡΑΦ", na=False, case=False)
].copy()
top["score"] = (
    top["ΒΑΘΜΟΛΟΓΙΑ"].astype(str).str.replace(",", ".").astype(float)
)
top = top.sort_values(by="score", ascending=False)

print("ΠΡΑΓΜΑΤΙΚΟΙ TOP 10 ΤΟΠΟΓΡΑΦΟΙ ΣΤΟ MASTER EXCEL:")
for idx, (_, r) in enumerate(top.head(10).iterrows(), 1):
  print(
      f"{idx}. {r['ΕΠΩΝΥΜΟ']} {r['ΟΝΟΜΑ']} - Θέση: {r['ΚΩΔΙΚΟΣ ΘΕΣΗΣ']} -"
      f" Βαθμός: {r['score']}"
  )