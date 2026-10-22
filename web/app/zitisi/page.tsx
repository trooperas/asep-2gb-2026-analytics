"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Flame,
  Award,
  Building2,
  TrendingUp,
  Compass,
  ArrowRight,
  Sparkles,
  Info,
} from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface TopForeas {
  foreas: string;
  first_choices: number;
  total_mentions: number;
  positions_count: number;
}

interface TopPosition {
  kod_thesis: string;
  foreas: string;
  eidikotita: string;
  perifereia: string;
  first_choices: number;
  top3_choices: number;
  total_mentions: number;
}

export default function ZitisiPage() {
  const [foreis, setForeis] = useState<TopForeas[]>([]);
  const [positions, setPositions] = useState<TopPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"foreis" | "positions">("foreis");

  useEffect(() => {
    fetch("/data/prestige_index.json")
      .then((r) => r.json())
      .then((res) => {
        setForeis(res.top_foreis || []);
        setPositions(res.top_positions || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen pt-20 sm:pt-28 text-center text-[#00E5FF]">
        Φόρτωση δείκτη ζήτησης & κύρους...
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-20 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <Link
        href="/"
        className="text-sm text-slate-400 hover:text-[#00E5FF] transition-colors inline-flex items-center gap-2 mb-6"
      >
        ← Επιστροφή στην Αρχική
      </Link>

      {/* Header */}
      <div className="mb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-semibold uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5" />
          The Prestige Index • Οδηγός Στρατηγικής 2027
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-display text-white tracking-tight">
          Βαρόμετρο Ζήτησης{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-[#00E5FF] to-emerald-400">
            Φορέων & Θέσεων
          </span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          Ποιες θέσεις ήταν οι απόλυτοι «μαγνήτες» των υποψηφίων (1η προτίμηση) και ποιοι φορείς
          συγκέντρωσαν τον υψηλότερο ανταγωνισμό. Ένα απαραίτητο μάθημα τακτικής για όσους στοχεύουν στον 3ο διαγωνισμό του 2027.
        </p>
      </div>

      {/* Στρατηγικό Tip 2027 Box */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900/90 to-[#070A13] border border-[#00E5FF]/30 mb-8 space-y-2">
        <div className="flex items-center gap-2 text-sm font-bold text-[#00E5FF]">
          <Compass className="w-4 h-4" />
          <span>Το μάθημα του 2026 για τον διαγωνισμό του 2027</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Εκατοντάδες υποψήφιοι με εξαιρετικό γραπτό βαθμό (85+) έμειναν εκτός επειδή δήλωσαν <strong>αποκλειστικά τους δημοφιλέστερους φορείς στην Αθήνα</strong>. 
          Αντίθετα, υποψήφιοι με 65 μόρια διορίστηκαν επιλέγοντας φορείς με χαμηλότερο δείκτη ζήτησης. Στον επόμενο διαγωνισμό, η έξυπνη διασπορά προτιμήσεων είναι εξίσου σημαντική με το διάβασμα!
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("foreis")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "foreis"
              ? "bg-[#00E5FF] text-slate-950 font-bold shadow-sm"
              : "text-slate-400 hover:text-white bg-slate-900/60"
          }`}
        >
          🏆 Top 20 Φορείς σε Ζήτηση
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("positions")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "positions"
              ? "bg-[#00E5FF] text-slate-950 font-bold shadow-sm"
              : "text-slate-400 hover:text-white bg-slate-900/60"
          }`}
        >
          📍 Top 30 Θέσεις «Μαγνήτες»
        </button>
      </div>

      {/* TAB 1: TOP ΦΟΡΕΙΣ */}
      {activeTab === "foreis" && (
        <div className="space-y-3">
          {foreis.map((f, i) => (
            <div
              key={f.foreas}
              className="glass p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#00E5FF]/40 transition-all"
            >
              <div className="flex items-center gap-3.5 min-w-0 pr-4">
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 ${
                    i < 3
                      ? "bg-pink-500 text-white shadow-[0_0_12px_rgba(255,0,110,0.5)]"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  #{i + 1}
                </span>
                <div className="min-w-0">
                  <div className="text-sm sm:text-base font-semibold text-white truncate">
                    {f.foreas}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {f.positions_count} προκηρυχθείσες θέσεις στον φορέα
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0 self-end sm:self-auto">
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-pink-400">
                    {formatNumber(f.first_choices)} υποψήφιοι
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase">1η Προτίμηση</div>
                </div>

                <div className="text-right pl-4 border-l border-slate-800">
                  <div className="text-xs font-mono font-bold text-[#00E5FF]">
                    {formatNumber(f.total_mentions)}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase">Συνολικές Δηλώσεις</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: TOP ΘΕΣΕΙΣ */}
      {activeTab === "positions" && (
        <div className="space-y-3">
          {positions.map((p, i) => (
            <div
              key={p.kod_thesis}
              className="glass p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#00E5FF]/40 transition-all"
            >
              <div className="flex items-center gap-3.5 min-w-0 pr-4">
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 ${
                    i < 3
                      ? "bg-[#00E5FF] text-slate-950 font-bold shadow-[0_0_12px_rgba(0,229,255,0.5)]"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  #{i + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/thesi/${p.kod_thesis}`}
                      className="text-sm sm:text-base font-bold font-mono text-[#00E5FF] hover:underline"
                    >
                      Θέση #{p.kod_thesis}
                    </Link>
                    {p.perifereia && (
                      <span className="text-[11px] text-slate-400">
                        • {p.perifereia}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-white font-medium truncate mt-0.5">
                    {p.foreas}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {p.eidikotita}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0 self-end sm:self-auto">
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-[#00E5FF]">
                    {formatNumber(p.first_choices)}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase">1η Επιλογή</div>
                </div>

                <div className="text-right pl-4 border-l border-slate-800">
                  <div className="text-xs font-mono font-bold text-slate-300">
                    {formatNumber(p.top3_choices)}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase">Στο Top 3</div>
                </div>

                <Link
                  href={`/thesi/${p.kod_thesis}`}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-[#00E5FF] text-slate-400 hover:text-white transition-all ml-2"
                  title="Λεπτομέρειες Θέσης"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}