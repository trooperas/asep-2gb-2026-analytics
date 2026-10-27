import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Τεστ Επαγωγικού Συλλογισμού Online Δωρεάν — ΑΣΕΠ 2027",
  description:
    "Δωρεάν online εξάσκηση στον επαγωγικό συλλογισμό για τον γραπτό διαγωνισμό του ΑΣΕΠ. Διαδραστικά σχήματα, μοτίβα matrix, κανόνες επίλυσης και άμεσες απαντήσεις.",
  alternates: {
    canonical: "/proetoimasia/epagogikos-syllogismos",
  },
  keywords: [
    "τεστ επαγωγικου συλλογισμου online",
    "δωρεαν τεστ επαγωγικου συλλογισμου",
    "επαγωγικος συλλογισμος ασεπ",
    "επαγωγικος συλλογισμος παραδειγματα",
    "ασκησεις επαγωγικου συλλογισμου",
    "ασεπ τεστ δεξιοτητων online",
    "τεστ δεξιοτητων δωρεαν",
  ],
  openGraph: {
    type: "website",
    locale: "el_GR",
    title: "Τεστ Επαγωγικού Συλλογισμού Online — ΑΣΕΠ 2027",
    description: "Δωρεάν διαδραστικό τεστ επαγωγικού συλλογισμού με ανάλυση κανόνων για τον διαγωνισμό ΑΣΕΠ.",
    url: "https://asepanalytics.app/proetoimasia/epagogikos-syllogismos",
    siteName: "ΑΣΕΠ Analytics Hub",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Τεστ Επαγωγικού Συλλογισμού ΑΣΕΠ",
      },
    ],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}