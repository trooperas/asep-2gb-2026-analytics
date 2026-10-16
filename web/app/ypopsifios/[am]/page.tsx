"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { formatVathmologia } from "@/lib/utils";
import AllocationJourney from "@/components/profile/AllocationJourney";
import ObjectionSimulator from "@/components/profile/ObjectionSimulator";
import { Sliders, ChevronDown, ChevronUp, Info, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
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

  // States θέσεων & simulator
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

          if (slugParam) {
            const idx = data.all.findIndex(
              (c: Candidate) => (c.slug || (c as any).eidikotitaSlug) === slugParam
            );
            if (idx >= 0) {
              setActiveIdx(idx);
              return;
            }
          }

          // Προεπιλογή: Άνοιξε την ειδικότητα στην οποία πραγματικά διορίστηκε
          const appointedIdx = data.all.findIndex((c: Candidate) => !!c.thesi_diorismou && !!c.appointed_rank);
          if (appointedIdx >= 0) {
            setActiveIdx(appointedIdx);
          } else {
            const fallbackIdx = data.all.findIndex((c: Candidate) => !!c.thesi_diorismou);
            setActiveIdx(fallbackIdx >= 0 ? fallbackIdx : 0);
          }
        }
      })
      .catch((e) => {
        console.error(e);
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [am, slugParam]);

  // 2. Φόρτωση metadata θέσεων
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

  // =========================================================
  // ΑΚΡΙΒΗΣ ΕΛΕΓΧΟΣ ΠΟΛΛΑΠΛΩΝ ΕΙΔΙΚΟΤΗΤΩΝ & ΔΙΟΡΙΣΜΟΥ
  // =========================================================
  const { trueAppointedCand, appointedSpecialtyIdx } = useMemo(() => {
    if (!candidates.length) return { trueAppointedCand: null, appointedSpecialtyIdx: -1 };

    // Εντοπισμός της μίας και μοναδικής ειδικότητας όπου ισχύει ο διορισμός
    let foundIdx = candidates.findIndex((c) => {
      if (!c.thesi_diorismou) return false;
      const cleanKod = String(c.thesi_diorismou).replace(/\.0$/, "").trim();
      
      // Αν η θέση υπάρχει στη λίστα προτιμήσεων της συγκεκριμένης ειδικότητας
      if (c.protimiseis && c.protimiseis.includes(cleanKod)) return true;

      // Ή αν έχει ρητό appointed_rank σε αυτή την εγγραφή
      if (c.appointed_rank && c.appointed_rank > 0) return true;

      return false;
    });

    if (foundIdx === -1) {
      foundIdx = candidates.findIndex((c) => !!c.thesi_diorismou);
    }

    return {
      trueAppointedCand: foundIdx >= 0 ? candidates[foundIdx] : null,
      appointedSpecialtyIdx: foundIdx,
    };
  }, [candidates]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-[#00E5FF]">
        Φόρτωση προφίλ...
      </main>
    );
  }

  if (notFound || candidates.length === 0) {
    return (
      <main className="min-h-screen p-28 text-center">
        <h1 className="mb-4 text-2xl font-bold">Δεν βρέθηκε</h1>
        <Link href="/search" className="text-[#00E5FF]">
          ← Πίσω στην αναζήτηση
        </Link>
      </main>
    );
  }

  const candidate = candidates[activeIdx];
  const cleanAmString = String(candidate.am).replace(/\.0$/, "");

  // Ισχύει ο διορισμός ΣΕ ΑΥΤΗ την ενεργή ειδικότητα;
  const isAppointedInCurrent = Boolean(
    trueAppointedCand &&
    (candidate.eidikotitaSlug === trueAppointedCand.eidikotitaSlug ||
      candidate.eidikotita === trueAppointedCand.eidikotita) &&
    !!candidate.thesi_diorismou
  );

  // Μήπως διορίστηκε σε ΑΛΛΗ ειδικότητα από αυτή που κοιτάμε τώρα;
  const isAppointedInOther = Boolean(trueAppointedCand && !isAppointedInCurrent);

  const cleanThesiKod = isAppointedInCurrent && candidate.thesi_diorismou
    ? String(candidate.thesi_diorismou).replace(/\.0$/, "")
    : "";

  // Υπολογισμοί βαθμών & εντοπιότητας
  const rawExcelScore = Number(candidate.vathmologia || 0);
  const hasEntopiotitaCode = Boolean(
    candidate.kod_entopiotitas &&
    candidate.kod_entopiotitas !== "-" &&
    candidate.kod_entopiotitas !== "0"
  );

  const appointedPosData = cleanThesiKod ? positionsMap[cleanThesiKod] : null;
  const isSeatWithEntopiotita = Boolean(
    candidate.is_entopiotita_seat ??
    (appointedPosData?.kod_entopiotita && appointedPosData.kod_entopiotita !== "-")
  );

  const entopBonus = Number(candidate.monades_entop) || (
    ["06", "07", "6", "7"].includes(String(candidate.kod_entopiotitas).trim()) ? 40 :
    hasEntopiotitaCode ? 20 : 0
  );

  const bypassedLocality = isAppointedInCurrent && hasEntopiotitaCode && !isSeatWithEntopiotita;
  const usedLocality = isAppointedInCurrent && hasEntopiotitaCode && isSeatWithEntopiotita;

  const actualAppointedScore = candidate.moria_diorismou != null
    ? Number(candidate.moria_diorismou)
    : bypassedLocality && rawExcelScore > 100
      ? Math.max(0, rawExcelScore - entopBonus)
      : rawExcelScore;

  // Υπολογισμός διαφοράς σειράς (#77 στον πίνακα -> #73 στους διοριστέους)
  const rankGain = (candidate.aa && candidate.appointed_rank)
    ? candidate.aa - candidate.appointed_rank
    : 0;

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

        {/* Profile Header Badge */}
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
              background: isAppointedInCurrent
                ? "rgba(0, 255, 163, 0.08)"
                : isAppointedInOther
                ? "rgba(0, 229, 255, 0.08)"
                : "rgba(255, 61, 113, 0.08)",
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: isAppointedInCurrent
                ? "var(--success)"
                : isAppointedInOther
                ? "var(--primary)"
                : "var(--danger)",
              marginBottom: "1.5rem",
            }}
          >
            ● {isAppointedInCurrent
                ? "Διοριστέος σε αυτή την ειδικότητα"
                : isAppointedInOther
                ? `Διορίστηκε σε άλλη ειδικότητα (${trueAppointedCand?.eidikotita})`
                : "Μη διοριστέος"}
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
              marginBottom: "2.5rem",
            }}
          >
            {candidate.patronymo} · Α.Μ.{" "}
            <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
              {cleanAmString}
            </span>
            {candidate.adt_masked && ` · ${candidate.adt_masked}`}
          </p>
        </motion.div>

        {/* Επιλογή ειδικότητας με ένδειξη πού διορίστηκε */}
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
              Συμμετοχή σε {candidates.length} ειδικότητες:
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {candidates.map((c, i) => {
                const isThisAppointed =
                  trueAppointedCand &&
                  (c.eidikotitaSlug === trueAppointedCand.eidikotitaSlug ||
                    c.eidikotita === trueAppointedCand.eidikotita);

                return (
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
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span>
                      {c.eidikotita.length > 50
                        ? c.eidikotita.substring(0, 50) + "..."
                        : c.eidikotita}
                    </span>
                    {isThisAppointed && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                        ✓ ΔΙΟΡΙΣΜΟΣ
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Ειδοποίηση όταν κοιτάζει ειδικότητα στην οποία ΔΕΝ διορίστηκε αλλά πέρασε στην άλλη */}
        {isAppointedInOther && trueAppointedCand && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 flex items-center justify-between gap-4"
          >
            <div className="text-xs sm:text-sm text-slate-300">
              ℹ️ Στην παρούσα ειδικότητα ο υποψήφιος είναι <strong>επιλαχών (θέση #{candidate.aa})</strong>. 
              Έχει κατοχυρώσει διορισμό στην ειδικότητα <strong>«{trueAppointedCand.eidikotita}»</strong> (Θέση #{String(trueAppointedCand.thesi_diorismou).replace(/\.0$/, "")}).
            </div>
            <button
              onClick={() => setActiveIdx(appointedSpecialtyIdx)}
              className="text-xs font-semibold text-[#00E5FF] whitespace-nowrap flex items-center gap-1 hover:underline cursor-pointer"
            >
              Μετάβαση <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
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
          {/* Βαθμολογία */}
          <StatBox
            label={isAppointedInCurrent ? "Βαθμολογία Διορισμού" : "Βαθμολογία Ειδικότητας"}
            value={formatVathmologia(isAppointedInCurrent ? actualAppointedScore : rawExcelScore)}
            highlight
            subtext={
              bypassedLocality
                ? `Αρχικός πίνακας: ${formatVathmologia(rawExcelScore)}`
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

          {/* 1. Σειρά Πίνακα Κατάταξης (ΑΣΕΠ) */}
          <StatBox
            label="Σειρά Πίνακα (ΑΣΕΠ)"
            value={`#${candidate.aa}`}
            subtext={
              candidate.total_candidates_in_specialty
                ? `σε ${candidate.total_candidates_in_specialty} υποψηφίους`
                : "Στον πίνακα όλων των αιτήσεων"
            }
            delay={200}
          />

          {/* 2. Σειρά Διοριστέων (με εξήγηση του #77 vs #73) */}
          {isAppointedInCurrent ? (
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

                {/* Εξήγηση μεταβολής θέσης (π.χ. από #77 σε #73) */}
                {rankGain > 0 && !bypassedLocality && (
                  <div className="text-[10px] text-emerald-400 mt-1 font-mono">
                    ↑ +{rankGain} θέσεις (προηγούμενοι υποψήφιοι δεν δήλωσαν τη θέση ή διορίστηκαν αλλού)
                  </div>
                )}
              </div>

              <div className="text-[11px] mt-2 font-medium">
                {usedLocality ? (
                  <span className="text-amber-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 inline" /> Θέση με χρήση Εντοπιότητας
                  </span>
                ) : (
                  <span className="text-[#00E5FF] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 inline" /> Γενική Σειρά (χωρίς εντοπιότητα)
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
                  Κατάσταση Ειδικότητας
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-slate-300">
                  {isAppointedInOther ? "Επιλαχών εδώ" : "Μη Διοριστέος"}
                </div>
              </div>
              <div className="text-[10px] text-slate-400 mt-2">
                {isAppointedInOther
                  ? "✓ Έχει διοριστεί σε άλλη ειδικότητα"
                  : "Στους πίνακες κατάταξης"}
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

        {/* Επεξήγηση διαφοράς μορίων όταν δεν χρησιμοποιήθηκε η εντοπιότητα */}
        {bypassedLocality && (
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
                  Ανάλυση Μορίων & Σειράς Κατάταξης
                </div>

                <p>
                  Στον αρχικό πίνακα κατάταξης του ΑΣΕΠ εμφανίζεστε στη θέση <strong>#{candidate.aa}</strong> με <strong>{formatVathmologia(rawExcelScore)} μόρια</strong>, 
                  καθώς είχε υπολογιστεί το δυνητικό προνόμιο εντοπιότητας (+{entopBonus} μόρια).
                </p>

                <p>
                  Κατοχυρώσατε τη θέση <strong>#{cleanThesiKod}</strong> στη <strong>Γενική Σειρά</strong> με <strong>{formatVathmologia(actualAppointedScore)} μόρια</strong> (Γραπτός + Προσαυξήσεις), 
                  καθώς στη θέση αυτή δεν απαιτούνταν ούτε εφαρμόστηκε εντοπιότητα.
                </p>

                <div className="pt-2 border-t border-cyan-500/20 text-slate-400 text-[11px] sm:text-xs">
                  💡 <strong>Σειρά Διοριστέων:</strong> Η σειρά #{candidate.appointed_rank || candidate.aa} στη λίστα διοριστέων περιλαμβάνει και θέσεις παραμεθορίου/νησιών που καταλήφθηκαν με χρήση εντοπιότητας.
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 1. ΔΙΑΔΡΟΜΗ ΚΑΤΑΝΟΜΗΣ (Εμφανίζεται μόνο αν έχει προτιμήσεις σε αυτή την ειδικότητα) */}
        <AllocationJourney
          protimiseisStr={candidate.protimiseis}
          thesiDiorismou={isAppointedInCurrent ? candidate.thesi_diorismou : ""}
          candidateScore={isAppointedInCurrent ? actualAppointedScore : candidate.vathmologia}
        />

        {/* === Epilaxontes Tracker (Για μη διοριστέους στη συγκεκριμένη ειδικότητα) === */}
        <EpilaxontesTracker
          isDioristaios={isAppointedInCurrent}
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
                  thesiDiorismou={isAppointedInCurrent ? candidate.thesi_diorismou : ""}
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

        {/* Link προς την ειδικότητα */}
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