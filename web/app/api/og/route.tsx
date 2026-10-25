import { ImageResponse } from "next/og";

export const runtime = "edge";

const TRAIT_LABELS: Record<string, string> = {
  teamwork: "Ομαδικότητα",
  results: "Αποτέλεσμα",
  adaptability: "Προσαρμοστικότητα",
  resilience: "Ανθεκτικότητα",
  integrity: "Ακεραιότητα",
  leadership: "Ηγεσία",
  analytical: "Αναλυτική Σκέψη",
  communication: "Επικοινωνία",
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const t0 = searchParams.get("t0") || "teamwork";
    const s0 = parseInt(searchParams.get("s0") || "50", 10);
    const t1 = searchParams.get("t1") || "results";
    const s1 = parseInt(searchParams.get("s1") || "50", 10);

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: "linear-gradient(135deg, #0A0E1A 0%, #111827 100%)",
            padding: "60px",
            fontFamily: "sans-serif",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "30px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#00E5FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>🏛️</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ color: "#00E5FF", fontSize: "20px", fontWeight: 700 }}>ASEP Analytics</span>
              <span style={{ color: "#94A3B8", fontSize: "14px" }}>Τεστ Εργασιακών Δεξιοτήτων (OPQ32)</span>
            </div>
          </div>

          {/* Main */}
          <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center", gap: "20px" }}>
            <div style={{ color: "#F8FAFC", fontSize: "32px", fontWeight: 700 }}>Το Προφίλ μου</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { label: TRAIT_LABELS[t0] || t0, score: s0, color: "#00E5FF" },
                { label: TRAIT_LABELS[t1] || t1, score: s1, color: "#34D399" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#E2E8F0", fontSize: "20px" }}>
                    <span>{item.label}</span>
                    <span style={{ color: item.color, fontWeight: 700 }}>{item.score}%</span>
                  </div>
                  <div style={{ width: "100%", height: "16px", background: "#1E293B", borderRadius: "8px", overflow: "hidden" }}>
                    <div style={{ width: `${item.score}%`, height: "100%", background: item.color, borderRadius: "8px" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "30px", paddingTop: "20px", borderTop: "1px solid #1E293B" }}>
            <span style={{ color: "#94A3B8", fontSize: "16px" }}>Εσύ ποιο είναι το προφίλ σου;</span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#00E5FF", color: "#0F172A", padding: "12px 24px", borderRadius: "12px", fontSize: "18px", fontWeight: 700 }}>
              Κάνε το Τεστ Δωρεάν →
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (e: any) {
    console.error(e);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}