import type { Metadata } from "next";
import stats from "@/public/data/global_stats.json";
import Hero from "@/components/hero/Hero";
import HomeFaq, { homeFaq } from "@/components/home/HomeFaq";

const pageTitle =
  "ΑΣΕΠ 2ΓΒ/2026 Αποτελέσματα (2gb) — Βάσεις & Στατιστικά";
const pageDescription =
  "Τα πλήρη αποτελέσματα του ΑΣΕΠ 2ΓΒ/2026 (2gb, 2by, 2βγ): 20.828 υποψήφιοι, 3.819 διοριστέοι, βάσεις ανά ειδικότητα, στατιστικά και χάρτης θέσεων.";

export const metadata: Metadata = {
  title: { absolute: pageTitle },
  description: pageDescription,
  keywords: [
    "2ΓΒ/2026",
    "2ΓΒ 2026 αποτελέσματα",
    "2gb 2026",
    "2by 2026",
    "apotelesmata 2gb",
    "στατιστικά 2ΓΒ/2026",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "https://asepanalytics.app",
    locale: "el_GR",
    type: "website",
    siteName: "ΑΣΕΠ Analytics Hub",
    title: pageTitle,
    description: pageDescription,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: ["/og-image.png"],
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: homeFaq.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.a,
    },
  })),
};

export default function Home() {
  return (
    <main>
      <Hero stats={stats} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <HomeFaq />
    </main>
  );
}