"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  ArrowRight,
  ArrowLeft,
  Info,
  ShieldCheck,
  Share2,
  Check,
  Sliders,
  TrendingUp,
  Zap,
  BookOpen,
  HelpCircle,
  Activity,
} from "lucide-react";

// ============ Τύποι & Σταθερές (αμετάβλητες) ============
interface Trait {
  id: string;
  label: string;
  desc: string;
}

const TRAITS: Record<string, Trait> = {
  teamwork: {
    id: "teamwork",
    label: "Ομαδικότητα & Συνεργασία",
    desc: "Ικανότητα αρμονικής συνεργασίας και επίτευξης κοινών στόχων στην ομάδα.",
  },
  results: {
    id: "results",
    label: "Προσανατολισμός στο Αποτέλεσμα",
    desc: "Εστίαση στην αποτελεσματικότητα, την τήρηση προθεσμιών και την ποιότητα.",
  },
  adaptability: {
    id: "adaptability",
    label: "Προσαρμοστικότητα & Ευελιξία",
    desc: "Θετική αντιμετώπιση αλλαγών και γρήγορη προσαρμογή σε νέες συνθήκες.",
  },
  resilience: {
    id: "resilience",
    label: "Ανθεκτικότητα & Αυτοέλεγχος",
    desc: "Διαχείριση άγχους, ψυχραιμία υπό πίεση και συναισθηματική σταθερότητα.",
  },
  integrity: {
    id: "integrity",
    label: "Ακεραιότητα & Δεοντολογία",
    desc: "Τήρηση θεσμικών κανόνων, διαφάνεια και προσήλωση στο δημόσιο συμφέρον.",
  },
  leadership: {
    id: "leadership",
    label: "Πρωτοβουλία & Ηγεσία",
    desc: "Ανάληψη ευθυνών, προνοητικότητα και ενθάρρυνση συναδέλφων.",
  },
  analytical: {
    id: "analytical",
    label: "Αναλυτική Σκέψη & Επίλυση",
    desc: "Ορθολογική ανάλυση προβλημάτων και λήψη τεκμηριωμένων αποφάσεων.",
  },
  communication: {
    id: "communication",
    label: "Επικοινωνία & Εξυπηρέτηση",
    desc: "Ενσυναίσθηση, σαφήνεια και σεβασμός στην εξυπηρέτηση του πολίτη.",
  },
};

interface Statement { text: string; trait: string; }
interface Triad { id: number; statements: Statement[]; }

const BASE_TRIADS: Triad[] = [
  {
    id: 1,
    statements: [
      { text: "Αναλαμβάνω εύκολα την πρωτοβουλία όταν προκύπτει ένα πρόβλημα.", trait: "leadership" },
      { text: "Προτιμώ να εργάζομαι σε περιβάλλον όπου όλοι συνεργάζονται αρμονικά.", trait: "teamwork" },
      { text: "Εστιάζω απόλυτα στην τήρηση των επίσημων διαδικασιών και κανονισμών.", trait: "integrity" },
    ],
  },
  {
    id: 2,
    statements: [
      { text: "Διατηρώ την ψυχραιμία μου ακόμη και όταν οι προθεσμίες πιέζουν ασφυκτικά.", trait: "resilience" },
      { text: "Αναζητώ συνεχώς νέους και αποδοτικότερους τρόπους εκτέλεσης των καθηκόντων μου.", trait: "results" },
      { text: "Προσαρμόζομαι άμεσα όταν αλλάζουν οι προτεραιότητες της υπηρεσίας.", trait: "adaptability" },
    ],
  },
  {
    id: 3,
    statements: [
      { text: "Επιδιώκω να ακούω προσεκτικά τις ανάγκες των συναδέλφων και των πολιτών.", trait: "communication" },
      { text: "Αναλύω διεξοδικά όλα τα διαθέσιμα δεδομένα πριν λάβω μια απόφαση.", trait: "analytical" },
      { text: "Αισθάνομαι ικανοποίηση όταν ολοκληρώνω ένα έργο με απόλυτη ακρίβεια.", trait: "results" },
    ],
  },
  {
    id: 4,
    statements: [
      { text: "Ενθαρρύνω τα μέλη της ομάδας μου να εκφράζουν ελεύθερα τις ιδέες τους.", trait: "teamwork" },
      { text: "Δεν αποθαρρύνομαι όταν τα πράγματα δεν εξελίσσονται όπως είχαν σχεδιαστεί.", trait: "resilience" },
      { text: "Θεωρώ ότι η τήρηση της δεοντολογίας προηγείται της ταχύτητας.", trait: "integrity" },
    ],
  },
  {
    id: 5,
    statements: [
      { text: "Είμαι ανοιχτός σε αλλαγές που βελτιώνουν τον τρόπο λειτουργίας του γραφείου.", trait: "adaptability" },
      { text: "Μπορώ να πείσω τους άλλους για την ορθότητα μιας πρότασής μου.", trait: "leadership" },
      { text: "Δίνω προτεραιότητα στην άμεση εξυπηρέτηση των πολιτών με ευγένεια.", trait: "communication" },
    ],
  },
  {
    id: 6,
    statements: [
      { text: "Εντοπίζω γρήγορα λογικά κενά ή ασυνέπειες σε μια αναφορά.", trait: "analytical" },
      { text: "Θέτω υψηλούς στόχους για την προσωπική μου απόδοση.", trait: "results" },
      { text: "Αποφεύγω τις εντάσεις αναζητώντας πάντα τη συναίνεση.", trait: "teamwork" },
    ],
  },
  {
    id: 7,
    statements: [
      { text: "Λειτουργώ με διαφάνεια ακόμη κι όταν δεν με ελέγχει κάποιος προϊστάμενος.", trait: "integrity" },
      { text: "Διαχειρίζομαι αποτελεσματικά πολλαπλά καθήκοντα ταυτόχρονα.", trait: "resilience" },
      { text: "Μαθαίνω με ευκολία νέα ψηφιακά συστήματα και εργαλεία.", trait: "adaptability" },
    ],
  },
  {
    id: 8,
    statements: [
      { text: "Εξηγώ σύνθετες οδηγίες με απλό και κατανοητό τρόπο.", trait: "communication" },
      { text: "Παίρνω αποφάσεις βασιζόμενος σε γεγονότα και όχι σε υποθέσεις.", trait: "analytical" },
      { text: "Αναλαμβάνω την ευθύνη για τα λάθη μου χωρίς δικαιολογίες.", trait: "integrity" },
    ],
  },
  {
    id: 9,
    statements: [
      { text: "Κατευθύνω την ομάδα σε λύσεις όταν όλοι έχουν κολλήσει.", trait: "leadership" },
      { text: "Οργανώνω τον χρόνο μου ώστε να μην αφήνω εκκρεμότητες.", trait: "results" },
      { text: "Βοηθώ πρόθυμα έναν συνάδελφο που έχει μείνει πίσω στη δουλειά του.", trait: "teamwork" },
    ],
  },
  {
    id: 10,
    statements: [
      { text: "Παραμένω παραγωγικός ακόμη και σε συνθήκες έντονου θορύβου ή άγχους.", trait: "resilience" },
      { text: "Δέχομαι καλοπροαίρετα την κριτική και προσπαθώ να βελτιωθώ.", trait: "adaptability" },
      { text: "Εξετάζω τις μακροπρόθεσμες συνέπειες μιας απόφασης.", trait: "analytical" },
    ],
  },
  {
    id: 11,
    statements: [
      { text: "Εξασφαλίζω ότι όλοι οι πολίτες τυγχάνουν ίσης και δίκαιης μεταχείρισης.", trait: "integrity" },
      { text: "Επικοινωνώ με άνεση με ανθρώπους διαφορετικού μορφωτικού επιπέδου.", trait: "communication" },
      { text: "Δεν εφησυχάζω μέχρι να επιτευχθεί ο τελικός στόχος της υπηρεσίας.", trait: "results" },
    ],
  },
  {
    id: 12,
    statements: [
      { text: "Μπορώ να καθοδηγήσω νέους συναδέλφους στα καθήκοντά τους.", trait: "leadership" },
      { text: "Προσαρμόζω τον τρόπο εργασίας μου στις ανάγκες της εκάστοτε ομάδας.", trait: "teamwork" },
      { text: "Ανακτώ γρήγορα την ψυχραιμία μου μετά από μια δύσκολη κατάσταση.", trait: "resilience" },
    ],
  },
];

// ============ Fisher-Yates Shuffle (σωστή υλοποίηση) ============
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateFullPool(): Triad[] {
  const full: Triad[] = [];
  let idCounter = 1;
  while (full.length < 76) {
    for (const base of BASE_TRIADS) {
      if (full.length >= 76) break;
      full.push({
        id: idCounter++,
        statements: shuffleArray(base.statements),
      });
    }
  }
  return full;
}

// ============ JSON-LD ============
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Τι είναι το τεστ εργασιακών δεξιοτήτων (OPQ32 / 76 τριάδες) του ΑΣΕΠ;",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Είναι ψυχομετρική δοκιμασία αναγκαστικής επιλογής (forced-choice) που αξιολογεί την εργασιακή συμπεριφορά και αποτελεσματικότητα των υποψηφίων σε 8 βασικούς πυλώνες δεξιοτήτων.",
      },
    },
    {
      "@type": "Question",
      name: "Υπάρχουν σωστές και λάθος απαντήσεις στις τριάδες του ΑΣΕΠ;",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Όχι, δεν υπάρχουν τυπικά 'σωστές' απαντήσεις. Το τεστ βαθμολογεί τη συνοχή, την ισορροπία και τη συνέπεια των απαντήσεων σε σχέση με τις απαιτήσεις του δημόσιου τομέα.",
      },
    },
  ],
};

// ============ Κύρια Συνιστώσα ============
export default function ErgasiakesDeksiotitesPage() {
  const [selectedMode, setSelectedMode] = useState<"express" | "full" | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [choices, setChoices] = useState<Record<number, { most: number | null; least: number | null }>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showLiveTracker, setShowLiveTracker] = useState(true);

  const activeTriads = useMemo(() => {
    if (selectedMode === "express") return BASE_TRIADS;
    if (selectedMode === "full") return generateFullPool();
    return [];
  }, [selectedMode]);

  const currentTriad = activeTriads[currentStep];
  const currentChoice = choices[currentStep] || { most: null, least: null };
  const isCurrentValid = currentChoice.most !== null && currentChoice.least !== null;

  // ============ Χειρισμός επιλογής (με απενεργοποίηση) ============
  function handleSelectMost(idx: number) {
    if (currentChoice.least === idx) return;
    setChoices((prev) => ({
      ...prev,
      [currentStep]: { ...prev[currentStep], most: prev[currentStep]?.most === idx ? null : idx, least: prev[currentStep]?.least ?? null },
    }));
  }

  function handleSelectLeast(idx: number) {
    if (currentChoice.most === idx) return;
    setChoices((prev) => ({
      ...prev,
      [currentStep]: { ...prev[currentStep], most: prev[currentStep]?.most ?? null, least: prev[currentStep]?.least === idx ? null : idx },
    }));
  }

  // ============ Διόρθωση: υπολογισμός τελικού σκορ με νέες απαντήσεις ============
  const traitScores = useMemo(() => {
    const rawScores: Record<string, number> = {};
    Object.keys(TRAITS).forEach((t) => (rawScores[t] = 50));

    Object.entries(choices).forEach(([stepStr, ch]) => {
      const stepIdx = parseInt(stepStr, 10);
      const triad = activeTriads[stepIdx];
      if (!triad) return;
      if (ch.most !== null && triad.statements[ch.most]) {
        rawScores[triad.statements[ch.most].trait] += 8;
      }
      if (ch.least !== null && triad.statements[ch.least]) {
        rawScores[triad.statements[ch.least].trait] = Math.max(10, rawScores[triad.statements[ch.least].trait] - 5);
      }
    });

    const normalized: Record<string, number> = {};
    Object.keys(TRAITS).forEach((t) => {
      normalized[t] = Math.min(100, Math.max(15, rawScores[t]));
    });
    return normalized;
  }, [choices, activeTriads]);

  const sortedTraits = useMemo(() => {
    return Object.entries(traitScores).sort(([, a], [, b]) => b - a);
  }, [traitScores]);

  // ============ Διόρθωση: διασφάλιση καταγραφής τελευταίας τριάδας ============
  const handleNext = useCallback(() => {
    if (!isCurrentValid) return;
    const newChoices = {
      ...choices,
      [currentStep]: { most: currentChoice.most!, least: currentChoice.least! },
    };
    setChoices(newChoices);

    if (currentStep < activeTriads.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      // Τελευταία τριάδα: εγγραφή νέων επιλογών και ολοκλήρωση
      setIsCompleted(true);
    }
  }, [isCurrentValid, choices, currentStep, currentChoice, activeTriads.length]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }, [currentStep]);

  const handleReset = useCallback(() => {
    setSelectedMode(null);
    setCurrentStep(0);
    setChoices({});
    setIsCompleted(false);
  }, []);

  // ============ Δημιουργία συνδέσμου κοινής χρήσης με OG εικόνα ============
  const buildShareUrl = useCallback(() => {
    const params = new URLSearchParams();
    sortedTraits.slice(0, 2).forEach(([key], i) => {
      params.set(`t${i}`, key);
      params.set(`s${i}`, String(traitScores[key]));
    });
    return `${typeof window !== "undefined" ? window.location.origin : ""}/api/og?${params.toString()}`;
  }, [sortedTraits, traitScores]);

  // Δυναμικό Share URL που ενεργοποιεί την εξατομικευμένη OG κάρτα!
  function handleShare() {
    const t0 = sortedTraits[0]?.[0] || "teamwork";
    const s0 = sortedTraits[0]?.[1] || 90;
    const t1 = sortedTraits[1]?.[0] || "results";
    const s1 = sortedTraits[1]?.[1] || 85;

    // Πλήρες δυναμικό link με τα αποτελέσματα του χρήστη
    const shareUrl = `https://asepanalytics.app/proetoimasia/ergasiakes-deksiotites?t0=${t0}&s0=${s0}&t1=${t1}&s1=${s1}`;

    const text = `🏛️ Ολοκλήρωσα το επίσημο Τεστ Εργασιακών Δεξιοτήτων (OPQ32) για τον ΑΣΕΠ!\n🎯 Κυρίαρχο Χαρακτηριστικό: ${TRAITS[t0]?.label ?? t0} (${s0}%)\n⚡ Δευτερεύον: ${TRAITS[t1]?.label ?? t1} (${s1}%)\n\n👉 Κάντε κι εσείς δωρεάν το τεστ:\n${shareUrl}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  // ============ Render ============
  return (
    <main className="min-h-screen pt-20 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Breadcrumb href="/proetoimasia" label="Προετοιμασία" />

      {/* Hero */}
      <div className="mb-10 space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
          <Briefcase className="w-3.5 h-3.5" />
          Επίσημη Δοκιμασία ΑΣΕΠ 1Γ/2025 & 3ου Διαγωνισμού (2027)
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-display text-white tracking-tight">
          Τεστ Εργασιακών Δεξιοτήτων &{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-[#00E5FF] to-emerald-400">
            Συμπεριφοράς (OPQ32)
          </span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          Διαδραστική προσομοίωση της δοκιμασίας <strong>αναγκαστικής επιλογής (forced-choice)</strong> του ΑΣΕΠ.
          Σε κάθε τριάδα, επιλέξτε υποχρεωτικά <strong>μία δήλωση που σας ταιριάζει περισσότερο (+)</strong> και
          <strong> μία που σας ταιριάζει λιγότερο (-)</strong>.
        </p>
      </div>

      {/* Επιλογή τρόπου */}
      {!selectedMode && !isCompleted && (
        <div className="glass p-6 sm:p-10 rounded-3xl border border-slate-800 space-y-6 mb-16 shadow-2xl">
          <h2 className="text-xl sm:text-2xl font-bold text-white text-center">Επιλέξτε Τύπο Προσομοίωσης</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div
              onClick={() => setSelectedMode("express")}
              className="glass p-6 rounded-2xl border border-[#00E5FF]/30 hover:border-[#00E5FF] hover:bg-[#00E5FF]/5 transition-all cursor-pointer flex flex-col justify-between group space-y-4 shadow-lg"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] font-mono text-xs font-bold border border-[#00E5FF]/30">⚡ ΔΙΑΓΝΩΣΤΙΚΟ (3 ΛΕΠΤΑ)</span>
                  <Zap className="w-5 h-5 text-[#00E5FF] group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#00E5FF]">Express (12 Τριάδες)</h3>
                <p className="text-xs text-slate-300 leading-relaxed">Γρήγορη εξοικείωση με τον μηχανισμό των τριάδων.</p>
              </div>
              <button type="button" className="w-full py-2.5 rounded-xl bg-[#00E5FF] text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 group-hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all cursor-pointer">
                Έναρξη <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div
              onClick={() => setSelectedMode("full")}
              className="glass p-6 rounded-2xl border border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/5 transition-all cursor-pointer flex flex-col justify-between group space-y-4 shadow-lg"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">🎓 ΠΛΗΡΕΣ ΑΣΕΠ (20 ΛΕΠΤΑ)</span>
                  <Briefcase className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300">Πλήρης Εξέταση (76 Τριάδες)</h3>
                <p className="text-xs text-slate-300 leading-relaxed">Η αυθεντική κλίμακα του διαγωνισμού 1Γ/2025.</p>
              </div>
              <button type="button" className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all cursor-pointer">
                Έναρξη <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ενεργό τεστ */}
      {selectedMode && !isCompleted && currentTriad && (
        <div className="space-y-6 mb-16">
          <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            <span className="font-mono">Τριάδα <strong>{currentStep + 1}</strong> / {activeTriads.length}</span>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setShowLiveTracker(!showLiveTracker)} className="text-xs text-[#00E5FF] hover:underline flex items-center gap-1 cursor-pointer font-medium">
                <Activity className="w-3.5 h-3.5" /> {showLiveTracker ? "Απόκρυψη" : "Προβολή"} Live
              </button>
              <span className="text-slate-600">•</span>
              <button type="button" onClick={handleReset} className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer">
                <RotateCcw className="w-3 h-3" /> Έξοδος
              </button>
            </div>
          </div>

          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-amber-400 via-[#00E5FF] to-emerald-400 h-full transition-all duration-300" style={{ width: `${((currentStep + 1) / activeTriads.length) * 100}%` }} />
          </div>

          {/* Live tracker */}
          <AnimatePresence>
            {showLiveTracker && Object.keys(choices).length > 0 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-2 overflow-hidden shadow-lg">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[#00E5FF] font-bold flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> Live Εξέλιξη (Κορυφαίες):</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                  {sortedTraits.slice(0, 3).map(([k, v]) => (
                    <div key={k} className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px]">
                      <div className="text-slate-300 font-medium truncate">{TRAITS[k].label}</div>
                      <div className="font-mono font-bold text-emerald-400 text-xs mt-0.5">{v}%</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Τριάδα */}
          <div className="glass p-6 sm:p-10 rounded-3xl border border-slate-800 space-y-6 shadow-2xl relative">
            <div className="text-xs font-mono uppercase text-slate-400 flex items-center justify-between">
              <span>Επιλέξτε: 1 Περισσότερο (+) και 1 Λιγότερο (-)</span>
              <span className="text-amber-400 text-[11px]">Η 3η δήλωση μένει ουδέτερη</span>
            </div>
            <div className="space-y-4">
              {currentTriad.statements.map((stmt, idx) => {
                const isMost = currentChoice.most === idx;
                const isLeast = currentChoice.least === idx;
                return (
                  <div key={idx} className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isMost ? "bg-emerald-950/40 border-emerald-500/70 shadow-[0_0_15px_rgba(16,185,129,0.15)]" : isLeast ? "bg-pink-950/30 border-pink-500/60" : "bg-slate-900/40 border-slate-800 text-slate-300"}`}>
                    <div className="text-sm sm:text-base font-medium text-slate-100 flex-1 leading-relaxed">{stmt.text}</div>
                    <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                      <button type="button" onClick={() => handleSelectMost(idx)} disabled={isLeast} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-20 ${isMost ? "bg-emerald-500 text-slate-950 shadow-md" : "bg-slate-800/80 hover:bg-slate-700 text-slate-300"}`}>
                        <CheckCircle2 className="w-4 h-4" /> Περισσότερο (+)
                      </button>
                      <button type="button" onClick={() => handleSelectLeast(idx)} disabled={isMost} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-20 ${isLeast ? "bg-pink-500 text-white shadow-md" : "bg-slate-800/80 hover:bg-slate-700 text-slate-300"}`}>
                        <XCircle className="w-4 h-4" /> Λιγότερο (-)
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between pt-6 border-t border-slate-800">
              <button type="button" onClick={handlePrev} disabled={currentStep === 0} className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Προηγούμενη
              </button>
              <button type="button" onClick={handleNext} disabled={!isCurrentValid} className="px-6 py-2.5 rounded-xl bg-[#00E5FF] text-slate-950 text-xs sm:text-sm font-bold hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all flex items-center gap-2 cursor-pointer shadow-lg">
                {currentStep === activeTriads.length - 1 ? "Ολοκλήρωση & Προφίλ" : "Επόμενη"} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Αποτελέσματα */}
      {isCompleted && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 mb-16">
          <div className="glass p-6 sm:p-10 rounded-3xl border border-emerald-500/40 text-center space-y-4 shadow-2xl relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400"><Trophy className="w-8 h-8" /></div>
            <span className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider">Ολοκλήρωση ({selectedMode === "express" ? "12" : "76"} Τριάδες)</span>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-white">Το Προφίλ Εργασιακών Δεξιοτήτων σας</h2>
          </div>

          <div className="glass p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2"><Sliders className="w-5 h-5 text-[#00E5FF]" /> Ανάλυση ανά Διάσταση</h3>
            <div className="space-y-4">
              {sortedTraits.map(([traitKey, scoreVal], idx) => {
                const trait = TRAITS[traitKey];
                const isTop = idx < 2;
                return (
                  <div key={traitKey} className="space-y-1.5 p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{trait.label}</span>
                        {isTop && <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">★ ΔΥΝΑΤΟ</span>}
                      </div>
                      <span className="font-mono font-bold text-[#00E5FF]">{scoreVal}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-700 ${isTop ? "bg-gradient-to-r from-[#00E5FF] to-emerald-400" : "bg-cyan-600/70"}`} style={{ width: `${scoreVal}%` }} />
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed pt-1">{trait.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass p-6 rounded-3xl border border-[#00E5FF]/40 bg-gradient-to-r from-cyan-950/30 via-slate-900 to-slate-950 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#00E5FF]"><TrendingUp className="w-4 h-4" /> Συσχέτιση με Βάσεις 2ΓΒ/2026</div>
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
              <span className="text-xs text-slate-400">Επίσημα στατιστικά 51.900 υποψηφίων:</span>
              <Link href="/stats" className="text-xs font-bold text-[#00E5FF] hover:underline">Εξερεύνηση Βάσεων →</Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button type="button" onClick={handleShare} className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#00E5FF] text-slate-950 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer hover:scale-105 transition-all shadow-lg">
              {copied ? <><Check className="w-4 h-4" /> Αντιγράφηκε!</> : <><Share2 className="w-4 h-4" /> Κοινοποίηση</>}
            </button>
            <button type="button" onClick={handleReset} className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer hover:text-white">
              <RotateCcw className="w-4 h-4" /> Νέα Προσομοίωση
            </button>
          </div>
        </motion.div>
      )}

      {/* Οδηγός SEO */}
      <article className="glass p-6 sm:p-10 rounded-3xl border border-slate-800 space-y-8 text-slate-300 text-xs sm:text-sm leading-relaxed">
        <div className="border-b border-slate-800 pb-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#00E5FF] uppercase tracking-wider mb-1"><BookOpen className="w-4 h-4" /> Οδηγός Υποψηφίου</div>
          <h2 className="text-xl sm:text-3xl font-bold font-display text-white">Όλα για τις 76 Τριάδες και το OPQ32</h2>
        </div>
        <section className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2"><Info className="w-4 h-4 text-[#00E5FF]" /> Τι είναι η δοκιμασία εργασιακής αποτελεσματικότητας;</h3>
          <p>Στον 2ο Πανελλήνιο Γραπτό Διαγωνισμό (1Γ/2025), το ΑΣΕΠ εισήγαγε τη δοκιμασία εργασιακής συμπεριφοράς. Αξιολογεί τις ήπιες δεξιότητες (soft skills), τον τρόπο επίλυσης συγκρούσεων, την ανθεκτικότητα και τη συνεργατικότητα.</p>
        </section>
        <section className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2"><Sliders className="w-4 h-4 text-amber-400" /> Πώς λειτουργεί το forced-choice;</h3>
          <p>Βασίζεται στη μεθοδολογία OPQ32. Ο υποψήφιος συγκρίνει 3 θετικές δηλώσεις: επιλέγει μία που τον περιγράφει περισσότερο (+) και μία λιγότερο (-). Η τρίτη μένει ουδέτερη. Αυτό αποτρέπει την «ωραιοποίηση».</p>
        </section>
        <section className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2"><HelpCircle className="w-4 h-4 text-emerald-400" /> Υπάρχουν σωστές απαντήσεις;</h3>
          <p>Όχι με την κλασική έννοια. Το ΑΣΕΠ αναζητά ισορροπημένα και συνεπή προφίλ που ταιριάζουν στην κουλτούρα του δημόσιου τομέα.</p>
        </section>
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div><strong>Σημείωση:</strong> Ανεξάρτητο εκπαιδευτικό εργαλείο. Δεν συνδέεται με το ΑΣΕΠ ή την SHL.</div>
        </div>
      </article>
    </main>
  );
}