import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "ΑΣΕΠ 2ΓΒ/2026 Analytics Hub";
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
          background: "#070A13",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Glow ambient effects */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(0, 229, 255, 0.2) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "200px",
            width: "450px",
            height: "450px",
            background: "radial-gradient(circle, rgba(255, 0, 110, 0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Top bar badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #00E5FF, #FF006E)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px",
              fontWeight: 800,
              color: "#070A13",
            }}
          >
            Α
          </div>
          <div
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#E2E8F0",
              letterSpacing: "-0.02em",
            }}
          >
            ΑΣΕΠ <span style={{ color: "#00E5FF" }}>2ΓΒ</span>/2026 Hub
          </div>
        </div>

        {/* Center Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: "56px",
              fontWeight: 800,
              color: "#FFFFFF",
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              maxWidth: "950px",
            }}
          >
            Αποτελέσματα, Χάρτης Θέσεων & AI Βοηθός
          </div>
          <div
            style={{
              fontSize: "26px",
              color: "#94A3B8",
              maxWidth: "850px",
            }}
          >
            Πλήρης ανάλυση των 54 πινάκων αποτελεσμάτων • 20.828 υποψήφιοι • 52 ειδικότητες
          </div>
        </div>

        {/* Bottom KPIs Bar */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            width: "100%",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "32px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "14px", color: "#64748B", textTransform: "uppercase" }}>Υποψήφιοι</span>
            <span style={{ fontSize: "28px", fontWeight: 700, color: "#00E5FF" }}>20.828</span>
          </div>
          <div style={{ width: "1px", background: "rgba(255,255,255,0.1)", margin: "0 12px" }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "14px", color: "#64748B", textTransform: "uppercase" }}>Διοριστέοι</span>
            <span style={{ fontSize: "28px", fontWeight: 700, color: "#FF006E" }}>3.819</span>
          </div>
          <div style={{ width: "1px", background: "rgba(255,255,255,0.1)", margin: "0 12px" }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "14px", color: "#64748B", textTransform: "uppercase" }}>Ειδικότητες</span>
            <span style={{ fontSize: "28px", fontWeight: 700, color: "#FFFFFF" }}>52</span>
          </div>
          <div style={{ width: "1px", background: "rgba(255,255,255,0.1)", margin: "0 12px" }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "14px", color: "#64748B", textTransform: "uppercase" }}>Κενές Θέσεις</span>
            <span style={{ fontSize: "28px", fontWeight: 700, color: "#F59E0B" }}>928</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}