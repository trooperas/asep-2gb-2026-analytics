import React from "react";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
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
  Box,
  Brain,
  Calendar,
  Layers,
  AlertCircle,
  FileCode,
  Zap,
} from "lucide-react";
import {
  OFFICIAL_QUIZ_STATS,
  OFFICIAL_CATEGORIES_LIST,
} from "@/lib/quiz-constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Θέματα & Προετοιμασία 2027",
  description:
    "Κόμβος προετοιμασίας ΑΣΕΠ 2027: 1.988 θέματα γνώσεων, επαγωγικός & χωρικός συλλογισμός, τεστ εργασιακής συμπεριφοράς και επίσημο χρονολόγιο.",
  alternates: {
    canonical: "/proetoimasia",
  },
  keywords: [
    "μητρωο θεματων ασεπ 1988",
    "επαγωγικος συλλογισμος ασεπ",
    "χωρικη αντιληψη ασεπ test",
    "εργασιακη συμπεριφορα ασεπ 76 τριαδες",
    "εργασιακες δεξιοτητες ασεπ",
    "προετοιμασια 3ος πανελληνιος γραπτος διαγωνισμος 2027",
    "θεματα γνωσεων ασεπ",
    "ερωτησεις ασεπ pdf",
  ],
  openGraph: {
    type: "website",
    locale: "el_GR",
    title: "ΑΣΕΠ 2027: Μητρώο 1.988 Θεμάτων & Οδηγός Δεξιοτήτων",
    description:
      "Δωρεάν εξάσκηση στις επίσημες ερωτήσεις γνώσεων και πλήρης οδηγός δεξιοτήτων για τον επόμενο διαγωνισμό ΑΣΕΠ.",
    url: "https://asepanalytics.app/proetoimasia",
    siteName: "ΑΣΕΠ 2ΓΒ/2026 Hub",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ΑΣΕΠ Προετοιμασία 2027",
      },
    ],
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

// FAQ Schema.org Structured Data
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
          "Το επικαιροποιημένο Μητρώο Θεμάτων Γνώσεων περιλαμβάνει 1.988 ερωτήσεις στο επίσημο PDF (1.989 στο δελτίο τύπου λόγω γνωστής απόκλισης μίας ερώτησης στα Οικονομικά), κατανεμημένες σε 11 θεματικές ενότητες.",
      },
    },
    {
      "@type": "Question",
      "name": "Τι θα περιλαμβάνει η εξέταση δεξιοτήτων στον 3ο διαγωνισμό (2027);",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "Σύμφωνα με τις επίσημες τοποθετήσεις του ΑΣΕΠ, η δοκιμασία δεξιοτήτων θα περιλαμβάνει επαγωγικό συλλογισμό (σχέσεις σχημάτων/matrix), ερωτήσεις αντίληψης χώρου (3D spatial reasoning) και τεστ εργασιακής συμπεριφοράς (δηλώσεις τύπου OPQ32/SHL).",
      },
    },
    {
      "@type": "Question",
      "name": "Πώς θα διεξαχθεί ο 3ος Πανελλήνιος Γραπτός Διαγωνισμός;",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "Ο διαγωνισμός προγραμματίζεται εντός του 2027 μέσω ηλεκτρονικής διαδικασίας (computer-based) σε μόνιμα εξεταστικά κέντρα σε Αθήνα και Θεσσαλονίκη, με διευρυμένο εξεταστικό παράθυρο πολλών εβδομάδων.",
      },
    },
  ],
};

export default function ProetoimasiaHubPage() {
  return (
    <main className="min-h-screen pt-32 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Inject FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Breadcrumb */}
      <Breadcrumb href="/" label="Επιστροφή στην Αρχική" />

      {/* Hero Header */}
      <div className="mb-10 space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Επίσημο Μητρώο Γνώσεων & Οδηγός Δεξιοτήτων (ν. 4765/2021)
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-display text-white tracking-tight">
          Ολοκληρωμένος Κόμβος Προετοιμασίας{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-pink-500 to-amber-400">
            ΑΣΕΠ 2027
          </span>
        </h1>
        <div className="lg:hidden mt-4 rounded-2xl border border-[#00E5FF]/30 bg-slate-900/80 p-3 shadow-lg">
          <div className="mb-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-[#00E5FF]">
            Γρήγορη εκκίνηση
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/proetoimasia/ergasiakes-deksiotites"
              className="flex min-h-12 items-center justify-center gap-1 rounded-xl bg-amber-500 px-2 py-2 text-center text-xs font-bold text-slate-950 no-underline"
            >
              Τεστ OPQ32 <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#knowledge-bank"
              className="flex min-h-12 items-center justify-center gap-1 rounded-xl border border-[#00E5FF]/40 bg-[#00E5FF]/10 px-2 py-2 text-center text-xs font-bold text-[#00E5FF] no-underline"
            >
              1.988 Ερωτήσεις <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          Πλήρης τράπεζα για τις <strong>1.988 επίσημες ερωτήσεις γνώσεων</strong>*, πρακτικός οδηγός 
          για τις <strong>δοκιμασίες δεξιοτήτων</strong> (επαγωγικός συλλογισμός, αντίληψη χώρου, εργασιακές δηλώσεις) 
          και συγκεντρωτικό χρονολόγιο εξελίξεων για τον επερχόμενο 3ο Πανελλήνιο Γραπτό Διαγωνισμό.
        </p>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-12">
        <div className="glass p-5 rounded-2xl">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">
            Επισημες Ερωτησεις
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-[#00E5FF]">
            {OFFICIAL_QUIZ_STATS.TOTAL_QUESTIONS.toLocaleString("el-GR")}*
          </div>
          <div className="text-[10px] text-slate-500 mt-1">11 Γνωστικές Ενότητες</div>
        </div>

        <div className="glass p-5 rounded-2xl">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">
            Δοκιμασια Δεξιοτητων
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-pink-400">
            50%
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Βαρύτητα στη βαθμολογία</div>
        </div>

        <div className="glass p-5 rounded-2xl">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">
            Επομενος Διαγωνισμος
          </div>
          <div className="text-sm sm:text-base font-bold text-white mt-1">
            Εντός 2027
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Κοινή δεξαμενή θεμάτων**</div>
        </div>

        <div className="glass p-5 rounded-2xl">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">
            Χαρακτηρας Εργαλειου
          </div>
          <div className="text-sm sm:text-base font-bold text-emerald-400 mt-1">
            100% Δωρεάν
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Ανοιχτή πρόσβαση για όλους</div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* ΕΝΟΤΗΤΑ Β: ΔΟΚΙΜΑΣΙΑ ΔΕΞΙΟΤΗΤΩΝ (ΤΟ 50% ΠΟΥ ΚΡΙΝΕΙ ΤΟ ΑΠΟΤΕΛΕΣΜΑ) */}
      {/* ============================================================== */}
      <div className="mb-16 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-pink-400 uppercase tracking-wider mb-1">
            <Brain className="w-4 h-4" />
            Το Κλειδί της Βαθμολογίας
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Δοκιμασία Δεξιοτήτων & Εργασιακής Αποτελεσματικότητας
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Σε αντίθεση με τις γνώσεις που αποστηθίζονται, οι δεξιότητες αξιολογούν τον τρόπο σκέψης. 
            Στον 2ο διαγωνισμό (1Γ/2025) αποτέλεσαν το καθοριστικό φίλτρο επιτυχίας. Ακολουθούν οι επιβεβαιωμένοι τύποι θεμάτων:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. Επαγωγικός Συλλογισμός */}
          <div className="glass p-6 rounded-2xl border border-pink-500/20 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  ΕΠΙΒΕΒΑΙΩΜΕΝΟ
                </span>
                <Layers className="w-5 h-5 text-pink-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Επαγωγικός Συλλογισμός</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Σχέσεις σχημάτων, μοτίβα σε πλέγματα (matrices) και λογικές ακολουθίες. Ο υποψήφιος καλείται να εντοπίσει τον κανόνα μεταβολής και να επιλέξει το σχήμα που ακολουθεί.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              💡 <em>Τύπος:</em> Πρότυπα Raven / SHL style.
            </div>
          </div>

          {/* 2. Χωρική Αντίληψη (3D) */}
          <div className="glass p-6 rounded-2xl border border-[#00E5FF]/20 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  ΕΠΙΒΕΒΑΙΩΜΕΝΟ
                </span>
                <Box className="w-5 h-5 text-[#00E5FF]" />
              </div>
              <h3 className="text-lg font-bold text-white">Αντίληψη Χώρου (3D)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Περιστροφές τρισδιάστατων σχημάτων, ανάπτυγμα κύβων και νοερή αναδίπλωση στερεών. Αξιολογεί τη χωρική νοημοσύνη χωρίς ανάγκη μαθηματικών πράξεων.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Δωρεαν Online Εξασκηση:</div>
              <div className="flex flex-wrap gap-2 text-xs">
                <a
                  href="https://www.123test.com/spatial-reasoning-test/"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-[#00E5FF] hover:underline inline-flex items-center gap-1"
                >
                  123test <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
                <span className="text-slate-600">•</span>
                <a
                  href="https://www.aptitude-test.com/free-aptitude-test/cognitive/spatial/"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-[#00E5FF] hover:underline inline-flex items-center gap-1"
                >
                  Aptitude-Test <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </div>
            </div>
          </div>

          {/* 3. Εργασιακή Συμπεριφορά (OPQ32) - ΜΕ ΑΜΕΣΟ LINK ΣΤΟ ΤΕΣΤ */}
          <div className="glass p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/5 to-transparent space-y-4 flex flex-col justify-between shadow-xl">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  ΕΠΙΒΕΒΑΙΩΜΕΝΟ
                </span>
                <Briefcase className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Εργασιακές Δεξιότητες (OPQ32)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Δοκιμασία τριάδων αναγκαστικής επιλογής (forced-choice). Επιλέγονται υποχρεωτικά μία δήλωση που «ταιριάζει περισσότερο» (+) και μία που «ταιριάζει λιγότερο» (-).
              </p>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-800">
              <Link
                href="/proetoimasia/ergasiakes-deksiotites"
                className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs hidden lg:flex items-center justify-center gap-1.5 transition-all shadow-md group no-underline"
              >
                <span>Έναρξη Τεστ (OPQ32)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="text-[10px] text-center text-slate-400">
                ⚡ Express (12 Τριάδες) & Πλήρες (76 Τριάδες)
              </div>
            </div>
          </div>
        </div>

        {/* Παραγωγικοί & Γλωσσικοί (Αναμενόμενα) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-slate-300">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              <strong>Παραγωγικός, Αριθμητικός & Γλωσσικός Συλλογισμός (EPSO Style):</strong> Εξετάζεται η ενσωμάτωσή τους ως συμπληρωματικές δοκιμασίες με κλιμακούμενη δυσκολία (Αναμένεται επιβεβαίωση στην προκήρυξη).
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* ΕΝΟΤΗΤΑ Α: ΟΙ 11 ΚΑΤΗΓΟΡΙΕΣ ΓΝΩΣΕΩΝ (SEO-FRIENDLY ΤΙΤΛΟΣ) */}
      {/* ============================================================== */}
      <div id="knowledge-bank" className="scroll-mt-28 space-y-4 mb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <span className="text-xs font-mono uppercase text-[#00E5FF] tracking-wider font-semibold">
              Επίσημη Τράπεζα Θεμάτων
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-0.5">
              11 Ενότητες Γνώσεων (1.988 Επίσημα Θέματα ΑΣΕΠ)
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Πλήρης κάλυψη ύλης με απαντήσεις
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

        {/* Footnote για 1.988 vs 1.989 */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
          * <strong>Σημείωση καταμέτρησης θεμάτων:</strong> Στο δελτίο τύπου του ΑΣΕΠ αναφέρεται άθροισμα 1.989 ερωτήσεων, ενώ το επίσημο αναρτημένο PDF της ενότητας «Οικονομικές Επιστήμες» καταμετρά ακριβώς 334 θέματα (αντί για 335), διαμορφώνοντας το πραγματικό σύνολο του αρχείου σε <strong>1.988 ερωτήσεις</strong>.  
          <br />
          ** <strong>Κατανομή ΠΕ & ΤΕ:</strong> Το Μητρώο αποτελεί κοινή δεξαμενή θεμάτων. Η ακριβής στάθμιση ερωτήσεων ανά κατηγορία εκπαίδευσης θα οριστεί στην τελική προκήρυξη του διαγωνισμού.
        </div>
      </div>

      {/* ============================================================== */}
      {/* ΕΝΟΤΗΤΑ Γ: ΧΡΟΝΟΛΟΓΙΟ & ΕΠΙΣΗΜΕΣ ΕΞΕΛΙΞΕΙΣ 2027 */}
      {/* ============================================================== */}
      <div className="mb-16 space-y-6">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-[#00E5FF] tracking-wider font-semibold">
              Roadmap
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
              Χρονολόγιο Εξελίξεων & Επίσημες Τοποθετήσεις (3ος ΑΣΕΠ)
            </h2>
          </div>
          <Calendar className="w-5 h-5 text-slate-500" />
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-[11px] sm:before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[#00E5FF] via-pink-500 to-slate-800">
          {/* Milestone 1 */}
          <div className="relative group">
            <span className="absolute -left-[30px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#00E5FF] border-4 border-[#070A13]" />
            <div className="glass p-4 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[#00E5FF] font-bold">14 Οκτωβρίου 2026</span>
                <span className="text-slate-500">Δελτίο Τύπου ΑΣΕΠ</span>
              </div>
              <h4 className="text-sm font-bold text-white">Όροι χρήσης του Μητρώου Θεμάτων από τρίτους</h4>
              <p className="text-xs text-slate-300">
                Διευκρίνιση ότι βάσει ν. 4727/2020 τα θέματα διατίθενται ελεύθερα για σκοπούς μελέτης, θέτοντας 6 κανόνες διαφάνειας και μη αλλοίωσης.
              </p>
            </div>
          </div>

          {/* Milestone 2 */}
          <div className="relative group">
            <span className="absolute -left-[30px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-pink-500 border-4 border-[#070A13]" />
            <div className="glass p-4 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-pink-400 font-bold">03 Απριλίου 2026</span>
                <span className="text-slate-500">Επίσημη Ανάρτηση</span>
              </div>
              <h4 className="text-sm font-bold text-white">Ανάρτηση Επικαιροποιημένου Μητρώου 1.988 Θεμάτων</h4>
              <p className="text-xs text-slate-300">
                Ολοκλήρωση της δημόσιας διαβούλευσης με προσθήκη 2 νέων ενοτήτων (GDPR, Υπαλληλικός Κώδικας) και αναδιάρθρωση της Δημόσιας Διοίκησης.
              </p>
            </div>
          </div>

          {/* Milestone 3 */}
          <div className="relative group">
            <span className="absolute -left-[30px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-slate-700 border-4 border-[#070A13]" />
            <div className="glass p-4 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400 font-bold">Προγραμματισμός 2027</span>
                <span className="text-emerald-400">Επιβεβαιωμένος Στόχος</span>
              </div>
              <h4 className="text-sm font-bold text-white">Διεξαγωγή 3ου Πανελλήνιου Γραπτού Διαγωνισμού</h4>
              <p className="text-xs text-slate-300">
                Διενέργεια σε μόνιμα εξεταστικά κέντρα σε Αθήνα και Θεσσαλονίκη με διευρυμένο εξεταστικό παράθυρο πολλών εβδομάδων (Computer-Adaptive Testing).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* ΕΝΟΤΗΤΑ ΣΤ: ΕΠΙΣΗΜΗ ΒΙΒΛΙΟΘΗΚΗ ΠΗΓΩΝ & ΝΟΜΟΘΕΣΙΑΣ */}
      {/* ============================================================== */}
      <div className="glass p-6 sm:p-8 rounded-3xl mb-12 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-[#00E5FF]" />
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Επίσημες Πηγές Ύλης & Θεσμικά Κείμενα
            </h2>
          </div>
          <span className="text-xs text-slate-500">Dofollow Authority Links</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Κρατικά Κείμενα & Νόμοι */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-white uppercase tracking-wider">
              Νομοθεσία Ύλης
            </div>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="https://www.dpa.gr/el/polites/gkpd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-[#00E5FF] flex items-center justify-between"
                >
                  <span>Οδηγός GDPR (DPA.gr)</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.taxheaven.gr/law/4624/2019"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-[#00E5FF] flex items-center justify-between"
                >
                  <span>Νόμος 4624/2019 (GDPR)</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.ypes.gr/wp-content/uploads/2019/09/20150721_kodikas_katastasis_dimosion_ypallilon.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-[#00E5FF] flex items-center justify-between"
                >
                  <span>Υπαλληλικός Κώδικας (ΥΠΕΣ)</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Πύλη ΑΣΕΠ */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-white uppercase tracking-wider">
              Ενημερωτική Πύλη ΑΣΕΠ
            </div>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="https://info.asep.gr/node/78603"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-[#00E5FF] flex items-center justify-between"
                >
                  <span>Μητρώο Θεμάτων (info.asep)</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://info.asep.gr/forma/trapeza-thematon-ypovoli"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-[#00E5FF] flex items-center justify-between"
                >
                  <span>Πλατφόρμα Διαβούλευσης</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://info.asep.gr/node/80138"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-[#00E5FF] flex items-center justify-between"
                >
                  <span>Δελτίο Τύπου 14/10/2026</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Περιοδικά ΑΣΕΠ */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-white uppercase tracking-wider">
              Περιοδικό ΑΣΕΠ (PDFs)
            </div>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="https://info.asep.gr/sites/default/files/2026-03/asep_news01.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-[#00E5FF] flex items-center justify-between"
                >
                  <span>Τεύχος 1 (Μάρτιος 2026)</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://info.asep.gr/sites/default/files/2026-05/asep_news02.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-[#00E5FF] flex items-center justify-between"
                >
                  <span>Τεύχος 2 (Μάιος 2026)</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://info.asep.gr/node/79388"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-[#00E5FF] flex items-center justify-between"
                >
                  <span>Τεύχος 3 (Καλοκαίρι 2026)</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* SEO FAQ SECTION */}
      <div className="glass p-6 sm:p-8 rounded-3xl mb-12 space-y-6">
        <div className="flex items-center gap-2 text-[#00E5FF] font-bold text-sm uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Συχνές Ερωτήσεις για τον 3ο Πανελλήνιο Γραπτό Διαγωνισμό (2027)</span>
        </div>

        <div className="space-y-4 divide-y divide-slate-800 text-xs sm:text-sm">
          <div className="pt-4 space-y-1">
            <h3 className="font-bold text-white text-sm sm:text-base">
              Πόσες είναι οι επίσημες ερωτήσεις του Μητρώου Θεμάτων Γνώσεων του ΑΣΕΠ;
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Το επικαιροποιημένο Μητρώο Θεμάτων Γνώσεων περιλαμβάνει 1.988 ερωτήσεις στο επίσημο PDF (1.989 στο δελτίο τύπου λόγω γνωστής απόκλισης μίας ερώτησης στα Οικονομικά), κατανεμημένες σε 11 θεματικές ενότητες.
            </p>
          </div>

          <div className="pt-4 space-y-1">
            <h3 className="font-bold text-white text-sm sm:text-base">
              Τι θα περιλαμβάνει η εξέταση δεξιοτήτων στον 3ο διαγωνισμό (2027);
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Σύμφωνα με τις επίσημες τοποθετήσεις του ΑΣΕΠ, η δοκιμασία δεξιοτήτων θα περιλαμβάνει επαγωγικό συλλογισμό (σχέσεις σχημάτων/matrix), ερωτήσεις αντίληψης χώρου (3D spatial reasoning) και τεστ εργασιακής συμπεριφοράς (δηλώσεις τύπου OPQ32/SHL).
            </p>
          </div>

          <div className="pt-4 space-y-1">
            <h3 className="font-bold text-white text-sm sm:text-base">
              Πώς θα διεξαχθεί ο 3ος Πανελλήνιος Γραπτός Διαγωνισμός;
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Ο διαγωνισμός προγραμματίζεται εντός του 2027 μέσω ηλεκτρονικής διαδικασίας (computer-based) σε μόνιμα εξεταστικά κέντρα σε Αθήνα και Θεσσαλονίκη, με διευρυμένο εξεταστικό παράθυρο πολλών εβδομάδων (Computer-Adaptive Testing).
            </p>
          </div>
        </div>
      </div>

      {/* Official Disclaimer */}
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