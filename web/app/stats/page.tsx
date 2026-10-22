"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
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
      className="glass p-5 sm:p-6 rounded-2xl flex flex-col justify-between"
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
          fontSize: "clamp(1.5rem, 3vw, 2rem)",
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
        background: "rgba(10, 14, 26, 0.98)",
        border: "1px solid rgba(0, 229, 255, 0.3)",
        borderRadius: "8px",
        padding: "10px 12px",
        fontSize: "0.8rem",
        maxWidth: "220px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.7)",
        wordBreak: "break-word",
      }}
    >
      <div style={{ color: "var(--text)", marginBottom: "4px", fontWeight: 600, lineHeight: 1.3 }}>
        {data.full || data.name}
      </div>
      <div style={{ color: "var(--primary)", fontWeight: 700, fontSize: "0.85rem" }}>
        {formatNumber(payload[0].value)} υποψήφιοι
      </div>
    </div>
  );
}

export default function StatsPage() {
  const [data, setData] = useState<StatsData | null>(null);
  const [eidikotitesIndex, setEidikotitesIndex] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [useLogScale, setUseLogScale] = useState(true);
  const [prosonImpact, setProsonImpact] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/stats").then((r) => r.json()),
      fetch("/data/eidikotites_index.json").then((r) => r.json()).catch(() => []),
      fetch("/data/proson_impact.json").then((r) => r.json()).catch(() => null),
    ])
      .then(([statsRes, indexRes, prosonRes]) => {
        setData(statsRes);
        setEidikotitesIndex(indexRes);
        if (prosonRes) setProsonImpact(prosonRes);
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
    return slug
      .replace(/^pe-/, "ΠΕ ")
      .replace(/-eid-pe-/, " ΕΙΔ. ")
      .replace(/-/g, " ")
      .toUpperCase();
  }

  // Σωστός υπολογισμός τίτλων σπουδών
  const titloiData = useMemo(() => {
    if (!data) return [];
    const total = data.global.total_candidates || 20828;
    const didaktoriko = data.global.me_didaktoriko || 1021;
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
        Φόρτωση στατιστικών...
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-20 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-x-hidden">

      <Breadcrumb href="/" label="Επιστροφή στην Αρχική" />
      <div>
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
              fontSize: "1.05rem",
              marginBottom: "2.5rem",
              maxWidth: "700px",
            }}
          >
            Πλήρης ανάλυση των αποτελεσμάτων του Πανελλήνιου Γραπτού
            Διαγωνισμού 2ΓΒ/2026.
          </p>
        </motion.div>

        {/* Global KPIs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8 sm:mb-12">
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

        {/* Top 15 Ειδικότητες ανά Υποψηφίους (με Log Scale Toggle) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-4 sm:p-8 rounded-2xl mb-8 overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="font-display text-lg sm:text-2xl font-bold text-white">
                Top 15 Ειδικότητες <span className="text-slate-400 font-normal">ανά υποψηφίους</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {useLogScale
                  ? "📊 Προβολή σε Λογαριθμική Κλίμακα (Log Scale) για να είναι ευδιάκριτες όλες οι ειδικότητες παρά την τεράστια απόκλιση (24.000 vs 200)."
                  : "📏 Προβολή σε Γραμμική Κλίμακα (απόλυτες διαφορές)."}
              </p>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setUseLogScale(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  useLogScale
                    ? "bg-[#00E5FF] text-slate-950 font-bold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Log Κλίμακα
              </button>
              <button
                type="button"
                onClick={() => setUseLogScale(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  !useLogScale
                    ? "bg-[#00E5FF] text-slate-950 font-bold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Κανονική
              </button>
            </div>
          </div>

          <div className="h-[640px] sm:h-[680px] w-full overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={formattedTopByCount}
                layout="vertical"
                margin={{ left: 0, right: 15, top: 10, bottom: 10 }}
                barCategoryGap="22%"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  scale={useLogScale ? "log" : "linear"}
                  domain={useLogScale ? [50, 30000] : [0, "auto"]}
                  stroke="#7A8499"
                  fontSize={11}
                  tickFormatter={(v) => formatNumber(v)}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#A0AEC0"
                  fontSize={10}
                  width={135}
                  tickLine={false}
                  tickFormatter={(v) => {
                    if (typeof v !== "string") return v;
                    const clean = v
                      .replace(/^ΠΕ\s+/i, "")
                      .replace(/ΕΙΔ\.\s*ΠΕ\s+/i, "• ")
                      .replace(/\(SOFTWARE-HARDWARE\)/i, "(IT)");
                    return clean.length > 20 ? clean.substring(0, 18) + "..." : clean;
                  }}
                />
                {/* 👇 allowEscapeViewBox={x: false} αποτρέπει το ξεχείλωμα της σελίδας 👇 */}
                <Tooltip
                  content={<CustomTooltip />}
                  allowEscapeViewBox={{ x: false, y: true }}
                />
                <Bar
                  dataKey="value"
                  fill="#00E5FF"
                  radius={[0, 5, 5, 0]}
                  barSize={18}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Grid: Top Διοριστέοι + Top Ποσοστό */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 sm:mb-12">
          {/* Top 15 ανά διοριστέους */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass p-5 sm:p-8 rounded-2xl flex flex-col"
          >
            <h3 className="text-lg sm:text-xl font-bold text-white mb-6 flex items-center justify-between">
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
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-3">
                      <span
                        className={`w-5 sm:w-6 text-xs font-mono font-bold flex-shrink-0 ${
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
                    <span className="font-mono font-bold text-xs sm:text-sm text-[#00E5FF] flex-shrink-0 bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-800">
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
            className="glass p-5 sm:p-8 rounded-2xl flex flex-col"
          >
            <h3 className="text-lg sm:text-xl font-bold text-white mb-6 flex items-center justify-between">
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
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-3">
                      <span
                        className={`w-5 sm:w-6 text-xs font-mono font-bold flex-shrink-0 ${
                          i < 3 ? "#00FFA3" : "text-slate-500"
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
                    <span className="font-mono font-bold text-xs sm:text-sm text-[#00FFA3] flex-shrink-0 bg-slate-950/80 px-2 py-1 rounded-md border border-slate-800">
                      {e.pososto.toFixed(1).replace(".", ",")}%
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Κατανομή Τίτλων Σπουδών (Mobile-Friendly Donut) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass p-5 sm:p-8 rounded-2xl mb-8 flex flex-col items-center"
        >
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4 w-full text-left">
            Κατανομή Τίτλων Σπουδών
          </h3>

          <div className="h-[280px] sm:h-[320px] w-full max-w-sm">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={titloiData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={4}
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
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Καθαρό Legend από κάτω με νούμερα */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg mt-2 pt-4 border-t border-slate-800/80">
            {titloiData.map((t) => (
              <div
                key={t.name}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/40 border border-slate-800"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: t.color }}
                  />
                  <span className="text-xs text-slate-300 font-medium">{t.name}</span>
                </div>
                <span className="text-xs font-mono font-bold text-white">
                  {formatNumber(t.value)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Η Δύναμη των Προσόντων (Bonus Points Impact Breakdown - ΣΤΟ ΣΩΣΤΟ ΣΗΜΕΙΟ) */}
        {prosonImpact && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass p-6 sm:p-8 rounded-2xl mb-12 border border-[#00E5FF]/20"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                  Η Δύναμη των Προσόντων: Πώς κρίθηκαν οι διορισμοί
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Ανάλυση των πρόσθετων μορίων και προνομίων στους {formatNumber(prosonImpact.total_appointed)} διοριστέους του διαγωνισμού.
                </p>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 w-fit">
                Ανάλυση Προσόντων
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Μεταπτυχιακό */}
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Μεταπτυχιακο (+2 μορια)
                </div>
                <div className="text-2xl font-bold font-mono text-[#00E5FF]">
                  {prosonImpact.metapt_pct}%
                </div>
                <div className="text-xs text-slate-400">
                  {formatNumber(prosonImpact.appointed_with_metapt)} διοριστέοι είχαν μεταπτυχιακό τίτλο.
                </div>
              </div>

              {/* Εντοπιότητα */}
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Εντοπιοτητα (Κωδ. 6 / 7)
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-400">
                  {prosonImpact.entop_pct}%
                </div>
                <div className="text-xs text-slate-400">
                  {formatNumber(prosonImpact.appointed_with_entop)} θέσεις κατοχυρώθηκαν μέσω εντοπιότητας.
                </div>
              </div>

              {/* Εμπειρία */}
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Επαγγελματικη Εμπειρια
                </div>
                <div className="text-2xl font-bold font-mono text-pink-400">
                  {prosonImpact.empeiria_pct}%
                </div>
                <div className="text-xs text-slate-400">
                  {formatNumber(prosonImpact.appointed_with_empeiria)} διοριστέοι αξιοποίησαν μόρια προϋπηρεσίας.
                </div>
              </div>

              {/* Ξένη Γλώσσα */}
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Αριστη Ξενη Γλωσσα (C2)
                </div>
                <div className="text-2xl font-bold font-mono text-amber-400">
                  {prosonImpact.xeni_pct}%
                </div>
                <div className="text-xs text-slate-400">
                  {formatNumber(prosonImpact.appointed_with_xeni)} διοριστέοι είχαν άριστη γνώση ξένης γλώσσας.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}