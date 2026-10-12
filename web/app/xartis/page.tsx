"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import GreeceMap from "@/components/maps/GreeceMap";
import { formatNumber } from "@/lib/utils";

// Mapping GeoJSON names → ελληνικές περιφέρειες
// (ίδιο με το GreeceMap component)
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

  // Φιλτράρουμε τις θέσεις με βάση την επιλεγμένη περιφέρεια
  const selectedPositions = selected
    ? positions.filter((p) => {
        const greekNames = PERIFEREIES_MAPPING[selected] || [];
        return greekNames.some(
          (gn) =>
            normalize(p.perifereia || "").includes(normalize(gn)) ||
            normalize(gn).includes(normalize(p.perifereia || ""))
        );
      })
    : [];

  const totalTheseis = selectedPositions.reduce(
    (sum, p) => sum + (p.theseis || 0),
    0
  );

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
            Πάτησε σε μια περιφέρεια για να δεις τις θέσεις που προκηρύχθηκαν.
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
            onSelectPerifereia={setSelected}
          />
        </motion.div>

        {/* Selected region details */}
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
                    <span className="text-gradient">
                      {PERIFEREIES_MAPPING[selected]?.[0] ||
                        selected.toUpperCase()}
                    </span>
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
                    Δεν βρέθηκαν θέσεις για αυτή την περιφέρεια.
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}