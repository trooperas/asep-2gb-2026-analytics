import React from "react";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { notFound } from "next/navigation";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import {
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Share2,
} from "lucide-react";
import type { Metadata } from "next";


interface Question {
  id: string;
  category_id: string;
  category_title: string;
  category_slug: string;
  question: string;
  options: string[];
  correct_index: number;
}

function getAllQuestions(): Question[] {
  try {
    const p = join(process.cwd(), "public", "data", "quizzes_clean.json");
    if (existsSync(p)) {
      return JSON.parse(readFileSync(p, "utf-8"));
    }
  } catch {}
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; id: string }>;
}): Promise<Metadata> {
  const { category, id } = await params; // 👈 Παίρνουμε και το category
  const questions = getAllQuestions();
  const q = questions.find((item) => item.id === id);

  if (!q) return { title: "Ερώτηση ΑΣΕΠ" };

  return {
    title: `${q.question.substring(0, 65)}... — Θέματα ΑΣΕΠ`,
    description: `Επίσημη ερώτηση και απάντηση ΑΣΕΠ: "${q.question}". Κατηγορία: ${q.category_title}.`,
    // 👇 Προσθήκη Canonical Tag:
    alternates: {
      canonical: `/proetoimasia/${category}/${id}`,
    },
    openGraph: {
      title: `${q.question} — Απάντηση ΑΣΕΠ`,
      description: `Ορθή απάντηση: ${q.options[q.correct_index]}`,
      url: `https://asepanalytics.app/proetoimasia/${category}/${id}`,
    },
  };
}

export default async function SingleQuestionPage({
  params,
}: {
  params: Promise<{ category: string; id: string }>;
}) {
  const { category, id } = await params;
  const questions = getAllQuestions();
  const qIdx = questions.findIndex((item) => item.id === id);

  if (qIdx === -1) notFound();

  const q = questions[qIdx];
  const questionNumber = q.id.match(/(\d+)$/)?.[1] ?? q.id;
  const nextQ = questions[qIdx + 1];
  const prevQ = questions[qIdx - 1];

  // Schema.org QAPage Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "mainEntity": {
      "@type": "Question",
      "name": q.question,
      "text": q.question,
      "answerCount": 1,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.options[q.correct_index],
        "upvoteCount": 100,
        "url": `https://asepanalytics.app/proetoimasia/${category}/${id}`,
      },
      "suggestedAnswer": q.options
        .filter((_, idx) => idx !== q.correct_index)
        .map((opt) => ({
          "@type": "Answer",
          "text": opt,
        })),
    },
  };

  return (
    <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* Navigation Breadcrumb */}
      <Breadcrumb
        href={`/proetoimasia/${q.category_slug}`}
        label={q.category_title}
      />

      {/* Question Card */}
      <div className="glass p-6 sm:p-10 rounded-3xl border border-[#00E5FF]/20 space-y-8">
        <div>
          <span className="text-xs font-mono text-[#00E5FF] uppercase font-bold tracking-wider">
            {q.category_title} • Ερώτηση #{questionNumber}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-white mt-2 leading-relaxed">
            {q.question}
          </h1>
        </div>

        {/* 4 Choices */}
        <div className="space-y-3">
          {q.options.map((opt, idx) => {
            const isCorrect = idx === q.correct_index;

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                  isCorrect
                    ? "bg-emerald-950/50 border-emerald-500/80 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                    : "bg-slate-900/40 border-slate-800 text-slate-400"
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5 ${
                    isCorrect
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="leading-relaxed flex-1 text-sm sm:text-base font-medium">
                  {opt}
                </span>
                {isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                )}
              </div>
            );
          })}
        </div>

        {/* Answer Explanation Banner */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
          <div className="text-xs font-mono uppercase text-emerald-400 font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Επίσημη Ορθή Απάντηση: Επιλογή {String.fromCharCode(65 + q.correct_index)}
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            {q.options[q.correct_index]}
          </p>
        </div>

        {/* Prev / Next Navigation */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
          {prevQ ? (
            <Link
              href={`/proetoimasia/${prevQ.category_slug}/${prevQ.id}`}
              className="text-xs sm:text-sm text-slate-300 hover:text-[#00E5FF] flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Προηγούμενη
            </Link>
          ) : (
            <div />
          )}

          <Link
            href={`/proetoimasia/${q.category_slug}`}
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-[#00E5FF] hover:border-[#00E5FF]/40"
          >
            Εξάσκηση σε όλη την ενότητα
          </Link>

          {nextQ ? (
            <Link
              href={`/proetoimasia/${nextQ.category_slug}/${nextQ.id}`}
              className="text-xs sm:text-sm text-slate-300 hover:text-[#00E5FF] flex items-center gap-1.5 transition-colors"
            >
              Επόμενη <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </main>
  );
}