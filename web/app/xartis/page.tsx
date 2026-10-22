"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import GreeceMap from "@/components/maps/GreeceMap";
import { formatNumber } from "@/lib/utils";
import { Search, MapPin, X } from "lucide-react";

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
  const [areaSearch, setAreaSearch] = useState("");
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

  // Δημιουργία λίστας αναζήτησης περιοχών για instant search
  const searchableAreas = useMemo(() => {
    const map = new Map<string, { label: string; type: string; key: string }>();

    // Περιφέρειες
    Object.entries(REGION_TITLE_MAP).forEach(([key, title]) => {
      map.set(normalize(title), { label: title, type: "Περιφέρεια", key });
    });

    // Πόλεις / Δήμοι
    Object.keys(citiesGeo).forEach((cityName) => {
      map.set(normalize(cityName), { label: cityName, type: "Πόλη / Δήμος", key: cityName });
    });

    // Θέσεις: Δήμοι / Νομοί
    positions.forEach((p) => {
      if (p.dimos && p.dimos.length >= 3) {
        map.set(normalize(p.dimos), { label: `Δήμος ${p.dimos}`, type: "Δήμος", key: p.dimos });
      }
      if (p.nomos && p.nomos.length >= 3) {
        map.set(normalize(p.nomos), { label: `Νομός ${p.nomos}`, type: "Νομός", key: p.nomos });
      }
    });

    return Array.from(map.values());
  }, [citiesGeo, positions]);

  const searchSuggestions = useMemo(() => {
    const q = normalize(areaSearch);
    if (!q || q.length < 2) return [];
    return searchableAreas
      .filter((a) => normalize(a.label).includes(q))
      .slice(0, 6);
  }, [areaSearch, searchableAreas]);

  // Αυστηρό, memoized φιλτράρισμα θέσεων
  const selectedPositions = useMemo(() => {
    if (!selected) return [];

    const selNorm = normalize(selected);
    if (!selNorm || selNorm.length < 3) return [];

    return positions.filter((p) => {
      const pPerifNorm = normalize(p.perifereia || "");
      const pNomosNorm = normalize(p.nomos || "");
      const pDimosNorm = normalize(p.dimos || "");
      const pEdraNorm = normalize(p.edra || "");

      if (PERIFEREIES_MAPPING[selected]) {
        const greekSubRegions = PERIFEREIES_MAPPING[selected];
        return greekSubRegions.some((gn) => {
          const gnNorm = normalize(gn);
          return (
            (pPerifNorm.length >= 3 && (pPerifNorm.includes(gnNorm) || gnNorm.includes(pPerifNorm))) ||
            (pNomosNorm.length >= 3 && (pNomosNorm.includes(gnNorm) || gnNorm.includes(pNomosNorm)))
          );
        });
      }

      const matchesPerif = pPerifNorm.length >= 3 && (pPerifNorm.includes(selNorm) || selNorm.includes(pPerifNorm));
      const matchesNomos = pNomosNorm.length >= 3 && (pNomosNorm.includes(selNorm) || selNorm.includes(pNomosNorm));
      const matchesDimos = pDimosNorm.length >= 3 && (pDimosNorm.includes(selNorm) || selNorm.includes(pDimosNorm));
      const matchesEdra = pEdraNorm.length >= 3 && (pEdraNorm.includes(selNorm) || selNorm.includes(pEdraNorm));

      return matchesPerif || matchesNomos || matchesDimos || matchesEdra;
    });
  }, [selected, positions]);

  const totalTheseis = useMemo(() => {
    return selectedPositions.reduce((sum, p) => sum + (p.theseis || 0), 0);
  }, [selectedPositions]);

  const displayTitle = selected
    ? REGION_TITLE_MAP[selected] || selected.toUpperCase()
    : "";

  if (loading) {
    return (
      <main className="min-h-screen pt-20 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto flex items-center justify-center text-[#00E5FF]">
        Φόρτωση χάρτη...
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-20 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
      style={{
        position: "relative",
        zIndex: 1,
      }}
    >
      <Breadcrumb href="/" label="Επιστροφή στην Αρχική" />

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
            ● Χάρτης Θέσεων & Γεωγραφική Αναζήτηση
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
            Αναζητήστε άμεσα έναν δήμο/πόλη ή πατήστε σε μια περιφέρεια του χάρτη για να δείτε τις θέσεις.
          </p>
        </motion.div>

        {/* ON-THE-FLY LOCATION SEARCH BAR */}
        <div style={{ position: "relative", maxWidth: "550px", marginBottom: "1.5rem" }}>
          <div style={{ position: "relative" }}>
            <Search
              style={{
                position: "absolute",
                left: "14px",
                top: "14px",
                width: "18px",
                height: "18px",
                color: "var(--text-muted)",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              placeholder="Αναζήτηση περιοχής (π.χ. Κοζάνη, Χανιά, Έβρος, Λάρισα)..."
              value={areaSearch}
              onChange={(e) => setAreaSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 40px 12px 42px",
                borderRadius: "12px",
                background: "rgba(10, 14, 26, 0.9)",
                border: "1px solid var(--border)",
                color: "#fff",
                fontSize: "0.9rem",
                outline: "none",
              }}
            />
            {areaSearch && (
              <button
                type="button"
                onClick={() => setAreaSearch("")}
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "14px",
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                }}
              >
                <X style={{ width: "16px", height: "16px" }} />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {searchSuggestions.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                marginTop: "8px",
                background: "rgba(10, 14, 26, 0.98)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                overflow: "hidden",
                zIndex: 30,
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              }}
            >
              {searchSuggestions.map((item) => (
                <button
                  key={`${item.type}-${item.key}`}
                  type="button"
                  onClick={() => {
                    handleSelect(item.key);
                    setAreaSearch("");
                  }}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    cursor: "pointer",
                    textAlign: "left",
                    color: "var(--text)",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(0, 229, 255, 0.08)";
                    e.currentTarget.style.color = "var(--primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--text)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <MapPin style={{ width: "14px", height: "14px", color: "var(--primary)" }} />
                    <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{item.label}</span>
                  </div>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--text-muted)",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      background: "rgba(255,255,255,0.05)",
                    }}
                  >
                    {item.type}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

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
          <AnimatePresence>
            {selected && (
              <motion.div
                key={selected}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="glass"
                style={{
                  padding: "1.75rem",
                  marginTop: "2rem",
                  borderRadius: "20px",
                  border: "1px solid rgba(0, 229, 255, 0.2)",
                  background: "rgba(10, 14, 26, 0.95)",
                }}
              >
                {/* Header περιοχής */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "1rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  <div>
                    <h2
                      className="font-display"
                      style={{
                        fontSize: "clamp(1.4rem, 2.5vw, 1.85rem)",
                        fontWeight: 700,
                        marginBottom: "0.25rem",
                        textTransform: "uppercase",
                      }}
                    >
                      <span className="text-gradient">
                        {displayTitle
                          .normalize("NFD")
                          .replace(/[\u0300-\u036f]/g, "")}
                      </span>
                    </h2>
                    <p
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.9rem",
                      }}
                    >
                      {formatNumber(selectedPositions.length)} κωδικοί θέσεων ·{" "}
                      {formatNumber(totalTheseis)} καλυφθείσες θέσεις
                    </p>
                  </div>

                  <button
                    onClick={() => setSelected(null)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "10px",
                      border: "1px solid var(--border)",
                      background: "rgba(255,255,255,0.03)",
                      color: "var(--text-muted)",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#fff";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--text-muted)";
                      e.currentTarget.style.borderColor = "var(--border)";
                    }}
                  >
                    ✕ Κλείσιμο
                  </button>
                </div>

                {/* Subtle Callout για Κενές Θέσεις της περιοχής */}
                <div
                  style={{
                    marginBottom: "1.25rem",
                    padding: "10px 14px",
                    borderRadius: "12px",
                    background: "rgba(245, 158, 11, 0.06)",
                    border: "1px solid rgba(245, 158, 11, 0.25)",
                    fontSize: "0.8rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <span style={{ color: "#FBBF24" }}>
                    💡 <em>Σημείωση:</em> Ενδέχεται να υπάρχουν και θέσεις στην περιοχή που έμειναν κενές (0 διορισμοί).
                  </span>
                  <Link
                    href="/kenes-theseis"
                    style={{
                      color: "#00E5FF",
                      textDecoration: "none",
                      fontWeight: 600,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                  >
                    Ακτινογραφία Κενών Θέσεων →
                  </Link>
                </div>

                {/* Λίστα θέσεων (Χωρίς οριζόντια scrollbar & με καθαρό wrapping) */}
                <div
                  style={{
                    display: "grid",
                    gap: "0.75rem",
                    maxHeight: "550px",
                    overflowY: "auto",
                    paddingRight: "6px",
                  }}
                >
                  {selectedPositions.slice(0, 50).map((p, i) => (
                    <Link
                      key={`${p.kod_thesis}-${i}`}
                      href={`/thesi/${p.kod_thesis}`}
                      style={{
                        padding: "14px 18px",
                        borderRadius: "12px",
                        background: "rgba(10, 14, 26, 0.6)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "1.25rem",
                        textDecoration: "none",
                        color: "var(--text)",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#00E5FF";
                        e.currentTarget.style.background = "rgba(0, 229, 255, 0.04)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                        e.currentTarget.style.background = "rgba(10, 14, 26, 0.6)";
                      }}
                    >
                      {/* Φορέας & Ειδικότητα με σωστό wrapping */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            marginBottom: "4px",
                            color: "#FFFFFF",
                            lineHeight: 1.35,
                            wordBreak: "break-word",
                          }}
                        >
                          {p.foreas}
                        </div>
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "var(--text-muted)",
                            lineHeight: 1.3,
                            wordBreak: "break-word",
                          }}
                        >
                          {p.eidikotita}
                        </div>
                      </div>

                      {/* Κωδικός θέσης & πλήθος */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: "2px",
                          flexShrink: 0,
                        }}
                      >
                        <div
                          style={{
                            color: "#00E5FF",
                            fontFamily: "var(--font-jetbrains-mono), monospace",
                            fontWeight: 700,
                            fontSize: "0.95rem",
                          }}
                        >
                          #{p.kod_thesis}
                        </div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {p.theseis} {p.theseis === 1 ? "θέση" : "θέσεις"}
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
                        fontSize: "0.85rem",
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
                        fontSize: "0.9rem",
                      }}
                    >
                      Δεν βρέθηκαν καλυφθείσες θέσεις για αυτή την επιλογή. Ελέγξτε τις{" "}
                      <Link href="/kenes-theseis" style={{ color: "#00E5FF" }}>
                        Κενές Θέσεις
                      </Link>
                      .
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