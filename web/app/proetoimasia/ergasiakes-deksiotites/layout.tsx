import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Τεστ Εργασιακών Δεξιοτήτων (OPQ32) — ΑΣΕΠ 2027",
  description:
    "Δωρεάν online προσομοίωση 76 τριάδων εργασιακής συμπεριφοράς (forced-choice). Ανακαλύψτε το επαγγελματικό σας προφίλ για τον 3ο διαγωνισμό ΑΣΕΠ.",
  alternates: {
    canonical: "/proetoimasia/ergasiakes-deksiotites",
  },
  openGraph: {
    type: "website",
    locale: "el_GR",
    url: "https://asepanalytics.app/proetoimasia/ergasiakes-deksiotites",
    title: "Τεστ Εργασιακών Δεξιοτήτων (OPQ32) — ΑΣΕΠ 2027",
    description: "Δωρεάν online προσομοίωση 76 τριάδων εργασιακής συμπεριφοράς.",
    siteName: "ΑΣΕΠ Analytics Hub",
    images: [
      {
        url: "https://asepanalytics.app/og-image.png", // 👈 ΑΠΟΛΥΤΩΣ ΕΓΚΥΡΟ PNG (1200x630)
        width: 1200,
        height: 630,
        alt: "Τεστ Εργασιακών Δεξιοτήτων ΑΣΕΠ — OPQ32",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Τεστ Εργασιακών Δεξιοτήτων (OPQ32) — ΑΣΕΠ 2027",
    description: "Δωρεάν προσομοίωση εργασιακής συμπεριφοράς για τον διαγωνισμό ΑΣΕΠ.",
    images: ["https://asepanalytics.app/og-image.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}