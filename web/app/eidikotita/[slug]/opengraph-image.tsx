import { ImageResponse } from "next/og";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

export const runtime = "nodejs"; // 👈 nodejs runtime για άμεσο διάβασμα των τοπικών JSON

export const alt = "ΑΣΕΠ 2ΓΒ/2026 - Στατιστικά & Βάσεις Ειδικότητας";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  let specialtyName = slug.replace(/^pe-/, "ΠΕ ").replace(/-/g, " ").toUpperCase();
  let totalCandidates = 0;
  let appointed = 0;
  let pososto = "0%";
  let minBase = "—";
  let maxScore = "—";

  try {
    // 1. Εύρεση Ελληνικού Ονόματος από το index
    const indexPath = join(process.cwd(), "public", "data", "eidikotites_index.json");
    if (existsSync(indexPath)) {
      const indexList = JSON.parse(readFileSync(indexPath, "utf-8"));
      const match = indexList.find((item: any) => item.slug === slug);
      if (match && match.eidikotita) {
        specialtyName = match.eidikotita;
      }
    }

    // 2. Εύρεση Στατιστικών από το eidikotites_stats.json
    const statsPath = join(process.cwd(), "public", "data", "eidikotites_stats.json");
    if (existsSync(statsPath)) {
      const statsMap = JSON.parse(readFileSync(statsPath, "utf-8"));
      const s = statsMap[slug];
      if (s) {
        totalCandidates = s.count || 0;
        appointed = s.dioristoi || 0;
        pososto = s.pososto ? `${s.pososto.toFixed(1).replace(".", ",")}%` : "0%";
        minBase = s.min_vath ? s.min_vath.toFixed(2) : "—";
        maxScore = s.max_vath ? s.max_vath.toFixed(2) : "—";
      }
    }
  } catch (e) {
    console.error("Error generating specialty OG image:", e);
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#070A13",
          backgroundImage:
            "radial-gradient(circle at 85% 15%, rgba(0, 229, 255, 0.18) 0%, transparent 60%), radial-gradient(circle at 15% 85%, rgba(255, 0, 110, 0.12) 0%, transparent 60%)",
          padding: "60px",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Top Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: "rgba(0, 229, 255, 0.08)",
              border: "1px solid rgba(0, 229, 255, 0.4)",
              borderRadius: "100px",
              padding: "8px 24px",
            }}
          >
            <span style={{ fontSize: "20px" }}>🏛️</span>
            <span style={{ color: "#00E5FF", fontSize: "16px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>
              ΑΣΕΠ 2ΓΒ/2026 • ΕΙΔΙΚΟΤΗΤΑ
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#FFFFFF", fontSize: "22px", fontWeight: 800 }}>ASEP</span>
            <span style={{ color: "#00E5FF", fontSize: "22px", fontWeight: 800 }}>Analytics</span>
          </div>
        </div>

        {/* Title Area */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <span style={{ color: "#94A3B8", fontSize: "18px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px" }}>
            Στατιστικά Αποτελεσμάτων &amp; Βάσεις
          </span>
          <h1
            style={{
              color: "#FFFFFF",
              fontSize: specialtyName.length > 40 ? "38px" : "46px",
              fontWeight: 900,
              margin: 0,
              lineHeight: 1.15,
              maxWidth: "1080px",
            }}
          >
            {specialtyName}
          </h1>
        </div>

        {/* 4 Stats Cards with Cyberpunk Badges */}
        <div style={{ display: "flex", gap: "18px", width: "100%" }}>
          {/* Card 1: Υποψήφιοι */}
          <div
            style={{
              flex: 1,
              backgroundColor: "rgba(10, 14, 26, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "18px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <span style={{ color: "#94A3B8", fontSize: "14px", fontWeight: 600, textTransform: "uppercase" }}>ΥΠΟΨΗΦΙΟΙ</span>
            <span style={{ color: "#FFFFFF", fontSize: "36px", fontWeight: 800 }}>{totalCandidates}</span>
          </div>

          {/* Card 2: Διοριστέοι */}
          <div
            style={{
              flex: 1,
              backgroundColor: "rgba(10, 14, 26, 0.8)",
              border: "1px solid rgba(0, 229, 255, 0.4)",
              borderRadius: "18px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <span style={{ color: "#A5F3FC", fontSize: "14px", fontWeight: 600, textTransform: "uppercase" }}>ΔΙΟΡΙΣΤΕΟΙ</span>
            <span style={{ color: "#00E5FF", fontSize: "36px", fontWeight: 800 }}>{appointed}</span>
          </div>

          {/* Card 3: Ποσοστό */}
          <div
            style={{
              flex: 1,
              backgroundColor: "rgba(10, 14, 26, 0.8)",
              border: "1px solid rgba(255, 0, 110, 0.35)",
              borderRadius: "18px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <span style={{ color: "#FECDD3", fontSize: "14px", fontWeight: 600, textTransform: "uppercase" }}>ΠΟΣΟΣΤΟ</span>
            <span style={{ color: "#FF006E", fontSize: "36px", fontWeight: 800 }}>{pososto}</span>
          </div>

          {/* Card 4: Ελάχιστη Βάση */}
          <div
            style={{
              flex: 1,
              backgroundColor: "rgba(10, 14, 26, 0.8)",
              border: "1px solid rgba(52, 211, 153, 0.4)",
              borderRadius: "18px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <span style={{ color: "#A7F3D0", fontSize: "14px", fontWeight: 600, textTransform: "uppercase" }}>ΕΛΑΧΙΣΤΗ ΒΑΣΗ</span>
            <span style={{ color: "#34D399", fontSize: "36px", fontWeight: 800 }}>{minBase}</span>
          </div>
        </div>

        {/* Bottom CTA Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "20px",
          }}
        >
          <div style={{ color: "#94A3B8", fontSize: "18px", fontWeight: 500 }}>
            Δες όλα τα ονόματα, τα μόρια &amp; τους πίνακες διορισμού
          </div>
          <div
            style={{
              backgroundColor: "#00E5FF",
              color: "#070A13",
              fontWeight: 800,
              fontSize: "16px",
              padding: "10px 22px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            asepanalytics.app →
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}