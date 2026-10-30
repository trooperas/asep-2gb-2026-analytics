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
  Box,
  Brain,
  Calendar,
  Layers,
  FileCode,
  ChevronDown,
  Zap,
} from "lucide-react";
import {
  OFFICIAL_QUIZ_STATS,
  OFFICIAL_CATEGORIES_LIST,
} from "@/lib/quiz-constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Τράπεζα Θεμάτων ΑΣΕΠ 2027 (1.988 Ερωτήσεις) & Δωρεάν Τεστ Δεξιοτήτων",
  description:
    "Δωρεάν online τεστ προετοιμασίας για τον 3ο διαγωνισμό ΑΣΕΠ 2027: 1.988 θέματα γνώσεων με απαντήσεις, τεστ επαγωγικού συλλογισμού και εργασιακές δεξιότητες (OPQ32).",
  alternates: {
    canonical: "/proetoimasia",
  },
  keywords: [
    "τραπεζα θεματων ασεπ 2027",
    "θεματα ασεπ 2026",
    "τεστ επαγωγικου συλλογισμου online",
    "δωρεαν τεστ επαγωγικου συλλογισμου",
    "ασεπ τεστ δεξιοτητων online",
    "μητρωο θεματων ασεπ 1988",
    "εργασιακες δεξιοτητες ασεπ opq32",
    "προετοιμασια 3ος πανελληνιος γραπτος διαγωνισμος 2027",
  ],
  openGraph: {
    type: "website",
    locale: "el_GR",
    title: "Τράπεζα Θεμάτων ΑΣΕΠ 2027: 1.988 Ερωτήσεις & Τεστ Δεξιοτήτων",
    description:
      "Δωρεάν online εξάσκηση: 1.988 επίσημες ερωτήσεις γνώσεων, τεστ επαγωγικού συλλογισμού και προσομοίωση OPQ32.",
    url: "https://asepanalytics.app/proetoimasia",
    siteName: "ΑΣΕΠ Analytics Hub",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Προετοιμασία ΑΣΕΠ 2027",
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
    <main className="min-h-screen pt-20 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Breadcrumb href="/" label="Επιστροφή στην Αρχική" />

      {/* ============================================================== */}
      {/* 1. COMPACT HERO: ΑΜΕΣΗ ΕΣΤΙΑΣΗ ΣΤΑ ΕΡΓΑΛΕΙΑ (ABOVE THE FOLD) */}
      {/* ============================================================== */}
      <div className="mb-8 space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-[11px] font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          3ος Πανελλήνιος Γραπτός Διαγωνισμός (2027)
        </div>
        
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight leading-tight">
          Κέντρο Προετοιμασίας &amp;{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-pink-500 to-amber-400">
            Online Εξάσκησης
          </span>
        </h1>
        
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Επιλέξτε άμεσα δοκιμασία για δωρεάν εξάσκηση στα επίσημα θέματα και πρότυπα του ΑΣΕΠ:
        </p>
      </div>

      {/* ============================================================== */}
      {/* 2. ΤΑ "ΧΑΡΤΙΑ" ΣΤΟ ΤΡΑΠΕΖΙ: 4 CORE ACTION CARDS (1Η ΟΘΟΝΗ) */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-12">
        {/* Κάρτα 1: OPQ32 */}
        <Link
          href="/proetoimasia/ergasiakes-deksiotites"
          className="glass p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 via-slate-900/60 to-transparent hover:border-amber-400 transition-all flex flex-col justify-between group no-underline shadow-lg"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ΔΕΞΙΟΤΗΤΕΣ
              </span>
              <Briefcase className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                Εργασιακές Δεξιότητες (OPQ32)
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Δοκιμασία αναγκαστικής επιλογής με 76 τριάδες δηλώσεων.
              </p>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-amber-300">
            <span>Έναρξη Τεστ</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Κάρτα 2: Επαγωγικός */}
        <Link
          href="/proetoimasia/epagogikos-syllogismos"
          className="glass p-5 rounded-2xl border border-pink-500/30 bg-gradient-to-b from-pink-500/10 via-slate-900/60 to-transparent hover:border-pink-400 transition-all flex flex-col justify-between group no-underline shadow-lg"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">
                ΔΕΞΙΟΤΗΤΕΣ
              </span>
              <Layers className="w-5 h-5 text-pink-400 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors">
                Επαγωγικός Συλλογισμός
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Πλέγματα Matrix 3x3 και σχέσεις σχημάτων Raven/SHL.
              </p>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-pink-300">
            <span>Έναρξη Τεστ</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Κάρτα 3: 1.988 Ερωτήσεις */}
        <Link
          href="#knowledge-bank"
          className="glass p-5 rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/20 via-slate-900/60 to-transparent hover:border-[#00E5FF] transition-all flex flex-col justify-between group no-underline shadow-lg"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-[#00E5FF] border border-cyan-500/30">
                ΓΝΩΣΕΙΣ
              </span>
              <BookOpen className="w-5 h-5 text-[#00E5FF] group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-[#00E5FF] transition-colors">
                1.988 Θέματα Γνώσεων
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                11 θεματικές ενότητες με τις επίσημες απαντήσεις.
              </p>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-[#00E5FF]">
            <span>Προβολή Ενοτήτων</span>
            <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </div>
        </Link>

        {/* Κάρτα 4: Χωρική Αντίληψη (3D) */}
        <div className="glass p-5 rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 via-slate-900/60 to-transparent flex flex-col justify-between shadow-lg">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ΔΕΞΙΟΤΗΤΕΣ
              </span>
              <Box className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Αντίληψη Χώρου (3D)
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Περιστροφές στερεών &amp; αναπτύγματα κύβων.
              </p>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs">
            <a
              href="https://www.123test.com/spatial-reasoning-test/"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-emerald-400 hover:underline inline-flex items-center gap-1 font-semibold"
            >
              123test <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-600">•</span>
            <a
              href="https://www.aptitude-test.com/free-aptitude-test/cognitive/spatial/"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-emerald-400 hover:underline inline-flex items-center gap-1 font-semibold"
            >
              Aptitude <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. COLLAPSIBLE ΕΝΟΤΗΤΑ ΓΝΩΣΕΩΝ (11 ΚΑΤΗΓΟΡΙΕΣ) */}
      {/* ============================================================== */}
      <div id="knowledge-bank" className="scroll-mt-24 space-y-4 mb-14">
        <details className="group glass rounded-3xl border border-slate-800 overflow-hidden transition-all duration-300 open:border-[#00E5FF]/40 open:bg-slate-900/40">
          <summary className="p-5 sm:p-7 flex items-center justify-between cursor-pointer select-none list-none">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-[#00E5FF] tracking-wider font-semibold">
                <span>Μάθημα 1 • 11 Γνωστικές Ενότητες</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-white">
                Επίσημη Τράπεζα 1.988 Θεμάτων Γνώσεων ΑΣΕΠ
              </h2>
              <p className="text-xs text-slate-400">
                Πατήστε για να ανοίξει η λίστα και των 11 ενοτήτων για μελέτη &amp; τεστ.
              </p>
            </div>

            <div className="flex items-center gap-2 pl-3">
              <span className="text-xs font-mono text-[#00E5FF] font-semibold hidden sm:inline">
                Προβολή
              </span>
              <div className="w-8 h-8 rounded-xl bg-slate-800/80 group-open:bg-[#00E5FF] group-open:text-slate-950 flex items-center justify-center text-slate-300 transition-transform duration-300 group-open:rotate-180">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </summary>

          <div className="px-5 sm:px-7 pb-7 pt-2 border-t border-slate-800/60 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {OFFICIAL_CATEGORIES_LIST.map((cat) => {
                const IconComp = ICONS[cat.icon] || BookOpen;

                return (
                  <Link
                    key={cat.slug}
                    href={`/proetoimasia/${cat.slug}`}
                    className="glass p-4 rounded-xl hover:border-[#00E5FF]/50 hover:bg-[#00E5FF]/5 transition-all flex flex-col justify-between group/card no-underline"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] group-hover/card:scale-105 transition-transform">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[#00E5FF]">
                            {cat.officialCount} θέματα
                          </span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-white group-hover/card:text-[#00E5FF] transition-colors leading-snug">
                          {cat.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {cat.desc}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 mt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-semibold text-slate-300 group-hover/card:text-white">
                      <span>Τεστ &amp; Μελέτη</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#00E5FF] group-hover/card:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              * <strong>Σημείωση:</strong> Το δελτίο τύπου αναφέρει άθροισμα 1.989 ερωτήσεων, ενώ το επίσημο PDF των Οικονομικών καταμετρά 334 θέματα, διαμορφώνοντας το σύνολο σε <strong>1.988 ερωτήσεις</strong>.
            </div>
          </div>
        </details>
      </div>

      {/* ============================================================== */}
      {/* 4. ΣΥΝΔΕΣΗ ΜΕ ΤΑ ΥΠΟΛΟΙΠΑ ΕΡΓΑΛΕΙΑ ΤΟΥ HUB (INTERLINKING) */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-14">
        <Link
          href="/zitisi"
          className="glass p-4 rounded-xl border border-slate-800 hover:border-[#00E5FF] transition-all no-underline block group"
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
          className="glass p-4 rounded-xl border border-slate-800 hover:border-amber-400 transition-all no-underline block group"
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
          className="glass p-4 rounded-xl border border-slate-800 hover:border-emerald-400 transition-all no-underline block group"
        >
          <div className="text-xs font-bold text-white group-hover:text-emerald-400">
            Στατιστικά &amp; Βάσεις 2ΓΒ →
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Ποσοστά επιτυχίας και κατανομή μορίων ανά κλάδο.
          </div>
        </Link>
      </div>

      {/* ============================================================== */}
      {/* 5. ΧΡΟΝΟΛΟΓΙΟ ΕΞΕΛΙΞΕΩΝ 2027 */}
      {/* ============================================================== */}
      <div id="timeline" className="mb-14 space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-[#00E5FF] tracking-wider font-semibold">
              Roadmap
            </span>
            <h2 className="text-lg sm:text-xl font-bold font-display text-white">
              Χρονολόγιο Εξελίξεων &amp; Επίσημες Τοποθετήσεις (3ος ΑΣΕΠ)
            </h2>
          </div>
          <Calendar className="w-4 h-4 text-slate-500" />
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-5 before:absolute before:left-[11px] sm:before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[#00E5FF] via-pink-500 to-slate-800">
          <div className="relative group">
            <span className="absolute -left-[30px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#00E5FF] border-4 border-[#070A13]" />
            <div className="glass p-4 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[#00E5FF] font-bold">14 Οκτωβρίου 2026</span>
                <span className="text-slate-500">Δελτίο Τύπου</span>
              </div>
              <h4 className="text-sm font-bold text-white">Όροι χρήσης του Μητρώου Θεμάτων από τρίτους</h4>
              <p className="text-xs text-slate-300">
                Διευκρίνιση ότι βάσει ν. 4727/2020 τα θέματα διατίθενται ελεύθερα για μελέτη.
              </p>
            </div>
          </div>

          <div className="relative group">
            <span className="absolute -left-[30px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-pink-500 border-4 border-[#070A13]" />
            <div className="glass p-4 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-pink-400 font-bold">03 Απριλίου 2026</span>
                <span className="text-slate-500">Επίσημη Ανάρτηση</span>
              </div>
              <h4 className="text-sm font-bold text-white">Ανάρτηση Επικαιροποιημένου Μητρώου 1.988 Θεμάτων</h4>
              <p className="text-xs text-slate-300">
                Προσθήκη GDPR, Υπαλληλικού Κώδικα και εξειδίκευση Δημόσιας Διοίκησης.
              </p>
            </div>
          </div>

          <div className="relative group">
            <span className="absolute -left-[30px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-slate-700 border-4 border-[#070A13]" />
            <div className="glass p-4 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400 font-bold">Εντός 2027</span>
                <span className="text-emerald-400 font-bold">Επιβεβαιωμένος Στόχος</span>
              </div>
              <h4 className="text-sm font-bold text-white">3ος Πανελλήνιος Γραπτός Διαγωνισμός</h4>
              <p className="text-xs text-slate-300">
                Διεξαγωγή σε Αθήνα &amp; Θεσσαλονίκη με εξεταστικό παράθυρο πολλών εβδομάδων (CAT).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 6. ΕΠΙΣΗΜΗ ΒΙΒΛΙΟΘΗΚΗ ΠΗΓΩΝ & ΝΟΜΟΘΕΣΙΑΣ */}
      {/* ============================================================== */}
      <div className="glass p-5 sm:p-7 rounded-2xl mb-12 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-[#00E5FF]" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              Επίσημες Πηγές Ύλης &amp; Θεσμικά Κείμενα
            </h2>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Dofollow Links</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
            <div className="text-[10px] font-bold text-white uppercase tracking-wider">Νομοθεσία Ύλης</div>
            <ul className="space-y-1.5">
              <li>
                <a href="https://www.dpa.gr/el/polites/gkpd" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-[#00E5FF] flex items-center justify-between">
                  <span>Οδηγός GDPR (DPA.gr)</span><ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://www.taxheaven.gr/law/4624/2019" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-[#00E5FF] flex items-center justify-between">
                  <span>Νόμος 4624/2019 (GDPR)</span><ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://www.ypes.gr/wp-content/uploads/2019/09/20150721_kodikas_katastasis_dimosion_ypallilon.pdf" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-[#00E5FF] flex items-center justify-between">
                  <span>Υπαλληλικός Κώδικας (ΥΠΕΣ)</span><ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
            <div className="text-[10px] font-bold text-white uppercase tracking-wider">Ενημερωτική Πύλη ΑΣΕΠ</div>
            <ul className="space-y-1.5">
              <li>
                <a href="https://info.asep.gr/node/78603" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-[#00E5FF] flex items-center justify-between">
                  <span>Μητρώο Θεμάτων</span><ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://info.asep.gr/forma/trapeza-thematon-ypovoli" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-[#00E5FF] flex items-center justify-between">
                  <span>Πλατφόρμα Διαβούλευσης</span><ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://info.asep.gr/node/80138" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-[#00E5FF] flex items-center justify-between">
                  <span>Δελτίο Τύπου 14/10/2026</span><ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
            <div className="text-[10px] font-bold text-white uppercase tracking-wider">Περιοδικά ΑΣΕΠ (PDFs)</div>
            <ul className="space-y-1.5">
              <li>
                <a href="https://info.asep.gr/sites/default/files/2026-03/asep_news01.pdf" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-[#00E5FF] flex items-center justify-between">
                  <span>Τεύχος 1 (Μάρτιος 2026)</span><ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://info.asep.gr/sites/default/files/2026-05/asep_news02.pdf" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-[#00E5FF] flex items-center justify-between">
                  <span>Τεύχος 2 (Μάιος 2026)</span><ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://info.asep.gr/node/79388" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-[#00E5FF] flex items-center justify-between">
                  <span>Τεύχος 3 (Καλοκαίρι 2026)</span><ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 7. SEO FAQ SECTION */}
      {/* ============================================================== */}
      <div className="glass p-5 sm:p-7 rounded-2xl mb-12 space-y-4">
        <div className="flex items-center gap-2 text-[#00E5FF] font-bold text-xs uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Συχνές Ερωτήσεις για τον 3ο Διαγωνισμό (2027)</span>
        </div>

        <div className="space-y-3 divide-y divide-slate-800 text-xs sm:text-sm">
          <div className="pt-3 space-y-1">
            <h3 className="font-bold text-white text-sm">
              Πόσες είναι οι επίσημες ερωτήσεις του Μητρώου Θεμάτων Γνώσεων του ΑΣΕΠ;
            </h3>
            <p className="text-slate-300 leading-relaxed text-xs">
              Περιλαμβάνει 1.988 ερωτήσεις στο επίσημο PDF (1.989 στο δελτίο τύπου λόγω γνωστής απόκλισης μίας ερώτησης στα Οικονομικά), κατανεμημένες σε 11 θεματικές ενότητες.
            </p>
          </div>

          <div className="pt-3 space-y-1">
            <h3 className="font-bold text-white text-sm">
              Τι θα περιλαμβάνει η εξέταση δεξιοτήτων στον 3ο διαγωνισμό (2027);
            </h3>
            <p className="text-slate-300 leading-relaxed text-xs">
              Θα περιλαμβάνει επαγωγικό συλλογισμό (σχέσεις σχημάτων/matrix), ερωτήσεις αντίληψης χώρου (3D spatial reasoning) και τεστ εργασιακής συμπεριφοράς (δηλώσεις τύπου OPQ32/SHL).
            </p>
          </div>

          <div className="pt-3 space-y-1">
            <h3 className="font-bold text-white text-sm">
              Πώς θα διεξαχθεί ο 3ος Πανελλήνιος Γραπτός Διαγωνισμός;
            </h3>
            <p className="text-slate-300 leading-relaxed text-xs">
              Προγραμματίζεται εντός του 2027 μέσω ηλεκτρονικής διαδικασίας (computer-based) σε μόνιμα εξεταστικά κέντρα σε Αθήνα και Θεσσαλονίκη με παράθυρο πολλών εβδομάδων (CAT).
            </p>
          </div>
        </div>
      </div>

      {/* Official Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 space-y-1.5 leading-relaxed">
        <div className="flex items-center gap-2 text-slate-300 font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Όροι Χρήσης &amp; Συμμόρφωση με το Δελτίο Τύπου ΑΣΕΠ (14/10/2026)</span>
        </div>
        <p>
          • <strong>Πηγή Περιεχομένου:</strong> Μητρώο Θεμάτων Γνώσεων του ΑΣΕΠ (άρθρο 9, ν. 4765/2021).  
          • <strong>Αναλλοίωτο Περιεχόμενο:</strong> Οι ερωτήσεις αποδίδονται αυτούσιες χωρίς καμία παραποίηση.  
          • <strong>Μη Επίσημος Χαρακτήρας:</strong> Ανεξάρτητη εφαρμογή τρίτου για σκοπούς μελέτης (ν. 4727/2020) χωρίς σύνδεση ή έγκριση από το ΑΣΕΠ.
        </p>
      </div>
    </main>
  );
}