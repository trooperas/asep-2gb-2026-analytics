"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Building2,
  MapPin,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

interface PositionMeta {
  kod_thesis: string;
  foreas?: string;
  perifereia?: string;
  edra?: string;
  eidikotita?: string;
  theseis?: number;
}

interface PositionIntel {
  min_score: number;
  max_score: number;
  count: number;
  has_entopiotita: boolean;
  entop_label?: string | null;
  has_special: boolean;
  top_candidate?: string;
}

interface AllocationJourneyProps {
  protimiseisStr?: string | null;
  thesiDiorismou?: string | null;
  candidateScore: number | null;
}

export default function AllocationJourney({
  protimiseisStr,
  thesiDiorismou,
  candidateScore,
}: AllocationJourneyProps) {
  const [positionsMap, setPositionsMap] = useState<Record<string, PositionMeta>>({});
  const [intelMap, setIntelMap] = useState<Record<string, PositionIntel>>({});
  const [isExpanded, setIsExpanded] = useState(false);

  // 1. Καθαρισμός λίστας προτιμήσεων
  const parsedPreferences = useMemo(() => {
    if (!protimiseisStr) return [];
    return protimiseisStr
      .split(/[-,\s]+/)
      .map((k) => k.replace(/\.0$/, "").trim())
      .filter(Boolean);
  }, [protimiseisStr]);

  const targetKod = thesiDiorismou ? String(thesiDiorismou).replace(/\.0$/, "").trim() : null;
  const targetIdx = targetKod ? parsedPreferences.indexOf(targetKod) : -1;

  // 2. Υπολογισμός Προτιμήσεων προς εμφάνιση:
  // Αν έχει δηλώσει έως 35 θέσεις, τις δείχνουμε ΟΛΕΣ!
  // Αν έχει δηλώσει πάνω από 35 θέσεις, δείχνουμε παράθυρο ±12 θέσεων γύρω από τον διορισμό.
  const windowedPreferences = useMemo(() => {
    if (!parsedPreferences.length) return [];
    
    // Αν είναι κάτω από 35 θέσεις, εμφάνισέ τες ΟΛΕΣ εξ αρχής!
    if (parsedPreferences.length <= 35) {
      return parsedPreferences;
    }

    if (targetIdx === -1) {
      return parsedPreferences.slice(0, 30);
    }

    // Παράθυρο: 10 πριν τη θέση διορισμού και έως 15 μετά!
    const startIdx = Math.max(0, targetIdx - 10);
    const endIdx = Math.min(parsedPreferences.length, targetIdx + 15);
    return parsedPreferences.slice(startIdx, endIdx);
  }, [parsedPreferences, targetIdx]);

  // 3. Φόρτωση metadata θέσεων και προ-υπολογισμένων βάσεων
  useEffect(() => {
    Promise.all([
      fetch("/data/positions.json").then((r) => r.json()).catch(() => []),
      fetch("/data/positions_intel.json").then((r) => r.json()).catch(() => ({})),
    ]).then(([posList, intelData]) => {
      const pMap: Record<string, PositionMeta> = {};
      for (const p of posList) {
        const kod = String(p.kod_thesis).replace(/\.0$/, "").trim();
        pMap[kod] = p;
      }
      setPositionsMap(pMap);
      setIntelMap(intelData);
    });
  }, []);

  if (!parsedPreferences.length) return null;

  const appointedNumber = targetIdx !== -1 ? targetIdx + 1 : null;
  const displayedItems = isExpanded ? parsedPreferences : windowedPreferences;

  return (
    <div className="glass p-5 sm:p-8 rounded-2xl mb-12">
      {/* Disclaimer Banner */}
      <div className="mb-6 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-[#00E5FF] flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Σημείωση Αποποίησης:</strong> Η παρακάτω διαδρομή αποτελεί ανάλυση βασισμένη στα ανοιχτά προσωρινά αποτελέσματα του ΑΣΕΠ και <strong>δεν αποτελεί επίσημη προσομοίωση ή ιδιοκτησία του αλγορίθμου κατανομής</strong>. 
          Οι βάσεις και η κάλυψη θέσεων ενδέχεται να μεταβληθούν μετά την εξέταση των ενστάσεων.
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] text-[11px] font-mono font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3" />
            Ανάλυση Βάσεων Προτιμήσεων (±10 Θέσεις)
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
            Διαδρομή Κατανομής & Βάσεις Θέσεων
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Δείτε τη βάση (χαμηλότερη βαθμολογία διορισμού) για κάθε επιλογή σας και αν κάποια θέση
            καλύφθηκε μέσω ειδικής κατηγορίας ή εντοπιότητας.
          </p>
        </div>

        {appointedNumber && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 self-start sm:self-auto flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-emerald-500">
                Αποτέλεσμα
              </div>
              <div className="text-sm font-bold">
                Διορισμός στην {appointedNumber}η Επιλογή!
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stepper Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-[11px] sm:before:left-[15px] before:top-3 before:bottom-3 before:w-[2px] before:bg-gradient-to-b before:from-slate-700 via-[#00E5FF]/40 to-slate-800">
        {displayedItems.map((kod) => {
          const actualIndex = parsedPreferences.indexOf(kod);
          const prefNum = actualIndex + 1;
          const isAppointed = kod === targetKod;
          const isPrior = targetIdx !== -1 && actualIndex < targetIdx;
          const posMeta = positionsMap[kod];
          const intel = intelMap[kod];

          // Υπολογισμός διαφοράς βαθμολογίας από τη βάση
          const scoreDiff =
            intel && candidateScore !== null
              ? (candidateScore - intel.min_score).toFixed(2)
              : null;

          return (
            <motion.div
              key={`${kod}-${actualIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="relative group"
            >
              {/* Stepper Node Icon */}
              <div
                className={`absolute -left-[30px] sm:-left-[39px] top-3.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border transition-all ${
                  isAppointed
                    ? "bg-emerald-500 border-white text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.9)] scale-110"
                    : isPrior
                    ? "bg-[#070A13] border-slate-700 text-slate-500"
                    : "bg-[#070A13] border-slate-800 text-slate-600"
                }`}
              >
                {isAppointed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                ) : isPrior ? (
                  <XCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                ) : (
                  <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                )}
              </div>

              {/* Step Card */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  isAppointed
                    ? "bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-[#070A13] border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                    : isPrior
                    ? "bg-slate-900/30 border-slate-800/80 hover:border-slate-700"
                    : "bg-slate-950/30 border-slate-900 opacity-70 hover:opacity-100"
                }`}
              >
                {/* Top Row: Choice Number & Position Link */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                        isAppointed
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : "bg-slate-800/80 text-slate-400"
                      }`}
                    >
                      {prefNum}η Επιλογή
                    </span>
                    <Link
                      href={`/thesi/${kod}`}
                      className="font-mono font-bold text-sm sm:text-base text-[#00E5FF] hover:underline"
                    >
                      Θέση #{kod}
                    </Link>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`text-[11px] font-medium px-2.5 py-0.5 rounded-md w-fit ${
                      isAppointed
                        ? "bg-emerald-500 text-slate-950 font-bold"
                        : isPrior
                        ? "bg-slate-800/60 text-slate-400"
                        : "bg-slate-900 text-slate-500"
                    }`}
                  >
                    {isAppointed
                      ? "🎯 ΚΑΤΟΧΥΡΩΣΗ ΘΕΣΗΣ"
                      : isPrior
                      ? "Καλύφθηκε προγενέστερα"
                      : "Δεν εξετάστηκε (κατοχυρώθηκε σε ανώτερη)"}
                  </span>
                </div>

                {/* Agency & Location */}
                <div className="text-xs space-y-1 mb-3">
                  <div className="text-slate-200 font-medium flex items-center gap-1.5 truncate">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{posMeta?.foreas || "Φορέας θέσης..."}</span>
                  </div>

                  {posMeta?.perifereia && (
                    <div className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                      <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                      <span>
                        {posMeta.perifereia} {posMeta.edra ? `• ${posMeta.edra}` : ""}
                      </span>
                    </div>
                  )}
                </div>

                {/* STATS ROW: Βάση Θέσης & Ποσοστώσεις */}
                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  {/* Min Score (Βάση) */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-slate-400">Βάση Θέσης:</span>
                    {intel ? (
                      <span className="font-mono font-bold text-white bg-slate-900 px-2.5 py-0.5 rounded border border-slate-700">
                        {intel.min_score.toFixed(2)} μόρια
                      </span>
                    ) : (
                      <span className="text-slate-500 font-mono text-[11px]">Κενή / Μη καλυφθείσα</span>
                    )}

                    {/* Διαφορά βαθμολογίας */}
                    {scoreDiff && isPrior && (
                      <span
                        className={`text-[11px] font-mono font-semibold flex items-center gap-0.5 px-2 py-0.5 rounded ${
                          Number(scoreDiff) >= 0 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" 
                            : "bg-pink-500/10 text-pink-400 border border-pink-500/30"
                        }`}
                        title="Διαφορά βαθμολογίας υποψηφίου από τη βάση της θέσης"
                      >
                        {Number(scoreDiff) >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {Number(scoreDiff) >= 0 ? `+${scoreDiff}` : scoreDiff} μόρια
                      </span>
                    )}
                  </div>

                  {/* Priority Badges: Εντοπιότητα & Ειδικές Κατηγορίες */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {intel?.has_entopiotita && (
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 flex items-center gap-1"
                        title={`Σε αυτή τη θέση διορίστηκε υποψήφιος με κριτήριο εντοπιότητας (${intel.entop_label || "Κωδ. 6/7"})`}
                      >
                        <span>📍 Εντοπιότητα</span>
                        {intel.entop_label && <span className="text-[9px] opacity-80">({intel.entop_label})</span>}
                      </span>
                    )}
                    {intel?.has_special && (
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded bg-pink-500/15 text-pink-300 border border-pink-500/40"
                        title="Σε αυτή τη θέση διορίστηκε υποψήφιος με Ειδική Κατηγορία (ΑΜΕΑ, πολυτεκνία κλπ.)"
                      >
                        ⭐ Ειδική Κατηγορία (ΝΑΙ)
                      </span>
                    )}
                  </div>
                </div>

                {/* Subtext info */}
                <div className="mt-2.5 pt-2 border-t border-slate-800/60 text-[11px] flex items-center justify-between text-slate-400">
                  <span>
                    {isAppointed
                      ? `✓ Κατοχυρώθηκε οριστικά με ${candidateScore || "—"} μόρια.`
                      : isPrior
                      ? "Αν η βαθμολογία σας αυξηθεί σε ενδεχόμενη ένσταση, ελέγξτε αν προσεγγίζετε τη βάση."
                      : "Η επιλογή προσπεράστηκε αφού ο υποψήφιος κλείδωσε σε ανώτερη προτίμησή του."}
                  </span>
                  <Link
                    href={`/thesi/${kod}`}
                    className="text-[#00E5FF] hover:underline flex-shrink-0 ml-2"
                  >
                    Όλοι οι διορισθέντες →
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Toggle View All Button */}
      {parsedPreferences.length > windowedPreferences.length && (
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex justify-center">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-[#00E5FF] hover:border-[#00E5FF]/40 transition-all cursor-pointer font-medium"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Σύμπτυξη στο παράθυρο ±10 θέσεων
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Εμφάνιση και των {parsedPreferences.length} δηλωθέντων προτιμήσεων
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}