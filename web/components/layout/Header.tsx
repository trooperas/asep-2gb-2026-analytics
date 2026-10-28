"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Desktop dropdown states
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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

  // Ομαδοποιημένα links για Desktop Dropdowns
  const RESULT_LINKS = [
    { href: "/search", label: "🔍 Αναζήτηση Υποψηφίου & Θέσης" },
    { href: "/stats", label: "📊 Βάσεις Μορίων ανά Ειδικότητα" },
    { href: "/xartis", label: "🗺️ Διαδραστικός Χάρτης Θέσεων" },
    { href: "/kenes-theseis", label: "📍 Ακτινογραφία 928 Κενών Θέσεων" },
  ];

  const PREP_LINKS = [
    { href: "/proetoimasia/ergasiakes-deksiotites", label: "🧠 Τεστ Εργασιακών Δεξιοτήτων (OPQ32)", badge: "ΝΕΟ" },
    { href: "/proetoimasia/epagogikos-syllogismos", label: "🔺 Τεστ Επαγωγικού Συλλογισμού (Matrix)", badge: "ΝΕΟ" },
    { href: "/proetoimasia", label: "📚 Μητρώο 1.988 Ερωτήσεων ΑΣΕΠ" },
    { href: "/zitisi", label: "📈 Βαρόμετρο Ζήτησης Φορέων 2027" },
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
            padding: "10px 18px",
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

          {/* Desktop Navigation με Clean Dropdowns (Καθαρό & Ευρύχωρο) */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === "/" ? "text-[#00E5FF] bg-[#00E5FF]/10 font-semibold" : "text-slate-300 hover:text-white"
              }`}
            >
              Αρχική
            </Link>

            {/* Dropdown 1: Αποτελέσματα 2ΓΒ */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown("results")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                  pathname?.startsWith("/thesi") || pathname === "/search" || pathname === "/stats" || pathname === "/xartis" || pathname === "/kenes-theseis"
                    ? "text-[#00E5FF] bg-[#00E5FF]/10 font-semibold"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <span>Αποτελέσματα 2ΓΒ</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {openDropdown === "results" && (
                <div className="absolute top-full left-0 mt-1 w-64 rounded-2xl bg-[#0A0E1A] border border-slate-800 shadow-2xl p-2 z-50 divide-y divide-slate-800/60">
                  <div className="space-y-1 pb-1.5">
                    {RESULT_LINKS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpenDropdown(null)}
                        className="block px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dropdown 2: Προετοιμασία 2027 */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown("prep")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                  pathname?.startsWith("/proetoimasia") || pathname === "/zitisi"
                    ? "text-amber-400 bg-amber-500/10 font-semibold"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <span>Προετοιμασία 2027</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {openDropdown === "prep" && (
                <div className="absolute top-full left-0 mt-1 w-72 rounded-2xl bg-[#0A0E1A] border border-slate-800 shadow-2xl p-2 z-50">
                  <div className="space-y-1">
                    {PREP_LINKS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpenDropdown(null)}
                        className="px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-900 transition-colors flex items-center justify-between group"
                      >
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/chat"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === "/chat" ? "text-[#00E5FF] bg-[#00E5FF]/10 font-semibold" : "text-slate-300 hover:text-white"
              }`}
            >
              AI Bot
            </Link>

            <Link
              href="/about"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === "/about" ? "text-[#00E5FF] bg-[#00E5FF]/10 font-semibold" : "text-slate-300 hover:text-white"
              }`}
            >
              Σχετικά
            </Link>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            className="flex lg:hidden items-center justify-center"
            style={{
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

        {/* Mobile Drawer (Παραμένει άθικτο όπως ακριβώς το είχες!) */}
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