import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Χάρτης Θέσεων ΑΣΕΠ 2ΓΒ/2026",
  description:
    "Διαδραστικός χάρτης της Ελλάδας με όλες τις θέσεις του 2ΓΒ/2026: θέσεις, διορισμοί και βάσεις ανά περιφέρεια, νομό και δήμο, με αναζήτηση τοποθεσίας.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/xartis" },
  openGraph: {
    type: "website",
    locale: "el_GR",
    url: "https://asepanalytics.app/xartis",
    siteName: "ΑΣΕΠ 2ΓΒ/2026 Hub",
    title: "Χάρτης Θέσεων ΑΣΕΠ 2ΓΒ/2026 — Γεωγραφική Κατανομή",
    description:
      "Διαδραστικός χάρτης της Ελλάδας με όλες τις θέσεις του 2ΓΒ/2026: θέσεις, διορισμοί και βάσεις ανά περιφέρεια, νομό και δήμο, με αναζήτηση τοποθεσίας.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Χάρτης Θέσεων ΑΣΕΠ 2ΓΒ/2026 — Γεωγραφική Κατανομή",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Χάρτης Θέσεων ΑΣΕΠ 2ΓΒ/2026 — Γεωγραφική Κατανομή",
    description:
      "Διαδραστικός χάρτης της Ελλάδας με όλες τις θέσεις του 2ΓΒ/2026: θέσεις, διορισμοί και βάσεις ανά περιφέρεια, νομό και δήμο, με αναζήτηση τοποθεσίας.",
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
