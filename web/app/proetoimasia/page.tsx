import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Scale,
  FileText,
  Globe,
  TrendingUp,
  Cpu,
  History,
  ShieldCheck,
  Briefcase,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  ExternalLink,
  HelpCircle,
  Compass,
  CheckCircle2,
} from "lucide-react";
import {
  OFFICIAL_QUIZ_STATS,
  OFFICIAL_CATEGORIES_LIST,
} from "@/lib/quiz-constants";

export const metadata = {
  title: "Μητρώο Θεμάτων Γνώσεων ΑΣΕΠ (1.988 Ερωτήσεις) — Προετοιμασία 3ος Διαγωνισμός 2027",
  description:
    "Πλήρης τράπεζα θεμάτων και δωρεάν τεστ προσομοίωσης για τις 1.988 επίσημες ερωτήσεις γνώσεων του ΑΣΕΠ (ν. 4765/2021). 11 θεματικές ενότητες για κατηγορίες ΠΕ και ΤΕ.",
  keywords: [
    "μητρωο θεματων ασεπ",
    "θεματα γνωσεων ασεπ 1988",
    "προετοιμασια γραπτου διαγωνισμου ασεπ 2027",
    "τεστ γνωσεων ασεπ κουιζ",
    "τραπεζα θεματων ασεπ",
    "συνταγματικο δικαιο ασεπ ερωτησεις",
    "διοικητικο δικαιο ασεπ",
    "πληροφορικη ψηφιακη διακυβερνηση ασεπ",
  ],
  openGraph: {
    title: "Μητρώο 1.988 Θεμάτων ΑΣΕΠ — Δωρεάν Τεστ & Επίσημες Απαντήσεις",
    description:
      "Εξασκηθείτε δωρεάν στις 1.988 επίσημες ερωτήσεις του ΑΣΕΠ με χρονόμετρο, ανάλυση λαθών και μελέτη ανά ενότητα.",
    url: "https://asep-2gb-2026.vercel.app/proetoimasia",
  },
};

const ICONS: Record<string, any> = {
  Scale,
  FileText,
  Globe,
  TrendingUp,
  Cpu,
  History,
  BookOpen,
  ShieldCheck,
  Briefcase,
  Users,
  Award,
};

// FAQ Schema.org Structured Data για την Google
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      "name": "Πόσες είναι οι επίσημες ερωτήσεις του Μητρώου Θεμάτων Γνώσεων του ΑΣΕΠ;",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "Το επικαιροποιημένο Μητρώο Θεμάτων Γνώσεων του ΑΣΕΠ περιλαμβάνει συνολικά 1.988 ερωτήσεις πολλαπλής επιλογής, κατανεμημένες σε 11 γνωστικές ενότητες.",
      },
    },
    {
      "@type": "Question",
      "name": "Είναι κοινή η ύλη των θεμάτων γνώσεων για όλες τις ειδικότητες ΠΕ και ΤΕ;",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "Ναι, σύμφωνα με το άρθρο 9 του ν. 4765/2021, η δοκιμασία εξέτασης γνώσεων βασίζεται στο ίδιο κοινό Μητρώο Θεμάτων για όλους τους υποψηφίους Πανεπιστημιακής (ΠΕ) και Τεχνολογικής (ΤΕ) Εκπαίδευσης.",
      },
    },
    {
      "@type": "Question",
      "name": "Πότε θα διεξαχθεί ο 3ος Πανελλήνιος Γραπτός Διαγωνισμός;",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "Ο επόμενος (3ος) Πανελλήνιος Γραπτός Διαγωνισμός προγραμματίζεται από το ΑΣΕΠ για το έτος 2027, αποτελώντας τη βασική δεξαμενή προσλήψεων για τον δημόσιο τομέα.",
      },
    },
  ],
};

export default function ProetoimasiaHubPage() {
  return (
    <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Inject FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Breadcrumb */}
      <Link
        href="/"
        className="text-sm text-slate-400 hover:text-[#00E5FF] transition-colors inline-flex items-center gap-2 mb-6"
      >
        ← Επιστροφή στην Αρχική
      </Link>

      {/* Header */}
      <div className="mb-10 space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Επίσημο Μητρώο Θεμάτων Γνώσεων ΑΣΕΠ (ν. 4765/2021)
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-display text-white tracking-tight">
          Μητρώο Θεμάτων ΑΣΕΠ:{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-pink-500 to-amber-400">
            1.988 Ερωτήσεις & Τεστ
          </span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          Πλήρης τράπεζα θεμάτων και διαδραστική πλατφόρμα μελέτης για τις <strong>1.988 επίσημες ερωτήσεις γνώσεων</strong> του ΑΣΕΠ. 
          Κάθε θέμα συνοδεύεται από την επίσημη ορθή απάντηση, ανάλυση και δυνατότητα προσομοίωσης εξέτασης 
          ενόψει του επερχόμενου 3ου Πανελλήνιου Γραπτού Διαγωνισμού (2027).
        </p>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10">
        <div className="glass p-5 rounded-2xl">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">
            Συνολο Ερωτησεων
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-[#00E5FF]">
            {OFFICIAL_QUIZ_STATS.TOTAL_QUESTIONS.toLocaleString("el-GR")}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Επικαιροποιημένο Μητρώο</div>
        </div>

        <div className="glass p-5 rounded-2xl">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">
            Γνωστικα Αντικειμενα
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-pink-400">
            {OFFICIAL_QUIZ_STATS.TOTAL_CATEGORIES}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Θεματικές Ενότητες</div>
        </div>

        <div className="glass p-5 rounded-2xl">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">
            Στοχευση
          </div>
          <div className="text-sm sm:text-base font-bold text-white mt-1">
            Διαγωνισμός 2027
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Κοινή ύλη για ΠΕ & ΤΕ</div>
        </div>

        <div className="glass p-5 rounded-2xl">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">
            Κοστος Μελετης
          </div>
          <div className="text-sm sm:text-base font-bold text-emerald-400 mt-1">
            100% Δωρεάν
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Χωρίς συνδρομές ή paywalls</div>
        </div>
      </div>

      {/* SEO Strategic Interlinking Box (Cross-Connecting Site Features) */}
      <div className="mb-12 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0A0E1A] to-[#070A13] border border-[#00E5FF]/20 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[#00E5FF]">
          <Compass className="w-4 h-4" />
          <span>Στρατηγική Προετοιμασίας: Συνδέστε τη Μελέτη με τα Δεδομένα Διορισμών</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Η άριστη προετοιμασία στο τεστ γνώσεων είναι μόνο το ένα σκέλος της επιτυχίας. Μελετήστε τα πραγματικά αποτελέσματα του προηγούμενου διαγωνισμού για να δείτε πώς διαμορφώθηκαν οι βάσεις ανά ειδικότητα:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <Link
            href="/zitisi"
            className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-[#00E5FF] transition-all no-underline block group"
          >
            <div className="text-xs font-bold text-white group-hover:text-[#00E5FF]">
              Βαρόμετρο Ζήτησης 2027 →
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Ποιοι φορείς συγκέντρωσαν τις περισσότερες 1ες προτιμήσεις.
            </div>
          </Link>

          <Link
            href="/kenes-theseis"
            className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-400 transition-all no-underline block group"
          >
            <div className="text-xs font-bold text-white group-hover:text-amber-400">
              Οι 928 Κενές Θέσεις →
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Ποιες θέσεις έμειναν ορφανές και θα ξαναπροκηρυχθούν.
            </div>
          </Link>

          <Link
            href="/stats"
            className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-400 transition-all no-underline block group"
          >
            <div className="text-xs font-bold text-white group-hover:text-emerald-400">
              Στατιστικά & Βάσεις →
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Ποσοστά επιτυχίας και κατανομή μορίων ανά κλάδο.
            </div>
          </Link>
        </div>
      </div>

      {/* 11 Official Categories Grid */}
      <div className="space-y-4 mb-14">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-display text-white">
            Επίσημες Γνωστικές Ενότητες ΑΣΕΠ:
          </h2>
          <span className="text-xs font-mono text-slate-400">
            11 Ενότητες • 1.988 Θέματα
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {OFFICIAL_CATEGORIES_LIST.map((cat) => {
            const IconComp = ICONS[cat.icon] || BookOpen;

            return (
              <Link
                key={cat.slug}
                href={`/proetoimasia/${cat.slug}`}
                className="glass p-5 rounded-2xl hover:border-[#00E5FF]/50 hover:bg-[#00E5FF]/5 transition-all flex flex-col justify-between group no-underline"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] group-hover:scale-105 transition-transform">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[#00E5FF] block">
                        {cat.officialCount} θέματα
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                        Επικ.: {cat.lastUpdate}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-[#00E5FF] transition-colors leading-snug">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-white">
                  <span>Τεστ & Μελέτη Ύλης</span>
                  <ArrowRight className="w-4 h-4 text-[#00E5FF] group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* SEO FAQ SECTION (Answer Engine Target) */}
      <div className="glass p-6 sm:p-8 rounded-3xl mb-12 space-y-6">
        <div className="flex items-center gap-2 text-[#00E5FF] font-bold text-sm uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Συχνές Ερωτήσεις για το Μητρώο Θεμάτων ΑΣΕΠ</span>
        </div>

        <div className="space-y-4 divide-y divide-slate-800 text-xs sm:text-sm">
          <div className="pt-4 space-y-1">
            <h3 className="font-bold text-white text-sm sm:text-base">
              Τι είναι το Μητρώο Θεμάτων Γνώσεων του ΑΣΕΠ;
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Είναι η επίσημη τράπεζα θεμάτων που καταρτίζει και τηρεί το ΑΣΕΠ βάσει του άρθρου 9 του ν. 4765/2021. 
              Περιλαμβάνει 1.988 ερωτήσεις πολλαπλής επιλογής που καλύπτουν όλο το φάσμα της γενικής δημόσιας διοίκησης, του δικαίου και των οικονομικών.
            </p>
          </div>

          <div className="pt-4 space-y-1">
            <h3 className="font-bold text-white text-sm sm:text-base">
              Πώς αξιοποιούνται τα θέματα στους γραπτούς διαγωνισμούς;
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Στους πανελλήνιους γραπτούς διαγωνισμούς του ΑΣΕΠ, η δοκιμασία εξέτασης γνώσεων (Μάθημα 1) 
              αντλείται απευθείας από αυτό το Μητρώο. Η άριστη εξοικείωση με τη διατύπωση και τις ορθές απαντήσεις 
              αποτελεί τον ασφαλέστερο δρόμο για υψηλή βαθμολογία.
            </p>
          </div>

          <div className="pt-4 space-y-1">
            <h3 className="font-bold text-white text-sm sm:text-base">
              Ποιες νέες ενότητες προστέθηκαν στην τελευταία επικαιροποίηση;
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Στο αναθεωρημένο Μητρώο προστέθηκαν ο Γενικός Κανονισμός για την Προστασία Δεδομένων (GDPR), 
              ο Κώδικας Κατάστασης Πολιτικών Διοικητικών Υπαλλήλων, καθώς και εξειδικευμένες ενότητες για τη 
              Διοίκηση Ανθρώπινου Δυναμικού και τον Κώδικα Συμπεριφοράς Δημοσίων Υπαλλήλων.
            </p>
          </div>
        </div>
      </div>

      {/* Official Disclaimer (ΑΣΕΠ 14/10/2026 Compliance) */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400 space-y-2 leading-relaxed">
        <div className="flex items-center gap-2 text-slate-300 font-semibold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Όροι Χρήσης & Συμμόρφωση με το Δελτίο Τύπου ΑΣΕΠ (14/10/2026)</span>
        </div>
        <p>
          • <strong>Πηγή Περιεχομένου:</strong> Μητρώο Θεμάτων Γνώσεων του ΑΣΕΠ (άρθρο 9, ν. 4765/2021).  
          • <strong>Αναλλοίωτο Περιεχόμενο:</strong> Το περιεχόμενο των ερωτήσεων και απαντήσεων αποδίδεται αυτούσιο, χωρίς καμία αλλοίωση ή παραποίηση.  
          • <strong>Μη Επίσημος Χαρακτήρας:</strong> Η παρούσα αποτελεί ανεξάρτητη εφαρμογή τρίτου (community project) για σκοπούς μελέτης (ν. 4727/2020) και δεν συνδέεται, δεν εγκρίνεται ούτε υποστηρίζεται από το ΑΣΕΠ.
        </p>
      </div>
    </main>
  );
}