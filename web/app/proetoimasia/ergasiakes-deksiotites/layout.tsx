import type { Metadata } from "next";

type Props = {
  params: { slug?: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { searchParams }: Props
): Promise<Metadata> {
  const t0 = (searchParams.t0 as string) || "teamwork";
  const s0 = (searchParams.s0 as string) || "92";
  const t1 = (searchParams.t1 as string) || "results";
  const s1 = (searchParams.s1 as string) || "84";

  const ogImage = `/api/og?t0=${encodeURIComponent(t0)}&s0=${encodeURIComponent(
    s0
  )}&t1=${encodeURIComponent(t1)}&s1=${encodeURIComponent(s1)}`;

  return {
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
      siteName: "ΑΣΕΠ Analytics Hub",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Τεστ Εργασιακών Δεξιοτήτων ΑΣΕΠ — Προσωπικό Προφίλ",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Τεστ Εργασιακών Δεξιοτήτων (OPQ32) — ΑΣΕΠ 2027",
      description:
        "Δωρεάν προσομοίωση εργασιακής συμπεριφοράς για τον διαγωνισμό ΑΣΕΠ.",
      images: [ogImage],
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}