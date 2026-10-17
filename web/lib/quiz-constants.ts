// Επίσημα στοιχεία Μητρώου Θεμάτων Γνώσεων ΑΣΕΠ (Ανακοίνωση 14/10/2026)
export const OFFICIAL_QUIZ_STATS = {
  TOTAL_QUESTIONS: 1988,
  TOTAL_CATEGORIES: 11,
  ANNOUNCEMENT_DATE: "14/10/2026",
};

export interface OfficialCategoryMeta {
  title: string;
  slug: string;
  officialCount: number;
  lastUpdate: string;
  desc: string;
  icon: string;
}

export const OFFICIAL_CATEGORIES: Record<string, OfficialCategoryMeta> = {
  "syntagmatiko-dikaio": {
    title: "Συνταγματικό Δίκαιο",
    slug: "syntagmatiko-dikaio",
    officialCount: 265,
    lastUpdate: "14/04/2026",
    desc: "Αρχές πολιτεύματος, ατομικά δικαιώματα, οργάνωση του κράτους και λειτουργία των θεσμών.",
    icon: "Scale",
  },
  "dioikitiko-dikaio": {
    title: "Διοικητικό Δίκαιο",
    slug: "dioikitiko-dikaio",
    officialCount: 303,
    lastUpdate: "25/06/2026 & 06/07/2026",
    desc: "Διοικητικές πράξεις, αρμοδιότητες, αρχή νομιμότητας και διοικητική οργάνωση.",
    icon: "FileText",
  },
  "evropaikoi-thesmoi-kai-dikaio": {
    title: "Ευρωπαϊκοί Θεσμοί και Δίκαιο",
    slug: "evropaikoi-thesmoi-kai-dikaio",
    officialCount: 189,
    lastUpdate: "03/04/2026",
    desc: "Όργανα Ε.Ε., συνθήκες, κανονισμοί, οδηγίες και ευρωπαϊκή έννομη τάξη.",
    icon: "Globe",
  },
  "oikonomikes-epistimes": {
    title: "Οικονομικές Επιστήμες",
    slug: "oikonomikes-epistimes",
    officialCount: 334,
    lastUpdate: "09/07/2026",
    desc: "Μικροοικονομία, μακροοικονομία, δημόσια οικονομικά και δημοσιονομική πολιτική.",
    icon: "TrendingUp",
  },
  "pliroforiki-kai-psifiaki-diakyvernisi": {
    title: "Πληροφορική και Ψηφιακή Διακυβέρνηση",
    slug: "pliroforiki-kai-psifiaki-diakyvernisi",
    officialCount: 257,
    lastUpdate: "18/09/2026",
    desc: "Ψηφιακές υπηρεσίες, δίκτυα, βάσεις δεδομένων, κυβερνοασφάλεια και gov.gr.",
    icon: "Cpu",
  },
  "sygchroni-istoria-tis-elladas": {
    title: "Σύγχρονη Ιστορία της Ελλάδας (1864 - σήμερα)",
    slug: "sygchroni-istoria-tis-elladas",
    officialCount: 144,
    lastUpdate: "03/04/2026",
    desc: "Κομβικά ιστορικά γεγονότα, πολιτικές εξελίξεις και συγκρότηση του ελληνικού κράτους.",
    icon: "History",
  },
  "ypallilikos-kodikas": {
    title: "Κώδικας Κατάστασης Πολιτικών Διοικητικών Υπαλλήλων και Υπαλλήλων Ν.Π.Δ.Δ.",
    slug: "ypallilikos-kodikas",
    officialCount: 121,
    lastUpdate: "03/04/2026",
    desc: "Δικαιώματα, καθήκοντα, υπηρεσιακή εξέλιξη, πειθαρχικό δίκαιο και αξιολόγηση.",
    icon: "BookOpen",
  },
  "gdpr-prostasia-dedomenon": {
    title: "Γενικός Κανονισμός για την Προστασία Δεδομένων (GDPR)",
    slug: "gdpr-prostasia-dedomenon",
    officialCount: 30,
    lastUpdate: "03/04/2026",
    desc: "Βασικές αρχές προστασίας προσωπικών δεδομένων, δικαιώματα πολιτών και υποχρεώσεις φορέων.",
    icon: "ShieldCheck",
  },
  "dioikisi-epicheiriseon-kai-organismon": {
    title: "Διοίκηση Επιχειρήσεων και Οργανισμών",
    slug: "dioikisi-epicheiriseon-kai-organismon",
    officialCount: 108,
    lastUpdate: "03/04/2026",
    desc: "Στρατηγικός σχεδιασμός, διαχείριση πόρων, στοχοθεσία και δημόσιο management.",
    icon: "Briefcase",
  },
  "dioikisi-anthropinoy-dynamikoy": {
    title: "Διοίκηση Ανθρώπινου Δυναμικού",
    slug: "dioikisi-anthropinoy-dynamikoy",
    officialCount: 151,
    lastUpdate: "03/04/2026",
    desc: "Στελέχωση, κίνητρα, διαχείριση ταλέντου, εκπαίδευση και ηγεσία.",
    icon: "Users",
  },
  "kodikas-symperiforas-dimosion-ypallilon": {
    title: "Κώδικας Συμπεριφοράς Δημοσίων Υπαλλήλων",
    slug: "kodikas-symperiforas-dimosion-ypallilon",
    officialCount: 86,
    lastUpdate: "03/04/2026",
    desc: "Κώδικας δεοντολογίας, καταπολέμηση διαφθοράς, εξυπηρέτηση ευάλωτων ομάδων.",
    icon: "Award",
  },
};

export const OFFICIAL_CATEGORIES_LIST = Object.values(OFFICIAL_CATEGORIES);