"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { href: "/", label: "Αρχική" },
  { href: "/xartis", label: "Χάρτης" },
  { href: "/search", label: "Αναζήτηση" },
  { href: "/stats", label: "Στατιστικά" },
  { href: "/chat", label: "AI Assistant" },
];

export default function Header() {
  const pathname = usePathname();

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
        background: "rgba(5, 7, 13, 0.7)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background:
                "linear-gradient(135deg, var(--primary), var(--accent))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: 700,
              color: "#000",
            }}
          >
            Α
          </div>
          <span
            className="font-display"
            style={{
              color: "var(--text)",
              fontWeight: 700,
              fontSize: "1rem",
              letterSpacing: "-0.02em",
            }}
          >
            ΑΣΕΠ <span className="text-gradient">2ΓΒ/2026</span>
          </span>
        </Link>

        <nav
          style={{
            display: "flex",
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
      </div>
    </motion.header>
  );
}