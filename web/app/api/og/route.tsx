import { ImageResponse } from "next/og";

export const runtime = "edge";

const TRAIT_LABELS: Record<string, string> = {
  teamwork: "Ομαδικότητα & Συνεργασία",
  results: "Προσανατολισμός στο Αποτέλεσμα",
  adaptability: "Προσαρμοστικότητα & Ευελιξία",
  resilience: "Ανθεκτικότητα & Αυτοέλεγχος",
  integrity: "Ακεραιότητα & Δεοντολογία",
  leadership: "Πρωτοβουλία & Ηγεσία",
  analytical: "Αναλυτική Σκέψη & Επίλυση",
  communication: "Επικοινωνία & Εξυπηρέτηση",
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const t0 = searchParams.get("t0") || "teamwork";
    const s0 = parseInt(searchParams.get("s0") || "92", 10);
    const t1 = searchParams.get("t1") || "results";
    const s1 = parseInt(searchParams.get("s1") || "84", 10);

    const traitName0 = TRAIT_LABELS[t0] || "Ομαδικότητα";
    const traitName1 = TRAIT_LABELS[t1] || "Αποτέλεσμα";

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
              "radial-gradient(circle at 80% 20%, rgba(0, 229, 255, 0.2) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(245, 158, 11, 0.15) 0%, transparent 60%)",
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
                backgroundColor: "rgba(245, 158, 11, 0.1)",
                border: "1px solid rgba(245, 158, 11, 0.4)",
                borderRadius: "100px",
                padding: "8px 22px",
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

          {/* Central Title & Result */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <span style={{ color: "#94A3B8", fontSize: "18px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px" }}>
              Χαρτογράφηση Εργασιακού Προφίλ
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
              Το Επαγγελματικό μου Αποτύπωμα
            </h1>
          </div>

          {/* 2 Big Cyberpunk Progress Cards */}
          <div style={{ display: "flex", gap: "20px", width: "100%" }}>
            {/* Primary Trait */}
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
                <span style={{ color: "#A5F3FC", fontSize: "15px", fontWeight: 700, textTransform: "uppercase" }}>
                  ΚΥΡΙΑΡΧΟ ΧΑΡΑΚΤΗΡΙΣΤΙΚΟ
                </span>
                <span style={{ color: "#00E5FF", fontSize: "32px", fontWeight: 800 }}>{s0}%</span>
              </div>
              <span style={{ color: "#FFFFFF", fontSize: "24px", fontWeight: 800 }}>{traitName0}</span>
              <div style={{ width: "100%", height: "12px", backgroundColor: "#1E293B", borderRadius: "100px", overflow: "hidden" }}>
                <div style={{ width: `${s0}%`, height: "100%", backgroundColor: "#00E5FF", borderRadius: "100px" }} />
              </div>
            </div>

            {/* Secondary Trait */}
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
                <span style={{ color: "#A7F3D0", fontSize: "15px", fontWeight: 700, textTransform: "uppercase" }}>
                  ΔΕΥΤΕΡΕΥΟΝ ΧΑΡΑΚΤΗΡΙΣΤΙΚΟ
                </span>
                <span style={{ color: "#34D399", fontSize: "32px", fontWeight: 800 }}>{s1}%</span>
              </div>
              <span style={{ color: "#FFFFFF", fontSize: "24px", fontWeight: 800 }}>{traitName1}</span>
              <div style={{ width: "100%", height: "12px", backgroundColor: "#1E293B", borderRadius: "100px", overflow: "hidden" }}>
                <div style={{ width: `${s1}%`, height: "100%", backgroundColor: "#34D399", borderRadius: "100px" }} />
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
              Εσύ ποιο είναι το εργασιακό σου προφίλ για τον ΑΣΕΠ;
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
              Κάνε το Τεστ Δωρεάν →
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (e: any) {
    console.error(e);
    return new Response("Failed to generate dynamic skills OG image", { status: 500 });
  }
}