import json
import os
import re
from pathlib import Path

print("=" * 65)
print("ASEP 1.988 QUESTIONS - DATA PREPARATION & INDEXING")
print("=" * 65)

# Εντοπισμός του quizzes.json
src_candidates = [
    Path("web/public/data/quizzes.json"),
    Path("data/quizzes.json"),
    Path("quizzes.json")
]
src_file = None
for p in src_candidates:
    if p.exists():
        src_file = p
        break

if not src_file:
    print("❌ Δεν βρέθηκε το αρχείο quizzes.json. Τοποθετήστε το στο web/public/data/quizzes.json")
    exit(1)

print(f"Διαβάζω: {src_file}")
with open(src_file, "r", encoding="utf-8") as f:
    questions = json.load(f)

print(f"Συνολικές ερωτήσεις: {len(questions)}")

# Ελληνικά καθαρά ονόματα και slugs για τις 11 επίσημες ενότητες του ΑΣΕΠ
CATEGORY_META = {
    "syntagmatiko_dikaio": {
        "title": "Συνταγματικό Δίκαιο",
        "slug": "syntagmatiko-dikaio",
        "desc": "Αρχές πολιτεύματος, ατομικά δικαιώματα, οργάνωση του κράτους και λειτουργία των θεσμών.",
        "icon": "Scale"
    },
    "dioikitiko_dikaio": {
        "title": "Διοικητικό Δίκαιο",
        "slug": "dioikitiko-dikaio",
        "desc": "Διοικητικές πράξεις, αρμοδιότητες, αρχή νομιμότητας και διοικητική οργάνωση.",
        "icon": "FileText"
    },
    "evropaikoi_thesmoi": {
        "title": "Ευρωπαϊκοί Θεσμοί & Δίκαιο",
        "slug": "evropaikoi-thesmoi-kai-dikaio",
        "desc": "Όργανα Ε.Ε., συνθήκες, κανονισμοί, οδηγίες και ευρωπαϊκή έννομη τάξη.",
        "icon": "Globe"
    },
    "oikonomikes_epistimes": {
        "title": "Οικονομικές Επιστήμες",
        "slug": "oikonomikes-epistimes",
        "desc": "Μικροοικονομία, μακροοικονομία, δημόσια οικονομικά και δημοσιονομική πολιτική.",
        "icon": "TrendingUp"
    },
    "pliroforiki": {
        "title": "Πληροφορική & Ψηφιακή Διακυβέρνηση",
        "slug": "pliroforiki-kai-psifiaki-diakyvernisi",
        "desc": "Ψηφιακές υπηρεσίες, δίκτυα, βάσεις δεδομένων, κυβερνοασφάλεια και gov.gr.",
        "icon": "Cpu"
    },
    "istoria": {
        "title": "Σύγχρονη Ιστορία της Ελλάδας (1864 - σήμερα)",
        "slug": "sygchroni-istoria-tis-elladas",
        "desc": "Κομβικά ιστορικά γεγονότα, πολιτικές εξελίξεις και συγκρότηση του ελληνικού κράτους.",
        "icon": "History"
    },
    "ypallilikos_kodikas": {
        "title": "Κώδικας Κατάστασης Δημοσίων Υπαλλήλων",
        "slug": "ypallilikos-kodikas",
        "desc": "Δικαιώματα, καθήκοντα, υπηρεσιακή εξέλιξη, πειθαρχικό δίκαιο και αξιολόγηση.",
        "icon": "BookOpen"
    },
    "gdpr": {
        "title": "Γενικός Κανονισμός Προστασίας Δεδομένων (GDPR)",
        "slug": "gdpr-prostasia-dedomenon",
        "desc": "Βασικές αρχές προστασίας προσωπικών δεδομένων, δικαιώματα πολιτών και υποχρεώσεις φορέων.",
        "icon": "ShieldCheck"
    },
    "dioikisi_epicheiriseon": {
        "title": "Διοίκηση Επιχειρήσεων & Οργανισμών",
        "slug": "dioikisi-epicheiriseon-kai-organismon",
        "desc": "Στρατηγικός σχεδιασμός, διαχείριση πόρων, στοχοθεσία και δημόσιο management.",
        "icon": "Briefcase"
    },
    "anthropino_dynamiko": {
        "title": "Διοίκηση Ανθρώπινου Δυναμικού (HRM)",
        "slug": "dioikisi-anthropinoy-dynamikoy",
        "desc": "Στελέχωση, κίνητρα, διαχείριση ταλέντου, εκπαίδευση και ηγεσία.",
        "icon": "Users"
    },
    "kodikas_symperiforas": {
        "title": "Κώδικας Συμπεριφοράς Δημοσίων Υπαλλήλων",
        "slug": "kodikas-symperiforas-dimosion-ypallilon",
        "desc": "Κώδικας δεοντολογίας, καταπολέμηση διαφθοράς, εξυπηρέτηση ευάλωτων ομάδων.",
        "icon": "Award"
    }
}

# Κανονικοποίηση ερωτήσεων
normalized_questions = []
categories_stats = {}

for q in questions:
    cat_id = q.get("category_id", "").strip().lower()
    
    # Fuzzy matching με τα γνωστά IDs
    matched_key = None
    for k in CATEGORY_META.keys():
        if k in cat_id or cat_id in k:
            matched_key = k
            break
    if not matched_key:
        matched_key = cat_id

    meta = CATEGORY_META.get(matched_key, {
        "title": q.get("category_name", cat_id).title(),
        "slug": cat_id.replace("_", "-"),
        "desc": "Θέματα γνώσεων ΑΣΕΠ.",
        "icon": "FileText"
    })

    q_id = str(q.get("id", "")).strip()
    if not q_id:
        continue

    item = {
        "id": q_id,
        "category_id": matched_key,
        "category_title": meta["title"],
        "category_slug": meta["slug"],
        "question": q.get("question", "").strip(),
        "options": [str(opt).strip() for opt in q.get("options", [])],
        "correct_index": int(q.get("correct_index", 0))
    }
    normalized_questions.append(item)

    if meta["slug"] not in categories_stats:
        categories_stats[meta["slug"]] = {
            "title": meta["title"],
            "slug": meta["slug"],
            "category_id": matched_key,
            "desc": meta["desc"],
            "icon": meta["icon"],
            "count": 0
        }
    categories_stats[meta["slug"]]["count"] += 1

# Αποθήκευση στο web/public/data/
out_dir = Path("web/public/data")
out_dir.mkdir(parents=True, exist_ok=True)

with open(out_dir / "quizzes_clean.json", "w", encoding="utf-8") as f:
    json.dump(normalized_questions, f, ensure_ascii=False, indent=2)

categories_list = sorted(list(categories_stats.values()), key=lambda x: -x["count"])
with open(out_dir / "quiz_categories.json", "w", encoding="utf-8") as f:
    json.dump(categories_list, f, ensure_ascii=False, indent=2)

print(f"\n✓ Επιτυχής ολοκλήρωση!")
print(f"✓ Καθαρίστηκαν {len(normalized_questions)} ερωτήσεις σε {len(categories_list)} κατηγορίες.")
print(f"✓ Δημιουργήθηκαν: quizzes_clean.json & quiz_categories.json")