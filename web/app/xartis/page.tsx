"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import GreeceMap from "@/components/maps/GreeceMap";
import { formatNumber } from "@/lib/utils";

// Mapping GeoJSON names → ελληνικές περιφέρειες
const PERIFEREIES_MAPPING: Record<string, string[]> = {
  Attiki: [
    "ΚΕΝΤΡΙΚΟΥ ΤΟΜΕΑ ΑΘΗΝΩΝ",
    "ΒΟΡΕΙΟΥ ΤΟΜΕΑ ΑΘΗΝΩΝ",
    "ΝΟΤΙΟΥ ΤΟΜΕΑ ΑΘΗΝΩΝ",
    "ΔΥΤΙΚΟΥ ΤΟΜΕΑ ΑΘΗΝΩΝ",
    "ΑΝΑΤΟΛΙΚΗΣ ΑΤΤΙΚΗΣ",
    "ΔΥΤΙΚΗΣ ΑΤΤΙΚΗΣ",
    "ΠΕΙΡΑΙΩΣ",
  ],
  "Kentriki Makedonia": [
    "ΘΕΣΣΑΛΟΝΙΚΗΣ",
    "ΗΜΑΘΙΑΣ",
    "ΚΙΛΚΙΣ",
    "ΠΕΛΛΑΣ",
    "ΠΙΕΡΙΑΣ",
    "ΣΕΡΡΩΝ",
    "ΧΑΛΚΙΔΙΚΗΣ",
  ],
  "Dytiki Makedonia": ["ΓΡΕΒΕΝΩΝ", "ΚΑΣΤΟΡΙΑΣ", "ΚΟΖΑΝΗΣ", "ΦΛΩΡΙΝΑΣ"],
  "Anatoliki Makedonia kai Thraki": [
    "ΔΡΑΜΑΣ",
    "ΕΒΡΟΥ",
    "ΚΑΒΑΛΑΣ",
    "ΞΑΝΘΗΣ",
    "ΡΟΔΟΠΗΣ",
  ],
  Ipeiros: ["ΑΡΤΑΣ", "ΘΕΣΠΡΩΤΙΑΣ", "ΙΩΑΝΝΙΝΩΝ", "ΠΡΕΒΕΖΑΣ"],
  Thessalia: ["ΚΑΡΔΙΤΣΑΣ", "ΛΑΡΙΣΑΣ", "ΜΑΓΝΗΣΙΑΣ", "ΤΡΙΚΑΛΩΝ", "ΣΠΟΡΑΔΩΝ"],
  "Ionioi Nisoi": ["ΖΑΚΥΝΘΟΥ", "ΚΕΡΚΥΡΑΣ", "ΚΕΦΑΛΛΗΝΙΑΣ", "ΛΕΥΚΑΔΑΣ", "ΙΘΑΚΗΣ"],
  "Dytiki Ellada": ["ΑΙΤΩΛΟΑΚΑΡΝΑΝΙΑΣ", "ΑΧΑΪΑΣ", "ΗΛΕΙΑΣ"],
  "Stereá Elláda": ["ΒΟΙΩΤΙΑΣ", "ΕΥΒΟΙΑΣ", "ΕΥΡΥΤΑΝΙΑΣ", "ΦΘΙΩΤΙΔΑΣ", "ΦΩΚΙΔΑΣ"],
  Peloponnisos: ["ΑΡΓΟΛΙΔΑΣ", "ΑΡΚΑΔΙΑΣ", "ΚΟΡΙΝΘΙΑΣ", "ΛΑΚΩΝΙΑΣ", "ΜΕΣΣΗΝΙΑΣ"],
  "Voreio Aigaio": ["ΛΕΣΒΟΥ", "ΣΑΜΟΥ", "ΧΙΟΥ"],
  "Notio Aigaio": ["ΚΥΚΛΑΔΩΝ", "ΔΩΔΕΚΑΝΗΣΟΥ"],
  Kriti: ["ΗΡΑΚΛΕΙΟΥ", "ΛΑΣΙΘΙΟΥ", "ΡΕΘΥΜΝΗΣ", "ΧΑΝΙΩΝ"],
};

// Επίσημα Ελληνικά Ονόματα Περιφερειών για τον τίτλο
const REGION_TITLE_MAP: Record<string, string> = {
  Attiki: "ΠΕΡΙΦΕΡΕΙΑ ΑΤΤΙΚΗΣ",
  "Kentriki Makedonia": "ΚΕΝΤΡΙΚΗ ΜΑΚΕΔΟΝΙΑ",
  "Dytiki Makedonia": "ΔΥΤΙΚΗ ΜΑΚΕΔΟΝΙΑ",
  "Anatoliki Makedonia kai Thraki": "ΑΝΑΤΟΛΙΚΗ ΜΑΚΕΔΟΝΙΑ & ΘΡΑΚΗ",
  Ipeiros: "ΗΠΕΙΡΟΣ",
  Thessalia: "ΘΕΣΣΑΛΙΑ",
  "Ionioi Nisoi": "ΙΟΝΙΑ ΝΗΣΙΑ",
  "Dytiki Ellada": "ΔΥΤΙΚΗ ΕΛΛΑΔΑ",
  "Stereá Elláda": "ΣΤΕΡΕΑ ΕΛΛΑΔΑ",
  Peloponnisos: "ΠΕΛΟΠΟΝΝΗΣΟΣ",
  "Voreio Aigaio": "ΒΟΡΕΙΟ ΑΙΓΑΙΟ",
  "Notio Aigaio": "ΝΟΤΙΟ ΑΙΓΑΙΟ",
  Kriti: "ΚΡΗΤΗ",
};

function normalize(text: string): string {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export default function XartisPage() {
  const [positions, setPositions] = useState<any[]>([]);
  const [citiesGeo, setCitiesGeo] = useState<Record<string, any>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      fetch("/data/positions.json").then((r) => r.json()),
      fetch("/data/cities-geo.json").then((r) => r.json()),
    ])
      .then(([pos, cities]) => {
        setPositions(pos);
        setCitiesGeo(cities);
      })
      .catch((e) => console.error("Load error:", e))
      .finally(() => setLoading(false));
  }, []);

  function handleSelect(region: string) {
    setSelected(region);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  }

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
        Φόρτωση χάρτη...
      </main>
    );
  }

  // Έξυπνο φιλτράρισμα: είτε επιλέχθηκε Περιφέρεια (GeoJSON key) είτε συγκεκριμένη Πόλη/Κύκλος
  const selectedPositions = selected
    ? positions.filter((p) => {
        const selNorm = normalize(selected);
        const pPerifNorm = normalize(p.perifereia || "");
        const pEdraNorm = normalize(p.edra || "");
        const pDimosNorm = normalize(p.dimos || "");
        const pNomosNorm = normalize(p.nomos || "");

        // 1. Έλεγχος αν είναι Περιφέρεια από το PERIFEREIES_MAPPING
        if (PERIFEREIES_MAPPING[selected]) {
          const greekSubRegions = PERIFEREIES_MAPPING[selected];
          return greekSubRegions.some((gn) => {
            const gnNorm = normalize(gn);
            return (
              pPerifNorm.includes(gnNorm) ||
              gnNorm.includes(pPerifNorm) ||
              pNomosNorm.includes(gnNorm) ||
              pEdraNorm.includes(gnNorm)
            );
          });
        }

        // 2. Έλεγχος αν είναι Click σε Κύκλο/Πόλη (π.χ. "ΧΑΝΙΩΝ")
        return (
          pPerifNorm.includes(selNorm) ||
          selNorm.includes(pPerifNorm) ||
          pNomosNorm.includes(selNorm) ||
          selNorm.includes(pNomosNorm) ||
          pEdraNorm.includes(selNorm) ||
          selNorm.includes(pEdraNorm) ||
          pDimosNorm.includes(selNorm) ||
          selNorm.includes(pDimosNorm)
        );
      })
    : [];

  const totalTheseis = selectedPositions.reduce(
    (sum, p) => sum + (p.theseis || 0),
    0
  );

  // Σωστός τίτλος: Ελληνικό όνομα περιφέρειας ή όνομα πόλης
  const displayTitle = selected
    ? REGION_TITLE_MAP[selected] || selected.toUpperCase()
    : "";

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "120px 24px 80px",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <Link
          href="/"
          style={{
            color: "var(--text-muted)",
            textDecoration: "none",
            fontSize: "0.9rem",
            display: "inline-block",
            marginBottom: "2rem",
          }}
        >
          ← Πίσω
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "6px 16px",
              borderRadius: "100px",
              border: "1px solid var(--border)",
              background: "rgba(0, 229, 255, 0.05)",
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--primary)",
              marginBottom: "1.5rem",
            }}
          >
            ● Χάρτης Θέσεων
          </div>

          <h1
            className="font-display"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            <span className="text-gradient">Χάρτης</span> Ελλάδας
          </h1>

          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "1.1rem",
              marginBottom: "2rem",
              maxWidth: "700px",
            }}
          >
            Πάτησε σε μια περιφέρεια ή σε έναν κύκλο πόλης για να δεις τις θέσεις που προκηρύχθηκαν.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GreeceMap
            positions={positions}
            citiesGeo={citiesGeo}
            onSelectPerifereia={handleSelect}
          />
        </motion.div>

        {/* Selected region details container with smooth scroll ref */}
        <div ref={resultsRef} style={{ scrollMarginTop: "100px" }}>
          <AnimatePresence mode="wait">
            {selected && (
              <motion.div
                key={selected}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="glass"
                style={{ padding: "2rem", marginTop: "2rem" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "1rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div>
                    <h2
                      className="font-display"
                      style={{
                        fontSize: "1.75rem",
                        fontWeight: 700,
                        marginBottom: "0.5rem",
                      }}
                    >
                      <span className="text-gradient">{displayTitle}</span>
                    </h2>
                    <p
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.95rem",
                      }}
                    >
                      {formatNumber(selectedPositions.length)} κωδικοί θέσεων ·{" "}
                      {formatNumber(totalTheseis)} συνολικές θέσεις
                    </p>
                  </div>

                  <button
                    onClick={() => setSelected(null)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      background: "transparent",
                      color: "var(--text-muted)",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    ✕ Κλείσιμο
                  </button>
                </div>

                {/* Λίστα θέσεων */}
                <div
                  style={{
                    display: "grid",
                    gap: "0.75rem",
                    maxHeight: "600px",
                    overflowY: "auto",
                    paddingRight: "8px",
                  }}
                >
                  {selectedPositions.slice(0, 50).map((p, i) => (
                    <Link
                      key={`${p.kod_thesis}-${i}`}
                      href={`/thesi/${p.kod_thesis}`}
                      style={{
                        padding: "14px 18px",
                        borderRadius: "10px",
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid transparent",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "1rem",
                        textDecoration: "none",
                        color: "var(--text)",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--primary)";
                        e.currentTarget.style.background =
                          "rgba(0, 229, 255, 0.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "transparent";
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.02)";
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: "0.95rem",
                            marginBottom: "4px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {p.foreas}
                        </div>
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "var(--text-muted)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {p.eidikotita}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: "4px",
                          flexShrink: 0,
                        }}
                      >
                        <div
                          style={{
                            color: "var(--primary)",
                            fontFamily:
                              "var(--font-jetbrains-mono), monospace",
                            fontWeight: 600,
                            fontSize: "0.9rem",
                          }}
                        >
                          #{p.kod_thesis}
                        </div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          {p.theseis}{" "}
                          {p.theseis === 1 ? "θέση" : "θέσεις"}
                        </div>
                      </div>
                    </Link>
                  ))}

                  {selectedPositions.length > 50 && (
                    <div
                      style={{
                        textAlign: "center",
                        color: "var(--text-muted)",
                        padding: "1rem",
                        fontSize: "0.9rem",
                      }}
                    >
                      ... και άλλες {selectedPositions.length - 50} θέσεις
                    </div>
                  )}

                  {selectedPositions.length === 0 && (
                    <div
                      style={{
                        textAlign: "center",
                        color: "var(--text-muted)",
                        padding: "2rem",
                      }}
                    >
                      Δεν βρέθηκαν θέσεις για αυτή την επιλογή.
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}