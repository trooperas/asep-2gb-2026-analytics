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
} from "lucide-react";
import {
  OFFICIAL_QUIZ_STATS,
  OFFICIAL_CATEGORIES_LIST,
} from "@/lib/quiz-constants";

export const metadata = {
  title: "Προετοιμασία & Μητρώο Θεμάτων ΑΣΕΠ (1.988 Ερωτήσεις) — 11 Ενότητες",
  description:
    "Δωρεάν εξάσκηση και πλήρης βάση απαντήσεων για τις 1.988 επίσημες ερωτήσεις γνώσεων του ΑΣΕΠ για τον επόμενο γραπτό διαγωνισμό. 11 γνωστικές ενότητες.",
  openGraph: {
    title: "Μητρώο 1.988 Θεμάτων ΑΣΕΠ — Δωρεάν Τεστ & Απαντήσεις",
    description:
      "Μελετήστε τις επίσημες ερωτήσεις γνώσεων του ΑΣΕΠ ανά κατηγορία (Συνταγματικό 265, Διοικητικό 303, Οικονομικά 334 κ.ά.).",
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

export default function ProetoimasiaHubPage() {
  return (
    <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <Link
        href="/"
        className="text-sm text-slate-400 hover:text-[#00E5FF] transition-colors inline-flex items-center gap-2 mb-6"
      >
        ← Επιστροφή στην Αρχική
      </Link>

      {/* Header */}
      <div className="mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Επίσημο Μητρώο Θεμάτων Γνώσεων ΑΣΕΠ
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-display text-white tracking-tight">
          Προετοιμασία & Τεστ{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-pink-500 to-amber-400">
            {OFFICIAL_QUIZ_STATS.TOTAL_QUESTIONS.toLocaleString("el-GR")} Ερωτήσεων
          </span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          Μελετήστε το επικαιροποιημένο Μητρώο Θεμάτων Γνώσεων που δημοσίευσε ο ΑΣΕΠ (11 γνωστικές ενότητες, 
          συνολικά 1.988 θέματα). Κάθε ερώτηση συνοδεύεται από την επίσημη ορθή απάντηση και δυνατότητα διαδραστικού τεστ 
          για την προετοιμασία του επερχόμενου γραπτού διαγωνισμού (2027).
        </p>
      </div>

      {/* KPIs Grid (Hardcoded Official Constants) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10">
        <div className="glass p-5 rounded-2xl">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">
            Επισημες Ερωτησεις
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-[#00E5FF]">
            {OFFICIAL_QUIZ_STATS.TOTAL_QUESTIONS.toLocaleString("el-GR")}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Επικαιροποιημένο Μητρώο</div>
        </div>

        <div className="glass p-5 rounded-2xl">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">
            Γνωστικες Ενοτητες
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-pink-400">
            {OFFICIAL_QUIZ_STATS.TOTAL_CATEGORIES}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Θεματικά αντικείμενα</div>
        </div>

        <div className="glass p-5 rounded-2xl">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">
            Επομενος Στοχος
          </div>
          <div className="text-sm sm:text-base font-bold text-white mt-1">
            3ος Διαγωνισμός
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Έτος 2027 (ΠΕ & ΤΕ)</div>
        </div>

        <div className="glass p-5 rounded-2xl">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">
            Προσβαση
          </div>
          <div className="text-sm sm:text-base font-bold text-emerald-400 mt-1">
            100% Δωρεάν
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Χωρίς συνδρομές ή κλειδώματα</div>
        </div>
      </div>

      {/* Official Source Disclaimer Banner (ΑΣΕΠ 14/10/2026 Compliance) */}
      <div className="mb-10 p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 to-[#070A13] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#00E5FF]">
            Επίσημη Πηγή & Όροι Χρήσης (Δελτίο Τύπου ΑΣΕΠ 14/10/2026)
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
            Το περιεχόμενο προέρχεται από το επίσημο Μητρώο Θεμάτων Γνώσεων του ΑΣΕΠ (ν. 4765/2021) 
            και αξιοποιείται ελεύθερα για σκοπούς μελέτης (ν. 4727/2020). 
            Πρόκειται για ανεξάρτητη εφαρμογή τρίτου και όχι για επίσημη εφαρμογή του ΑΣΕΠ.
          </p>
        </div>
        <a
          href="https://info.asep.gr/node/80138"
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-xs text-white font-medium hover:bg-slate-700 transition-colors flex-shrink-0"
        >
          <span>Ανακοίνωση ΑΣΕΠ</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
        </a>
      </div>

      {/* 11 Categories Grid with Hardcoded Official Counts & Last Update */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-display text-white">
          Επίσημη Κατανομή Θεμάτων ανά Γνωστική Ενότητα:
        </h2>

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
                    <h3 className="text-base font-bold text-white group-hover:text-[#00E5FF] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-white">
                  <span>Έναρξη Τεστ & Μελέτη</span>
                  <ArrowRight className="w-4 h-4 text-[#00E5FF] group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}