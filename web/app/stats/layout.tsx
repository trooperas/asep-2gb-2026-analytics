import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Στατιστικά Διαγωνισμού 2ΓΒ/2026",
  description:
    "Ζωντανά στατιστικά του 2ΓΒ/2026: κατανομή υποψηφίων, μέσες και μέγιστες βαθμολογίες, ποσοστά επιτυχίας και διορισμών ανά ειδικότητα, σε διαδραστικά γραφήματα.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/stats" },
  openGraph: {
    type: "website",
    locale: "el_GR",
    url: "https://asepanalytics.app/stats",
    siteName: "ΑΣΕΠ 2ΓΒ/2026 Hub",
    title: "Στατιστικά Διαγωνισμού 2ΓΒ/2026 — Βάσεις & Διορισμοί",
    description:
      "Ζωντανά στατιστικά του 2ΓΒ/2026: κατανομή υποψηφίων, μέσες και μέγιστες βαθμολογίες, ποσοστά επιτυχίας και διορισμών ανά ειδικότητα, σε διαδραστικά γραφήματα.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Στατιστικά Διαγωνισμού 2ΓΒ/2026 — Βάσεις & Διορισμοί",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Στατιστικά Διαγωνισμού 2ΓΒ/2026 — Βάσεις & Διορισμοί",
    description:
      "Ζωντανά στατιστικά του 2ΓΒ/2026: κατανομή υποψηφίων, μέσες και μέγιστες βαθμολογίες, ποσοστά επιτυχίας και διορισμών ανά ειδικότητα, σε διαδραστικά γραφήματα.",
    images: ["/og-image.png"],
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
