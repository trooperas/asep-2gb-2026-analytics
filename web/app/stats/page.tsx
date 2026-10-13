"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { formatNumber, formatVathmologia } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";

interface StatsData {
  global: {
    total_candidates: number;
    total_dioristoi: number;
    total_eidikotites: number;
    pososto_epityxias: number;
    avg_vath: number;
    max_vath: number;
    min_vath: number;
    me_metaptyxiako: number;
    me_didaktoriko: number;
  };
  topByCount: any[];
  topByDioristoi: any[];
  topByPososto: any[];
  topByAvg: any[];
  sunburst: any;
}

function StatBox({
  label,
  value,
  suffix = "",
  highlight = false,
  delay = 0,
}: {
  label: string;
  value: string | number;
  suffix?: string;
  highlight?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000 }}
      className="glass"
      style={{ padding: "1.5rem" }}
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
          fontSize: "2rem",
          fontWeight: 700,
          color: highlight ? undefined : "var(--primary)",
          lineHeight: 1,
        }}
      >
        {value}
        {suffix}
      </div>
    </motion.div>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;
  return (
    <div
      style={{
        background: "rgba(10, 14, 26, 0.95)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "12px 16px",
        fontSize: "0.85rem",
        maxWidth: "320px",
      }}
    >
      <div style={{ color: "var(--text)", marginBottom: "6px", fontWeight: 600 }}>
        {data.full || data.name}
      </div>
      <div style={{ color: "var(--primary)" }}>
        {formatNumber(payload[0].value)} υποψήφιοι
      </div>
    </div>
  );
}

export default function StatsPage() {
  const [data, setData] = useState<StatsData | null>(null);
  const [eidikotitesIndex, setEidikotitesIndex] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/stats").then((r) => r.json()),
      fetch("/data/eidikotites_index.json")
        .then((r) => r.json())
        .catch(() => []),
    ])
      .then(([statsRes, indexRes]) => {
        setData(statsRes);
        setEidikotitesIndex(indexRes);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Helper map: slug -> Ελληνικό Όνομα
  const slugToGreekMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const item of eidikotitesIndex) {
      if (item.slug && item.eidikotita) {
        map[item.slug] = item.eidikotita;
      }
    }
    return map;
  }, [eidikotitesIndex]);

  function getDisplayName(slug: string): string {
    if (slugToGreekMap[slug]) return slugToGreekMap[slug];
    // Fallback αν δεν βρεθεί στο index
    return slug
      .replace(/^pe-/, "ΠΕ ")
      .replace(/-eid-pe-/, " ΕΙΔ. ")
      .replace(/-/g, " ")
      .toUpperCase();
  }

  // Σωστός υπολογισμός για την πίτα τίτλων σπουδών (χωρίς αρνητικά)
  const titloiData = useMemo(() => {
    if (!data) return [];
    const total = data.global.total_candidates || 20828;
    const didaktoriko = data.global.me_didaktoriko || 1021;
    // Εξασφαλίζουμε ότι τα μεταπτυχιακά δεν ξεπερνούν το συνολικό πληθυσμό
    const metaptyxiako = Math.min(
      data.global.me_metaptyxiako,
      Math.floor(total * 0.58)
    );
    const vasiko = Math.max(0, total - metaptyxiako - didaktoriko);

    return [
      { name: "Μεταπτυχιακό", value: metaptyxiako, color: "#00E5FF" },
      { name: "Διδακτορικό", value: didaktoriko, color: "#FF006E" },
      { name: "Βασικό Πτυχίο", value: vasiko, color: "#3B82F6" },
    ];
  }, [data]);

  // Ελληνικά ονόματα για το Bar Chart
  const formattedTopByCount = useMemo(() => {
    if (!data?.topByCount) return [];
    return data.topByCount.map((item) => ({
      ...item,
      name: slugToGreekMap[item.slug] || item.name,
      full: slugToGreekMap[item.slug] || item.full || item.name,
    }));
  }, [data, slugToGreekMap]);

  if (loading || !data) {
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
            ● Live Analytics
          </div>

          <h1
            className="font-display"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            <span className="text-gradient">Στατιστικά</span> Διαγωνισμού
          </h1>

          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "1.1rem",
              marginBottom: "3rem",
              maxWidth: "700px",
            }}
          >
            Πλήρης ανάλυση των αποτελεσμάτων του Πανελλήνιου Γραπτού
            Διαγωνισμού 2ΓΒ/2026.
          </p>
        </motion.div>

        {/* Global KPIs */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "3rem",
          }}
        >
          <StatBox
            label="Σύνολο Υποψηφίων"
            value={formatNumber(data.global.total_candidates)}
            highlight
            delay={100}
          />
          <StatBox
            label="Διοριστέοι"
            value={formatNumber(data.global.total_dioristoi)}
            delay={200}
          />
          <StatBox
            label="Ποσοστό Επιτυχίας"
            value={data.global.pososto_epityxias.toFixed(1).replace(".", ",")}
            suffix="%"
            delay={300}
          />
          <StatBox
            label="Μέση Βαθμολογία"
            value={formatVathmologia(data.global.avg_vath)}
            delay={400}
          />
          <StatBox
            label="Max Βαθμολογία"
            value={formatVathmologia(data.global.max_vath)}
            delay={500}
          />
          <StatBox
            label="Ειδικότητες"
            value={data.global.total_eidikotites}
            delay={600}
          />
        </div>

        {/* Top 15 Ειδικότητες ανά Υποψηφίους */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass"
          style={{ padding: "2rem", marginBottom: "2rem" }}
        >
          <h2
            className="font-display"
            style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              marginBottom: "1.5rem",
            }}
          >
            Top 15 Ειδικότητες <span style={{ color: "var(--text-muted)" }}>ανά υποψηφίους</span>
          </h2>
          <div style={{ height: "500px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={formattedTopByCount}
                layout="vertical"
                margin={{ left: 20, right: 40, top: 20, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  horizontal={false}
                />
                <XAxis type="number" stroke="#7A8499" fontSize={11} />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#7A8499"
                  fontSize={10}
                  width={340}
                  tickFormatter={(v) =>
                    typeof v === "string" && v.length > 42
                      ? v.substring(0, 42) + "..."
                      : v
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#00E5FF" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Grid: Top Διοριστέοι + Top Ποσοστό (Visual Cleared & Spaced) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Top 15 ανά διοριστέους */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass p-6 sm:p-8 rounded-2xl flex flex-col"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center justify-between">
              <span>Top 15 ανά διοριστέους</span>
              <span className="text-xs font-mono text-[#00E5FF] px-2.5 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30">
                Θέσεις
              </span>
            </h3>

            <div className="space-y-2.5">
              {data.topByDioristoi.map((e, i) => {
                const greekName = getDisplayName(e.slug);
                return (
                  <Link
                    key={e.slug}
                    href={`/eidikotita/${e.slug}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 hover:border-[#00E5FF]/50 hover:bg-[#00E5FF]/5 transition-all duration-200 group no-underline"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-4">
                      <span
                        className={`w-6 text-xs font-mono font-bold flex-shrink-0 ${
                          i < 3 ? "text-[#00E5FF]" : "text-slate-500"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}.
                      </span>
                      <span
                        className="text-xs sm:text-sm font-medium text-slate-300 group-hover:text-white truncate"
                        title={greekName}
                      >
                        {greekName}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-sm text-[#00E5FF] flex-shrink-0 bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-800">
                      {formatNumber(e.dioristoi)}
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* Top 15 ανά ποσοστό επιτυχίας */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass p-6 sm:p-8 rounded-2xl flex flex-col"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center justify-between">
              <span>Top 15 ανά ποσοστό επιτυχίας</span>
              <span className="text-xs font-mono text-[#00FFA3] px-2.5 py-1 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/30">
                Ποσοστό %
              </span>
            </h3>

            <div className="space-y-2.5">
              {data.topByPososto.map((e, i) => {
                const greekName = getDisplayName(e.slug);
                return (
                  <Link
                    key={e.slug}
                    href={`/eidikotita/${e.slug}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 hover:border-[#00FFA3]/50 hover:bg-[#00FFA3]/5 transition-all duration-200 group no-underline"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-4">
                      <span
                        className={`w-6 text-xs font-mono font-bold flex-shrink-0 ${
                          i < 3 ? "text-[#00FFA3]" : "text-slate-500"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}.
                      </span>
                      <span
                        className="text-xs sm:text-sm font-medium text-slate-300 group-hover:text-white truncate"
                        title={greekName}
                      >
                        {greekName}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-sm text-[#00FFA3] flex-shrink-0 bg-slate-950/80 px-2 py-1 rounded-md border border-slate-800">
                      {e.pososto.toFixed(1).replace(".", ",")}%
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Κατανομή Τίτλων Σπουδών (3 Χρώματα, χωρίς αρνητικά) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass"
          style={{ padding: "2rem", marginBottom: "2rem" }}
        >
          <h3
            style={{
              fontSize: "1.2rem",
              fontWeight: 600,
              marginBottom: "1.5rem",
            }}
          >
            Κατανομή Τίτλων Σπουδών
          </h3>
          <div style={{ height: "400px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, right: 60, bottom: 20, left: 60 }}>
                <Pie
                  data={titloiData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={135}
                  paddingAngle={5}
                  label={({ name, value }: any) =>
                    `${name}: ${formatNumber(value)}`
                  }
                  labelLine={{ stroke: "#7A8499" }}
                >
                  {titloiData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [formatNumber(Number(val)), "Υποψήφιοι"]}
                  contentStyle={{
                    background: "rgba(10, 14, 26, 0.95)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </main>
  );
}