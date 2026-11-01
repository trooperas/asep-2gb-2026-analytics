import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Κενές Θέσεις ΑΣΕΠ 2ΓΒ/2026",
  description:
    "Οι θέσεις του 2ΓΒ/2026 που έμειναν ακάλυπτες λόγω έλλειψης προσόντων ή μη δήλωσης: πλήρης κατάλογος με φορέα, ειδικότητα, περιφέρεια και αριθμό θέσεων.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/kenes-theseis" },
  openGraph: {
    type: "website",
    locale: "el_GR",
    url: "https://asepanalytics.app/kenes-theseis",
    siteName: "ΑΣΕΠ 2ΓΒ/2026 Hub",
    title: "Κενές Θέσεις ΑΣΕΠ 2ΓΒ/2026 — Κατάλογος ανά Ειδικότητα",
    description:
      "Οι θέσεις του 2ΓΒ/2026 που έμειναν ακάλυπτες λόγω έλλειψης προσόντων ή μη δήλωσης: πλήρης κατάλογος με φορέα, ειδικότητα, περιφέρεια και αριθμό θέσεων.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Κενές Θέσεις ΑΣΕΠ 2ΓΒ/2026 — Κατάλογος ανά Ειδικότητα",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Κενές Θέσεις ΑΣΕΠ 2ΓΒ/2026 — Κατάλογος ανά Ειδικότητα",
    description:
      "Οι θέσεις του 2ΓΒ/2026 που έμειναν ακάλυπτες λόγω έλλειψης προσόντων ή μη δήλωσης: πλήρης κατάλογος με φορέα, ειδικότητα, περιφέρεια και αριθμό θέσεων.",
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
