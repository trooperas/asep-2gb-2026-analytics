"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Building2,
  AlertTriangle,
  HelpCircle,
  TrendingDown,
  Info,
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
  const epilaxonPositions = useMemo(() => {
    if (!parsedPreferences.length) return [];

    const list: Array<{
      kod: string;
      prefNum: number;
      minScore: number;
      scoreDiff: number;
      foreas: string;
      perifereia: string;
      proximityText: string;
    }> = [];

    parsedPreferences.forEach((kod, idx) => {
      const intel = intelMap[kod];
      const posMeta = positionsMap[kod];

      if (intel && intel.min_score > 0) {
        const diff = Number((score - intel.min_score).toFixed(2));
        
        // Μας ενδιαφέρουν οι θέσεις όπου ο υποψήφιος έμεινε εκτός οριακά (έως -6 μόρια απόσταση)
        if (diff < 0 && diff >= -6.0) {
          const absDiff = Math.abs(diff);
          let prox = "Μικρή απόσταση";
          if (absDiff <= 0.8) prox = "Πολύ υψηλή εγγύτητα";
          else if (absDiff <= 2.0) prox = "Υψηλή εγγύτητα";

          list.push({
            kod,
            prefNum: idx + 1,
            minScore: intel.min_score,
            scoreDiff: diff,
            foreas: posMeta?.foreas || "Φορέας θέσης",
            perifereia: posMeta?.perifereia || "",
            proximityText: prox,
          });
        }
      }
    });

    return list.sort((a, b) => Math.abs(a.scoreDiff) - Math.abs(b.scoreDiff)).slice(0, 6);
  }, [parsedPreferences, intelMap, positionsMap, score]);

  if (isDioristaios || !epilaxonPositions.length) {
    return null;
  }

  return (
    <div className="glass p-5 sm:p-8 rounded-2xl mb-12 border border-amber-500/30 relative overflow-hidden space-y-5">
      {/* Glow Ambient */}
      <div className="absolute -left-16 -top-16 w-60 h-60 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Απαραίτητο Legal & Disclaimers Callout Box */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
            ⚠️ Σημαντική Ενημέρωση — Ενδεικτική Στατιστική Εκτίμηση
          </div>
          <p>
            Η παρακάτω ανάλυση παρουσιάζει <strong>αποκλειστικά τη βαθμολογική εγγύτητα (απόσταση μορίων)</strong> από τη βάση των θέσεων που δηλώσατε. 
            <strong>ΔΕΝ αποτελεί επίσημη σειρά επιλαχόντα ούτε εγγύηση διορισμού</strong>. 
            Μόνη αρμόδια αρχή για την κατάρτιση πινάκων, ενστάσεων και αναπληρώσεων είναι το <strong>ΑΣΕΠ</strong>. 
            Παρακαλούμε να <strong>μην λαμβάνετε κρίσιμες αποφάσεις</strong> (π.χ. απόσυρση αίτησης, αποχή από ενστάσεις) βασιζόμενοι σε ανεπίσημες πλατφόρμες.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px] font-mono font-semibold uppercase tracking-wider mb-1.5">
            <Users className="w-3 h-3 text-[#00E5FF]" />
            Στατιστική Εγγύτητα στη Βάση
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
            Θέσεις με τη μικρότερη απόσταση από τη Βάση
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Απεικόνιση των δηλωθέντων προτιμήσεων όπου η βαθμολογία σας προσέγγισε περισσότερο 
            τη χαμηλότερη βαθμολογία διορισμού (βάση) των προσωρινών αποτελεσμάτων.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 self-start sm:self-auto flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#00E5FF] flex-shrink-0" />
          <span>Βάσει προσωρινών αποτελεσμάτων</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {epilaxonPositions.map((pos) => (
          <div
            key={pos.kod}
            className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2.5 hover:border-slate-700 transition-colors"
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

              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {pos.proximityText}
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
                  {pos.minScore.toFixed(2)} μόρια
                </span>
              </div>

              <span className="font-mono text-[11px] font-semibold text-pink-400 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                {pos.scoreDiff} μόρια
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
        * Σημείωση: Στην προκήρυξη δεν υπάρχουν «θέσεις ειδικών κατηγοριών». Ορισμένες θέσεις καλύφθηκαν από υποψηφίους που ενέπιπταν σε ειδικές ποσοστώσεις (ΑΜΕΑ, πολυτεκνία κλπ.) σύμφωνα με τον αλγόριθμο κατανομής του ΑΣΕΠ.
      </div>
    </div>
  );
}