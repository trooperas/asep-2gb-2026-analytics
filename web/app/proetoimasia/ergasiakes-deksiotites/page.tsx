"use client";

import React, { useState } from "react";
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
} from "lucide-react";

// 8 Βασικές Διαστάσεις Προφίλ Δημοσίου Τομέα (Μοντέλο SHL / ΑΣΕΠ)
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

// Ενδεικτικές Τριάδες Επίσημης Δομής OPQ32
const SAMPLE_TRIADS: Triad[] = [
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

export default function ErgasiakesDeksiotitesPage() {
  const [triads, setTriads] = useState<Triad[]>(SAMPLE_TRIADS);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Επιλογές για την τρέχουσα τριάδα: index δήλωσης για MOST (+) και LEAST (-)
  const [mostIdx, setMostIdx] = useState<number | null>(null);
  const [leastIdx, setLeastIdx] = useState<number | null>(null);

  // Αποθηκευμένες απαντήσεις: triadId -> { mostIdx, leastIdx }
  const [answers, setAnswers] = useState<Record<number, { most: number; least: number }>>({});
  const [completed, setCompleted] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentTriad = triads[currentIndex];
  const isLast = currentIndex === triads.length - 1;
  const canProceed = mostIdx !== null && leastIdx !== null && mostIdx !== leastIdx;

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
    setCurrentIndex(0);
    setMostIdx(null);
    setLeastIdx(null);
    setAnswers({});
    setCompleted(false);
  }

  // Υπολογισμός Σκορ ανά Διάσταση
  const traitScores = React.useMemo(() => {
    if (!completed) return {};

    const rawScores: Record<string, number> = {};
    Object.keys(TRAITS).forEach((t) => (rawScores[t] = 50)); // Βάση 50

    Object.entries(answers).forEach(([triadId, ans]) => {
      const tr = triads.find((t) => t.id === Number(triadId));
      if (!tr) return;

      const mostTrait = tr.statements[ans.most].trait;
      const leastTrait = tr.statements[ans.least].trait;

      rawScores[mostTrait] = (rawScores[mostTrait] || 50) + 12;
      rawScores[leastTrait] = Math.max(10, (rawScores[leastTrait] || 50) - 8);
    });

    // Κανονικοποίηση σε κλίμακα 0 - 100%
    const normalized: Record<string, number> = {};
    Object.keys(TRAITS).forEach((t) => {
      normalized[t] = Math.min(100, Math.max(15, rawScores[t]));
    });

    return normalized;
  }, [completed, answers, triads]);

  // Ταξινόμηση διαστάσεων από την υψηλότερη στη χαμηλότερη
  const sortedTraits = React.useMemo(() => {
    if (!completed) return [];
    return Object.entries(traitScores).sort(([, a], [, b]) => b - a);
  }, [completed, traitScores]);

  function handleShare() {
    const text = `🧠 Ολοκλήρωσα την προσομοίωση Εργασιακών Δεξιοτήτων (OPQ32) για τον ΑΣΕΠ!\nΚάντε κι εσείς το δωρεάν τεστ:\n👉 https://asepanalytics.app/proetoimasia/ergasiakes-deksiotites`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-mono">
        <Link href="/proetoimasia" className="hover:text-[#00E5FF]">
          Προετοιμασία
        </Link>
        <span>/</span>
        <span className="text-slate-200">Εργασιακές Δεξιότητες (OPQ32)</span>
      </div>

      {/* Hero Header */}
      <div className="mb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
          <Briefcase className="w-3.5 h-3.5" />
          Επίσημη Δοκιμασία ΑΣΕΠ 1Γ/2025 & 3ου Διαγωνισμού (2027)
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold font-display text-white">
          Τεστ Εργασιακών Δεξιοτήτων & Συμπεριφοράς (OPQ32)
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Σε κάθε τριάδα, επιλέξτε υποχρεωτικά <strong>μία δήλωση που σας ταιριάζει περισσότερο (+)</strong> και 
          <strong> μία που σας ταιριάζει λιγότερο (-)</strong>. Η τρίτη μένει αυτόματα ουδέτερη.
        </p>
      </div>

      {/* ============================================================== */}
      {/* INTERACTIVE TEST CARD */}
      {/* ============================================================== */}
      {!completed ? (
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>
              Τριάδα <strong>{currentIndex + 1}</strong> από {triads.length}
            </span>
            <span className="text-[#00E5FF]">
              {Math.round(((currentIndex + 1) / triads.length) * 100)}%
            </span>
          </div>

          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-6">
            <div
              className="bg-gradient-to-r from-amber-400 via-[#00E5FF] to-emerald-400 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / triads.length) * 100}%` }}
            />
          </div>

          {/* Triad Box */}
          <div className="glass p-6 sm:p-10 rounded-3xl border border-slate-800 space-y-6 shadow-2xl relative">
            <div className="text-xs font-mono uppercase text-slate-400 flex items-center justify-between">
              <span>Επιλέξτε: 1 Περισσότερο (+) και 1 Λιγότερο (-)</span>
              <span className="text-amber-400 text-[11px]">Υποχρεωτική επιλογή 2 δηλώσεων</span>
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
      ) : (
        /* ============================================================== */
        /* RESULTS PROFILE SCREEN */
        /* ============================================================== */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header Card */}
          <div className="glass p-6 sm:p-10 rounded-3xl border border-emerald-500/40 text-center space-y-4 shadow-2xl relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <Trophy className="w-8 h-8" />
            </div>
            <span className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider">
              Ολοκλήρωση Προσομοίωσης
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-white">
              Το Προφίλ Εργασιακών Δεξιοτήτων σας
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Με βάση το μοντέλο forced-choice του ΑΣΕΠ, παρακάτω απεικονίζονται οι 8 βασικές 
              διαστάσεις της εργασιακής σας συμπεριφοράς.
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
                  <div key={traitKey} className="space-y-1.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80">
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

          {/* CUTOFF & STATS BRIDGE */}
          <div className="glass p-6 rounded-3xl border border-[#00E5FF]/40 bg-gradient-to-r from-cyan-950/30 via-slate-900 to-slate-950 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#00E5FF]">
              <TrendingUp className="w-4 h-4" />
              Σύνδεση με τον Διαγωνισμό 2ΓΒ/2026
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Οι εργασιακές δεξιότητες συνδιαμορφώνουν τη βαθμολογία του υποψηφίου. Δείτε πώς διαμορφώθηκαν οι 
              πραγματικές βάσεις διορισμού ανά ειδικότητα στον 2ο διαγωνισμό:
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={handleShare}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#00E5FF] text-slate-950 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer hover:scale-105 transition-all shadow-lg"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-950" /> Αντιγράφηκε στο Clipboard!
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" /> Κοινοποίηση Αποτελέσματος
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

      {/* Official Disclaimer */}
      <div className="mt-14 p-5 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400 space-y-2 leading-relaxed">
        <div className="flex items-center gap-2 text-slate-300 font-semibold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Μεθοδολογική Σημείωση</span>
        </div>
        <p>
          Η παρούσα εφαρμογή αποτελεί ανεξάρτητο εργαλείο προσομοίωσης και εξοικείωσης με το σύστημα των 
          ερωτήσεων αναγκαστικής επιλογής (forced-choice questionnaire). Δεν συνδέεται με την SHL ή το ΑΣΕΠ. 
          Η βαθμολογία έχει καθαρά εκπαιδευτικό χαρακτήρα για την κατανόηση της δομής του τεστ.
        </p>
      </div>
    </main>
  );
}