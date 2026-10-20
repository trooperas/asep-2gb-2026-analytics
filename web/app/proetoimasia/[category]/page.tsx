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
  Share2,
  AlertTriangle,
  Check,
} from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { OFFICIAL_CATEGORIES } from "@/lib/quiz-constants";

interface Question {
  id: string;
  category_id?: string;
  category_title?: string;
  category_slug?: string;
  question: string;
  options: string[];
  correct_index: number;
}

export default function CategoryQuizPage() {
  const params = useParams();
  const categorySlug = (params?.category as string) || "";

  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  // Tabs: "quiz" | "study" | "completed"
  const [viewMode, setViewMode] = useState<"quiz" | "study" | "completed">("quiz");

  // State Ερωτήσεων
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // Επανάληψη Λαθών
  const [wrongQuestions, setWrongQuestions] = useState<Question[]>([]);
  const [isReviewingMistakes, setIsReviewingMistakes] = useState(false);

  // Χρονόμετρο (45 λεπτά)
  const [timeLeft, setTimeLeft] = useState<number>(45 * 60);

  // Share state
  const [copied, setCopied] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");

  const officialMeta = OFFICIAL_CATEGORIES[categorySlug] || {
    title: "Γνωστική Ενότητα",
    officialCount: 0,
    lastUpdate: "03/04/2026",
  };
  const categoryTitle = officialMeta.title;
  const lastUpdate = officialMeta.lastUpdate;

  // 1. Ασφαλής Φόρτωση ερωτήσεων (με fallback σε quizzes_clean.json ή quizzes.json)
  useEffect(() => {
    async function loadQuestions() {
      try {
        let res = await fetch("/data/quizzes_clean.json");
        if (!res.ok) {
          res = await fetch("/data/quizzes.json");
        }
        const data = await res.json();
        const list: Question[] = Array.isArray(data) ? data : data.questions || [];

        // Φιλτράρισμα με βάση το categorySlug ή category_id
        const filtered = list.filter((q: any) => {
          const cSlug = q.category_slug || q.category_id?.replace(/_/g, "-");
          return cSlug === categorySlug || q.category_id === categorySlug.replace(/-/g, "_");
        });

        setAllQuestions(filtered);

        // Αρχικό τυχαίο session 30 ερωτήσεων για το Τεστ
        const initialQuiz = [...filtered].sort(() => Math.random() - 0.5).slice(0, 35);
        setActiveQuestions(initialQuiz.length ? initialQuiz : filtered);
      } catch (err) {
        console.error("Error loading quiz questions:", err);
      } finally {
        setLoading(false);
      }
    }

    if (categorySlug) loadQuestions();

    try {
      const saved = localStorage.getItem(`asep_streak_${categorySlug}`);
      if (saved) setBestStreak(parseInt(saved, 10));
    } catch {}
  }, [categorySlug]);

  // Χρονόμετρο Τεστ
  useEffect(() => {
    let interval: any = null;
    if (viewMode === "quiz" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [viewMode, timeLeft]);

  const currentQ = activeQuestions[currentIndex];

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
      setStreak(0);
      if (!wrongQuestions.some((wq) => wq.id === currentQ.id)) {
        setWrongQuestions((prev) => [...prev, currentQ]);
      }
    }
  }

  function handleNext() {
    setSelectedOption(null);
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setViewMode("completed");
    }
  }

  function startNewQuizSession() {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, 35);
    setActiveQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setAnsweredCount(0);
    setStreak(0);
    setWrongQuestions([]);
    setIsReviewingMistakes(false);
    setTimeLeft(45 * 60);
    setViewMode("quiz");
  }

  function startMistakesReview() {
    if (wrongQuestions.length === 0) return;
    setActiveQuestions([...wrongQuestions]);
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setAnsweredCount(0);
    setIsReviewingMistakes(true);
    setViewMode("quiz");
  }

  function handleShareScore() {
    const totalQ = answeredCount || activeQuestions.length;
    const pct = Math.round((score / totalQ) * 100);
    const shareText = `🎯 Πέτυχα σκορ ${score}/${totalQ} (${pct}%) στο τεστ ΑΣΕΠ: «${categoryTitle}»!\n\nΔωρεάν εξάσκηση στο επίσημο Μητρώο Γνώσεων:\n👉 https://asepanalytics.app/proetoimasia/${categorySlug}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const filteredStudyList = useMemo(() => {
    if (!filterQuery.trim()) return allQuestions;
    const qNorm = filterQuery.toLowerCase();
    return allQuestions.filter(
      (q) =>
        q.question.toLowerCase().includes(qNorm) ||
        q.options.some((opt) => opt.toLowerCase().includes(qNorm))
    );
  }, [allQuestions, filterQuery]);

  if (loading) {
    return (
      <main className="min-h-screen pt-32 text-center text-[#00E5FF]">
        Φόρτωση θεμάτων ενότητας...
      </main>
    );
  }

  if (allQuestions.length === 0) {
    return (
      <main className="min-h-screen p-28 text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">Δεν βρέθηκαν ερωτήσεις για αυτή την ενότητα</h1>
        <p className="text-sm text-slate-400">
          Βεβαιωθείτε ότι εκτελέστηκε το build script για το αρχείο quizzes.json.
        </p>
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-mono uppercase text-[#00E5FF] tracking-wider font-semibold">
            Μητρώο ΑΣΕΠ • Επικαιροποίηση: {lastUpdate}
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold font-display text-white mt-1">
            {categoryTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Επίσημο Μητρώο: <strong>{officialMeta.officialCount || allQuestions.length}</strong> ερωτήσεις.
          </p>
        </div>

        {/* 2 ΚΑΘΑΡΑ TABS: ΤΕΣΤ vs ΜΕΛΕΤΗ ΥΛΗΣ */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800 self-start sm:self-auto shadow-lg">
          <button
            type="button"
            onClick={() => setViewMode("quiz")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              viewMode === "quiz" || viewMode === "completed"
                ? "bg-[#00E5FF] text-slate-950 font-bold shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            Τεστ Προσομοίωσης
          </button>

          <button
            type="button"
            onClick={() => setViewMode("study")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              viewMode === "study"
                ? "bg-[#00E5FF] text-slate-950 font-bold shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Μελέτη Ύλης ({allQuestions.length})
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1. QUIZ MODE INTERFACE */}
      {/* ============================================================== */}
      {viewMode === "quiz" && currentQ && (
        <div className="space-y-6">
          {/* Status & Gamification Bar */}
          <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            <div className="flex items-center gap-4">
              {/* Streak */}
              <div className="flex items-center gap-1.5">
                <Flame className={`w-4 h-4 ${streak > 2 ? "text-amber-400 animate-bounce" : "text-slate-500"}`} />
                <span>
                  Σερί: <strong className="font-mono text-white">{streak}</strong>
                </span>
              </div>

              {/* Countdown Timer */}
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono font-bold">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>{formatTime(timeLeft)}</span>
              </div>

              {isReviewingMistakes && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  Επανάληψη {activeQuestions.length} Λαθών
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={startNewQuizSession}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
              title="Νέο σετ ερωτήσεων"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Νέο Τεστ</span>
            </button>
          </div>

          {/* Question Card */}
          <div className="glass p-6 sm:p-10 rounded-3xl border border-[#00E5FF]/20 relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3 font-mono">
              <span>
                Ερώτηση <strong>{currentIndex + 1}</strong> από {activeQuestions.length}
              </span>
              <span className="text-emerald-400 font-bold">
                Σκορ: {score} / {answeredCount}
              </span>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-8">
              <div
                className="bg-gradient-to-r from-[#00E5FF] to-emerald-400 h-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / activeQuestions.length) * 100}%` }}
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

            {/* Next Button */}
            {selectedOption !== null && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-slate-800">
                <div className="text-xs sm:text-sm text-slate-300 text-center sm:text-left">
                  {selectedOption === currentQ.correct_index ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5 justify-center sm:justify-start">
                      <CheckCircle2 className="w-4 h-4" /> Σωστή απάντηση! (+1)
                    </span>
                  ) : (
                    <span className="text-pink-400 font-medium flex items-center gap-1.5 justify-center sm:justify-start">
                      <XCircle className="w-4 h-4" /> Λάθος επιλογή. Η ορθή απάντηση επισημάνθηκε με πράσινο.
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#00E5FF] text-slate-950 font-bold text-sm hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  {currentIndex < activeQuestions.length - 1 ? (
                    <>
                      Επόμενη Ερώτηση <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Ολοκλήρωση & Αποτέλεσμα <Trophy className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCORECARD / RESULT SCREEN */}
      {/* ============================================================== */}
      {viewMode === "completed" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-6 sm:p-10 rounded-3xl border border-emerald-500/40 text-center space-y-6 relative overflow-hidden shadow-2xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider">
              Ολοκλήρωση Τεστ
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-white mt-1">
              Η Επίδοσή σας: {score} / {answeredCount}
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Ποσοστό Επιτυχίας:{" "}
              <strong className="text-emerald-400 font-mono text-base">
                {answeredCount > 0 ? Math.round((score / answeredCount) * 100) : 0}%
              </strong>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {wrongQuestions.length > 0 && (
              <button
                type="button"
                onClick={startMistakesReview}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105 shadow-lg"
              >
                <AlertTriangle className="w-4 h-4" />
                Επανάληψη των {wrongQuestions.length} Λαθών μου
              </button>
            )}

            <button
              type="button"
              onClick={handleShareScore}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#00E5FF] text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105 shadow-lg"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-950" /> Αντιγράφηκε στο Clipboard!
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" /> Κοινοποίηση Επίδοσης
                </>
              )}
            </button>

            <button
              type="button"
              onClick={startNewQuizSession}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer hover:text-white"
            >
              <RotateCcw className="w-4 h-4" /> Νέο Τεστ
            </button>
          </div>
        </motion.div>
      )}

      {/* ============================================================== */}
      {/* 2. STUDY MODE INTERFACE (Ευρετήριο με αναζήτηση) */}
      {/* ============================================================== */}
      {viewMode === "study" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#00E5FF]" />
                Μελέτη Όλης της Ύλης ({filteredStudyList.length})
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
            {filteredStudyList.map((q, idx) => (
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
      {/* ΕΠΙΣΗΜΟ DISCLAIMER ΣΥΜΜΟΡΦΩΣΗΣ ΑΣΕΠ (14/10/2026) */}
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