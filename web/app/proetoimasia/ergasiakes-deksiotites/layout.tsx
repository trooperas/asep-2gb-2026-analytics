import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Τεστ Εργασιακών Δεξιοτήτων & Συμπεριφοράς (OPQ32) — ΑΣΕΠ 2027",
  description:
    "Δωρεάν online προσομοίωση του επίσημου τεστ εργασιακής αποτελεσματικότητας του ΑΣΕΠ με τριάδες δηλώσεων (OPQ32) και άμεση ανάλυση προφίλ ικανοτήτων.",
  alternates: {
    canonical: "/proetoimasia/ergasiakes-deksiotites",
  },
  keywords: [
    "εργασιακες δεξιοτητες ασεπ",
    "τεστ εργασιακης συμπεριφορας ασεπ",
    "opq32 ασεπ",
    "76 τριαδες ασεπ",
    "εργασιακη αποτελεσματικοτητα ασεπ test",
    "τεστ δεξιοτητων online δωρεαν",
  ],
  openGraph: {
    type: "website",
    locale: "el_GR",
    title: "Τεστ Εργασιακών Δεξιοτήτων (OPQ32) — ΑΣΕΠ 2027",
    description:
      "Δωρεάν online προσομοίωση 76 τριάδων εργασιακής συμπεριφοράς. Ανακαλύψτε το προφίλ σας για τον επόμενο γραπτό διαγωνισμό ΑΣΕΠ.",
    url: "https://asepanalytics.app/proetoimasia/ergasiakes-deksiotites",
    siteName: "ΑΣΕΠ 2ΓΒ/2026 Hub",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Τεστ Εργασιακών Δεξιοτήτων ΑΣΕΠ",
      },
    ],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}