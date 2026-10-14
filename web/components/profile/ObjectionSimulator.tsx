"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sliders,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  LockOpen,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { formatNumber } from "@/lib/utils";

interface PositionIntel {
  min_score: number;
  max_score: number;
  count: number;
  has_entopiotita: boolean;
  has_special: boolean;
}

interface ObjectionSimulatorProps {
  currentScore: number | null;
  currentRank: number;
  totalInSpecialty?: number;
  protimiseisStr?: string | null;
  thesiDiorismou?: string | null;
  intelMap: Record<string, PositionIntel>;
  positionsMap: Record<string, any>;
  onScoreShiftChange?: (delta: number) => void;
}

export default function ObjectionSimulator({
  currentScore,
  currentRank,
  totalInSpecialty = 500,
  protimiseisStr,
  thesiDiorismou,
  intelMap,
  positionsMap,
  onScoreShiftChange,
}: ObjectionSimulatorProps) {
  const [delta, setDelta] = useState<number>(0);

  const baseScore = currentScore || 0;
  const simulatedScore = Number((baseScore + delta).toFixed(2));

  function handleDeltaChange(newDelta: number) {
    const clamped = Math.round(newDelta * 100) / 100;
    setDelta(clamped);
    onScoreShiftChange?.(clamped);
  }

  // 1. Καθαρισμός προτιμήσεων
  const parsedPreferences = useMemo(() => {
    if (!protimiseisStr) return [];
    return protimiseisStr
      .split(/[-,\s]+/)
      .map((k) => k.replace(/\.0$/, "").trim())
      .filter(Boolean);
  }, [protimiseisStr]);

  const targetKod = thesiDiorismou ? String(thesiDiorismou).replace(/\.0$/, "").trim() : null;
  const targetIdx = targetKod ? parsedPreferences.indexOf(targetKod) : -1;

  // 2. Εύρεση θέσεων που "ξεκλειδώνονται" με τη νέα βαθμολογία
  // (Θέσεις που είχε δηλώσει ΠΡΙΝ από αυτή που διορίστηκε, και το νέο σκορ είναι >= της βάσης τους)
  const unlockedPositions = useMemo(() => {
    if (delta <= 0 || !parsedPreferences.length) return [];

    // Εξετάζουμε μόνο ανώτερες προτιμήσεις (ή όλες αν δεν είχε διοριστεί)
    const candidatesToInspect =
      targetIdx !== -1 ? parsedPreferences.slice(0, targetIdx) : parsedPreferences;

    const unlocked: Array<{
      kod: string;
      prefNum: number;
      minScore: number;
      foreas: string;
      perifereia: string;
    }> = [];

    candidatesToInspect.forEach((kod) => {
      const intel = intelMap[kod];
      const posMeta = positionsMap[kod];
      if (intel && intel.min_score > 0) {
        // Αν το αρχικό σκορ ήταν κάτω από τη βάση, αλλά το νέο σκορ την πιάνει!
        if (baseScore < intel.min_score && simulatedScore >= intel.min_score) {
          unlocked.push({
            kod,
            prefNum: parsedPreferences.indexOf(kod) + 1,
            minScore: intel.min_score,
            foreas: posMeta?.foreas || "Φορέας θέσης",
            perifereia: posMeta?.perifereia || "",
          });
        }
      }
    });

    return unlocked;
  }, [delta, parsedPreferences, targetIdx, baseScore, simulatedScore, intelMap, positionsMap]);

  // 3. Εκτίμηση μετατόπισης σειράς κατάταξης (ευρετική εκτίμηση πυκνότητας)
  const estimatedRankGain = useMemo(() => {
    if (delta <= 0) return 0;
    // Σε έναν διαγωνισμό ΑΣΕΠ, κάθε 1 μόριο περιλαμβάνει περίπου 3% - 6% του πληθυσμού της ειδικότητας
    const densityFactor = Math.max(12, Math.round(totalInSpecialty * 0.045));
    const gain = Math.min(Math.round(delta * densityFactor), currentRank - 1);
    return Math.max(0, gain);
  }, [delta, totalInSpecialty, currentRank]);

  const newEstimatedRank = Math.max(1, currentRank - estimatedRankGain);

  return (
    <div className="glass p-5 sm:p-8 rounded-2xl mb-12 border border-[#00E5FF]/20 relative overflow-hidden">
      {/* Background Neon Ambient */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#00E5FF]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] text-[11px] font-mono font-semibold uppercase tracking-wider mb-1.5">
            <Sliders className="w-3 h-3" />
            Interactive Tool • Προθεσμία Ενστάσεων 13–22 Οκτωβρίου
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
            Προσομοιωτής Μεταβολής Μορίων (Ένσταση)
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Δείτε τι θα άλλαζε αν δικαιωθείτε σε ενδεχόμενη ένσταση (αναγνώριση μεταπτυχιακού, 
            διόρθωση βαθμολογίας κλπ.) και ποιες ανώτερες θέσεις θα ξεκλείδωναν.
          </p>
        </div>

        {delta !== 0 && (
          <button
            type="button"
            onClick={() => handleDeltaChange(0)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-white transition-all w-fit cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Επαναφορά
          </button>
        )}
      </div>

      {/* Controls Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mb-8">
        {/* Slider & Quick Buttons (Left 7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div>
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-slate-400 font-medium">Μεταβολή Βαθμολογίας:</span>
              <span className="font-mono font-bold text-base text-[#00E5FF]">
                {delta > 0 ? `+${delta.toFixed(2)}` : delta.toFixed(2)} μόρια
              </span>
            </div>

            <input
              type="range"
              min="-2"
              max="5"
              step="0.25"
              value={delta}
              onChange={(e) => handleDeltaChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00E5FF]"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>-2.00</span>
              <span>0.00 (Αρχική)</span>
              <span>+2.00</span>
              <span>+5.00</span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleDeltaChange(2.0)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                delta === 2.0
                  ? "bg-[#00E5FF] text-slate-950 font-bold"
                  : "bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-[#00E5FF]/40"
              }`}
            >
              +2.00 (Μεταπτυχιακό)
            </button>
            <button
              type="button"
              onClick={() => handleDeltaChange(1.0)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                delta === 1.0
                  ? "bg-[#00E5FF] text-slate-950 font-bold"
                  : "bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-[#00E5FF]/40"
              }`}
            >
              +1.00 (~1 Ερώτηση)
            </button>
            <button
              type="button"
              onClick={() => handleDeltaChange(0.5)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                delta === 0.5
                  ? "bg-[#00E5FF] text-slate-950 font-bold"
                  : "bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-[#00E5FF]/40"
              }`}
            >
              +0.50 (Ξένη Γλώσσα)
            </button>
          </div>
        </div>

        {/* Live Metrics Display (Right 5 cols) */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="space-y-1">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">
              Νέα Βαθμολογία
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#00E5FF]">
              {simulatedScore.toFixed(2)}
            </div>
            <div className="text-[10px] text-slate-400">
              Αρχική: {baseScore.toFixed(2)}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">
              Εκτίμηση Σειράς
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 flex items-center gap-1">
              #{newEstimatedRank}
              {estimatedRankGain > 0 && (
                <span className="text-xs text-emerald-400 font-normal">
                  (+{estimatedRankGain})
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400">
              Αρχική: #{currentRank}
            </div>
          </div>
        </div>
      </div>

      {/* Unlocked Positions Result Banner */}
      <AnimatePresence mode="wait">
        {delta > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {unlockedPositions.length > 0 ? (
              <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-[#070A13] border border-emerald-500/40">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-3">
                  <LockOpen className="w-4 h-4" />
                  <span>
                    Με +{delta.toFixed(2)} μόρια, ξεκλειδώνετε {unlockedPositions.length}{" "}
                    {unlockedPositions.length === 1 ? "ανώτερη θέση" : "ανώτερες θέσεις"}!
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {unlockedPositions.map((pos) => (
                    <Link
                      key={pos.kod}
                      href={`/thesi/${pos.kod}`}
                      className="p-3 rounded-lg bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400 transition-all no-underline block group"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-mono font-bold text-white group-hover:text-[#00E5FF]">
                          {pos.prefNum}η Επιλογή • #{pos.kod}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                          Βάση: {pos.minScore.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 truncate">{pos.foreas}</div>
                      <div className="text-[11px] text-slate-500">{pos.perifereia}</div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>
                  Με +{delta.toFixed(2)} μόρια βελτιώνετε τη σειρά κατάταξής σας, αλλά οι βάσεις των ανώτερων προτιμήσεών σας παρέμειναν υψηλότερες.
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advisory Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-2">
        <span>Παράβολο ένστασης: <strong>50€</strong> (επιστρέφεται σε περίπτωση δικαίωσης).</span>
        <span className="text-slate-400 text-center sm:text-right">
          * Η εκτίμηση σειράς είναι ενδεικτική βάσει της πυκνότητας βαθμολογιών της ειδικότητας.
        </span>
      </div>
    </div>
  );
}