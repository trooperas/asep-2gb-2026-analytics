import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // Μετατροπή slug σε ευανάγνωστο τίτλο (π.χ. pe-pliroforikis -> Pe Pliroforikis)
  const titleFormatted = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${titleFormatted} — Αποτελέσματα & Βαθμολογίες 2ΓΒ/2026`,
    description: `Στατιστικά, πίνακες διοριστέων, βάσεις και κατανομή μορίων για την ειδικότητα ${titleFormatted} στον διαγωνισμό ΑΣΕΠ 2ΓΒ/2026.`,
    openGraph: {
      title: `${titleFormatted} | ΑΣΕΠ 2ΓΒ/2026 Analytics Hub`,
      description: `Αναλυτική βαθμολογική κατάταξη, μόρια και διοριστέοι για την ειδικότητα ${titleFormatted}.`,
    },
  };
}

export default function EidikotitaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}