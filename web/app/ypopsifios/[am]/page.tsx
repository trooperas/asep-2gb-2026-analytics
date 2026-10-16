"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { formatVathmologia } from "@/lib/utils";
import AllocationJourney from "@/components/profile/AllocationJourney";
import ObjectionSimulator from "@/components/profile/ObjectionSimulator";
import { Sliders, ChevronDown, ChevronUp, Info, MapPin, CheckCircle2 } from "lucide-react";
import EpilaxontesTracker from "@/components/profile/EpilaxontesTracker";

interface Candidate {
  am: string;
  aa: number;
  eponymo: string;
  onoma: string;
  patronymo: string;
  adt_masked: string;
  omada_prosonton: string;
  theseis_idias_omadas?: string;
  protimiseis?: string;
  thesi_diorismou: string;
  pinakas: string;
  metaptyxiako: string;
  didaktoriko: string;
  minas_empeirias: number | null;
  monades_empeirias: number | null;
  kod_entopiotitas: string;
  math1: number | null;
  math2: number | null;
  synolo_graptou: number | null;
  vathmologia: number | null;
  appointed_rank?: number;
  total_appointed_in_specialty?: number;
  total_candidates_in_specialty?: number;
  monades_entop?: number | null;
  is_entopiotita_seat?: boolean;
  moria_diorismou?: number | null;
  thesi_entopiotitas?: string;
  eidikotita: string;
  slug?: string;
  eidikotitaSlug: string;
}

function StatBox({
  label,
  value,
  highlight = false,
  delay = 0,
  subtext,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
  delay?: number;
  subtext?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.5 }}
      className="glass flex flex-col justify-between"
      style={{ padding: "1.25rem" }}
    >
      <div>
        <div
          style={{
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--text-muted)",
            marginBottom: "0.5rem",
          }}
        >
          {label}
        </div>
        <div
          className={highlight ? "text-gradient" : ""}
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: highlight ? undefined : "var(--text)",
            lineHeight: 1.2,
          }}
        >
          {value}
        </div>
      </div>
      {subtext && (
        <div className="text-[11px] text-slate-400 mt-2 font-mono">
          {subtext}
        </div>
      )}
    </motion.div>
  );
}

export default function ProfilePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const am = params?.am as string;
  const slugParam = searchParams?.get("slug");

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // States για θέσεις και simulator
  const [intelMap, setIntelMap] = useState<Record<string, any>>({});
  const [positionsMap, setPositionsMap] = useState<Record<string, any>>({});
  const [showSimulator, setShowSimulator] = useState(false);

  // 1. Φόρτωση υποψηφίου
  useEffect(() => {
    if (!am) return;
    const cleanAm = String(am).replace(/\.0$/, "");
    fetch(`/api/ypopsifios?am=${encodeURIComponent(cleanAm)}`)
      .then((r) => {
        if (r.status === 404) {
          setNotFound(true);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data && data.all) {
          setCandidates(data.all);

          // Αν υπάρχει ?slug= στο URL
          if (slugParam) {
            const idx = data.all.findIndex(
              (c: Candidate) => (c.slug || (c as any).eidikotitaSlug) === slugParam
            );
            if (idx >= 0) {
              setActiveIdx(idx);
              return;
            }
          }

          // DEFAULT: Άνοιξε ΑΥΤΟΜΑΤΑ την ειδικότητα στην οποία ΔΙΟΡΙΣΤΗΚΕ!
          const appointedIdx = data.all.findIndex((c: Candidate) => !!c.thesi_diorismou);
          if (appointedIdx >= 0) {
            setActiveIdx(appointedIdx);
          } else {
            setActiveIdx(0);
          }
        }
      })
      .catch((e) => {
        console.error(e);
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [am, slugParam]);

  // 2. Φόρτωση metadata θέσεων για τον προσομοιωτή
  useEffect(() => {
    Promise.all([
      fetch("/data/positions_intel.json").then((r) => r.json()).catch(() => ({})),
      fetch("/data/positions.json").then((r) => r.json()).catch(() => []),
    ]).then(([intelData, posList]) => {
      setIntelMap(intelData);
      const pMap: Record<string, any> = {};
      for (const p of posList) {
        const kod = String(p.kod_thesis).replace(/\.0$/, "").trim();
        pMap[kod] = p;
      }
      setPositionsMap(pMap);
    });
  }, []);

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--primary)",
        }}
      >
        Φόρτωση προφίλ...
      </main>
    );
  }

  if (notFound || candidates.length === 0) {
    return (
      <main
        style={{
          minHeight: "100vh",
          padding: "120px 24px",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "1rem" }}>Δεν βρέθηκε</h1>
        <Link href="/search" style={{ color: "var(--primary)" }}>
          ← Πίσω στην αναζήτηση
        </Link>
      </main>
    );
  }

  const candidate = candidates[activeIdx];
  const isDioristaios = !!candidate.thesi_diorismou;
  const cleanAmString = String(candidate.am).replace(/\.0$/, "");
  const cleanThesiKod = candidate.thesi_diorismou
    ? String(candidate.thesi_diorismou).replace(/\.0$/, "")
    : "";

  // ==========================================
  // ΥΠΟΛΟΓΙΣΜΟΙ ΕΝΤΟΠΙΟΤΗΤΑΣ & ΒΑΘΜΟΛΟΓΙΑΣ
  // ==========================================
  const rawExcelScore = Number(candidate.vathmologia || 0);

  // Έχει δικαίωμα εντοπιότητας (στοιχεία αίτησης/excel);
  const hasEntopiotitaRight = Boolean(
    (candidate.kod_entopiotitas && candidate.kod_entopiotitas !== "-" && candidate.kod_entopiotitas !== "0") ||
    Number(candidate.monades_entop || 0) > 0
  );

  const entopBonusPoints = Number(candidate.monades_entop || (hasEntopiotitaRight ? 40 : 0));

  // Χρησιμοποιήθηκε εντοπιότητα στη συγκεκριμένη θέση διορισμού;
  const usedLocalityForSeat = Boolean(candidate.is_entopiotita_seat);

  // Πραγματικά μόρια διορισμού (αν δεν δίνονται ρητά, αφαιρούμε τις μονάδες εντοπιότητας αν δεν χρησιμοποιήθηκαν)
  const actualAppointedScore = candidate.moria_diorismou != null
    ? Number(candidate.moria_diorismou)
    : (isDioristaios && hasEntopiotitaRight && !usedLocalityForSeat && rawExcelScore > 100)
      ? Math.max(0, rawExcelScore - entopBonusPoints)
      : rawExcelScore;

  // Η βαθμολογία διορισμού διαφέρει από το Excel (περίπτωση Μιχαηλίδου)
  const scoreDiffersFromExcel = isDioristaios && hasEntopiotitaRight && !usedLocalityForSeat && rawExcelScore > actualAppointedScore;

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "120px 24px 80px",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{ maxWidth: "950px", margin: "0 auto" }}>
        <Link
          href="/search"
          style={{
            color: "var(--text-muted)",
            textDecoration: "none",
            fontSize: "0.9rem",
            display: "inline-block",
            marginBottom: "2rem",
          }}
        >
          ← Πίσω στην αναζήτηση
        </Link>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "6px 16px",
              borderRadius: "100px",
              border: "1px solid var(--border)",
              background: isDioristaios
                ? "rgba(0, 255, 163, 0.08)"
                : "rgba(255, 61, 113, 0.08)",
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: isDioristaios ? "var(--success)" : "var(--danger)",
              marginBottom: "1.5rem",
            }}
          >
            ● {isDioristaios ? "Διοριστέος" : "Μη διοριστέος"}
          </div>

          <h1
            className="font-display"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              marginBottom: "0.5rem",
            }}
          >
            {candidate.eponymo} {candidate.onoma}
          </h1>

          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "1.05rem",
              marginBottom: "3rem",
            }}
          >
            {candidate.patronymo} · Α.Μ.{" "}
            <span
              style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
            >
              {cleanAmString}
            </span>
            {candidate.adt_masked && ` · ${candidate.adt_masked}`}
          </p>
        </motion.div>

        {/* Επιλογή ειδικότητας αν έχει πολλαπλές */}
        {candidates.length > 1 && (
          <div
            style={{
              marginBottom: "2rem",
              padding: "1rem 1.25rem",
              background: "rgba(0, 229, 255, 0.04)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
            }}
          >
            <div
              style={{
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--text-muted)",
                marginBottom: "0.75rem",
              }}
            >
              Ο υποψήφιος συμμετείχε σε {candidates.length} ειδικότητες
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {candidates.map((c, i) => (
                <button
                  key={`${c.eidikotitaSlug}-${i}`}
                  onClick={() => setActiveIdx(i)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    border:
                      i === activeIdx
                        ? "1px solid var(--primary)"
                        : "1px solid var(--border)",
                    background:
                      i === activeIdx
                        ? "rgba(0, 229, 255, 0.1)"
                        : "transparent",
                    color: i === activeIdx ? "var(--primary)" : "var(--text)",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    textAlign: "left",
                  }}
                >
                  {c.eidikotita.length > 60
                    ? c.eidikotita.substring(0, 60) + "..."
                    : c.eidikotita}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TOP KPIs (Σειρές & Βαθμολογίες με απόλυτη σαφήνεια) */}
        {/* ========================================================= */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          {/* Βαθμολογία (Διορισμού ή Τελική) */}
          <StatBox
            label={isDioristaios ? "Βαθμολογία Διορισμού" : "Τελική Βαθμολογία"}
            value={formatVathmologia(actualAppointedScore)}
            highlight
            subtext={
              scoreDiffersFromExcel
                ? `Πίνακας ΑΣΕΠ: ${formatVathmologia(rawExcelScore)}`
                : undefined
            }
            delay={100}
          />

          {/* Γραπτός */}
          <StatBox
            label="Σύνολο Γραπτού"
            value={formatVathmologia(candidate.synolo_graptou)}
            delay={150}
          />

          {/* Σειρά Πίνακα Κατάταξης (ΑΣΕΠ Pure Rank) */}
          <StatBox
            label="Σειρά Πίνακα (ΑΣΕΠ)"
            value={`#${candidate.aa}`}
            subtext={
              candidate.total_candidates_in_specialty
                ? `στους ${candidate.total_candidates_in_specialty}`
                : "Στον πίνακα ειδικότητας"
            }
            delay={200}
          />

          {/* Σειρά & Κατάσταση Διορισμού */}
          {candidate.thesi_diorismou ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="glass p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400">
                    Σειρά Διοριστέων
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-white">
                  #{candidate.appointed_rank || candidate.aa}
                  {candidate.total_appointed_in_specialty && (
                    <span className="text-xs sm:text-sm text-slate-400 font-normal">
                      {" "}από {candidate.total_appointed_in_specialty}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-[11px] mt-2 font-medium">
                {usedLocalityForSeat ? (
                  <span className="text-amber-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 inline" /> Με Εντοπιότητα
                  </span>
                ) : (
                  <span className="text-[#00E5FF] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 inline" /> Αξιοκρατική Κατοχύρωση
                  </span>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="glass p-5 rounded-2xl opacity-75 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">
                  Κατάσταση
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-slate-300">
                  Μη Διοριστέος
                </div>
              </div>
              <div className="text-[10px] text-slate-400 mt-2">
                Στους επιλαχόντες ειδικότητας
              </div>
            </motion.div>
          )}

          {/* Θέση Διορισμού */}
          {cleanThesiKod ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                href={`/thesi/${cleanThesiKod}`}
                className="glass glass-hover"
                style={{
                  padding: "1.25rem",
                  display: "block",
                  textDecoration: "none",
                  borderRadius: "16px",
                  border: "1px solid rgba(0, 229, 255, 0.25)",
                  background: "rgba(0, 229, 255, 0.03)",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.7rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "var(--text-muted)",
                    }}
                  >
                    Θέση Διορισμού
                  </span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--primary)",
                      fontWeight: 600,
                    }}
                  >
                    →
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "var(--primary)",
                    lineHeight: 1.2,
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                  }}
                >
                  #{cleanThesiKod}
                </div>
              </Link>
            </motion.div>
          ) : (
            <StatBox label="Θέση Διορισμού" value="—" delay={300} />
          )}
        </div>

        {/* ========================================================= */}
        {/* ΕΠΕΞΗΓΗΜΑΤΙΚΟ CALLOUT (Διαφάνεια Μορίων & Εντοπιότητας) */}
        {/* ========================================================= */}
        {scoreDiffersFromExcel && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-8 p-4 sm:p-5 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 text-slate-200 text-xs sm:text-sm leading-relaxed"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-[#00E5FF] flex-shrink-0 mt-0.5">
                <Info className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-cyan-300 text-sm sm:text-base">
                  Ανάλυση Μορίων & Σειράς Διορισμού
                </div>

                <p>
                  Στον συγκεντρωτικό πίνακα του ΑΣΕΠ εμφανίζεστε στη θέση <strong>#{candidate.aa}</strong> με <strong>{formatVathmologia(rawExcelScore)} μόρια</strong>, 
                  καθώς είχε υπολογιστεί το θεωρητικό μπόνους εντοπιότητας (+{entopBonusPoints} μόρια).
                </p>

                <p>
                  Στην πραγματικότητα, κατοχυρώσατε τη θέση <strong>#{cleanThesiKod}</strong> αποκλειστικά με τα 
                  αξιοκρατικά σας μόρια (<strong>{formatVathmologia(actualAppointedScore)} μόρια</strong> από Γραπτό + Προσαυξήσεις), 
                  καθώς στη θέση αυτή <em>δεν απαιτήθηκε ούτε εφαρμόζεται προνόμιο εντοπιότητας</em>.
                </p>

                <div className="pt-2 border-t border-cyan-500/20 text-slate-400 text-[11px] sm:text-xs">
                  <strong>Γιατί η σειρά διοριστέων είναι #{candidate.appointed_rank || candidate.aa};</strong> Οι θέσεις που προηγούνται στη συνολική κατάταξη διοριστέων καταλήφθηκαν από υποψηφίους που αξιοποίησαν εντοπιότητα παραμεθορίου/νησιών (+20 ή +40 μόρια).
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Callout αν διορίστηκε ΜΕ εντοπιότητα */}
        {isDioristaios && usedLocalityForSeat && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-8 p-4 rounded-2xl border border-amber-500/30 bg-amber-950/20 text-slate-200 text-xs sm:text-sm"
          >
            <div className="flex items-center gap-2 font-semibold text-amber-300 mb-1">
              <MapPin className="w-4 h-4" /> Κατοχύρωση Θέσης με Προνόμιο Εντοπιότητας
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Η θέση <strong>#{cleanThesiKod}</strong> κατοχυρώθηκε με συνυπολογισμό των <strong>+{entopBonusPoints} μορίων εντοπιότητας</strong>, 
              διαμορφώνοντας την τελική βαθμολογία διορισμού στα <strong>{formatVathmologia(actualAppointedScore)} μόρια</strong>.
            </p>
          </motion.div>
        )}

        {/* 1. ΔΙΑΔΡΟΜΗ ΚΑΤΑΝΟΜΗΣ (Natural Hierarchy) */}
        <AllocationJourney
          protimiseisStr={candidate.protimiseis}
          thesiDiorismou={candidate.thesi_diorismou}
          candidateScore={candidate.vathmologia}
        />

        {/* === Epilaxontes & Replacement Tracker (Για μη διοριστέους) === */}
        <EpilaxontesTracker
          isDioristaios={isDioristaios}
          candidateScore={candidate.vathmologia}
          candidateRank={candidate.aa}
          protimiseisStr={candidate.protimiseis}
          intelMap={intelMap}
          positionsMap={positionsMap}
        />  

        {/* 2. COLLAPSIBLE BAR ΓΙΑ ΤΟΝ ΠΡΟΣΟΜΟΙΩΤΗ ΕΝΣΤΑΣΕΩΝ */}
        <div className="mb-12">
          <button
            type="button"
            onClick={() => setShowSimulator(!showSimulator)}
            className="w-full p-4 sm:p-5 rounded-2xl glass hover:border-[#00E5FF]/40 transition-all flex items-center justify-between gap-4 cursor-pointer text-left group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] flex-shrink-0 group-hover:scale-105 transition-transform">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-bold text-white group-hover:text-[#00E5FF] transition-colors">
                  Σκέφτεστε να υποβάλετε ένσταση; (Προθεσμία 13–22 Οκτωβρίου)
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Ανοίξτε τον διαδραστικό προσομοιωτή για να δείτε ποιες ανώτερες θέσεις θα ξεκλείδωναν με +1 ή +2 μόρια.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#00E5FF] flex-shrink-0">
              <span className="hidden sm:inline">
                {showSimulator ? "Απόκρυψη" : "Προσομοίωση"}
              </span>
              {showSimulator ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
          </button>

          <AnimatePresence>
            {showSimulator && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mt-4"
              >
                <ObjectionSimulator
                  currentScore={candidate.vathmologia}
                  currentRank={candidate.aa}
                  protimiseisStr={candidate.protimiseis}
                  thesiDiorismou={candidate.thesi_diorismou}
                  intelMap={intelMap}
                  positionsMap={positionsMap}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Αναλυτικές Βαθμολογίες */}
        <h2
          className="font-display"
          style={{ fontSize: "1.5rem", marginBottom: "1rem" }}
        >
          Αναλυτικές Βαθμολογίες
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
            marginBottom: "3rem",
          }}
        >
          <StatBox
            label="Μαθ 1 (Γνώσεις)"
            value={formatVathmologia(candidate.math1)}
          />
          <StatBox
            label="Μαθ 2 (Δεξιότητες)"
            value={formatVathmologia(candidate.math2)}
          />
          <StatBox
            label="Μήνες Εμπειρίας"
            value={candidate.minas_empeirias ?? "—"}
          />
          <StatBox
            label="Μονάδες Εμπειρίας"
            value={candidate.monades_empeirias ?? "—"}
          />
        </div>

        {/* Στοιχεία Ειδικότητας */}
        <h2
          className="font-display"
          style={{ fontSize: "1.5rem", marginBottom: "1rem" }}
        >
          Στοιχεία Ειδικότητας
        </h2>

        <div
          className="glass"
          style={{ padding: "1.5rem", marginBottom: "3rem" }}
        >
          <div style={{ marginBottom: "1rem" }}>
            <div
              style={{
                fontSize: "0.7rem",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: "4px",
              }}
            >
              Ειδικότητα
            </div>
            <div style={{ fontWeight: 600 }}>{candidate.eidikotita}</div>
          </div>

          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            <div>
              <div
                style={{
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginBottom: "4px",
                }}
              >
                Πίνακας
              </div>
              <div>{candidate.pinakas || "—"}</div>
            </div>

            <div>
              <div
                style={{
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginBottom: "4px",
                }}
              >
                Μεταπτυχιακό
              </div>
              <div>{candidate.metaptyxiako || "—"}</div>
            </div>

            <div>
              <div
                style={{
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginBottom: "4px",
                }}
              >
                Διδακτορικό
              </div>
              <div>{candidate.didaktoriko || "—"}</div>
            </div>

            <div>
              <div
                style={{
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginBottom: "4px",
                }}
              >
                Κωδ. Εντοπιότητας
              </div>
              <div>{candidate.kod_entopiotitas || "—"}</div>
            </div>
          </div>
        </div>

        {/* Σωστό Link με fallback σε slug */}
        <Link
          href={`/eidikotita/${candidate.slug || (candidate as any).eidikotitaSlug || ""}`}
          className="glass glass-hover"
          style={{
            padding: "16px 32px",
            display: "inline-block",
            color: "var(--primary)",
            textDecoration: "none",
            fontWeight: 600,
            borderRadius: "12px",
          }}
        >
          Δες όλη την ειδικότητα ({candidate.eidikotita}) →
        </Link>
      </div>
    </main>
  );
}