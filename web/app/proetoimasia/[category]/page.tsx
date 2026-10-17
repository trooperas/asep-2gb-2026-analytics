"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Shuffle,
  ArrowRight,
  BookOpen,
  ArrowLeft,
  Search,
  Flame,
  Trophy,
  ExternalLink,
  ShieldCheck,
  Gamepad2,
  Clock,
} from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { OFFICIAL_CATEGORIES } from "@/lib/quiz-constants";

interface Question {
  id: string;
  category_id: string;
  category_title: string;
  category_slug: string;
  question: string;
  options: string[];
  correct_index: number;
}

// Επίσημες ημερομηνίες επικαιροποίησης ΑΣΕΠ ανά ενότητα (Δελτίο Τύπου 14/10/2026)
const UPDATE_DATES: Record<string, string> = {
  "syntagmatiko-dikaio": "14/04/2026",
  "dioikitiko-dikaio": "06/07/2026",
  "evropaikoi-thesmoi-kai-dikaio": "03/04/2026",
  "oikonomikes-epistimes": "09/07/2026",
  "pliroforiki-kai-psifiaki-diakyvernisi": "18/09/2026",
  "sygchroni-istoria-tis-elladas": "03/04/2026",
  "ypallilikos-kodikas": "03/04/2026",
  "gdpr-prostasia-dedomenon": "03/04/2026",
  "dioikisi-epicheiriseon-kai-organismon": "03/04/2026",
  "dioikisi-anthropinoy-dynamikoy": "03/04/2026",
  "kodikas-symperiforas-dimosion-ypallilon": "03/04/2026",
};

export default function CategoryQuizPage() {
  const params = useParams();
  const categorySlug = params?.category as string;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  // View Mode: "quiz" ή "study"
  const [activeTab, setActiveTab] = useState<"quiz" | "study">("quiz");

  // Quiz State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // Search Filter για το Study Mode
  const [filterQuery, setFilterQuery] = useState("");

  // Φόρτωση ερωτήσεων & τοπικών στατιστικών
  useEffect(() => {
    fetch("/data/quizzes_clean.json")
      .then((r) => r.json())
      .then((all: Question[]) => {
        const filtered = all.filter((q) => q.category_slug === categorySlug);
        setQuestions(filtered);
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    // Φόρτωση best streak από localStorage
    try {
      const saved = localStorage.getItem(`asep_streak_${categorySlug}`);
      if (saved) setBestStreak(parseInt(saved, 10));
    } catch {}
  }, [categorySlug]);

  const currentQ = questions[currentIndex];
  const officialMeta = OFFICIAL_CATEGORIES[categorySlug] || {
    title: questions[0]?.category_title || "Γνωστική Ενότητα",
    officialCount: questions.length,
    lastUpdate: "03/04/2026",
  };
  const categoryTitle = officialMeta.title;
  const lastUpdate = officialMeta.lastUpdate;

  function handleAnswer(optIdx: number) {
    if (selectedOption !== null) return;
    setSelectedOption(optIdx);
    setAnsweredCount((prev) => prev + 1);

    if (optIdx === currentQ.correct_index) {
      setScore((prev) => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
        try {
          localStorage.setItem(`asep_streak_${categorySlug}`, String(newStreak));
        } catch {}
      }
    } else {
      setStreak(0); // Έσπασε το σερί
    }
  }

  function handleNext() {
    setSelectedOption(null);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }

  function handleReset() {
    setSelectedOption(null);
    setCurrentIndex(0);
    setScore(0);
    setAnsweredCount(0);
    setStreak(0);
  }

  function handleShuffle() {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    handleReset();
  }

  // Φιλτράρισμα για το Study Mode
  const filteredList = useMemo(() => {
    if (!filterQuery.trim()) return questions;
    const qNorm = filterQuery.toLowerCase();
    return questions.filter(
      (q) =>
        q.question.toLowerCase().includes(qNorm) ||
        q.options.some((opt) => opt.toLowerCase().includes(qNorm))
    );
  }, [questions, filterQuery]);

  if (loading) {
    return (
      <main className="min-h-screen pt-32 text-center text-[#00E5FF]">
        Φόρτωση ερωτήσεων...
      </main>
    );
  }

  if (questions.length === 0) {
    return (
      <main className="min-h-screen p-28 text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">Δεν βρέθηκαν ερωτήσεις</h1>
        <Link href="/proetoimasia" className="text-[#00E5FF]">
          ← Επιστροφή στις κατηγορίες
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Back button */}
      <Link
        href="/proetoimasia"
        className="text-sm text-slate-400 hover:text-[#00E5FF] transition-colors inline-flex items-center gap-2 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Όλες οι κατηγορίες θεμάτων
      </Link>

      {/* Header & Category Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-mono uppercase text-[#00E5FF] tracking-wider font-semibold">
            Μητρώο Θεμάτων ΑΣΕΠ • {lastUpdate}
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold font-display text-white mt-1">
            {categoryTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Επίσημο Μητρώο ΑΣΕΠ: <strong>{officialMeta.officialCount}</strong> ερωτήσεις • Επικαιροποίηση: {officialMeta.lastUpdate}
          </p>
        </div>

        {/* Tab Switcher: Quiz vs Study */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800 self-start sm:self-auto shadow-lg">
          <button
            type="button"
            onClick={() => setActiveTab("quiz")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "quiz"
                ? "bg-[#00E5FF] text-slate-950 font-bold shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            Τεστ (Quiz Mode)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("study")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "study"
                ? "bg-[#00E5FF] text-slate-950 font-bold shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Μελέτη Ύλης ({questions.length})
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: INTERACTIVE QUIZ MODE (Clean, Gamified, No Distractions) */}
      {/* ============================================================== */}
      {activeTab === "quiz" && currentQ && (
        <div className="space-y-6">
          {/* Gamification Bar (Streaks & Controls) */}
          <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            <div className="flex items-center gap-4">
              {/* Current Streak */}
              <div className="flex items-center gap-1.5">
                <Flame className={`w-4 h-4 ${streak > 2 ? "text-amber-400 animate-bounce" : "text-slate-500"}`} />
                <span>
                  Σερί: <strong className="font-mono text-white">{streak}</strong>
                </span>
              </div>

              {/* Best Streak */}
              {bestStreak > 0 && (
                <div className="hidden sm:flex items-center gap-1 text-slate-400">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>Ρεκόρ: {bestStreak}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShuffle}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
                title="Ανακάτεμα ερωτήσεων"
              >
                <Shuffle className="w-3 h-3" />
                <span className="hidden sm:inline">Ανακάτεμα</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
                title="Επανεκκίνηση"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Main Quiz Card */}
          <div className="glass p-6 sm:p-10 rounded-3xl border border-[#00E5FF]/20 relative overflow-hidden shadow-2xl">
            {/* Progress Header */}
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3 font-mono">
              <span>
                Ερώτηση <strong>{currentIndex + 1}</strong> από {questions.length}
              </span>
              <span className="text-emerald-400 font-bold">
                Σκορ: {score} / {answeredCount}{" "}
                {answeredCount > 0 && (
                  <span className="text-slate-500 font-normal">
                    ({Math.round((score / answeredCount) * 100)}%)
                  </span>
                )}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-8">
              <div
                className="bg-gradient-to-r from-[#00E5FF] to-emerald-400 h-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <h2 className="text-lg sm:text-2xl font-bold text-white leading-relaxed mb-8">
              {currentQ.question}
            </h2>

            {/* 4 Choices */}
            <div className="space-y-3 mb-8">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correct_index;
                const hasAnswered = selectedOption !== null;

                let btnStyle = "bg-slate-900/60 border-slate-800 text-slate-200 hover:border-[#00E5FF]/50 hover:bg-[#00E5FF]/5";
                if (hasAnswered) {
                  if (isCorrect) {
                    btnStyle = "bg-emerald-950/70 border-emerald-500 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.25)] font-semibold";
                  } else if (isSelected) {
                    btnStyle = "bg-pink-950/70 border-pink-500 text-pink-200 font-semibold";
                  } else {
                    btnStyle = "bg-slate-950/40 border-slate-900 text-slate-600 opacity-40";
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={hasAnswered}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full p-4 sm:p-5 rounded-2xl border text-left text-sm sm:text-base transition-all flex items-start gap-3.5 cursor-pointer ${btnStyle}`}
                  >
                    <span className="w-7 h-7 rounded-xl bg-slate-800/90 flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-relaxed flex-1">{opt}</span>
                    {hasAnswered && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    )}
                    {hasAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer Status & Next Button */}
            {selectedOption !== null && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-slate-800">
                <div className="text-xs sm:text-sm text-slate-300 text-center sm:text-left">
                  {selectedOption === currentQ.correct_index ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5 justify-center sm:justify-start">
                      <CheckCircle2 className="w-4 h-4" /> Σωστή απάντηση! (+1 βαθμός)
                    </span>
                  ) : (
                    <span className="text-pink-400 font-medium flex items-center gap-1.5 justify-center sm:justify-start">
                      <XCircle className="w-4 h-4" /> Λάθος επιλογή. Η ορθή απάντηση επισημάνθηκε με πράσινο.
                    </span>
                  )}
                </div>

                {currentIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#00E5FF] text-slate-950 font-bold text-sm hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    Επόμενη Ερώτηση <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    Ολοκλήρωση Ενότητας (Επανεκκίνηση)
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: STUDY MODE & DIRECTORY (Full Index with Search for SEO) */}
      {/* ============================================================== */}
      {activeTab === "study" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#00E5FF]" />
                Μελέτη Όλης της Ύλης ({filteredList.length})
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Κάντε κλικ σε οποιαδήποτε ερώτηση για να δείτε την αναλυτική απάντηση και επεξήγηση.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Αναζήτηση στην ύλη..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
              />
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredList.map((q, idx) => (
              <Link
                key={q.id}
                href={`/proetoimasia/${categorySlug}/${q.id}`}
                className="glass p-4 rounded-xl hover:border-[#00E5FF]/40 transition-all flex items-start justify-between gap-3 group no-underline block"
              >
                <div className="space-y-1 min-w-0 pr-2">
                  <div className="text-[11px] font-mono text-[#00E5FF]">
                    Ερώτηση #{idx + 1}
                  </div>
                  <div className="text-sm font-medium text-slate-200 group-hover:text-white line-clamp-2 leading-relaxed">
                    {q.question}
                  </div>
                </div>
                <span className="text-xs text-[#00E5FF] font-semibold flex-shrink-0 flex items-center gap-1 pt-1 opacity-80 group-hover:opacity-100">
                  Απάντηση →
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ΕΠΙΣΗΜΟ DISCLAIMER ΣΥΜΜΟΡΦΩΣΗΣ ΜΕ ΤΟ ΔΕΛΤΙΟ ΤΥΠΟΥ ΤΟΥ ΑΣΕΠ */}
      {/* ============================================================== */}
      <div className="mt-14 p-5 rounded-2xl bg-slate-950/90 border border-slate-800/80 text-xs text-slate-400 space-y-2 leading-relaxed">
        <div className="flex items-center gap-2 text-slate-300 font-semibold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Όροι Χρήσης & Συμμόρφωση με το Δελτίο Τύπου ΑΣΕΠ (14/10/2026)</span>
        </div>
        <p>
          • <strong>Πηγή Περιεχομένου:</strong> Μητρώο Θεμάτων Γνώσεων του ΑΣΕΠ (άρθρο 9, ν. 4765/2021).  
          • <strong>Έκδοση / Επικαιροποίηση ενότητας:</strong> {lastUpdate} (όπως αναρτήθηκε στην Ενημερωτική Πύλη του ΑΣΕΠ).  
          • <strong>Αναλλοίωτο Περιεχόμενο:</strong> Το περιεχόμενο των ερωτήσεων και απαντήσεων αποδίδεται αυτούσιο, χωρίς καμία αλλοίωση ή παραποίηση.  
          • <strong>Μη Επίσημος Χαρακτήρας:</strong> Η παρούσα αποτελεί ανεξάρτητη εφαρμογή τρίτου (community project) για σκοπούς μελέτης (ν. 4727/2020) και δεν συνδέεται, δεν εγκρίνεται ούτε υποστηρίζεται από το ΑΣΕΠ.
        </p>
      </div>
    </main>
  );
}