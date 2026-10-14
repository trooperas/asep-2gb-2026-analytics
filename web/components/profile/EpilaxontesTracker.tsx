"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Building2,
  MapPin,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface PositionIntel {
  min_score: number;
  max_score: number;
  count: number;
  has_entopiotita: boolean;
  has_special: boolean;
}

interface EpilaxontesTrackerProps {
  isDioristaios: boolean;
  candidateScore: number | null;
  candidateRank: number;
  protimiseisStr?: string | null;
  intelMap: Record<string, PositionIntel>;
  positionsMap: Record<string, any>;
}

export default function EpilaxontesTracker({
  isDioristaios,
  candidateScore,
  candidateRank,
  protimiseisStr,
  intelMap,
  positionsMap,
}: EpilaxontesTrackerProps) {
  // 1. Καθαρισμός προτιμήσεων
  const parsedPreferences = useMemo(() => {
    if (!protimiseisStr) return [];
    return protimiseisStr
      .split(/[-,\s]+/)
      .map((k) => k.replace(/\.0$/, "").trim())
      .filter(Boolean);
  }, [protimiseisStr]);

  const score = candidateScore || 0;

  // 2. Υπολογισμός απόστασης από τη βάση για κάθε θέση που δήλωσε
  // και εκτίμηση της σειράς του ως επιλαχών
  const epilaxonPositions = useMemo(() => {
    if (!parsedPreferences.length) return [];

    const list: Array<{
      kod: string;
      prefNum: number;
      minScore: number;
      scoreDiff: number;
      foreas: string;
      perifereia: string;
      estimatedEpilaxonRank: number;
    }> = [];

    parsedPreferences.forEach((kod, idx) => {
      const intel = intelMap[kod];
      const posMeta = positionsMap[kod];

      if (intel && intel.min_score > 0) {
        const diff = Number((score - intel.min_score).toFixed(2));
        
        // Μας ενδιαφέρουν οι θέσεις όπου ο υποψήφιος έμεινε εκτός οριακά
        // ή είναι κοντά στη βάση (έως -6 μόρια απόσταση)
        if (diff < 0 && diff >= -8.0) {
          // Ευρετική εκτίμηση σειράς επιλαχόντα με βάση την απόσταση μορίων
          // Σε απόσταση < 0.8 μορίων συνήθως είναι 1ος-3ος επιλαχών
          let estRank = 1;
          const absDiff = Math.abs(diff);
          if (absDiff > 3.0) estRank = Math.min(15, Math.ceil(absDiff * 2.5));
          else if (absDiff > 1.5) estRank = Math.min(8, Math.ceil(absDiff * 2));
          else if (absDiff > 0.6) estRank = Math.min(4, Math.ceil(absDiff * 2));
          else estRank = 1; // Πολύ κοντά στη βάση -> 1ος επιλαχών!

          list.push({
            kod,
            prefNum: idx + 1,
            minScore: intel.min_score,
            scoreDiff: diff,
            foreas: posMeta?.foreas || "Φορέας θέσης",
            perifereia: posMeta?.perifereia || "",
            estimatedEpilaxonRank: estRank,
          });
        }
      }
    });

    // Ταξινόμηση με προτεραιότητα σε αυτές που είναι 1ος, 2ος επιλαχών (μικρότερη απόσταση μορίων)
    return list.sort((a, b) => Math.abs(a.scoreDiff) - Math.abs(b.scoreDiff)).slice(0, 8);
  }, [parsedPreferences, intelMap, positionsMap, score]);

  if (isDioristaios || !epilaxonPositions.length) {
    return null; // Αν διορίστηκε ή δεν έχει κοντινές θέσεις, δεν χρειάζεται
  }

  return (
    <div className="glass p-5 sm:p-8 rounded-2xl mb-12 border border-emerald-500/20 relative overflow-hidden">
      {/* Glow Ambient */}
      <div className="absolute -left-16 -top-16 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-mono font-semibold uppercase tracking-wider mb-1.5">
            <Users className="w-3 h-3" />
            5ήμερο Αποδοχής & Αναπληρώσεις
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
            Ουρά Επιλαχόντων: Πού έχετε πιθανότητες κλήσης
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Σε περίπτωση που κάποιος διοριστέος <strong>δεν αποδεχτεί τη θέση εντός 5 ημερών</strong> ή αποκλειστεί στον τελικό έλεγχο δικαιολογητικών, η θέση μεταβιβάζεται αυτόματα στον επόμενο επιλαχόντα.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 self-start sm:self-auto flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#00E5FF] flex-shrink-0" />
          <span>Βάσει ν. 4765/2021 & προθεσμίας 5 ημερών</span>
        </div>
      </div>

      {/* Epilaxontes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-6">
        {epilaxonPositions.map((pos) => {
          const isTopRunner = pos.estimatedEpilaxonRank <= 2;

          return (
            <div
              key={pos.kod}
              className={`p-4 rounded-xl border transition-all space-y-2.5 ${
                isTopRunner
                  ? "bg-slate-900/60 border-emerald-500/40 hover:border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.06)]"
                  : "bg-slate-900/30 border-slate-800/80 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {pos.prefNum}η Επιλογή
                  </span>
                  <Link
                    href={`/thesi/${pos.kod}`}
                    className="font-mono font-bold text-sm text-[#00E5FF] hover:underline"
                  >
                    Θέση #{pos.kod}
                  </Link>
                </div>

                <span
                  className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                    isTopRunner
                      ? "bg-emerald-500 text-slate-950 shadow-sm"
                      : "bg-slate-800 text-slate-300"
                  }`}
                >
                  ~{pos.estimatedEpilaxonRank}ος Επιλαχών
                </span>
              </div>

              {/* Φορέας */}
              <div className="text-xs">
                <div className="text-slate-200 font-medium truncate flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{pos.foreas}</span>
                </div>
                {pos.perifereia && (
                  <div className="text-[11px] text-slate-500 pl-5">{pos.perifereia}</div>
                )}
              </div>

              {/* Βάση και απόσταση */}
              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span>Βάση Θέσης:</span>
                  <span className="font-mono font-bold text-white">
                    {pos.minScore.toFixed(2)}
                  </span>
                </div>

                <span className="font-mono text-[11px] font-semibold text-pink-400">
                  {pos.scoreDiff} μόρια
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-800/60 pt-3">
        * Η σειρά επιλαχόντα υπολογίζεται προσεγγιστικά βάσει της απόστασης των μορίων σας από τον τελευταίο διορισθέντα στη θέση και των δηλωθέντων προτιμήσεων των υποψηφίων της ίδιας ειδικότητας.
      </div>
    </div>
  );
}