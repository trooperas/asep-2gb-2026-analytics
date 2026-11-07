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