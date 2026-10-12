import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";

const inter = Inter({
  subsets: ["latin", "greek"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ΑΣΕΠ 2ΓΒ/2026 — Αποτελέσματα Πανελλήνιου Γραπτού Διαγωνισμού",
    template: "%s | ΑΣΕΠ 2ΓΒ/2026",
  },
  description:
    "Πλήρη αποτελέσματα του Πανελλήνιου Γραπτού Διαγωνισμού 2ΓΒ/2026. 51.934 υποψήφιοι, 10.545 διοριστέοι, 52 ειδικότητες. Αναζήτηση, στατιστικά, αναλυτικά δεδομένα.",
  keywords: [
    "ΑΣΕΠ 2ΓΒ/2026",
    "Πανελλήνιος Γραπτός Διαγωνισμός",
    "ΑΣΕΠ αποτελέσματα",
    "διοριστέοι",
    "πίνακες κατάταξης",
  ],
  authors: [{ name: "ΑΣΕΠ 2ΓΒ/2026 Hub" }],
  openGraph: {
    title: "ΑΣΕΠ 2ΓΒ/2026 — Αποτελέσματα",
    description: "51.934 υποψήφιοι, 10.545 διοριστέοι, 52 ειδικότητες.",
    type: "website",
    locale: "el_GR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="el"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}