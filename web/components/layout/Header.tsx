"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  // Desktop Links
  const DESKTOP_NAV = [
    { href: "/", label: "Αρχική" },
    { href: "/search", label: "Αναζήτηση" },
    { href: "/stats", label: "Βάσεις 2ΓΒ" },
    { href: "/proetoimasia/ergasiakes-deksiotites", label: "Τεστ OPQ32", badge: "ΝΕΟ", badgeColor: "amber" },
    { href: "/proetoimasia", label: "1.988 Ερωτήσεις 2027" },
    { href: "/xartis", label: "Χάρτης" },
    { href: "/kenes-theseis", label: "Κενές Θέσεις" },
    { href: "/zitisi", label: "Ζήτηση 2027" },
    { href: "/chat", label: "AI Bot" },
    { href: "/about", label: "Σχετικά" },
  ];

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
          className="fixed inset-0 z-40 border-0 bg-black/70 p-0 backdrop-blur-md lg:hidden"
        />
      )}
      <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        background: "rgba(5, 7, 13, 0.9)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          width: "100%",
          margin: "0 auto",
          padding: "12px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2.5 no-underline group"
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #00E5FF 0%, #FF006E 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: 800,
              color: "#070A13",
              boxShadow: "0 0 15px rgba(0, 229, 255, 0.4)",
              transition: "transform 0.2s ease",
            }}
            className="group-hover:scale-105"
          >
            Α
          </div>
          <span
            className="font-display"
            style={{
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: "1rem",
              letterSpacing: "-0.02em",
            }}
          >
            ΑΣΕΠ{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00E5FF, #FF006E)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Analytics
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden lg:flex"
          style={{
            gap: "3px",
            alignItems: "center",
          }}
        >
          {DESKTOP_NAV.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: "7px 11px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  color: isActive ? "var(--primary)" : "var(--text-muted)",
                  background: isActive
                    ? "rgba(0, 229, 255, 0.08)"
                    : "transparent",
                  border: isActive
                    ? "1px solid rgba(0, 229, 255, 0.25)"
                    : "1px solid transparent",
                  transition: "all 0.2s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-100 border border-amber-500/40">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Hamburger Button (44px touch target) */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          className="flex lg:hidden items-center justify-center"
          style={{
            alignItems: "center",
            justifyContent: "center",
            background: "#00E5FF",
            border: "1px solid #00E5FF",
            borderRadius: "10px",
            width: "44px",
            height: "44px",
            flexShrink: 0,
            color: "#05070D",
            fontSize: "1.3rem",
            fontWeight: 700,
            cursor: "pointer",
            zIndex: 50,
          }}
          aria-label={mobileOpen ? "Κλείσιμο μενού" : "Άνοιγμα μενού"}
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Drawer (78% of users — Structured & Thumb-Friendly) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: "rgba(5, 7, 13, 0.98)",
              borderBottom: "1px solid var(--border)",
              padding: "16px 18px 28px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              overflow: "hidden",
            }}
            className="lg:hidden"
          >
            {/* ΕΝΟΤΗΤΑ 1: ΑΠΟΤΕΛΕΣΜΑΤΑ 2ΓΒ */}
            <div>
              <div className="text-[10px] font-mono uppercase text-[#00E5FF] font-bold tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                ● Αποτελέσματα 2ΓΒ/2026
              </div>
              <div className="flex flex-col gap-1.5">
                <Link
                  href="/search"
                  onClick={() => setMobileOpen(false)}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-sm font-medium text-white flex items-center justify-between"
                >
                  <span>🔍 Αναζήτηση (Α.Μ. • Επώνυμο • Θέση)</span>
                </Link>
                <Link
                  href="/stats"
                  onClick={() => setMobileOpen(false)}
                  className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-sm font-medium text-slate-300 flex items-center justify-between"
                >
                  <span>📊 Βάσεις Μορίων ανά Ειδικότητα</span>
                </Link>
                <div className="grid grid-cols-2 gap-1.5">
                  <Link
                    href="/xartis"
                    onClick={() => setMobileOpen(false)}
                    className="p-2.5 rounded-xl bg-slate-900/30 border border-slate-800 text-xs font-medium text-slate-400 text-center"
                  >
                    🗺️ Χάρτης Θέσεων
                  </Link>
                  <Link
                    href="/kenes-theseis"
                    onClick={() => setMobileOpen(false)}
                    className="p-2.5 rounded-xl bg-slate-900/30 border border-slate-800 text-xs font-medium text-slate-400 text-center"
                  >
                    📍 Κενές Θέσεις
                  </Link>
                </div>
              </div>
            </div>

            {/* ΕΝΟΤΗΤΑ 2: ΠΡΟΕΤΟΙΜΑΣΙΑ 2027 */}
            <div>
              <div className="text-[10px] font-mono uppercase text-amber-300 font-bold tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                ● 3ος ΑΣΕΠ · Προετοιμασία 2027
              </div>
              <div className="flex flex-col gap-1.5">
                <Link
                  href="/proetoimasia/ergasiakes-deksiotites"
                  onClick={() => setMobileOpen(false)}
                  className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/40 text-sm font-bold text-amber-300 flex items-center justify-between"
                >
                  <span>🧠 Τεστ Εργασιακών Δεξιοτήτων (OPQ32)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    ΝΕΟ
                  </span>
                </Link>

                <Link
                  href="/proetoimasia/epagogikos-syllogismos"
                  onClick={() => setMobileOpen(false)}
                  className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/40 text-sm font-bold text-pink-300 flex items-center justify-between"
                >
                  <span>🔺 Τεστ Επαγωγικού Συλλογισμού</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40">
                    ΝΕΟ
                  </span>
                </Link>

                <Link
                  href="/proetoimasia"
                  onClick={() => setMobileOpen(false)}
                  className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-sm font-medium text-slate-300 flex items-center justify-between"
                >
                  <span>📚 1.988 Επίσημες Ερωτήσεις ΑΣΕΠ</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    11 Ενότητες
                  </span>
                </Link>
                <Link
                  href="/zitisi"
                  onClick={() => setMobileOpen(false)}
                  className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-sm font-medium text-slate-300 flex items-center justify-between"
                >
                  <span>📈 Βαρόμετρο Ζήτησης Φορέων</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    ΝΕΟ
                  </span>
                </Link>
              </div>
            </div>

            {/* ΕΝΟΤΗΤΑ 3: ΕΡΓΑΛΕΙΑ & ΣΧΕΤΙΚΑ */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between px-2 text-xs">
              <Link
                href="/chat"
                onClick={() => setMobileOpen(false)}
                className="text-[#00E5FF] hover:underline font-medium"
              >
                🤖 AI Assistant
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                Σχετικά με το Project
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </header>
    </>
  );
}