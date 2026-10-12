"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { formatNumber, formatVathmologia } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
} from "recharts";

interface Data {
  slug: string;
  stats: {
    count: number;
    dioristoi: number;
    pososto: number;
    min_vath: number;
    max_vath: number;
    avg_vath: number;
    me_metaptyxiako: number;
    me_didaktoriko: number;
    me_entopiotita: number;
  };
  distribution: Record<string, number>;
  entopiotita: Record<string, number>;
  theseis: { kod: string; count: number }[];
  topDioristoi: any[];
  titloi: {
    metaptyxiako: number;
    didaktoriko: number;
    xeni_glossa: number;
    empeiria: number;
  };
  totalRecords: number;
}

const COLORS = ["#00E5FF", "#FF006E", "#00FFA3", "#FFB800", "#7A8499"];

function StatBox({
  label,
  value,
  highlight = false,
  suffix = "",
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
  suffix?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass"
      style={{ padding: "1.25rem" }}
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
        {label}
      </div>
      <div
        className={highlight ? "text-gradient" : ""}
        style={{
          fontSize: "1.75rem",
          fontWeight: 700,
          color: highlight ? undefined : "var(--text)",
          lineHeight: 1.2,
        }}
      >
        {value}
        {suffix}
      </div>
    </motion.div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      style={{
        background: "rgba(10, 14, 26, 0.95)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "10px 14px",
        fontSize: "0.85rem",
      }}
    >
      <div style={{ color: "var(--text-muted)", marginBottom: "4px" }}>
        {label}
      </div>
      <div style={{ color: "var(--primary)", fontWeight: 700 }}>
        {formatNumber(payload[0].value)} υποψήφιοι
      </div>
    </div>
  );
}

export default function EidikotitaPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/eidikotita?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

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
        Φόρτωση...
      </main>
    );
  }

  if (!data || !data.stats) {
    return (
      <main style={{ minHeight: "100vh", padding: "120px 24px" }}>
        <h1>Δεν βρέθηκε</h1>
        <Link href="/" style={{ color: "var(--primary)" }}>
          ← Πίσω
        </Link>
      </main>
    );
  }

  const distData = Object.entries(data.distribution)
    .map(([label, count]) => ({ label, count }))
    .filter((d) => d.count > 0);

  const entopData = Object.entries(data.entopiotita)
    .map(([label, value]) => ({ name: label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "120px 24px 80px",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
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
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
              fontWeight: 700,
              marginBottom: "0.5rem",
            }}
          >
            <span className="text-gradient">{data.stats.count.toLocaleString("el-GR")} υποψήφιοι</span>
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              marginBottom: "3rem",
              fontSize: "1.05rem",
              maxWidth: "800px",
            }}
          >
            {slug.replace(/-/g, " ").toUpperCase()}
          </p>
        </motion.div>

        {/* KPI Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
            marginBottom: "3rem",
          }}
        >
          <StatBox
            label="Διοριστέοι"
            value={formatNumber(data.stats.dioristoi)}
            highlight
          />
          <StatBox
            label="Ποσοστό"
            value={data.stats.pososto.toFixed(1).replace(".", ",")}
            suffix="%"
          />
          <StatBox
            label="Μέση Βαθμολογία"
            value={formatVathmologia(data.stats.avg_vath)}
          />
          <StatBox
            label="Max"
            value={formatVathmologia(data.stats.max_vath)}
          />
          <StatBox
            label="Min"
            value={formatVathmologia(data.stats.min_vath)}
          />
        </div>

        {/* Charts Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "1.5rem",
            marginBottom: "3rem",
          }}
        >
          {/* Κατανομή Βαθμολογίας */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass"
            style={{ padding: "1.5rem", height: "400px" }}
          >
            <h3
              style={{
                marginBottom: "1rem",
                fontSize: "1.1rem",
                fontWeight: 600,
              }}
            >
              Κατανομή Βαθμολογίας
            </h3>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={distData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="label"
                  stroke="var(--text-muted)"
                  fontSize={11}
                />
                <YAxis stroke="var(--text-muted)" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Εντοπιότητα */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass"
            style={{ padding: "1.5rem", height: "400px" }}
          >
            <h3
              style={{
                marginBottom: "1rem",
                fontSize: "1.1rem",
                fontWeight: 600,
              }}
            >
              Κατανομή Εντοπιότητας
            </h3>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={entopData.map((d, i) => ({
                    ...d,
                    fill: COLORS[i % COLORS.length],
                  }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={110}
                  paddingAngle={4}
                  label={(entry: any) => `${entry.name}: ${entry.value}`}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(10, 14, 26, 0.95)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Τίτλοι Σπουδών */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass"
          style={{ padding: "1.5rem", marginBottom: "3rem" }}
        >
          <h3
            style={{
              marginBottom: "1.5rem",
              fontSize: "1.1rem",
              fontWeight: 600,
            }}
          >
            Τίτλοι & Προσόντα
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "1rem",
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
                Με Μεταπτυχιακό
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                {formatNumber(data.titloi.metaptyxiako)}
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
                Με Διδακτορικό
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                {formatNumber(data.titloi.didaktoriko)}
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
                Με Ξένη Γλώσσα
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                {formatNumber(data.titloi.xeni_glossa)}
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
                Με Εμπειρία
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                {formatNumber(data.titloi.empeiria)}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Top Διοριστέοι */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass"
          style={{ padding: "1.5rem", marginBottom: "3rem" }}
        >
          <h3
            style={{
              marginBottom: "1.5rem",
              fontSize: "1.1rem",
              fontWeight: 600,
            }}
          >
            Top 20 Διοριστέοι
          </h3>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {data.topDioristoi.map((c, i) => (
              <Link
                key={`${c.am}-${i}`}
                href={`/ypopsifios/${c.am}?slug=${data.slug}`}
                className="glass-hover"
                style={{
                  padding: "10px 14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  textDecoration: "none",
                  color: "var(--text)",
                  border: "1px solid transparent",
                  borderRadius: "8px",
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
                  <span>{c.eponymo} {c.onoma}</span>
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
        </motion.div>

        {/* Top Κωδικοί Θέσεων */}
        {data.theseis.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass"
            style={{ padding: "1.5rem" }}
          >
            <h3
              style={{
                marginBottom: "1.5rem",
                fontSize: "1.1rem",
                fontWeight: 600,
              }}
            >
              Top Κωδικοί Θέσεων
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                gap: "0.5rem",
              }}
            >
              {data.theseis.map((t) => (
                <div
                  key={t.kod}
                  style={{
                    padding: "10px 14px",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                  }}
                >
                  <div
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.7rem",
                      marginBottom: "4px",
                    }}
                  >
                    Κωδικός
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{t.kod}</span>
                    <span style={{ color: "var(--primary)" }}>{t.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}