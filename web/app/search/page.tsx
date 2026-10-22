"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { Building2, ArrowRight } from "lucide-react";

interface Result {
  am: string;
  slug: string;
  aa: number;
  eponymo: string;
  onoma: string;
  patronymo?: string;
  thesi_diorismou?: string | null;
  specialties?: string[];
}

interface MatchedPosition {
  kod_thesis: string;
  foreas: string;
  eidikotita: string;
  perifereia?: string;
  theseis?: number;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [matchedPositions, setMatchedPositions] = useState<MatchedPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const quickFilters = [
    { label: "Θέση 1523", value: "1523" },
    { label: "Α.Μ. 13448", value: "13448" },
    { label: "ΠΑΠΑΓΙΑΝΝΟΠΟΥΛΟΥ", value: "ΠΑΠΑΓΙΑΝΝΟΠΟΥΛΟΥ" },
  ];

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setMatchedPositions([]);
      setSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
        setMatchedPositions(data.matchedPositions || []);
        setSearched(true);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "120px 24px 80px",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Breadcrumb href="/" label="Επιστροφή στην Αρχική" />

          <h1
            className="font-display"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            <span className="text-gradient">Αναζήτηση</span>
          </h1>

          <p
            style={{
              color: "var(--text-muted)",
              marginBottom: "2rem",
              fontSize: "1.1rem",
            }}
          >
            Ψάξε με Α.Μ. αίτησης, Επώνυμο ή <strong>Κωδικό Θέσης</strong> (π.χ. 1523).
          </p>

          <div
            className="glass"
            style={{
              padding: "4px",
              marginBottom: "2rem",
            }}
          >
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Επώνυμο, Α.Μ. ή Κωδ. Θέσης..."
              style={{
                width: "100%",
                padding: "20px 24px",
                fontSize: "1.1rem",
                background: "transparent",
                border: "none",
                color: "var(--text)",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
          </div>

          {!query && (
            <div className="mb-6 flex flex-wrap gap-2" aria-label="Γρήγορες αναζητήσεις">
              {quickFilters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setQuery(filter.value)}
                  className="min-h-11 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-200 transition-colors hover:border-cyan-400 hover:text-white"
                >
                  {filter.label}
                </button>
              ))}
            </div>
          )}

          {loading && (
            <div
              style={{
                color: "var(--primary)",
                textAlign: "center",
                padding: "2rem",
              }}
            >
              Αναζήτηση...
            </div>
          )}

          {/* 1. ΕΜΦΑΝΙΣΗ ΘΕΣΕΩΝ ΑΝ ΒΡΕΘΗΚΑΝ ΚΩΔΙΚΟΙ ΘΕΣΗΣ */}
          {!loading && matchedPositions.length > 0 && (
            <div style={{ marginBottom: "2rem", display: "grid", gap: "0.75rem" }}>
              <div
                style={{
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--primary)",
                  fontWeight: 600,
                }}
              >
                Θέσεις Προκήρυξης με κωδικό "#{query}":
              </div>

              {matchedPositions.map((pos) => (
                <Link
                  key={pos.kod_thesis}
                  href={`/thesi/${pos.kod_thesis}`}
                  className="glass glass-hover"
                  style={{
                    padding: "1.25rem 1.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    textDecoration: "none",
                    color: "var(--text)",
                    borderRadius: "14px",
                    border: "1px solid rgba(0, 229, 255, 0.3)",
                    background: "rgba(0, 229, 255, 0.03)",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0, paddingRight: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-jetbrains-mono), monospace",
                          fontWeight: 700,
                          fontSize: "1.1rem",
                          color: "var(--primary)",
                        }}
                      >
                        Θέση #{pos.kod_thesis}
                      </span>
                      <span style={{ fontSize: "0.9rem", color: "#fff", fontWeight: 600 }}>
                        • {pos.foreas}
                      </span>
                    </div>

                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      {pos.eidikotita} {pos.perifereia ? `(${pos.perifereia})` : ""}
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--primary)",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      flexShrink: 0,
                    }}
                  >
                    Προβολή Θέσης →
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* ΜΗΝΥΜΑ ΑΝ ΔΕΝ ΒΡΕΘΗΚΕ ΤΙΠΟΤΑ */}
          {!loading && searched && results.length === 0 && matchedPositions.length === 0 && (
            <div
              className="glass"
              style={{
                padding: "2rem",
                textAlign: "center",
                color: "var(--text-muted)",
              }}
            >
              Δεν βρέθηκαν αποτελέσματα για "{query}"
            </div>
          )}

          {/* 2. ΕΜΦΑΝΙΣΗ ΥΠΟΨΗΦΙΩΝ */}
          {!loading && results.length > 0 && (
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {matchedPositions.length > 0 && (
                <div
                  style={{
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--text-muted)",
                    fontWeight: 600,
                    marginTop: "0.5rem",
                  }}
                >
                  Υποψήφιοι:
                </div>
              )}

              {results.map((r, i) => {
                const cleanAm = String(r.am).replace(/\.0$/, "").trim();

                return (
                  <motion.div
                    key={`${cleanAm}-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <Link
                      href={`/ypopsifios/${cleanAm}${r.slug ? `?slug=${r.slug}` : ""}`}
                      className="glass glass-hover"
                      style={{
                        padding: "1.25rem 1.5rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        textDecoration: "none",
                        color: "var(--text)",
                        borderRadius: "14px",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0, paddingRight: "16px" }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: "1.1rem",
                            color: "#fff",
                            marginBottom: "4px",
                          }}
                        >
                          {r.eponymo} {r.onoma}
                        </div>

                        <div
                          style={{
                            fontSize: "0.85rem",
                            color: "var(--text-muted)",
                            fontFamily: "var(--font-jetbrains-mono), monospace",
                            display: "flex",
                            gap: "8px",
                            alignItems: "center",
                            marginBottom: "8px",
                          }}
                        >
                          <span>Α.Μ. {cleanAm}</span>
                          {r.patronymo && <span>• {r.patronymo}</span>}
                        </div>

                        {/* Ελληνικά Badges Ειδικοτήτων */}
                        {r.specialties && r.specialties.length > 0 && (
                          <div
                            style={{
                              display: "flex",
                              gap: "6px",
                              flexWrap: "wrap",
                            }}
                          >
                            {r.specialties.map((s, idx) => (
                              <span
                                key={idx}
                                style={{
                                  fontSize: "0.75rem",
                                  padding: "3px 8px",
                                  borderRadius: "6px",
                                  background: "rgba(0, 229, 255, 0.08)",
                                  color: "var(--primary)",
                                  border: "1px solid rgba(0, 229, 255, 0.2)",
                                  fontWeight: 500,
                                }}
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div
                        style={{
                          color: "var(--primary)",
                          fontSize: "1.4rem",
                          flexShrink: 0,
                        }}
                      >
                        →
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}

          {!searched && query.length < 2 && (
            <div
              style={{
                color: "var(--text-dim)",
                textAlign: "center",
                padding: "3rem 1rem",
                fontSize: "0.95rem",
              }}
            >
              Πληκτρολόγησε τουλάχιστον 2 χαρακτήρες για αναζήτηση.
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}