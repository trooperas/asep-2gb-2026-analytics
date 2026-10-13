"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { href: "/", label: "Αρχική" },
  { href: "/xartis", label: "Χάρτης" },
  { href: "/search", label: "Αναζήτηση" },
  { href: "/stats", label: "Στατιστικά" },
  { href: "/chat", label: "AI Assistant" },
  { href: "/about", label: "Σχετικά" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        background: "rgba(5, 7, 13, 0.8)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo (με το δικό σου στυλ) */}
        {/* Modern Cyberpunk / Neon Logo Badge */}
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 no-underline group"
        >
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #00E5FF 0%, #FF006E 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "17px",
              fontWeight: 800,
              color: "#070A13",
              boxShadow: "0 0 15px rgba(0, 229, 255, 0.4)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
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
              fontSize: "1.05rem",
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
              2ΓΒ/2026
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex"
          style={{
            gap: "4px",
            alignItems: "center",
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  color: isActive ? "var(--primary)" : "var(--text-muted)",
                  background: isActive
                    ? "rgba(0, 229, 255, 0.08)"
                    : "transparent",
                  border: isActive
                    ? "1px solid rgba(0, 229, 255, 0.2)"
                    : "1px solid transparent",
                  transition: "all 0.2s ease",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex md:hidden"
          style={{
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "6px 10px",
            color: "var(--primary)",
            fontSize: "1.2rem",
            cursor: "pointer",
          }}
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Drawer (Dropdown Menu με smooth animation) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: "rgba(5, 7, 13, 0.95)",
              borderBottom: "1px solid var(--border)",
              padding: "12px 20px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              overflow: "hidden",
            }}
            className="md:hidden"
          >
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: isActive ? "var(--primary)" : "var(--text)",
                    background: isActive
                      ? "rgba(0, 229, 255, 0.1)"
                      : "rgba(255,255,255,0.02)",
                    border: isActive
                      ? "1px solid rgba(0, 229, 255, 0.3)"
                      : "1px solid transparent",
                    transition: "all 0.2s ease",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}