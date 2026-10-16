import glob
import pandas as pd
import os

dior_files = [f for f in glob.glob("raw_excel/*ΔΙΟΡΙΣΤΕΟΙ*.xlsx") if not os.path.basename(f).startswith("~$")]
df_raw = pd.read_excel(dior_files[0], header=None)

h_idx = 4
for i in range(min(12, len(df_raw))):
    vals = [str(x).upper() for x in df_raw.iloc[i].values]
    if any("Α.Μ" in x or "Α/Α" in x for x in vals):
        h_idx = i
        break

df = pd.read_excel(dior_files[0], header=h_idx)

print("ΟΛΕΣ ΟΙ ΣΤΗΛΕΣ ΤΟΥ EXCEL:")
for idx, col in enumerate(df.columns):
    print(f"[{idx}] '{col}'")

print("\nΔΕΙΓΜΑ ΤΙΜΩΝ ΣΤΗΛΩΝ ΠΟΥ ΜΠΟΡΕΙ ΝΑ ΕΙΝΑΙ ΟΙ ΕΙΔΙΚΕΣ ΙΔΙΟΤΗΤΕΣ:")
for col in df.columns:
    unique_vals = [str(x) for x in df[col].dropna().unique()[:8]]
    if any("ΝΑΙ" in str(x).upper() or "NAI" in str(x).upper() or "ΕΙΔΙΚ" in str(col).upper() or "ΙΔΙΟΤ" in str(col).upper() for x in unique_vals + [str(col)]):
        print(f"\nΣτήλη '{col}':")
        print(f"  Μοναδικές τιμές: {df[col].dropna().unique()[:10]}")
        print(f"  Πλήθος μη-κενών: {df[col].notna().sum()}")