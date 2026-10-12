import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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

export const metadata = {
  metadataBase: new URL("https://asep-2gb-2026.vercel.app"),
  title: {
    default: "ΑΣΕΠ 2ΓΒ/2026 Analytics Hub — Αποτελέσματα, Χάρτης & AI Βοηθός",
    template: "%s | ΑΣΕΠ 2ΓΒ/2026 Hub",
  },
  description:
    "Διαδραστική πλατφόρμα στατιστικών και ανάλυσης για τον γραπτό διαγωνισμό ΑΣΕΠ 2ΓΒ/2026. 51.900+ υποψήφιοι, 52 ειδικότητες, γεωγραφικός χάρτης θέσεων και AI Assistant.",
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
    url: "https://asep-2gb-2026.vercel.app",
    title: "ΑΣΕΠ 2ΓΒ/2026 Hub — Πλήρης Ανάλυση Αποτελεσμάτων & AI",
    description:
      "Εξερεύνησε τα αποτελέσματα του ΑΣΕΠ 2ΓΒ/2026: κατανομή θέσεων, βαθμολογίες ανά ειδικότητα, γεωγραφικός χάρτης και έξυπνη αναζήτηση.",
    siteName: "ΑΣΕΠ 2ΓΒ/2026 Hub",
  },
  twitter: {
    card: "summary_large_image",
    title: "ΑΣΕΠ 2ΓΒ/2026 Hub — Αποτελέσματα & Στατιστικά",
    description: "Διαδραστική πλατφόρμα ανάλυσης αποτελεσμάτων ΑΣΕΠ 2ΓΒ/2026.",
  },
  robots: {
    index: true,
    follow: true,
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
        <Footer />
      </body>
    </html>
  );
}