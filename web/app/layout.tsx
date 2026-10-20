import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Analytics } from "@vercel/analytics/react";

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
  metadataBase: new URL("https://asepanalytics.app"),
  title: {
    default: "ΑΣΕΠ 2ΓΒ/2026 Hub — Αποτελέσματα, Χάρτης & Βάσεις",
    template: "%s | ΑΣΕΠ 2ΓΒ/2026 Hub",
  },
  description:
    "Πλατφόρμα ανάλυσης αποτελεσμάτων ΑΣΕΠ 2ΓΒ/2026. Αναζήτηση 51.900+ υποψηφίων, βάσεις 52 ειδικοτήτων, διαδραστικός χάρτης θέσεων & AI βοηθός.",
  // 👈 ΑΦΑΙΡΕΘΗΚΕ ΤΟ CANONICAL ΑΠΟ ΕΔΩ ΓΙΑ ΝΑ ΜΗΝ ΤΟ ΚΛΗΡΟΝΟΜΟΥΝ ΟΙ ΥΠΟΣΕΛΙΔΕΣ!
  keywords: [
    "ΑΣΕΠ",
    "2ΓΒ/2026",
    "2ΓΒ 2026 αποτελέσματα",
    "διοριστέοι 2ΓΒ",
    "βάσεις 2ΓΒ",
    "πίνακες κατάταξης ΑΣΕΠ",
    "στατιστικά 2ΓΒ/2026",
    "ΑΣΕΠ χάρτης θέσεων",
  ],
  authors: [{ name: "Fokion", url: "https://www.linkedin.com/in/fokionas/" }],
  creator: "Fokion",
  openGraph: {
    type: "website",
    locale: "el_GR",
    url: "https://asepanalytics.app",
    title: "ΑΣΕΠ 2ΓΒ/2026 Hub — Πλήρης Ανάλυση Αποτελεσμάτων & AI",
    description:
      "Εξερεύνησε τα αποτελέσματα του ΑΣΕΠ 2ΓΒ/2026: κατανομή θέσεων, βαθμολογίες ανά ειδικότητα, γεωγραφικός χάρτης και έξυπνη αναζήτηση.",
    siteName: "ΑΣΕΠ 2ΓΒ/2026 Hub",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ΑΣΕΠ 2ΓΒ/2026 Hub Preview Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ΑΣΕΠ 2ΓΒ/2026 Hub — Αποτελέσματα & Στατιστικά",
    description: "Διαδραστική πλατφόρμα ανάλυσης αποτελεσμάτων ΑΣΕΠ 2ΓΒ/2026.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "ΑΣΕΠ 2ΓΒ/2026 Analytics Hub",
  url: "https://asepanalytics.app",
  description:
    "Διαδραστική πλατφόρμα στατιστικών και ανάλυσης για τον γραπτό διαγωνισμό ΑΣΕΠ 2ΓΒ/2026.",
  applicationCategory: "EducationalApplication",
  operatingSystem: "All",
  creator: {
    "@type": "Person",
    name: "Fokion",
    url: "https://www.linkedin.com/in/fokionas/",
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
        {/* Idiomatic App Router placement: το script μπαίνει στο body (απόλυτα έγκυρο για τη Google) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <Header />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}