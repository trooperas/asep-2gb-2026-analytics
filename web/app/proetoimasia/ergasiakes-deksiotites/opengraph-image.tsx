import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Τεστ Εργασιακών Δεξιοτήτων (OPQ32) — ΑΣΕΠ 2027";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
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
            "radial-gradient(circle at 80% 20%, rgba(0, 229, 255, 0.22) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(245, 158, 11, 0.18) 0%, transparent 60%)",
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
              backgroundColor: "rgba(245, 158, 11, 0.12)",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              borderRadius: "100px",
              padding: "8px 24px",
            }}
          >
            <span style={{ fontSize: "20px" }}>⚡</span>
            <span style={{ color: "#F59E0B", fontSize: "16px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>
              ΑΣΕΠ 2027 • ΤΕΣΤ ΔΕΞΙΟΤΗΤΩΝ (OPQ32)
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#FFFFFF", fontSize: "22px", fontWeight: 800 }}>ASEP</span>
            <span style={{ color: "#00E5FF", fontSize: "22px", fontWeight: 800 }}>Analytics</span>
          </div>
        </div>

        {/* Central Title */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <span style={{ color: "#94A3B8", fontSize: "18px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px" }}>
            Επίσημη Δοκιμασία 76 Τριάδων ΑΣΕΠ
          </span>
          <h1
            style={{
              color: "#FFFFFF",
              fontSize: "44px",
              fontWeight: 900,
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            Τεστ Εργασιακής Συμπεριφοράς &amp; Προφίλ
          </h1>
        </div>

        {/* 2 Big Preview Cards with Bars */}
        <div style={{ display: "flex", gap: "20px", width: "100%" }}>
          {/* Card 1 */}
          <div
            style={{
              flex: 1,
              backgroundColor: "rgba(10, 14, 26, 0.85)",
              border: "1px solid rgba(0, 229, 255, 0.5)",
              borderRadius: "20px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#A5F3FC", fontSize: "14px", fontWeight: 700, textTransform: "uppercase" }}>
                ΚΥΡΙΑΡΧΗ ΔΙΑΣΤΑΣΗ
              </span>
              <span style={{ color: "#00E5FF", fontSize: "30px", fontWeight: 800 }}>92%</span>
            </div>
            <span style={{ color: "#FFFFFF", fontSize: "22px", fontWeight: 800 }}>Ομαδικότητα &amp; Συνεργασία</span>
            <div style={{ width: "100%", height: "12px", backgroundColor: "#1E293B", borderRadius: "100px", overflow: "hidden" }}>
              <div style={{ width: "92%", height: "100%", backgroundColor: "#00E5FF", borderRadius: "100px" }} />
            </div>
          </div>

          {/* Card 2 */}
          <div
            style={{
              flex: 1,
              backgroundColor: "rgba(10, 14, 26, 0.85)",
              border: "1px solid rgba(52, 211, 153, 0.4)",
              borderRadius: "20px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#A7F3D0", fontSize: "14px", fontWeight: 700, textTransform: "uppercase" }}>
                ΔΕΥΤΕΡΕΥΟΥΣΑ ΔΙΑΣΤΑΣΗ
              </span>
              <span style={{ color: "#34D399", fontSize: "30px", fontWeight: 800 }}>86%</span>
            </div>
            <span style={{ color: "#FFFFFF", fontSize: "22px", fontWeight: 800 }}>Ακεραιότητα &amp; Δεοντολογία</span>
            <div style={{ width: "100%", height: "12px", backgroundColor: "#1E293B", borderRadius: "100px", overflow: "hidden" }}>
              <div style={{ width: "86%", height: "100%", backgroundColor: "#34D399", borderRadius: "100px" }} />
            </div>
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
            Δωρεάν προσομοίωση για τον 3ο Γραπτό Διαγωνισμό ΑΣΕΠ
          </div>
          <div
            style={{
              backgroundColor: "#00E5FF",
              color: "#070A13",
              fontWeight: 800,
              fontSize: "16px",
              padding: "12px 24px",
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