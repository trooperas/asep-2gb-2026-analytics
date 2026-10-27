"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Share2,
  Check,
  Brain,
  Lightbulb,
  Grid3X3,
  Timer,
} from "lucide-react";

interface MatrixQuestion {
  id: number;
  title: string;
  ruleCategory: string;
  gridType: "3x3" | "sequence";
  gridCells: React.ReactNode[];
  options: React.ReactNode[];
  correctIndex: number;
  hintText: string;
  explanation: string;
}

// Τράπεζα Αυθεντικών Θεμάτων Matrix 3x3 & Επαγωγικών Ακολουθιών (ΑΣΕΠ / Raven Style)
const QUESTIONS: MatrixQuestion[] = [
  {
    id: 1,
    title: "Ποιο σχήμα συμπληρώνει το πλέγμα 3x3 (κάτω δεξιά);",
    ruleCategory: "Πλέγμα 3x3: Περιστροφή & Αύξηση Στοιχείων",
    gridType: "3x3",
    gridCells: [
      // Γραμμή 1: Κύκλος με 1 γραμμή (0°), 2 γραμμές (90°), 3 γραμμές (180°)
      <svg key="c1" className="w-10 h-10" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="14" fill="none" stroke="#334155" strokeWidth="2" />
        <line x1="20" y1="20" x2="20" y2="8" stroke="#00E5FF" strokeWidth="3" strokeLinecap="round" />
      </svg>,
      <svg key="c2" className="w-10 h-10" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="14" fill="none" stroke="#334155" strokeWidth="2" />
        <line x1="20" y1="20" x2="32" y2="20" stroke="#00E5FF" strokeWidth="3" strokeLinecap="round" />
        <line x1="20" y1="20" x2="20" y2="8" stroke="#00E5FF" strokeWidth="3" strokeLinecap="round" />
      </svg>,
      <svg key="c3" className="w-10 h-10" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="14" fill="none" stroke="#334155" strokeWidth="2" />
        <line x1="20" y1="20" x2="32" y2="20" stroke="#00E5FF" strokeWidth="3" strokeLinecap="round" />
        <line x1="20" y1="20" x2="20" y2="32" stroke="#00E5FF" strokeWidth="3" strokeLinecap="round" />
        <line x1="20" y1="20" x2="20" y2="8" stroke="#00E5FF" strokeWidth="3" strokeLinecap="round" />
      </svg>,

      // Γραμμή 2: Τετράγωνο με 1 γραμμή, 2 γραμμές, 3 γραμμές
      <svg key="c4" className="w-10 h-10" viewBox="0 0 40 40">
        <rect x="8" y="8" width="24" height="24" rx="4" fill="none" stroke="#334155" strokeWidth="2" />
        <line x1="20" y1="20" x2="20" y2="8" stroke="#FF006E" strokeWidth="3" strokeLinecap="round" />
      </svg>,
      <svg key="c5" className="w-10 h-10" viewBox="0 0 40 40">
        <rect x="8" y="8" width="24" height="24" rx="4" fill="none" stroke="#334155" strokeWidth="2" />
        <line x1="20" y1="20" x2="32" y2="20" stroke="#FF006E" strokeWidth="3" strokeLinecap="round" />
        <line x1="20" y1="20" x2="20" y2="8" stroke="#FF006E" strokeWidth="3" strokeLinecap="round" />
      </svg>,
      <svg key="c6" className="w-10 h-10" viewBox="0 0 40 40">
        <rect x="8" y="8" width="24" height="24" rx="4" fill="none" stroke="#334155" strokeWidth="2" />
        <line x1="20" y1="20" x2="32" y2="20" stroke="#FF006E" strokeWidth="3" strokeLinecap="round" />
        <line x1="20" y1="20" x2="20" y2="32" stroke="#FF006E" strokeWidth="3" strokeLinecap="round" />
        <line x1="20" y1="20" x2="20" y2="8" stroke="#FF006E" strokeWidth="3" strokeLinecap="round" />
      </svg>,

      // Γραμμή 3: Τρίγωνο με 1 γραμμή, 2 γραμμές, [ ? ]
      <svg key="c7" className="w-10 h-10" viewBox="0 0 40 40">
        <polygon points="20,6 34,34 6,34" fill="none" stroke="#334155" strokeWidth="2" />
        <line x1="20" y1="22" x2="20" y2="10" stroke="#00FFA3" strokeWidth="3" strokeLinecap="round" />
      </svg>,
      <svg key="c8" className="w-10 h-10" viewBox="0 0 40 40">
        <polygon points="20,6 34,34 6,34" fill="none" stroke="#334155" strokeWidth="2" />
        <line x1="20" y1="22" x2="30" y2="22" stroke="#00FFA3" strokeWidth="3" strokeLinecap="round" />
        <line x1="20" y1="22" x2="20" y2="10" stroke="#00FFA3" strokeWidth="3" strokeLinecap="round" />
      </svg>,
      // Κελί 9: ?
      <div key="c9" className="w-full h-full rounded-xl bg-pink-500/10 border-2 border-dashed border-pink-500/60 flex items-center justify-center font-bold text-pink-400 text-xl font-mono">
        ?
      </div>,
    ],
    options: [
      <svg key="o0" className="w-10 h-10" viewBox="0 0 40 40">
        <polygon points="20,6 34,34 6,34" fill="none" stroke="#334155" strokeWidth="2" />
        <line x1="20" y1="22" x2="20" y2="10" stroke="#00FFA3" strokeWidth="3" />
      </svg>,
      <svg key="o1" className="w-10 h-10" viewBox="0 0 40 40">
        <polygon points="20,6 34,34 6,34" fill="none" stroke="#334155" strokeWidth="2" />
        <line x1="20" y1="22" x2="30" y2="22" stroke="#00FFA3" strokeWidth="3" strokeLinecap="round" />
        <line x1="20" y1="22" x2="20" y2="30" stroke="#00FFA3" strokeWidth="3" strokeLinecap="round" />
        <line x1="20" y1="22" x2="20" y2="10" stroke="#00FFA3" strokeWidth="3" strokeLinecap="round" />
      </svg>,
      <svg key="o2" className="w-10 h-10" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="14" fill="none" stroke="#334155" strokeWidth="2" />
        <line x1="20" y1="20" x2="32" y2="20" stroke="#00FFA3" strokeWidth="3" />
      </svg>,
      <svg key="o3" className="w-10 h-10" viewBox="0 0 40 40">
        <polygon points="20,6 34,34 6,34" fill="none" stroke="#00FFA3" strokeWidth="2" />
      </svg>,
      <svg key="o4" className="w-10 h-10" viewBox="0 0 40 40">
        <rect x="8" y="8" width="24" height="24" fill="none" stroke="#334155" strokeWidth="2" />
        <line x1="20" y1="8" x2="20" y2="32" stroke="#00FFA3" strokeWidth="3" />
      </svg>,
    ],
    correctIndex: 1,
    hintText: "Κάθετα το εξωτερικό σχήμα είναι ίδιο (Τρίγωνο). Οριζόντια οι ακτίνες αυξάνονται από 1 σε 2 και σε 3.",
    explanation: "Στο πλέγμα, κάθε γραμμή διατηρεί το ίδιο εξωτερικό σχήμα (3η γραμμή = Τρίγωνα) και προσθέτει διαδοχικά μία ακτίνα δεξιόστροφα (1 -> 2 -> 3 ακτίνες). Άρα το σωστό σχήμα είναι το Τρίγωνο με 3 ακτίνες (Επιλογή Β).",
  },
  {
    id: 2,
    title: "Ποιο σχήμα συμπληρώνει τη λογική ακολουθία;",
    ruleCategory: "Περιστροφή κατά 90° & Μετατόπιση",
    gridType: "sequence",
    gridCells: [
      <svg key="s1" className="w-12 h-12" viewBox="0 0 48 48">
        <rect width="48" height="48" rx="8" fill="#0A0E1A" stroke="#334155" strokeWidth="2" />
        <path d="M24 10 L34 22 L27 22 L27 38 L21 38 L21 22 L14 22 Z" fill="#00E5FF" />
      </svg>,
      <svg key="s2" className="w-12 h-12" viewBox="0 0 48 48">
        <rect width="48" height="48" rx="8" fill="#0A0E1A" stroke="#334155" strokeWidth="2" />
        <path d="M38 24 L26 14 L26 21 L10 21 L10 27 L26 27 L26 34 Z" fill="#00E5FF" />
      </svg>,
      <svg key="s3" className="w-12 h-12" viewBox="0 0 48 48">
        <rect width="48" height="48" rx="8" fill="#0A0E1A" stroke="#334155" strokeWidth="2" />
        <path d="M24 38 L14 26 L21 26 L21 10 L27 10 L27 26 L34 26 Z" fill="#00E5FF" />
      </svg>,
      <div key="sq" className="w-12 h-12 rounded-lg bg-pink-500/10 border-2 border-dashed border-pink-500/60 flex items-center justify-center font-bold text-pink-400 text-xl font-mono">
        ?
      </div>,
    ],
    options: [
      <svg key="o0" className="w-10 h-10" viewBox="0 0 48 48">
        <path d="M10 24 L22 34 L22 27 L38 27 L38 21 L22 21 L22 14 Z" fill="#00E5FF" />
      </svg>,
      <svg key="o1" className="w-10 h-10" viewBox="0 0 48 48">
        <path d="M24 10 L34 22 L27 22 L27 38 L21 38 L21 22 L14 22 Z" fill="#00E5FF" />
      </svg>,
      <svg key="o2" className="w-10 h-10" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="10" fill="#00E5FF" />
      </svg>,
      <svg key="o3" className="w-10 h-10" viewBox="0 0 48 48">
        <path d="M24 38 L14 26 L21 26 L21 10 L27 10 L27 26 L34 26 Z" fill="#00E5FF" />
      </svg>,
      <svg key="o4" className="w-10 h-10" viewBox="0 0 48 48">
        <rect x="14" y="14" width="20" height="20" rx="4" fill="#00E5FF" />
      </svg>,
    ],
    correctIndex: 0,
    hintText: "Παρατηρήστε την κατεύθυνση: Πάνω (0°) -> Δεξιά (90°) -> Κάτω (180°).",
    explanation: "Ο κανόνας είναι περιστροφή 90° δεξιόστροφα. Μετά το βέλος προς τα κάτω, το επόμενο δείχνει αριστερά (270° - Επιλογή Α).",
  },
  {
    id: 3,
    title: "Ποιο σχήμα ολοκληρώνει το μοτίβο του Matrix 3x3;",
    ruleCategory: "Πλέγμα 3x3: Αφαίρεση Κοινών Γραμμών (XOR)",
    gridType: "3x3",
    gridCells: [
      <svg key="m1" className="w-10 h-10" viewBox="0 0 40 40">
        <line x1="20" y1="6" x2="20" y2="34" stroke="#38BDF8" strokeWidth="3" />
      </svg>,
      <svg key="m2" className="w-10 h-10" viewBox="0 0 40 40">
        <line x1="6" y1="20" x2="34" y2="20" stroke="#38BDF8" strokeWidth="3" />
      </svg>,
      <svg key="m3" className="w-10 h-10" viewBox="0 0 40 40">
        <line x1="20" y1="6" x2="20" y2="34" stroke="#38BDF8" strokeWidth="3" />
        <line x1="6" y1="20" x2="34" y2="20" stroke="#38BDF8" strokeWidth="3" />
      </svg>,

      <svg key="m4" className="w-10 h-10" viewBox="0 0 40 40">
        <line x1="8" y1="32" x2="32" y2="8" stroke="#F43F5E" strokeWidth="3" />
      </svg>,
      <svg key="m5" className="w-10 h-10" viewBox="0 0 40 40">
        <line x1="8" y1="8" x2="32" y2="32" stroke="#F43F5E" strokeWidth="3" />
      </svg>,
      <svg key="m6" className="w-10 h-10" viewBox="0 0 40 40">
        <line x1="8" y1="32" x2="32" y2="8" stroke="#F43F5E" strokeWidth="3" />
        <line x1="8" y1="8" x2="32" y2="32" stroke="#F43F5E" strokeWidth="3" />
      </svg>,

      <svg key="m7" className="w-10 h-10" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="12" fill="none" stroke="#F59E0B" strokeWidth="3" />
      </svg>,
      <svg key="m8" className="w-10 h-10" viewBox="0 0 40 40">
        <line x1="20" y1="8" x2="20" y2="32" stroke="#F59E0B" strokeWidth="3" />
        <line x1="8" y1="20" x2="32" y2="20" stroke="#F59E0B" strokeWidth="3" />
      </svg>,
      <div key="m9" className="w-full h-full rounded-xl bg-pink-500/10 border-2 border-dashed border-pink-500/60 flex items-center justify-center font-bold text-pink-400 text-xl font-mono">
        ?
      </div>,
    ],
    options: [
      <svg key="o0" className="w-10 h-10" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="12" fill="none" stroke="#F59E0B" strokeWidth="3" />
        <line x1="20" y1="8" x2="20" y2="32" stroke="#F59E0B" strokeWidth="3" />
        <line x1="8" y1="20" x2="32" y2="20" stroke="#F59E0B" strokeWidth="3" />
      </svg>,
      <svg key="o1" className="w-10 h-10" viewBox="0 0 40 40">
        <rect x="8" y="8" width="24" height="24" fill="none" stroke="#F59E0B" strokeWidth="3" />
      </svg>,
      <svg key="o2" className="w-10 h-10" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="6" fill="#F59E0B" />
      </svg>,
      <svg key="o3" className="w-10 h-10" viewBox="0 0 40 40">
        <polygon points="20,8 32,30 8,30" fill="none" stroke="#F59E0B" strokeWidth="3" />
      </svg>,
      <svg key="o4" className="w-10 h-10" viewBox="0 0 40 40">
        <line x1="20" y1="6" x2="20" y2="34" stroke="#F59E0B" strokeWidth="3" />
      </svg>,
    ],
    correctIndex: 0,
    hintText: "Σε κάθε γραμμή, το 3ο στοιχείο είναι η ένωση (σύνθεση) των δύο πρώτων στοιχείων.",
    explanation: "Ο κανόνας σύνθεσης: Στοιχείο 1 + Στοιχείο 2 = Στοιχείο 3. Στην 3η γραμμή, ο κύκλος συντίθεται με τον σταυρό, παράγοντας έναν κύκλο με σταυρό μέσα (Επιλογή Α).",
  },
  {
    id: 4,
    title: "Εντοπίστε το σχήμα που ακολουθεί τη λογική:",
    ruleCategory: "Εναλλαγή Σκίασης & Χρωμάτων (Inversion)",
    gridType: "sequence",
    gridCells: [
      <svg key="s1" className="w-12 h-12" viewBox="0 0 48 48">
        <rect width="48" height="48" rx="8" fill="#00E5FF" />
        <circle cx="24" cy="24" r="10" fill="#0A0E1A" />
      </svg>,
      <svg key="s2" className="w-12 h-12" viewBox="0 0 48 48">
        <rect width="48" height="48" rx="8" fill="#0A0E1A" stroke="#00E5FF" strokeWidth="2" />
        <circle cx="24" cy="24" r="10" fill="#00E5FF" />
      </svg>,
      <svg key="s3" className="w-12 h-12" viewBox="0 0 48 48">
        <rect width="48" height="48" rx="8" fill="#00E5FF" />
        <polygon points="24,14 34,32 14,32" fill="#0A0E1A" />
      </svg>,
      <div key="sq" className="w-12 h-12 rounded-lg bg-pink-500/10 border-2 border-dashed border-pink-500/60 flex items-center justify-center font-bold text-pink-400 text-xl font-mono">
        ?
      </div>,
    ],
    options: [
      <svg key="o0" className="w-10 h-10" viewBox="0 0 48 48">
        <rect width="48" height="48" rx="6" fill="#0A0E1A" stroke="#00E5FF" strokeWidth="2" />
        <polygon points="24,14 34,32 14,32" fill="#00E5FF" />
      </svg>,
      <svg key="o1" className="w-10 h-10" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="12" fill="#00E5FF" />
      </svg>,
      <svg key="o2" className="w-10 h-10" viewBox="0 0 48 48">
        <rect width="48" height="48" rx="6" fill="#00E5FF" />
      </svg>,
      <svg key="o3" className="w-10 h-10" viewBox="0 0 48 48">
        <polygon points="24,34 34,16 14,16" fill="#00E5FF" />
      </svg>,
      <svg key="o4" className="w-10 h-10" viewBox="0 0 48 48">
        <rect x="14" y="14" width="20" height="20" fill="#00E5FF" />
      </svg>,
    ],
    correctIndex: 0,
    hintText: "Προσέξτε πώς αντιστρέφεται το φωτεινό φόντο με το εσωτερικό σχήμα.",
    explanation: "Εναλλαγή Inversion: Το σχήμα 1 αντιστρέφεται στο 2. Άρα το σχήμα 3 (κυανό φόντο με σκούρο τρίγωνο) αντιστρέφεται σε σκούρο φόντο με κυανό τρίγωνο (Επιλογή Α).",
  },
  {
    id: 5,
    title: "Ποιο σχήμα συμπληρώνει την αύξηση πλευρών;",
    ruleCategory: "Γεωμετρική Ακολουθία (3, 4, 5... πλευρές)",
    gridType: "sequence",
    gridCells: [
      <svg key="s1" className="w-12 h-12" viewBox="0 0 48 48">
        <rect width="48" height="48" rx="8" fill="#0A0E1A" stroke="#334155" strokeWidth="2" />
        <polygon points="24,12 36,34 12,34" fill="none" stroke="#38BDF8" strokeWidth="3" />
      </svg>,
      <svg key="s2" className="w-12 h-12" viewBox="0 0 48 48">
        <rect width="48" height="48" rx="8" fill="#0A0E1A" stroke="#334155" strokeWidth="2" />
        <rect x="14" y="14" width="20" height="20" fill="none" stroke="#38BDF8" strokeWidth="3" />
      </svg>,
      <svg key="s3" className="w-12 h-12" viewBox="0 0 48 48">
        <rect width="48" height="48" rx="8" fill="#0A0E1A" stroke="#334155" strokeWidth="2" />
        <polygon points="24,10 38,20 32,36 16,36 10,20" fill="none" stroke="#38BDF8" strokeWidth="3" />
      </svg>,
      <div key="sq" className="w-12 h-12 rounded-lg bg-pink-500/10 border-2 border-dashed border-pink-500/60 flex items-center justify-center font-bold text-pink-400 text-xl font-mono">
        ?
      </div>,
    ],
    options: [
      <svg key="o0" className="w-10 h-10" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="12" fill="none" stroke="#38BDF8" strokeWidth="3" />
      </svg>,
      <svg key="o1" className="w-10 h-10" viewBox="0 0 48 48">
        <polygon points="24,8 36,15 36,29 24,36 12,29 12,15" fill="none" stroke="#38BDF8" strokeWidth="3" />
      </svg>,
      <svg key="o2" className="w-10 h-10" viewBox="0 0 48 48">
        <polygon points="24,10 36,24 24,38 12,24" fill="none" stroke="#38BDF8" strokeWidth="3" />
      </svg>,
      <svg key="o3" className="w-10 h-10" viewBox="0 0 48 48">
        <polygon points="24,12 36,34 12,34" fill="none" stroke="#38BDF8" strokeWidth="3" />
      </svg>,
      <svg key="o4" className="w-10 h-10" viewBox="0 0 48 48">
        <path d="M24 10 L27 19 L36 19 L29 25 L32 34 L24 28 L16 34 L19 25 L12 19 L21 19 Z" fill="#38BDF8" />
      </svg>,
    ],
    correctIndex: 1,
    hintText: "Μετρήστε τις πλευρές: 3 (τρίγωνο), 4 (τετράγωνο), 5 (πεντάγωνο).",
    explanation: "Αύξηση πλευρών κατά 1: Το επόμενο σχήμα πρέπει να έχει 6 πλευρές (εξάγωνο - Επιλογή Β).",
  },
];

export default function EpagogikosSyllogismosPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Gamification States
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [showHint, setShowHint] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  const currentQ = QUESTIONS[currentIndex];

  useEffect(() => {
    setQuestionStartTime(Date.now());
    setTimerSeconds(60);
    setShowHint(false);
    setEliminatedOptions([]);

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  function handleUseHint() {
    if (showHint || selectedOption !== null) return;
    setShowHint(true);

    const wrongIndices = currentQ.options
      .map((_, i) => i)
      .filter((i) => i !== currentQ.correctIndex);

    const toEliminate = wrongIndices.sort(() => 0.5 - Math.random()).slice(0, 2);
    setEliminatedOptions(toEliminate);
  }

  function handleSelectOption(idx: number) {
    if (selectedOption !== null || eliminatedOptions.includes(idx)) return;

    const timeSpent = Math.max(1, Math.round((Date.now() - questionStartTime) / 1000));
    setResponseTimes((prev) => [...prev, timeSpent]);

    setSelectedOption(idx);
    setAnsweredCount((prev) => prev + 1);

    if (idx === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  }

  function handleNext() {
    setSelectedOption(null);
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  }

  function handleReset() {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setAnsweredCount(0);
    setIsCompleted(false);
    setResponseTimes([]);
  }

  const avgTime = useMemo(() => {
    if (!responseTimes.length) return 0;
    return Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length);
  }, [responseTimes]);

  const percentileText = useMemo(() => {
    const pct = Math.round((score / QUESTIONS.length) * 100);
    if (pct >= 80) return "Top 5% των υποψηφίων ΑΣΕΠ (Άριστη Επαγωγική Ικανότητα!)";
    if (pct >= 60) return "Top 25% των υποψηφίων ΑΣΕΠ (Πολύ Καλή Λογική Σκέψη)";
    return "Μέσος Όρος (Χρειάζεται εξάσκηση στα μοτίβα matrix)";
  }, [score]);

  function handleShare() {
    const pct = Math.round((score / QUESTIONS.length) * 100);
    const text = `🧠 Πέτυχα ${score}/${QUESTIONS.length} (${pct}%) στο διαδραστικό Τεστ Επαγωγικού Συλλογισμού (Matrix 3x3) για τον ΑΣΕΠ!\n⏱️ Μέσος χρόνος: ${avgTime}s • ${percentileText}\n\nΔοκιμάστε δωρεάν με διαδραστικά σχήματα:\n👉 https://asepanalytics.app/proetoimasia/epagogikos-syllogismos`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <main className="min-h-screen pt-20 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <Breadcrumb href="/proetoimasia" label="Όλα τα Θέματα Προετοιμασίας" />

      {/* Hero Header */}
      <div className="mb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-semibold uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5" />
          Επίσημη Δοκιμασία Δεξιοτήτων (Πρότυπα Matrix 3x3 / Raven)
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-display text-white tracking-tight leading-tight">
          Τεστ Επαγωγικού{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-[#00E5FF] to-emerald-400">
            Συλλογισμού (Matrix 3x3)
          </span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Διαδραστική προσομοίωση σε πλέγματα 3x3 και ακολουθίες σχημάτων. 
          Κάθε ερώτηση περιλαμβάνει <strong>χρονόμετρο 60 δευτερολέπτων</strong>, σύστημα βοήθειας <strong>50-50 Hint</strong> και αναλυτική επεξήγηση του κανόνα.
        </p>
      </div>

      {/* ACTIVE TEST INTERFACE */}
      {!isCompleted && currentQ && (
        <div className="space-y-6 mb-16">
          {/* Status & Timer Bar */}
          <div className="glass p-3.5 rounded-2xl flex items-center justify-between text-xs text-slate-300 font-mono">
            <div className="flex items-center gap-3">
              <span>
                Ερώτηση <strong>{currentIndex + 1}</strong> / {QUESTIONS.length}
              </span>
              <span className="text-emerald-400 font-bold">
                Σκορ: {score}
              </span>
            </div>

            {/* Blitz Countdown Timer */}
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold ${
                  timerSeconds > 25
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : timerSeconds > 10
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                    : "bg-pink-500/20 border-pink-500 text-pink-300 animate-pulse"
                }`}
              >
                <Timer className="w-3.5 h-3.5" />
                <span>{timerSeconds}s</span>
              </div>

              {/* 50-50 Hint Button */}
              <button
                type="button"
                onClick={handleUseHint}
                disabled={showHint || selectedOption !== null}
                className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-all cursor-pointer ${
                  showHint
                    ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                } disabled:opacity-40 disabled:cursor-not-allowed`}
                title="Βοήθεια: Αποκλεισμός 2 λάθος επιλογών"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Βοήθεια 50-50</span>
              </button>
            </div>
          </div>

          {/* Question Container Card */}
          <div className="glass p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-[#00E5FF] font-semibold flex items-center gap-1.5">
                <Grid3X3 className="w-4 h-4" />
                {currentQ.ruleCategory}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {currentQ.gridType === "3x3" ? "Πλέγμα 3x3" : "Ακολουθία"}
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-white">
              {currentQ.title}
            </h2>

            {/* 1. MATRIX 3x3 VIEW */}
            {currentQ.gridType === "3x3" && (
              <div className="flex justify-center py-2">
                <div className="p-3 sm:p-4 rounded-2xl bg-slate-950/90 border border-slate-800 grid grid-cols-3 gap-2.5 sm:gap-3 max-w-[280px] sm:max-w-[320px] shadow-inner">
                  {currentQ.gridCells.map((cell, idx) => (
                    <div
                      key={idx}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-center p-1.5"
                    >
                      {cell}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. SEQUENCE VIEW */}
            {currentQ.gridType === "sequence" && (
              <div className="p-4 sm:p-6 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center gap-3 sm:gap-5 overflow-x-auto">
                {currentQ.gridCells.map((node, i) => (
                  <div key={i} className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center">
                      {node}
                    </div>
                    {i < currentQ.gridCells.length - 1 && (
                      <span className="text-slate-600 font-mono text-sm">→</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Hint Message Banner */}
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2"
                >
                  <Lightbulb className="w-4 h-4 flex-shrink-0" />
                  <span>💡 <strong>Υπόδειξη:</strong> {currentQ.hintText} (Αποκλείστηκαν 2 επιλογές!)</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 5 Options Grid (A, B, C, D, E) */}
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Επιλέξτε το σχήμα που λείπει:
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {currentQ.options.map((optSvg, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQ.correctIndex;
                  const isEliminated = eliminatedOptions.includes(idx);
                  const hasAnswered = selectedOption !== null;

                  let borderClass = "border-slate-800 hover:border-[#00E5FF]/60 bg-slate-900/50";
                  if (isEliminated) {
                    borderClass = "border-slate-900 opacity-20 pointer-events-none bg-slate-950";
                  } else if (hasAnswered) {
                    if (isCorrect) {
                      borderClass = "border-emerald-500 bg-emerald-950/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]";
                    } else if (isSelected) {
                      borderClass = "border-pink-500 bg-pink-950/40";
                    } else {
                      borderClass = "border-slate-900 opacity-30";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={hasAnswered || isEliminated}
                      onClick={() => handleSelectOption(idx)}
                      className={`p-3 sm:p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 cursor-pointer disabled:cursor-default ${borderClass}`}
                    >
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <div className="flex items-center justify-center py-1">
                        {optSvg}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Explanation & Next Controls */}
            {selectedOption !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 pt-4 border-t border-slate-800"
              >
                <div
                  className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                    selectedOption === currentQ.correctIndex
                      ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
                      : "bg-pink-950/30 border-pink-500/40 text-pink-200"
                  }`}
                >
                  <div className="font-bold mb-1 flex items-center gap-1.5">
                    {selectedOption === currentQ.correctIndex ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Σωστά!
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-pink-400" /> Λάθος επιλογή.
                      </>
                    )}
                  </div>
                  <p>{currentQ.explanation}</p>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-xl bg-[#00E5FF] text-slate-950 font-bold text-xs sm:text-sm hover:scale-105 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                  >
                    <span>
                      {currentIndex < QUESTIONS.length - 1
                        ? "Επόμενο Παζλ"
                        : "Ολοκλήρωση & Scorecard"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* FINAL PERCENTILE SCORECARD SCREEN */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-6 sm:p-10 rounded-3xl border border-emerald-500/40 text-center space-y-6 mb-16 shadow-2xl relative overflow-hidden"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider">
              Αποτελεσματα Επαγωγικης Νοημοσυνης
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-white mt-1">
              Σκορ: {score} / {QUESTIONS.length}
            </h2>
            <div className="inline-block mt-3 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold">
              🎯 {percentileText}
            </div>
          </div>

          {/* Metrics Breakdown */}
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto pt-2">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
              <div className="text-slate-400">Μέσος Χρόνος Σκέψης:</div>
              <div className="text-base font-bold font-mono text-[#00E5FF] mt-0.5">{avgTime}s / παζλ</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
              <div className="text-slate-400">Ακρίβεια Μοτίβων:</div>
              <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
                {Math.round((score / QUESTIONS.length) * 100)}%
              </div>
            </div>
          </div>

          {/* Social Share & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={handleShare}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#00E5FF] text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer hover:scale-105 transition-all shadow-lg"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" /> Αντιγράφηκε για Κοινοποίηση!
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" /> Κοινοποίηση Επίδοσης
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer hover:text-white"
            >
              <RotateCcw className="w-4 h-4" /> Επανάληψη Τεστ
            </button>

            <Link
              href="/proetoimasia/ergasiakes-deksiotites"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-medium text-xs sm:text-sm hover:text-amber-400 transition-colors flex items-center justify-center gap-2 no-underline"
            >
              <Brain className="w-4 h-4 text-amber-400" /> Τεστ OPQ32 →
            </Link>
          </div>
        </motion.div>
      )}

      {/* SEO EDUCATIONAL ARTICLE & MATRIX RULES GUIDE */}
      <article className="glass p-6 sm:p-10 rounded-3xl border border-slate-800 space-y-8 text-slate-300 text-xs sm:text-sm leading-relaxed">
        <div className="border-b border-slate-800 pb-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#00E5FF] uppercase tracking-wider mb-1">
            <Brain className="w-4 h-4" /> Οδηγός Επίλυσης Matrix
          </div>
          <h2 className="text-xl sm:text-3xl font-bold font-display text-white">
            Πώς να «διαβάζετε» τα Πλέγματα Matrix 3x3 στον ΑΣΕΠ
          </h2>
        </div>

        <section className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            1. Οριζόντια Σύνθεση (Row Operations)
          </h3>
          <p>
            Στα περισσότερα θέματα 3x3, το 3ο κελί κάθε γραμμής προκύπτει από μαθηματική ή οπτική πράξη ανάμεσα στο 1ο και το 2ο κελί (προσθήκη γραμμών, αφαίρεση κοινών στοιχείων ή υπέρθεση).
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            2. Κάθετη Συνέπεια (Column Invariants)
          </h3>
          <p>
            Ελέγχετε πάντα και τις στήλες. Συχνά κάθε στήλη μοιράζεται το ίδιο βασικό σχήμα (π.χ. όλα κύκλοι ή όλα τρίγωνα), ενώ η μεταβολή αφορά μόνο τα εσωτερικά σύμβολα.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            3. Στρατηγική Αποκλεισμού (Elimination Method)
          </h3>
          <p>
            Όταν ο χρόνος πιέζει (κάτω από 60 δευτερόλεπτα), εντοπίστε ένα μόνο χαρακτηριστικό (π.χ. φορά βέλους) και αποκλείστε αμέσως 2–3 επιλογές που δεν το τηρούν.
          </p>
        </section>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Σημείωση Μεθοδολογίας:</strong> Ανεξάρτητο εκπαιδευτικό υλικό προετοιμασίας στα διεθνή πρότυπα non-verbal cognitive testing (Raven / SHL).
          </div>
        </div>
      </article>
    </main>
  );
}