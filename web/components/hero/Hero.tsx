"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatNumber } from "@/lib/utils";
import {
  Search,
  TrendingUp,
  MapPin,
  Briefcase,
  BookOpen,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";

interface Stats {
  total_candidates: number;
  total_dioristoi: number;
  total_eidikotites: number;
  pososto_epityxias: number;
}

function useCountUp(target: number, duration = 2000, delay = 0) {
  const countState = useState(0);
  const count = countState[0];
  const setCount = countState[1];

  useEffect(() => {
    const timeout = setTimeout(() => {
      let startTime: number | null = null;
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(target * eased));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);

  return count;
}

function StatCard({
  label,
  value,
  suffix = "",
  delay = 0,
  accent = false,
}: {
  label: string;
  value: number;
  suffix?: string;
  delay?: number;
  accent?: boolean;
}) {
  const count = useCountUp(value, 2000, delay);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay / 1000 }}
      className="glass glass-hover"
      style={{ padding: "1.15rem" }}
    >
      <div
        style={{
          fontSize: "0.7rem",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "var(--text-muted)",
          marginBottom: "0.35rem",
        }}
      >
        {label}
      </div>
      <div
        className={accent ? "text-gradient" : ""}
        style={{
          fontSize: "clamp(1.75rem, 4vw, 2.35rem)",
          fontWeight: 700,
          lineHeight: 1,
          color: accent ? undefined : "var(--primary)",
        }}
      >
        {formatNumber(count)}
        {suffix}
      </div>
    </motion.div>
  );
}

export default function Hero({ stats }: { stats: Stats }) {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "110px 18px 80px",
        overflow: "hidden",
      }}
    >
      {/* Background Ambient Glows */}
      <div
        className="animate-float"
        style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "350px",
          height: "350px",
          background:
            "radial-gradient(circle, rgba(0, 229, 255, 0.12), transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        className="animate-float"
        style={{
          position: "absolute",
          bottom: "10%",
          right: "5%",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(245, 158, 11, 0.08), transparent 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
          animationDelay: "2s",
        }}
      />

      <div style={{ maxWidth: "1200px", width: "100%", position: "relative" }}>
        {/* Main Hero Header */}
        <div className="text-center sm:text-left">
          <div
            style={{
              display: "inline-block",
              padding: "5px 14px",
              borderRadius: "100px",
              border: "1px solid var(--border)",
              background: "rgba(0, 229, 255, 0.05)",
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--primary)",
              marginBottom: "1.25rem",
            }}
          >
            ● Live Hub · 2ΓΒ/2026 & 3ος ΑΣΕΠ 2027
          </div>

          <h1
            className="font-display"
            style={{
              fontSize: "clamp(2.25rem, 6vw, 4.5rem)",
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              marginBottom: "1.25rem",
            }}
          >
            <span className="text-gradient">ΑΣΕΠ Analytics Hub</span>
            <br />
            <span style={{ color: "var(--text)" }}>
              Αποτελέσματα & Προετοιμασία
            </span>
          </h1>

          <p
            style={{
              fontSize: "clamp(0.95rem, 2vw, 1.15rem)",
              color: "var(--text-muted)",
              maxWidth: "680px",
              marginBottom: "2rem",
              lineHeight: 1.6,
            }}
          >
            Πλήρης ανάλυση αποτελεσμάτων του <strong>2ΓΒ/2026</strong> και σύγχρονος ανοιχτός κόμβος 
            προετοιμασίας για τον <strong>3ο διαγωνισμό (2027)</strong> με 1.988 επίσημες ερωτήσεις και τεστ δεξιοτήτων (OPQ32).
          </p>
        </div>

        {/* 2ΓΒ Stats Counters Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: "0.75rem",
            marginBottom: "2.5rem",
          }}
        >
          <StatCard
            label="Υποψήφιοι 2ΓΒ"
            value={stats.total_candidates}
            delay={100}
            accent
          />
          <StatCard
            label="Διοριστέοι"
            value={stats.total_dioristoi}
            delay={200}
          />
          <StatCard
            label="Ειδικότητες"
            value={stats.total_eidikotites}
            delay={300}
          />
          <StatCard
            label="Ποσοστό Επιτυχίας"
            value={Math.round(stats.pososto_epityxias)}
            suffix="%"
            delay={400}
          />
        </div>

        {/* ============================================================== */}
        {/* DUAL-TRACK ARCHITECTURE: ΤΟ ΠΑΡΟΝ (ΚΥΑΝΟ) vs ΤΟ ΜΕΛΛΟΝ (GOLD) */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 🔵 ΠΥΛΩΝΑΣ Α: ΤΟ ΠΑΡΟΝ (ΑΠΟΤΕΛΕΣΜΑΤΑ 2ΓΒ/2026) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass p-5 sm:p-6 rounded-3xl border border-cyan-500/40 bg-gradient-to-b from-cyan-950/25 via-slate-900/60 to-transparent flex flex-col justify-between space-y-4 shadow-xl"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-[#00E5FF] font-bold border border-cyan-500/30">
                  ● 2ΓΒ/2026 · ΑΠΟΤΕΛΕΣΜΑΤΑ
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  51.900 Αιτήσεις
                </span>
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
                  Αναζήτηση Αποτελεσμάτων & Βάσεων
                </h2>
                {/* 👈 Descriptive Micro-Copy: Ρητή αναφορά τι πληκτρολογεί ο χρήστης */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  Αναζητήστε με <strong>Α.Μ. αίτησης</strong>, <strong>Επώνυμο</strong> ή <strong>Κωδικό Θέσης (π.χ. 1523)</strong> για σειρά κατάταξης, διορισμό και βάσεις μορίων.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/search"
                  className="p-3 rounded-xl bg-[#00E5FF] text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 hover:scale-[1.02] transition-transform shadow-md no-underline min-h-[44px]"
                >
                  <Search className="w-4 h-4" /> Αναζήτηση
                </Link>
                <Link
                  href="/stats"
                  className="p-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-[#00E5FF] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors no-underline min-h-[44px]"
                >
                  <TrendingUp className="w-4 h-4 text-[#00E5FF]" /> Βάσεις Μορίων
                </Link>
              </div>

              <Link
                href="/xartis"
                className="text-[11px] text-slate-400 hover:text-[#00E5FF] flex items-center justify-center gap-1 pt-1 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" /> Διαδραστικός Χάρτης Κενών & Καλυμμένων Θέσεων →
              </Link>
            </div>
          </motion.div>

          {/* 🟠 ΠΥΛΩΝΑΣ Β: ΤΟ ΜΕΛΛΟΝ (ΠΡΟΕΤΟΙΜΑΣΙΑ 3ΟΥ ΑΣΕΠ 2027) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass p-5 sm:p-6 rounded-3xl border border-amber-500/40 bg-gradient-to-b from-amber-500/10 via-slate-900/60 to-transparent flex flex-col justify-between space-y-4 shadow-xl"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-bold border border-amber-500/30">
                  ● 3ος ΑΣΕΠ · ΠΡΟΕΤΟΙΜΑΣΙΑ 2027
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  100% ΔΩΡΕΑΝ
                </span>
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white mb-1 flex items-center gap-2">
                  1.988 Επίσημες Ερωτήσεις & Τεστ Δεξιοτήτων
                </h2>
                {/* 👈 Επίσημες Ερωτήσεις + OPQ32 */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  Δωρεάν εξάσκηση στην επίσημη τράπεζα θεμάτων γνώσεων και online προσομοίωση <strong>εργασιακών δεξιοτήτων (OPQ32 - 76 τριάδες)</strong>.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/proetoimasia/ergasiakes-deksiotites"
                  className="p-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 hover:scale-[1.02] transition-transform shadow-md no-underline min-h-[44px]"
                >
                  <Briefcase className="w-4 h-4" /> Τεστ OPQ32
                </Link>
                <Link
                  href="/proetoimasia"
                  className="p-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors no-underline min-h-[44px]"
                >
                  <BookOpen className="w-4 h-4 text-amber-400" /> 1.988 Ερωτήσεις
                </Link>
              </div>

              <Link
                href="/proetoimasia"
                className="text-[11px] text-slate-400 hover:text-amber-300 flex items-center justify-center gap-1 pt-1 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" /> Χρονολόγιο Εξελίξεων & Επίσημες Ανακοινώσεις 2027 →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}