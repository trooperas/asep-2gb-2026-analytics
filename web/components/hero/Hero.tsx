import React from "react";
import Link from "next/link";
import { formatNumber } from "@/lib/utils";
import {
  Search,
  TrendingUp,
  MapPin,
  Briefcase,
  BookOpen,
  Sparkles,
  ArrowRight,
  Map,
} from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";

interface Stats {
  total_candidates: number;
  total_dioristoi: number;
  total_eidikotites: number;
  pososto_epityxias: number;
}

export default function Hero({ stats }: { stats: Stats }) {
  return (
    <section
      className="relative min-h-[92vh] sm:min-h-screen flex flex-col items-center justify-center pt-24 sm:pt-28 pb-12 px-4 sm:px-6 overflow-hidden"
    >
      {/* Background Ambient Glows */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "350px",
          height: "350px",
          background: "radial-gradient(circle, rgba(0, 229, 255, 0.12), transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          contain: "layout",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "5%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(245, 158, 11, 0.08), transparent 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
          contain: "layout",
        }}
      />

      <div style={{ maxWidth: "1200px", width: "100%", position: "relative" }}>
        {/* Header - Compact on mobile for instant viewport fit */}
        <div className="text-center sm:text-left mb-4 sm:mb-6">
          <div
            style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: "100px",
              border: "1px solid var(--border)",
              background: "rgba(0, 229, 255, 0.05)",
              fontSize: "0.7rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--primary)",
              marginBottom: "0.75rem",
            }}
          >
            ● Live Hub · 2ΓΒ/2026 &amp; 3ος ΑΣΕΠ 2027
          </div>

          <h1
            className="text-3xl sm:text-5xl lg:text-6xl"
            style={{
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              marginBottom: "0.75rem",
              contentVisibility: "auto",
            }}
          >
            <span className="text-gradient">
              ΑΣΕΠ <span className="whitespace-nowrap">Analytics Hub</span>
            </span>
            <br />
            <span style={{ color: "var(--text)" }}>
              Αποτελέσματα &amp; Προετοιμασία
            </span>
          </h1>

          <p
            style={{
              fontSize: "clamp(0.85rem, 1.8vw, 1.05rem)",
              color: "var(--text-muted)",
              maxWidth: "680px",
              marginBottom: "1.25rem",
              lineHeight: 1.5,
            }}
          >
            Πλήρης ανάλυση αποτελεσμάτων <strong>2ΓΒ/2026</strong> και σύγχρονος ανοιχτός κόμβος 
            προετοιμασίας για τον <strong>3ο διαγωνισμό (2027)</strong> με 1.988 θέματα και τεστ δεξιοτήτων (OPQ32).
          </p>
        </div>

        {/* Stats Grid - Compact on Mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
          <div className="glass p-2.5 sm:p-4 rounded-xl">
            <div className="text-[9px] uppercase tracking-wider text-slate-400 mb-0.5">Υποψήφιοι 2ΓΒ</div>
            <div className="text-xl sm:text-3xl font-bold font-mono text-[#00E5FF]">
              <AnimatedCounter target={stats.total_candidates} />
            </div>
          </div>

          <div className="glass p-2.5 sm:p-4 rounded-xl">
            <div className="text-[9px] uppercase tracking-wider text-slate-400 mb-0.5">Διοριστέοι</div>
            <div className="text-xl sm:text-3xl font-bold font-mono text-emerald-400">
              <AnimatedCounter target={stats.total_dioristoi} />
            </div>
          </div>

          <div className="glass p-2.5 sm:p-4 rounded-xl">
            <div className="text-[9px] uppercase tracking-wider text-slate-400 mb-0.5">Ειδικότητες</div>
            <div className="text-xl sm:text-3xl font-bold font-mono text-white">
              {stats.total_eidikotites}
            </div>
          </div>

          <div className="glass p-2.5 sm:p-4 rounded-xl">
            <div className="text-[9px] uppercase tracking-wider text-slate-400 mb-0.5">Ποσοστό Επιτυχίας</div>
            <div className="text-xl sm:text-3xl font-bold font-mono text-pink-400">
              {Math.round(stats.pososto_epityxias)}%
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* DUAL-TRACK CARDS: ΠΛΗΡΗΣ ΣΥΜΜΕΤΡΙΑ 4x4 ΕΡΓΑΛΕΙΩΝ */}
        {/* ============================================================== */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5"
          style={{ contain: "layout" }}
        >
          {/* 🔵 ΠΥΛΩΝΑΣ Α: ΤΟ ΠΑΡΟΝ (ΑΠΟΤΕΛΕΣΜΑΤΑ 2ΓΒ/2026) */}
          <div className="glass p-4 sm:p-6 rounded-3xl border border-cyan-500/40 bg-gradient-to-b from-cyan-950/25 via-slate-900/60 to-transparent flex flex-col justify-between space-y-4 shadow-xl">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-[#00E5FF] font-bold border border-cyan-500/30">
                  ● 2ΓΒ/2026 · ΑΠΟΤΕΛΕΣΜΑΤΑ
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {formatNumber(stats.total_candidates)} Αιτήσεις
                </span>
              </div>

              <div>
                <h2 className="text-base sm:text-xl font-bold text-white mb-1">
                  <Link href="/search" className="hover:text-[#00E5FF] transition-colors no-underline text-white flex items-center justify-between group">
                    <span>Αποτελέσματα, Βάσεις &amp; Θέσεις</span>
                    <ArrowRight className="w-4 h-4 text-[#00E5FF] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Αναζητήστε με <strong>Α.Μ.</strong>, <strong>Επώνυμο</strong> ή <strong>Κωδικό Θέσης</strong> για σειρά κατάταξης, διορισμό και βάσεις μορίων.
                </p>
              </div>
            </div>

            {/* 4 ΚΟΥΜΠΙΑ ΣΕ GRID 2x2 (Πλήρης κάλυψη του μενού 2ΓΒ) */}
            <div className="grid grid-cols-2 gap-2 pt-1">
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
              <Link
                href="/xartis"
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-[#00E5FF] text-slate-300 hover:text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors no-underline min-h-[44px]"
              >
                <MapPin className="w-4 h-4 text-[#00E5FF]" /> Χάρτης Θέσεων
              </Link>
              <Link
                href="/kenes-theseis"
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-400 text-slate-300 hover:text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors no-underline min-h-[44px]"
              >
                <Sparkles className="w-4 h-4 text-amber-400" /> 928 Κενές Θέσεις
              </Link>
            </div>
          </div>

          {/* 🟠 ΠΥΛΩΝΑΣ Β: ΤΟ ΜΕΛΛΟΝ (ΠΡΟΕΤΟΙΜΑΣΙΑ 3ΟΥ ΑΣΕΠ 2027) */}
          <div className="glass p-4 sm:p-6 rounded-3xl border border-amber-500/40 bg-gradient-to-b from-amber-500/10 via-slate-900/60 to-transparent flex flex-col justify-between space-y-4 shadow-xl">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-bold border border-amber-500/30">
                  ● 3ος ΑΣΕΠ · ΠΡΟΕΤΟΙΜΑΣΙΑ 2027
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  100% ΔΩΡΕΑΝ
                </span>
              </div>

              <div>
                <h2 className="text-base sm:text-xl font-bold text-white mb-1">
                  <Link
                    href="/proetoimasia"
                    className="hover:text-amber-300 transition-colors no-underline text-white flex items-center justify-between group"
                  >
                    <span>1.988 Επίσημα Θέματα &amp; Τεστ Δεξιοτήτων</span>
                    <ArrowRight className="w-4 h-4 text-amber-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </Link>
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Δωρεάν εξάσκηση στην τράπεζα γνώσεων και online προσομοιώσεις <strong>εργασιακών δεξιοτήτων (OPQ32)</strong> και <strong>επαγωγικού συλλογισμού</strong>.
                </p>
              </div>
            </div>

            {/* 4 ΚΟΥΜΠΙΑ ΣΕ GRID 2x2 (Πλήρης κάλυψη του μενού 2027) */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href="/proetoimasia/ergasiakes-deksiotites"
                className="p-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 hover:scale-[1.02] transition-transform shadow-md no-underline min-h-[44px]"
              >
                <Briefcase className="w-4 h-4" /> Τεστ OPQ32
              </Link>
              <Link
                href="/proetoimasia/epagogikos-syllogismos"
                className="p-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:scale-[1.02] transition-transform shadow-md no-underline min-h-[44px]"
              >
                <span>🔺 Επαγωγικός</span>
              </Link>
              <Link
                href="/proetoimasia#knowledge-bank"
                className="p-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors no-underline min-h-[44px]"
              >
                <BookOpen className="w-4 h-4 text-amber-400" /> 1.988 Θέματα
              </Link>
              <Link
                href="/zitisi"
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-400 text-slate-300 hover:text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors no-underline min-h-[44px]"
              >
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Ζήτηση 2027
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}