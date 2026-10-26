import type { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const t0 = (sp?.t0 as string) || null;
  const s0 = (sp?.s0 as string) || null;
  const t1 = (sp?.t1 as string) || null;
  const s1 = (sp?.s1 as string) || null;

  // Αν υπάρχουν αποτελέσματα χρήστη, φτιάχνουμε το εξατομικευμένο .png URL!
  const hasUserScore = t0 && s0;
  const dynamicImageUrl = hasUserScore
    ? `https://asepanalytics.app/api/og/image.png?t0=${t0}&s0=${s0}&t1=${t1 || "results"}&s1=${s1 || "80"}`
    : "https://asepanalytics.app/og-image.png";

  const pageTitle = hasUserScore
    ? "Τεστ Εργασιακών Δεξιοτήτων (OPQ32) — Το Προφίλ μου"
    : "Τεστ Εργασιακών Δεξιοτήτων (OPQ32) — ΑΣΕΠ 2027";

  const pageDesc = hasUserScore
    ? "Ολοκλήρωσα την επίσημη προσομοίωση 76 τριάδων του ΑΣΕΠ. Δείτε την ανάλυση του επαγγελματικού μου προφίλ!"
    : "Δωρεάν online προσομοίωση 76 τριάδων εργασιακής συμπεριφοράς (forced-choice) για τον 3ο διαγωνισμό ΑΣΕΠ.";

  return {
    title: pageTitle,
    description: pageDesc,
    openGraph: {
      type: "website",
      locale: "el_GR",
      url: hasUserScore
        ? `https://asepanalytics.app/proetoimasia/ergasiakes-deksiotites?t0=${t0}&s0=${s0}&t1=${t1}&s1=${s1}`
        : "https://asepanalytics.app/proetoimasia/ergasiakes-deksiotites",
      title: pageTitle,
      description: pageDesc,
      siteName: "ΑΣΕΠ Analytics Hub",
      images: [
        {
          url: dynamicImageUrl,
          width: 1200,
          height: 630,
          alt: "Τεστ Εργασιακών Δεξιοτήτων ΑΣΕΠ — Προσωπικό Προφίλ",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDesc,
      images: [dynamicImageUrl],
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}