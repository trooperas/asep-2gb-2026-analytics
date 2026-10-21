"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  ArrowRight,
  ArrowLeft,
  Sparkles,
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
  ChevronDown,
  ChevronUp,
} from "lucide-react";

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

interface Statement {
  text: string;
  trait: string;
}

interface Triad {
  id: number;
  statements: Statement[];
}

// Τράπεζα Τριάδων
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

// Δημιουργία πλήρους δεξαμενής 76 τριάδων μέσω παραλλαγών για το full mode
function generateFullPool(): Triad[] {
  const full: Triad[] = [];
  let idCounter = 1;
  while (full.length < 76) {
    for (const b of BASE_TRIADS) {
      if (full.length >= 76) break;
      full.push({
        id: idCounter++,
        statements: [...b.statements].sort(() => (idCounter % 2 === 0 ? 0.5 : -0.5)),
      });
    }
  }
  return full;
}

export default function ErgasiakesDeksiotitesPage() {
  const [mode, setMode] = useState<"express" | "full">("express");
  const [testStarted, setTestStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Επιλογές τρέχουσας τριάδας
  const [mostIdx, setMostIdx] = useState<number | null>(null);
  const [leastIdx, setLeastIdx] = useState<number | null>(null);

  // Απαντήσεις
  const [answers, setAnswers] = useState<Record<number, { most: number; least: number }>>({});
  const [completed, setCompleted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showLiveTracker, setShowLiveTracker] = useState(true);

  const triads = useMemo(() => {
    return mode === "express" ? BASE_TRIADS : generateFullPool();
  }, [mode]);

  const currentTriad = triads[currentIndex];
  const isLast = currentIndex === triads.length - 1;
  const canProceed = mostIdx !== null && leastIdx !== null && mostIdx !== leastIdx;

  function startTest(selectedMode: "express" | "full") {
    setMode(selectedMode);
    setCurrentIndex(0);
    setMostIdx(null);
    setLeastIdx(null);
    setAnswers({});
    setCompleted(false);
    setTestStarted(true);
  }

  function selectMost(idx: number) {
    if (leastIdx === idx) setLeastIdx(null);
    setMostIdx(idx);
  }

  function selectLeast(idx: number) {
    if (mostIdx === idx) setMostIdx(null);
    setLeastIdx(idx);
  }

  function handleNext() {
    if (!canProceed) return;

    const newAnswers = {
      ...answers,
      [currentTriad.id]: { most: mostIdx!, least: leastIdx! },
    };
    setAnswers(newAnswers);

    if (isLast) {
      setCompleted(true);
    } else {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      const nextAns = newAnswers[triads[nextIndex].id];
      setMostIdx(nextAns ? nextAns.most : null);
      setLeastIdx(nextAns ? nextAns.least : null);
    }
  }

  function handlePrev() {
    if (currentIndex === 0) return;
    const prevIndex = currentIndex - 1;
    setCurrentIndex(prevIndex);
    const prevAns = answers[triads[prevIndex].id];
    setMostIdx(prevAns ? prevAns.most : null);
    setLeastIdx(prevAns ? prevAns.least : null);
  }

  function restartTest() {
    setTestStarted(false);
    setCurrentIndex(0);
    setMostIdx(null);
    setLeastIdx(null);
    setAnswers({});
    setCompleted(false);
  }

  // Ζωντανός Υπολογισμός Σκορ (Τρέχει και κατά τη διάρκεια του τεστ για το Live Preview)
  const traitScores = useMemo(() => {
    const rawScores: Record<string, number> = {};
    Object.keys(TRAITS).forEach((t) => (rawScores[t] = 50));

    Object.entries(answers).forEach(([triadId, ans]) => {
      const tr = triads.find((t) => t.id === Number(triadId));
      if (!tr) return;

      const mostTrait = tr.statements[ans.most].trait;
      const leastTrait = tr.statements[ans.least].trait;

      rawScores[mostTrait] = (rawScores[mostTrait] || 50) + 8;
      rawScores[leastTrait] = Math.max(10, (rawScores[leastTrait] || 50) - 5);
    });

    const normalized: Record<string, number> = {};
    Object.keys(TRAITS).forEach((t) => {
      normalized[t] = Math.min(100, Math.max(15, rawScores[t]));
    });

    return normalized;
  }, [answers, triads]);

  const sortedTraits = useMemo(() => {
    return Object.entries(traitScores).sort(([, a], [, b]) => b - a);
  }, [traitScores]);

  function handleShare() {
    const text = `🧠 Ολοκλήρωσα την προσομοίωση Εργασιακών Δεξιοτήτων (OPQ32) για τον ΑΣΕΠ!\nΚάντε κι εσείς το δωρεάν τεστ:\n👉 https://asepanalytics.app/proetoimasia/ergasiakes-deksiotites`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-mono">
        <Link href="/proetoimasia" className="hover:text-[#00E5FF]">
          Προετοιμασία
        </Link>
        <span>/</span>
        <span className="text-slate-200">Εργασιακές Δεξιότητες (OPQ32)</span>
      </div>

      {/* Hero Header */}
      <div className="mb-10 space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
          <Briefcase className="w-3.5 h-3.5" />
          Επίσημη Δοκιμασία ΑΣΕΠ 1Γ/2025 & 3ου Διαγωνισμού (2027)
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-display text-white tracking-tight">
          Τεστ Εργασιακών Δεξιοτήτων & Συμπεριφοράς{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-[#00E5FF] to-emerald-400">
            (OPQ32)
          </span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          Διαδραστική προσομοίωση της δοκιμασίας <strong>αναγκαστικής επιλογής (forced-choice)</strong> του ΑΣΕΠ. 
          Σε κάθε τριάδα, επιλέξτε υποχρεωτικά <strong>μία δήλωση που σας ταιριάζει περισσότερο (+)</strong> και 
          <strong> μία που σας ταιριάζει λιγότερο (-)</strong> για να χαρτογραφήσετε το εργασιακό σας προφίλ.
        </p>
      </div>

      {/* ============================================================== */}
      {/* MODE SELECTOR (Αν δεν έχει ξεκινήσει το τεστ) */}
      {/* ============================================================== */}
      {!testStarted && (
        <div className="glass p-6 sm:p-10 rounded-3xl border border-slate-800 space-y-6 mb-16 shadow-2xl">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Επιλέξτε Τύπο Προσομοίωσης
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Επιλέξτε τη γρήγορη διάγνωση ή την πλήρη εξέταση του διαγωνισμού.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {/* Express Mode */}
            <div
              onClick={() => startTest("express")}
              className="glass p-6 rounded-2xl border border-[#00E5FF]/30 hover:border-[#00E5FF] hover:bg-[#00E5FF]/5 transition-all cursor-pointer flex flex-col justify-between group space-y-4 shadow-lg"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] font-mono text-xs font-bold border border-[#00E5FF]/30">
                    ⚡ ΔΙΑΓΝΩΣΤΙΚΟ (3 ΛΕΠΤΑ)
                  </span>
                  <Zap className="w-5 h-5 text-[#00E5FF] group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#00E5FF] transition-colors">
                  Express Προσομοίωση (12 Τριάδες)
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Ιδανικό για γρήγορη εξοικείωση με τον μηχανισμό των τριάδων και άμεση εικόνα των ισχυρών σας σημείων.
                </p>
              </div>
              <button
                type="button"
                className="w-full py-2.5 rounded-xl bg-[#00E5FF] text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 group-hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all cursor-pointer"
              >
                Έναρξη Express Τεστ <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Full Mode */}
            <div
              onClick={() => startTest("full")}
              className="glass p-6 rounded-2xl border border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/5 transition-all cursor-pointer flex flex-col justify-between group space-y-4 shadow-lg"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
                    🎓 ΠΛΗΡΕΣ ΑΣΕΠ (20 ΛΕΠΤΑ)
                  </span>
                  <Briefcase className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                  Πλήρης Εξέταση (76 Τριάδες)
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Η αυθεντική κλίμακα του διαγωνισμού 1Γ/2025. Δοκιμάζει τη συνέπεια των απαντήσεων σε βάθος χρόνου.
                </p>
              </div>
              <button
                type="button"
                className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
              >
                Έναρξη Πλήρους Τεστ <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* INTERACTIVE TEST CARD */}
      {/* ============================================================== */}
      {testStarted && !completed && (
        <div className="space-y-6 mb-16">
          {/* Header Bar */}
          <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            <span className="font-mono">
              Τριάδα <strong>{currentIndex + 1}</strong> από {triads.length} (
              {mode === "express" ? "Express Mode" : "Πλήρες Mode"})
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowLiveTracker(!showLiveTracker)}
                className="text-xs text-[#00E5FF] hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                <Activity className="w-3.5 h-3.5" />
                {showLiveTracker ? "Απόκρυψη Live Profile" : "Προβολή Live Profile"}
              </button>
              <span className="text-slate-600">•</span>
              <button
                type="button"
                onClick={restartTest}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Επανεκκίνηση
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 via-[#00E5FF] to-emerald-400 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / triads.length) * 100}%` }}
            />
          </div>

          {/* LIVE REAL-TIME PROFILE TRACKER (GAMIFIED PREVIEW) */}
          <AnimatePresence>
            {showLiveTracker && Object.keys(answers).length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-2 overflow-hidden shadow-lg"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[#00E5FF] font-bold flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" /> Live Εξέλιξη Προφίλ (Κορυφαίες Ικανότητες):
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {Object.keys(answers).length} απαντήσεις
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                  {sortedTraits.slice(0, 3).map(([traitKey, scoreVal]) => (
                    <div
                      key={traitKey}
                      className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px]"
                    >
                      <div className="text-slate-300 font-medium truncate">
                        {TRAITS[traitKey].label}
                      </div>
                      <div className="font-mono font-bold text-emerald-400 text-xs mt-0.5">
                        {scoreVal}%
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Triad Box */}
          <div className="glass p-6 sm:p-10 rounded-3xl border border-slate-800 space-y-6 shadow-2xl relative">
            <div className="text-xs font-mono uppercase text-slate-400 flex items-center justify-between">
              <span>Επιλέξτε: 1 Περισσότερο (+) και 1 Λιγότερο (-)</span>
              <span className="text-amber-400 text-[11px]">Η 3η δήλωση μένει αυτόματα ουδέτερη</span>
            </div>

            {/* Statements List */}
            <div className="space-y-4">
              {currentTriad.statements.map((stmt, idx) => {
                const isMost = mostIdx === idx;
                const isLeast = leastIdx === idx;

                return (
                  <div
                    key={idx}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isMost
                        ? "bg-emerald-950/40 border-emerald-500/70 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                        : isLeast
                        ? "bg-pink-950/30 border-pink-500/60"
                        : "bg-slate-900/40 border-slate-800 text-slate-300"
                    }`}
                  >
                    <div className="text-sm sm:text-base font-medium text-slate-100 flex-1 leading-relaxed">
                      {stmt.text}
                    </div>

                    {/* Dual Action Buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => selectMost(idx)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                          isMost
                            ? "bg-emerald-500 text-slate-950 shadow-md"
                            : "bg-slate-800/80 hover:bg-slate-700 text-slate-300"
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Περισσότερο (+)
                      </button>

                      <button
                        type="button"
                        onClick={() => selectLeast(idx)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                          isLeast
                            ? "bg-pink-500 text-white shadow-md"
                            : "bg-slate-800/80 hover:bg-slate-700 text-slate-300"
                        }`}
                      >
                        <XCircle className="w-4 h-4" />
                        Λιγότερο (-)
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-800">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Προηγούμενη
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceed}
                className="px-6 py-2.5 rounded-xl bg-[#00E5FF] text-slate-950 text-xs sm:text-sm font-bold hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all flex items-center gap-2 cursor-pointer shadow-lg"
              >
                {isLast ? "Ολοκλήρωση & Προφίλ" : "Επόμενη Τριάδα"} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* FINAL SCORECARD / RESULTS PROFILE */}
      {/* ============================================================== */}
      {completed && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 mb-16"
        >
          {/* Header Card */}
          <div className="glass p-6 sm:p-10 rounded-3xl border border-emerald-500/40 text-center space-y-4 shadow-2xl relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <Trophy className="w-8 h-8" />
            </div>
            <span className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider">
              Ολοκλήρωση Προσομοίωσης ({mode === "express" ? "12 Τριάδες" : "76 Τριάδες"})
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-white">
              Το Προφίλ Εργασιακών Δεξιοτήτων σας
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Ακολουθεί η χαρτογράφηση των 8 βασικών διαστάσεων συμπεριφοράς βάσει του μοντέλου αναγκαστικής επιλογής.
            </p>
          </div>

          {/* Breakdown Bars */}
          <div className="glass p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#00E5FF]" />
              Ανάλυση ανά Διάσταση Ικανοτήτων
            </h3>

            <div className="space-y-4">
              {sortedTraits.map(([traitKey, scoreVal], idx) => {
                const trait = TRAITS[traitKey];
                const isTop = idx < 2;

                return (
                  <div
                    key={traitKey}
                    className="space-y-1.5 p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80"
                  >
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{trait.label}</span>
                        {isTop && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            ★ ΔΥΝΑΤΟ ΣΗΜΕΙΟ
                          </span>
                        )}
                      </div>
                      <span className="font-mono font-bold text-[#00E5FF]">{scoreVal}%</span>
                    </div>

                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isTop ? "bg-gradient-to-r from-[#00E5FF] to-emerald-400" : "bg-cyan-600/70"
                        }`}
                        style={{ width: `${scoreVal}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                      {trait.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CUTOFF BRIDGE */}
          <div className="glass p-6 rounded-3xl border border-[#00E5FF]/40 bg-gradient-to-r from-cyan-950/30 via-slate-900 to-slate-950 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#00E5FF]">
              <TrendingUp className="w-4 h-4" />
              Συσχέτιση με τις Βάσεις Διορισμού 2ΓΒ/2026
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Οι εργασιακές δεξιότητες συναποτελούν τη συνολική βαθμολογία. Δείτε πώς διαμορφώθηκαν οι βάσεις εισαγωγής ανά φορέα και νομό:
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
              <span className="text-xs text-slate-400">Επίσημα στατιστικά 51.900 υποψηφίων:</span>
              <Link
                href="/stats"
                className="text-xs font-bold text-[#00E5FF] hover:underline flex items-center gap-1"
              >
                Εξερεύνηση Βάσεων & Μορίων →
              </Link>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleShare}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#00E5FF] text-slate-950 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer hover:scale-105 transition-all shadow-lg"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-950" /> Αντιγράφηκε!
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" /> Κοινοποίηση Προφίλ
                </>
              )}
            </button>

            <button
              type="button"
              onClick={restartTest}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer hover:text-white"
            >
              <RotateCcw className="w-4 h-4" /> Νέα Προσομοίωση
            </button>
          </div>
        </motion.div>
      )}

      {/* ============================================================== */}
      {/* ΕΚΠΑΙΔΕΥΤΙΚΟΣ ΟΔΗΓΟΣ (SEO & USER VALUE — ΧΩΡΙΣ SPAM) */}
      {/* ============================================================== */}
      <article className="glass p-6 sm:p-10 rounded-3xl border border-slate-800 space-y-8 text-slate-300 text-xs sm:text-sm leading-relaxed">
        <div className="border-b border-slate-800 pb-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#00E5FF] uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            Οδηγός Υποψηφίου
          </div>
          <h2 className="text-xl sm:text-3xl font-bold font-display text-white">
            Όλα όσα πρέπει να γνωρίζετε για τις 76 Τριάδες και το OPQ32
          </h2>
        </div>

        <section className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Info className="w-4 h-4 text-[#00E5FF]" />
            Τι είναι η δοκιμασία εργασιακής αποτελεσματικότητας του ΑΣΕΠ;
          </h3>
          <p>
            Στον 2ο Πανελλήνιο Γραπτό Διαγωνισμό (1Γ/2025) και στις εξετάσεις στελεχών δημόσιας διοίκησης, 
            το ΑΣΕΠ εισήγαγε τη δοκιμασία <strong>εργασιακής συμπεριφοράς</strong>. 
            Σε αντίθεση με τις ερωτήσεις γνώσεων που απαιτούν αποστήθιση νόμων, το τεστ αυτό αξιολογεί τις 
            <strong> ήπιες δεξιότητες (soft skills)</strong>, τον τρόπο επίλυσης συγκρούσεων, την ανθεκτικότητα 
            και τη συνεργατικότητα των υποψηφίων.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            Πώς λειτουργεί το σύστημα αναγκαστικής επιλογής (Forced-Choice);
          </h3>
          <p>
            Το ερωτηματολόγιο βασίζεται στη μεθοδολογία <strong>Occupational Personality Questionnaire (OPQ32)</strong>. 
            Ο υποψήφιος δεν βαθμολογεί απλά σε κλίμακα 1–5 (όπου όλοι θα δήλωναν «τέλειοι»), αλλά καλείται να συγκρίνει 
            <strong>3 θετικές δηλώσεις</strong> (τριάδα):
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li>Επιλέγει <strong>μία δήλωση που τον περιγράφει περισσότερο (+)</strong>.</li>
            <li>Επιλέγει <strong>μία δήλωση που τον περιγράφει λιγότερο (-)</strong>.</li>
            <li>Η τρίτη δήλωση μένει υποχρεωτικά ουδέτερη.</li>
          </ul>
          <p>
            Αυτός ο μηχανισμός αποτρέπει την «ωραιοποίηση» και αναγκάζει τον υποψήφιο να ιεραρχήσει τις πραγματικές του εργασιακές προτεραιότητες.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            Υπάρχουν «σωστές» και «λάθος» απαντήσεις;
          </h3>
          <p>
            Όχι με την κλασική έννοια των μαθηματικών. Το ΑΣΕΠ αναζητά <strong>ισορροπημένα και συνεπή προφίλ</strong> 
            που ταιριάζουν στην κουλτούρα του σύγχρονου δημόσιου τομέα: σεβασμός στον πολίτη, ακεραιότητα, 
            συνεργασία και τήρηση της νομιμότητας. 
            Η προσπάθεια «μαντέματος» της επιθυμητής απάντησης συχνά οδηγεί σε αντιφάσεις σε βάθος 76 τριάδων, 
            καθώς η ίδια διάσταση εμφανίζεται σε πολλαπλούς συνδυασμούς.
          </p>
        </section>

        {/* Disclaimer */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Μεθοδολογική Σημείωση:</strong> Η παρούσα πλατφόρμα αποτελεί ανεξάρτητο εκπαιδευτικό εργαλείο 
            εξοικείωσης με τη μορφή των ερωτήσεων. Δεν συνδέεται, δεν εκπροσωπεί και δεν αντικαθιστά επίσημα ψυχομετρικά 
            εργαλεία του ΑΣΕΠ ή της SHL.
          </div>
        </div>
      </article>
    </main>
  );
}