"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo , useState } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { useParams } from "next/navigation";
import { formatVathmologia, formatNumber } from "@/lib/utils";

interface Position {
  kod_thesis: string;
  eidikotita: string;
  kod_organogrammatos: string;
  foreas: string;
  foreas_main: string;
  edra: string;
  perifereia: string;
  dimos: string;
  nomos: string;
  titloi: string;
  prosonta: string;
  entopiotita: string;
  theseis: number;
}

interface Candidate {
  am: string;
  eponymo: string;
  onoma: string;
  vathmologia: number | null;
  aa: number;
  eidikotita: string;
  slug: string;
}

interface Stats {
  total: number;
  avg_vath: number | null;
  max_vath: number | null;
  min_vath: number | null;
}

interface ApiResponse {
  position: Position;
  candidates: Candidate[];
  applicants?: any[];
  totalApplicantsCount?: number;
  stats: Stats;
}

export default function PositionPage() {
  const params = useParams();
  const kod = params?.kod as string;

  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState<"appointed" | "applicants">("appointed");
  // States για διεκδικητές (Mobile-friendly Search & Pagination)
  const [applicantSearch, setApplicantFilter] = useState("");
  const [applicantPage, setApplicantPage] = useState(1);
  const PAGE_SIZE = 25; // 25 κάρτες ανά σελίδα - ιδανικό για κινητό!

  useEffect(() => {
    if (!kod) return;
    const cleanKod = String(kod).replace(/\.0$/, "").trim();

    fetch(`/api/position/${cleanKod}`)
      .then((r) => {
        if (r.status === 404) {
          setNotFound(true);
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (d && !d.error) {
          setData(d);
        } else {
          setNotFound(true);
        }
      })
      .catch((e) => {
        console.error(e);
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [kod]);

  // Φιλτράρισμα διεκδικητών με βάση την αναζήτηση
  const filteredApplicants = useMemo(() => {
    if (!data?.applicants) return [];
    if (!applicantSearch.trim()) return data.applicants;

    const q = applicantSearch.toLowerCase().trim();
    return data.applicants.filter((app: any) => {
      const am = String(app.am || "").toLowerCase();
      const ep = String(app.eponymo || "").toLowerCase();
      const on = String(app.onoma || "").toLowerCase();
      return am.includes(q) || ep.includes(q) || on.includes(q);
    });
  }, [data?.applicants, applicantSearch]);

  // Pagination (25 ανά σελίδα)
  const totalPages = Math.ceil(filteredApplicants.length / PAGE_SIZE) || 1;
  const paginatedApplicants = useMemo(() => {
    const start = (applicantPage - 1) * PAGE_SIZE;
    return filteredApplicants.slice(start, start + PAGE_SIZE);
  }, [filteredApplicants, applicantPage]);

  if (loading) {
    return (
      <main className="min-h-screen pt-20 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto flex items-center justify-center text-[#00E5FF]">
        Φόρτωση...
      </main>
    );
  }

  if (notFound || !data || !data.position) {
    return (
      <main className="min-h-screen pt-20 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <h1>Η θέση δεν βρέθηκε</h1>
        <Breadcrumb href="/xartis" label="Χάρτης" />
      </main>
    );
  }

  const { position, candidates, stats } = data;

  // Εξαγωγή ΟΛΩΝ των links HRMS
  const hrmsLinks = position.kod_organogrammatos
    ? position.kod_organogrammatos
        .split(/[\s,;]+/)
        .map((k: string) => k.trim())
        .filter((k: string) => k.length >= 3 && !isNaN(Number(k)))
        .map((id: string, idx: number) => ({
          id,
          num: idx + 1,
          url: `https://hrms.gov.gr/api/public/positions/${id}/job-description`,
        }))
    : [];

  return (
    <main className="min-h-screen pt-20 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
      style={{
        position: "relative",
        zIndex: 1,
      }}
    >
        <Breadcrumb href="/xartis" label="Χάρτης" />

        {/* Header */}
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
            ● Κωδικός Θέσης {position.kod_thesis}
          </div>

          <h1
            className="font-display"
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              fontWeight: 700,
              marginBottom: "1.5rem",
              lineHeight: 1.2,
            }}
          >
            <span className="text-gradient">{position.eidikotita}</span>
          </h1>

          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "1.1rem",
              marginBottom: "3rem",
            }}
          >
            {position.foreas}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
            marginBottom: "3rem",
          }}
        >
          <motion.div
            className="glass"
            style={{ padding: "1.5rem" }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div
              style={{
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--text-muted)",
                marginBottom: "0.5rem",
              }}
            >
              Διορισμένοι
            </div>
            <div
              className="text-gradient"
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {formatNumber(stats.total)}
            </div>
            <div
              style={{
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                marginTop: "4px",
              }}
            >
              από {position.theseis}{" "}
              {position.theseis === 1 ? "θέση" : "θέσεις"}
            </div>
          </motion.div>

          <motion.div
            className="glass"
            style={{ padding: "1.5rem" }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div
              style={{
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--text-muted)",
                marginBottom: "0.5rem",
              }}
            >
              Μέση Βαθμολογία
            </div>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                color: "var(--primary)",
                lineHeight: 1,
              }}
            >
              {formatVathmologia(stats.avg_vath)}
            </div>
          </motion.div>

          <motion.div
            className="glass"
            style={{ padding: "1.5rem" }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div
              style={{
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--text-muted)",
                marginBottom: "0.5rem",
              }}
            >
              Max / Min
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.2 }}>
              <span style={{ color: "var(--success)" }}>
                {formatVathmologia(stats.max_vath)}
              </span>
              <span style={{ color: "var(--text-muted)", margin: "0 8px" }}>
                /
              </span>
              <span style={{ color: "var(--danger)" }}>
                {formatVathmologia(stats.min_vath)}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Details */}
        <motion.div
          className="glass"
          style={{ padding: "2rem", marginBottom: "2rem" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2
            className="font-display"
            style={{
              fontSize: "1.3rem",
              fontWeight: 600,
              marginBottom: "1.5rem",
            }}
          >
            Στοιχεία Θέσης
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginBottom: "4px",
                }}
              >
                Φορέας
              </div>
              <div style={{ fontSize: "0.95rem" }}>{position.foreas}</div>
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
                Έδρα
              </div>
              <div style={{ fontSize: "0.95rem" }}>{position.edra}</div>
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
                Περιφέρεια
              </div>
              <div style={{ fontSize: "0.95rem" }}>{position.perifereia}</div>
            </div>

            {position.dimos && (
              <div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    marginBottom: "4px",
                  }}
                >
                  Δήμος
                </div>
                <div style={{ fontSize: "0.95rem" }}>{position.dimos}</div>
              </div>
            )}

            {position.nomos && (
              <div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    marginBottom: "4px",
                  }}
                >
                  Νομός
                </div>
                <div style={{ fontSize: "0.95rem" }}>{position.nomos}</div>
              </div>
            )}

            <div>
              <div
                style={{
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginBottom: "4px",
                }}
              >
                Εντοπιότητα
              </div>
              <div style={{ fontSize: "0.95rem" }}>
                {position.entopiotita || "—"}
              </div>
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
                Αποδεκτοί Τίτλοι
              </div>
              <div style={{ fontSize: "0.95rem" }}>
                {position.titloi || "—"}
              </div>
            </div>

            {position.prosonta && (
              <div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    marginBottom: "4px",
                  }}
                >
                  Πρόσθετα Προσόντα
                </div>
                <div style={{ fontSize: "0.95rem" }}>{position.prosonta}</div>
              </div>
            )}
          </div>

          {/* Πλήρης λίστα συνδέσμων HRMS για ΟΛΕΣ τις κενές θέσεις */}
          {hrmsLinks.length > 0 && (
            <div
              style={{
                marginTop: "2rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--text-muted)",
                  marginBottom: "0.75rem",
                  fontWeight: 600,
                }}
              >
                Ψηφιακό Οργανόγραμμα Δημόσιας Διοίκησης (HRMS) — {hrmsLinks.length}{" "}
                {hrmsLinks.length === 1 ? "Περιγραφή Θέσης" : "Περιγραφές Θέσεων"}:
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                }}
              >
                {hrmsLinks.map((item: any) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass glass-hover"
                    style={{
                      padding: "8px 14px",
                      borderRadius: "10px",
                      border: "1px solid rgba(0, 229, 255, 0.25)",
                      color: "var(--primary)",
                      textDecoration: "none",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <span>
                      📄 {hrmsLinks.length > 1 ? `Θέση ${item.num} (ID: ${item.id})` : `Περιγραφή Καθηκόντων (ID: ${item.id})`}
                    </span>
                    <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>→</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Candidates & Applicants with 2 Tabs */}
        <motion.div
          className="glass"
          style={{ padding: "2rem" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* Tab Buttons Switcher */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "1.5rem",
              borderBottom: "1px solid var(--border)",
              paddingBottom: "1rem",
            }}
          >
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setActiveTab("appointed")}
                style={{
                  padding: "8px 16px",
                  borderRadius: "10px",
                  border: activeTab === "appointed" ? "1px solid var(--primary)" : "1px solid var(--border)",
                  background: activeTab === "appointed" ? "rgba(0, 229, 255, 0.1)" : "transparent",
                  color: activeTab === "appointed" ? "var(--primary)" : "var(--text-muted)",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                🎯 Διορισθέντες ({candidates.length})
              </button>

              {data.applicants && data.applicants.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab("applicants")}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "10px",
                    border: activeTab === "applicants" ? "1px solid var(--primary)" : "1px solid var(--border)",
                    background: activeTab === "applicants" ? "rgba(0, 229, 255, 0.1)" : "transparent",
                    color: activeTab === "applicants" ? "var(--primary)" : "var(--text-muted)",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  📋 Όλοι οι Διεκδικητές ({data.totalApplicantsCount || data.applicants.length})
                </button>
              )}
            </div>

            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-jetbrains-mono), monospace" }}>
              {activeTab === "appointed" ? "Επιτυχόντες Θέσης" : "Ταξινόμηση κατά Βαθμολογία"}
            </span>
          </div>

          {/* TAB 1: ΜΟΝΟ ΟΙ ΔΙΟΡΙΣΘΕΝΤΕΣ */}
          {activeTab === "appointed" && (
            <div>
              {candidates.length === 0 ? (
                <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem" }}>
                  Κανένας διορισμένος δεν βρέθηκε για αυτή τη θέση (Κενή Θέση).
                </div>
              ) : (
                <div style={{ display: "grid", gap: "0.5rem" }}>
                  {candidates.map((c: any, i: number) => (
                    <Link
                      key={`${c.am}-${i}`}
                      href={`/ypopsifios/${c.am}?slug=${c.slug}`}
                      style={{
                        padding: "12px 16px",
                        borderRadius: "8px",
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid transparent",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        textDecoration: "none",
                        color: "var(--text)",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--primary)";
                        e.currentTarget.style.background = "rgba(0, 229, 255, 0.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "transparent";
                        e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span
                          style={{
                            width: "28px",
                            color: i < 3 ? "var(--primary)" : "var(--text-dim)",
                            fontWeight: 700,
                            fontSize: "0.85rem",
                          }}
                        >
                          #{i + 1}
                        </span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                            {c.eponymo} {c.onoma}
                          </div>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--text-muted)",
                              fontFamily: "var(--font-jetbrains-mono), monospace",
                            }}
                          >
                            Α.Μ. {c.am}
                          </div>
                        </div>
                      </div>
                      <span
                        style={{
                          color: "var(--primary)",
                          fontFamily: "var(--font-jetbrains-mono), monospace",
                          fontWeight: 600,
                        }}
                      >
                        {formatVathmologia(c.vathmologia)}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ΟΛΟΙ ΟΙ ΔΙΕΚΔΙΚΗΤΕΣ */}
          {/* TAB 2: ΟΛΟΙ ΟΙ ΔΙΕΚΔΙΚΗΤΕΣ (Με Search & Pagination) */}
          {activeTab === "applicants" && (
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {/* Mobile Search Box μέσα στους διεκδικητές */}
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: "12px",
                  background: "rgba(10, 14, 26, 0.8)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "0.5rem",
                }}
              >
                <span style={{ fontSize: "0.9rem", opacity: 0.6 }}>🔍</span>
                <input
                  type="text"
                  placeholder="Βρες το Α.Μ. ή Επώνυμό σου στη λίστα..."
                  value={applicantSearch}
                  onChange={(e) => {
                    setApplicantFilter(e.target.value);
                    setApplicantPage(1); // Reset στην 1η σελίδα με κάθε γράμμα
                  }}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    color: "var(--text)",
                    fontSize: "0.85rem",
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                />
                {applicantSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setApplicantFilter("");
                      setApplicantPage(1);
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--text-muted)",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Disclaimer Επεξεργασίας Δεδομένων */}
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  padding: "6px 10px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  lineHeight: 1.4,
                }}
              >
                ⚠️ <em>Σημείωση:</em> Τα στοιχεία προκύπτουν από επεξεργασία των πινάκων του ΑΣΕΠ για στατιστική διευκόλυνση. Εμφανίζονται οι καταγεγραμμένες προτιμήσεις υποψηφίων της ειδικότητας.
              </div>

              {/* Λίστα Διεκδικητών (Paginated 25) */}
              {paginatedApplicants.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  Δεν βρέθηκε υποψήφιος με "{applicantSearch}" στους διεκδικητές.
                </div>
              ) : (
                paginatedApplicants.map((app: any) => {
                  // Η πραγματική σειρά του διεκδικητή στο συνολικό pool
                  const overallRank = data.applicants?.indexOf(app) !== -1 
                    ? (data.applicants?.indexOf(app) ?? 0) + 1 
                    : 1;

                  return (
                    <Link
                      key={`${app.am}-${app.slug}`}
                      href={`/ypopsifios/${app.am}?slug=${app.slug}`}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "10px",
                        background: app.isAppointedHere ? "rgba(0, 255, 163, 0.04)" : "rgba(255,255,255,0.02)",
                        border: app.isAppointedHere ? "1px solid rgba(0, 255, 163, 0.3)" : "1px solid transparent",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        textDecoration: "none",
                        color: "var(--text)",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--primary)";
                        e.currentTarget.style.background = "rgba(0, 229, 255, 0.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = app.isAppointedHere ? "rgba(0, 255, 163, 0.3)" : "transparent";
                        e.currentTarget.style.background = app.isAppointedHere ? "rgba(0, 255, 163, 0.04)" : "rgba(255,255,255,0.02)";
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                        <span
                          style={{
                            width: "34px",
                            color: "var(--text-muted)",
                            fontWeight: 700,
                            fontSize: "0.8rem",
                            fontFamily: "var(--font-jetbrains-mono), monospace",
                            flexShrink: 0,
                          }}
                        >
                          #{overallRank}
                        </span>

                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                              {app.eponymo} {app.onoma}
                            </span>
                            {app.isAppointedHere && (
                              <span
                                style={{
                                  fontSize: "0.65rem",
                                  fontWeight: 700,
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  background: "rgba(0, 255, 163, 0.15)",
                                  color: "var(--success)",
                                  border: "1px solid rgba(0, 255, 163, 0.3)",
                                }}
                              >
                                🎯 Διορίστηκε εδώ
                              </span>
                            )}
                            {app.isAppointedElsewhere && (
                              <span
                                style={{
                                  fontSize: "0.65rem",
                                  fontWeight: 600,
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  background: "rgba(0, 229, 255, 0.1)",
                                  color: "var(--primary)",
                                }}
                              >
                                Διορίστηκε στη Θέση #{app.appointedElsewhereCode}
                              </span>
                            )}
                          </div>

                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
                            Α.Μ. {app.am} • <strong>{app.prefNumber}η Επιλογή</strong>
                          </div>
                        </div>
                      </div>

                      <span
                        style={{
                          color: app.isAppointedHere ? "var(--success)" : "var(--primary)",
                          fontFamily: "var(--font-jetbrains-mono), monospace",
                          fontWeight: 700,
                          fontSize: "0.9rem",
                          flexShrink: 0,
                        }}
                      >
                        {formatVathmologia(app.vathmologia)}
                      </span>
                    </Link>
                  );
                })
              )}

              {/* Pagination Controls για Κινητά */}
              {totalPages > 1 && !applicantSearch && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 6px 4px",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    fontSize: "0.8rem",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setApplicantPage((p) => Math.max(1, p - 1))}
                    disabled={applicantPage === 1}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      background: "rgba(255,255,255,0.03)",
                      color: applicantPage === 1 ? "var(--text-dim)" : "var(--text)",
                      cursor: applicantPage === 1 ? "not-allowed" : "pointer",
                      fontSize: "0.8rem",
                    }}
                  >
                    ← Προηγούμενοι
                  </button>

                  <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                    Σελίδα {applicantPage} από {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() => setApplicantPage((p) => Math.min(totalPages, p + 1))}
                    disabled={applicantPage === totalPages}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      background: "rgba(255,255,255,0.03)",
                      color: applicantPage === totalPages ? "var(--text-dim)" : "var(--text)",
                      cursor: applicantPage === totalPages ? "not-allowed" : "pointer",
                      fontSize: "0.8rem",
                    }}
                  >
                    Επόμενοι →
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
    </main>
  );
}