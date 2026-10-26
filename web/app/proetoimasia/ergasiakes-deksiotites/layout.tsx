import type { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const t0 = (sp?.t0 as string) || "teamwork";
  const s0 = (sp?.s0 as string) || "92";
  const t1 = (sp?.t1 as string) || "results";
  const s1 = (sp?.s1 as string) || "84";

  // Πλήρες, απόλυτο URL της δυναμικής κάρτας εικόνας
  const ogImageUrl = `https://asepanalytics.app/api/og?t0=${t0}&s0=${s0}&t1=${t1}&s1=${s1}`;

  return {
    title: "Τεστ Εργασιακών Δεξιοτήτων (OPQ32) — ΑΣΕΠ 2027",
    description:
      "Δωρεάν online προσομοίωση 76 τριάδων εργασιακής συμπεριφοράς. Ανακαλύψτε το προφίλ σας για τον επόμενο γραπτό διαγωνισμό ΑΣΕΠ.",
    alternates: {
      canonical: "/proetoimasia/ergasiakes-deksiotites",
    },
    openGraph: {
      type: "website",
      locale: "el_GR",
      url: `https://asepanalytics.app/proetoimasia/ergasiakes-deksiotites?t0=${t0}&s0=${s0}&t1=${t1}&s1=${s1}`,
      title: "Τεστ Εργασιακών Δεξιοτήτων (OPQ32) — Το Προφίλ μου",
      description: `Ολοκλήρωσα την επίσημη προσομοίωση δεξιοτήτων του ΑΣΕΠ! Δείτε την ανάλυση του εργασιακού μου προφίλ.`,
      siteName: "ΑΣΕΠ Analytics Hub",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: "Τεστ Εργασιακών Δεξιοτήτων ΑΣΕΠ — Προσωπικό Προφίλ",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Τεστ Εργασιακών Δεξιοτήτων (OPQ32) — ΑΣΕΠ 2027",
      description: "Δωρεάν προσομοίωση εργασιακής συμπεριφοράς για τον διαγωνισμό ΑΣΕΠ.",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}