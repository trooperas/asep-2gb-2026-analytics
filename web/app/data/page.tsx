import React from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import {
  Database,
  Download,
  ShieldCheck,
  Scale,
  FileSpreadsheet,
  ChevronDown,
} from "lucide-react";

export const metadata = {
  title: "Ανοιχτά Δεδομένα — Dataset ΑΣΕΠ 2ΓΒ/2026 (CC BY 4.0)",
  description:
    "Τα δημόσια δεδομένα θέσεων του ΑΣΕΠ 2ΓΒ/2026 σε CSV και JSON: 2.723 θέσεις, 551 κωδικοί κενών θέσεων (928 θέσεις) και στατιστικά 52 ειδικοτήτων. Άδεια CC BY 4.0.",
  alternates: {
    canonical: "/data",
  },
  openGraph: {
    type: "website",
    locale: "el_GR",
    url: "https://asepanalytics.app/data",
    title: "Ανοιχτά Δεδομένα — Dataset ΑΣΕΠ 2ΓΒ/2026 (CC BY 4.0)",
    description:
      "Τα δημόσια δεδομένα θέσεων του ΑΣΕΠ 2ΓΒ/2026 σε CSV και JSON: 2.723 θέσεις, 551 κωδικοί κενών θέσεων (928 θέσεις) και στατιστικά 52 ειδικοτήτων. Άδεια CC BY 4.0.",
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
    title: "Ανοιχτά Δεδομένα — Dataset ΑΣΕΠ 2ΓΒ/2026 (CC BY 4.0)",
    description:
      "Τα δημόσια δεδομένα θέσεων του ΑΣΕΠ 2ΓΒ/2026 σε CSV και JSON: 2.723 θέσεις, 551 κωδικοί κενών θέσεων (928 θέσεις) και στατιστικά 52 ειδικοτήτων. Άδεια CC BY 4.0.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ΑΣΕΠ 2ΓΒ/2026 Hub Preview Banner",
      },
    ],
  },
};

const datasetJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://asepanalytics.app/data#webpage",
      url: "https://asepanalytics.app/data",
      name: metadata.title,
      inLanguage: "el",
      isPartOf: {
        "@type": "WebSite",
        "@id": "https://asepanalytics.app/#website",
        url: "https://asepanalytics.app",
        name: "ΑΣΕΠ 2ΓΒ/2026 Hub",
      },
      about: [
        { "@id": "https://asepanalytics.app/data#dataset-theseis" },
        { "@id": "https://asepanalytics.app/data#dataset-kenes-theseis" },
        { "@id": "https://asepanalytics.app/data#dataset-eidikotites" },
      ],
      license: "https://creativecommons.org/licenses/by/4.0/",
    },
    {
      "@type": "DataCatalog",
      "@id": "https://asepanalytics.app/data#catalog",
      name: "ΑΣΕΠ Analytics Hub — Ανοιχτά Δεδομένα",
      url: "https://asepanalytics.app/data",
      license: "https://creativecommons.org/licenses/by/4.0/",
      publisher: { "@id": "https://asepanalytics.app/about#person" },
    },
    {
      "@type": "Dataset",
      "@id": "https://asepanalytics.app/data#dataset-theseis",
      name: "Θέσεις ΑΣΕΠ 2ΓΒ/2026 ανά ειδικότητα, φορέα και έδρα",
      description:
        "2.723 θέσεις του διαγωνισμού ΑΣΕΠ 2ΓΒ/2026, καταγραμμένες ανά ειδικότητα, φορέα και έδρα, με 4.745 θέσεις συνολικά.",
      url: "https://asepanalytics.app/data",
      license: "https://creativecommons.org/licenses/by/4.0/",
      creator: { "@id": "https://asepanalytics.app/about#person" },
      publisher: { "@id": "https://asepanalytics.app/about#person" },
      isAccessibleForFree: true,
      inLanguage: "el",
      keywords: [
        "ΑΣΕΠ",
        "2ΓΒ/2026",
        "θέσεις",
        "ανοιχτά δεδομένα",
        "CSV",
        "JSON",
      ],
      spatialCoverage: { "@type": "Place", name: "Ελλάδα" },
      temporalCoverage: "2026",
      datePublished: "2026-11-01",
      includedInDataCatalog: { "@id": "https://asepanalytics.app/data#catalog" },
      distribution: [
        {
          "@type": "DataDownload",
          name: "CSV (UTF-8)",
          contentUrl:
            "https://asepanalytics.app/data/dataset/asep-2gb2026-theseis.csv",
          encodingFormat: "text/csv",
        },
        {
          "@type": "DataDownload",
          name: "JSON",
          contentUrl: "https://asepanalytics.app/data/positions.json",
          encodingFormat: "application/json",
        },
      ],
    },
    {
      "@type": "Dataset",
      "@id": "https://asepanalytics.app/data#dataset-kenes-theseis",
      name: "Κενές θέσεις ΑΣΕΠ 2ΓΒ/2026",
      description:
        "Οι 551 κωδικοί θέσεων που παρέμειναν κενές (928 θέσεις συνολικά) μετά την ολοκλήρωση του διαγωνισμού 2ΓΒ/2026.",
      url: "https://asepanalytics.app/data",
      license: "https://creativecommons.org/licenses/by/4.0/",
      creator: { "@id": "https://asepanalytics.app/about#person" },
      publisher: { "@id": "https://asepanalytics.app/about#person" },
      isAccessibleForFree: true,
      inLanguage: "el",
      keywords: [
        "ΑΣΕΠ",
        "2ΓΒ/2026",
        "κενές θέσεις",
        "ανοιχτά δεδομένα",
        "CSV",
        "JSON",
      ],
      spatialCoverage: { "@type": "Place", name: "Ελλάδα" },
      temporalCoverage: "2026",
      datePublished: "2026-11-01",
      includedInDataCatalog: { "@id": "https://asepanalytics.app/data#catalog" },
      distribution: [
        {
          "@type": "DataDownload",
          name: "CSV (UTF-8)",
          contentUrl:
            "https://asepanalytics.app/data/dataset/asep-2gb2026-kenes-theseis.csv",
          encodingFormat: "text/csv",
        },
        {
          "@type": "DataDownload",
          name: "JSON",
          contentUrl: "https://asepanalytics.app/data/kenes_theseis.json",
          encodingFormat: "application/json",
        },
      ],
    },
    {
      "@type": "Dataset",
      "@id": "https://asepanalytics.app/data#dataset-eidikotites",
      name: "Στατιστικά βάσεων ανά ειδικότητα — ΑΣΕΠ 2ΓΒ/2026",
      description:
        "Στατιστικά βαθμολογιών και αποτελεσμάτων για όλες τις 52 ειδικότητες του διαγωνισμού ΑΣΕΠ 2ΓΒ/2026.",
      url: "https://asepanalytics.app/data",
      license: "https://creativecommons.org/licenses/by/4.0/",
      creator: { "@id": "https://asepanalytics.app/about#person" },
      publisher: { "@id": "https://asepanalytics.app/about#person" },
      isAccessibleForFree: true,
      inLanguage: "el",
      keywords: [
        "ΑΣΕΠ",
        "2ΓΒ/2026",
        "ειδικότητες",
        "στατιστικά",
        "ανοιχτά δεδομένα",
        "CSV",
        "JSON",
      ],
      spatialCoverage: { "@type": "Place", name: "Ελλάδα" },
      temporalCoverage: "2026",
      datePublished: "2026-11-01",
      includedInDataCatalog: { "@id": "https://asepanalytics.app/data#catalog" },
      distribution: [
        {
          "@type": "DataDownload",
          name: "CSV (UTF-8)",
          contentUrl:
            "https://asepanalytics.app/data/dataset/asep-2gb2026-eidikotites.csv",
          encodingFormat: "text/csv",
        },
        {
          "@type": "DataDownload",
          name: "JSON",
          contentUrl: "https://asepanalytics.app/data/eidikotites_stats.json",
          encodingFormat: "application/json",
        },
      ],
    },
  ],
};

export default function DataPage() {
  return (
    <main className="min-h-screen pt-20 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(datasetJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Breadcrumb href="/" label="Επιστροφή στην Αρχική" />

      <div className="mx-auto w-full max-w-4xl">
        <div className="space-y-10">
          {/* Title */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-semibold uppercase tracking-wider">
              <Database className="w-3.5 h-3.5" />
              Open Data • CC BY 4.0
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-white">
              Ανοιχτά Δεδομένα <span className="text-slate-400">(Open Data)</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
              Τα δημόσια δεδομένα θέσεων και στατιστικών του ΑΣΕΠ 2ΓΒ/2026, έτοιμα
              για έρευνα, δημοσιογραφία και εφαρμογές — με άδεια Creative Commons
              Αναφορά 4.0 Διεθνής (CC BY 4.0).
            </p>
          </div>

          {/* License Box */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Scale className="w-5 h-5 text-[#00E5FF]" />
              Άδεια Χρήσης — CC BY 4.0
            </div>
            <p className="text-slate-300 leading-relaxed">
              Όλα τα datasets διατίθενται υπό την άδεια{" "}
              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00E5FF] hover:underline font-medium"
              >
                Creative Commons Αναφορά 4.0 Διεθνής (CC BY 4.0)
              </a>
              .
            </p>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <p className="text-sm text-slate-300 leading-relaxed">
                Επιτρέπεται η ελεύθερη επαναχρησιμοποίηση, τροποποίηση και
                διανομή του υλικού,{" "}
                <strong className="text-white">
                  συμπεριλαμβανομένης της εμπορικής χρήσης
                </strong>
                , με τον όρο ότι θα διατηρηθεί η αναφορά στον δημιουργό.
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong>Απόδοση:</strong> ASEP Analytics Hub (asepanalytics.app),
                Fokion Chiotakis
              </p>
            </div>
          </div>

          {/* Dataset 1 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-[#00E5FF]" />
              Θέσεις ΑΣΕΠ 2ΓΒ/2026 ανά ειδικότητα, φορέα και έδρα
            </h2>
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
              Ολόκληρο το σύνολο των 2.723 θέσεων του διαγωνισμού, με τα κύρια
              χαρακτηριστικά κάθε θέσης (ειδικότητα, φορέας, έδρα, νομός, δήμος,
              τίτλοι σπουδών, προσόντα, εντοπιότητα).
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-semibold">
                2.723 θέσεις
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700 text-slate-300 text-xs font-semibold">
                4.745 θέσεις στους πίνακες
              </span>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="/data/dataset/asep-2gb2026-theseis.csv"
                download
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium hover:border-[#00E5FF]/50 hover:text-white transition-colors no-underline"
              >
                <Download className="w-4 h-4" />
                Λήψη CSV (περίπου 0,9 MB)
              </a>
              <a
                href="/data/positions.json"
                download
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium hover:border-[#00E5FF]/50 hover:text-white transition-colors no-underline"
              >
                <Download className="w-4 h-4" />
                Λήψη JSON
              </a>
            </div>
          </div>

          {/* Dataset 2 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-[#00E5FF]" />
              Κενές θέσεις ΑΣΕΠ 2ΓΒ/2026
            </h2>
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
              Οι κωδικοί θέσεων που δεν καλύφθηκαν μετά την ολοκλήρωση των
              διορισμών: συνολικά 928 κενές θέσεις σε 551 διαφορετικούς κωδικούς,
              ώστε να εντοπίζετε εύκολα τις ευκαιρίες που παρέμειναν ανοικτές.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-semibold">
                928 κενές θέσεις
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700 text-slate-300 text-xs font-semibold">
                551 κωδικοί θέσεων
              </span>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="/data/dataset/asep-2gb2026-kenes-theseis.csv"
                download
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium hover:border-[#00E5FF]/50 hover:text-white transition-colors no-underline"
              >
                <Download className="w-4 h-4" />
                Λήψη CSV (περίπου 0,1 MB)
              </a>
              <a
                href="/data/kenes_theseis.json"
                download
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium hover:border-[#00E5FF]/50 hover:text-white transition-colors no-underline"
              >
                <Download className="w-4 h-4" />
                Λήψη JSON
              </a>
            </div>
          </div>

          {/* Dataset 3 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-[#00E5FF]" />
              Στατιστικά βάσεων ανά ειδικότητα — ΑΣΕΠ 2ΓΒ/2026
            </h2>
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
              Στατιστικά βαθμολογιών (ελάχιστη, μέγιστη, μέση) και διοριστέων για
              όλες τις 52 ειδικότητες του διαγωνισμού, με πληροφορίες για
              μεταπτυχιακούς, διδακτορικούς και εντοπιότητα.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-semibold">
                52 ειδικότητες
              </span>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="/data/dataset/asep-2gb2026-eidikotites.csv"
                download
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium hover:border-[#00E5FF]/50 hover:text-white transition-colors no-underline"
              >
                <Download className="w-4 h-4" />
                Λήψη CSV (περίπου 0,01 MB)
              </a>
              <a
                href="/data/eidikotites_stats.json"
                download
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium hover:border-[#00E5FF]/50 hover:text-white transition-colors no-underline"
              >
                <Download className="w-4 h-4" />
                Λήψη JSON
              </a>
            </div>
          </div>

          {/* Citation */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#00E5FF]" />
              Πώς να μας αναφέρετε (Citation)
            </h2>
            <p className="text-sm text-slate-400">
              Αν χρησιμοποιείτε αυτά τα δεδομένα σε έρευνα ή δημοσίευση,
              χρησιμοποιήστε την παρακάτω μορφή αναφοράς:
            </p>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <code className="text-sm text-[#00E5FF] leading-relaxed block whitespace-pre-wrap break-words">
                Chiotakis, F. (2026). ΑΣΕΠ 2ΓΒ/2026 — Dataset αποτελεσμάτων [Data
                set]. ASEP Analytics Hub. https://asepanalytics.app/data (CC BY
                4.0).
              </code>
            </div>
          </div>

          {/* Data Dictionary */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-[#00E5FF]" />
              Λεξικό Δεδομένων (Data Dictionary)
            </h2>
            <p className="text-sm text-slate-400">
              Περιγραφή των στηλών που υπάρχουν σε κάθε CSV αρχείο.
            </p>
            <div className="space-y-2.5">
              <details className="group glass rounded-2xl border border-white/10 overflow-hidden open:border-[#00E5FF]/40 transition-colors">
                <summary className="flex items-center justify-between gap-3 p-4 sm:p-5 cursor-pointer select-none list-none">
                  <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                    Dataset 1 — Θέσεις (asep-2gb2026-theseis.csv)
                  </h3>
                  <span className="shrink-0 w-7 h-7 rounded-lg bg-white/5 group-open:bg-[#00E5FF] group-open:text-slate-950 flex items-center justify-center text-slate-300 transition-transform duration-300 group-open:rotate-180">
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </summary>
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 -mt-1 text-sm text-slate-300 leading-relaxed space-y-2">
                  <p>
                    Κύριο dataset με όλες τις θέσεις του διαγωνισμού, συνοδευόμενες
                    από τα βασικά χαρακτηριστικά κάθε θέσης.
                  </p>
                  <p className="text-xs text-slate-400">
                    Στήλες:{" "}
                    <code className="text-[#00E5FF]">
                      kod_thesis, eidikotita, kod_organogrammatos, foreas,
                      foreas_main, edra, perifereia, dimos, nomos, titloi,
                      prosonta, entopiotita, theseis
                    </code>
                  </p>
                </div>
              </details>

              <details className="group glass rounded-2xl border border-white/10 overflow-hidden open:border-[#00E5FF]/40 transition-colors">
                <summary className="flex items-center justify-between gap-3 p-4 sm:p-5 cursor-pointer select-none list-none">
                  <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                    Dataset 2 — Κενές θέσεις (asep-2gb2026-kenes-theseis.csv)
                  </h3>
                  <span className="shrink-0 w-7 h-7 rounded-lg bg-white/5 group-open:bg-[#00E5FF] group-open:text-slate-950 flex items-center justify-center text-slate-300 transition-transform duration-300 group-open:rotate-180">
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </summary>
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 -mt-1 text-sm text-slate-300 leading-relaxed space-y-2">
                  <p>
                    Κωδικοί θέσεων που δεν καλύφθηκαν, με στοιχεία φορέα και
                    τοποθεσίας, καθώς και τις συνολικές θέσεις, τους διορισμούς και
                    τις κενές θέσεις κάθε κωδικού (total_slots, appointed, vacant).
                  </p>
                  <p className="text-xs text-slate-400">
                    Στήλες:{" "}
                    <code className="text-[#00E5FF]">
                      kod_thesis, foreas, eidikotita, perifereia, dimos, nomos,
                      edra, titloi, prosonta, entopiotita, total_slots,
                      appointed, vacant
                    </code>
                  </p>
                </div>
              </details>

              <details className="group glass rounded-2xl border border-white/10 overflow-hidden open:border-[#00E5FF]/40 transition-colors">
                <summary className="flex items-center justify-between gap-3 p-4 sm:p-5 cursor-pointer select-none list-none">
                  <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                    Dataset 3 — Στατιστικά ειδικοτήτων
                    (asep-2gb2026-eidikotites.csv)
                  </h3>
                  <span className="shrink-0 w-7 h-7 rounded-lg bg-white/5 group-open:bg-[#00E5FF] group-open:text-slate-950 flex items-center justify-center text-slate-300 transition-transform duration-300 group-open:rotate-180">
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </summary>
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 -mt-1 text-sm text-slate-300 leading-relaxed space-y-2">
                  <p>
                    Στατιστικά βαθμολογιών και αποτελεσμάτων ανά ειδικότητα, με
                    πληροφορίες για μεταπτυχιακούς, διδακτορικούς και εντοπιότητα.
                  </p>
                  <p className="text-xs text-slate-400">
                    Στήλες:{" "}
                    <code className="text-[#00E5FF]">
                      slug, eidikotita, count, dioristoi, pososto, min_vath,
                      max_vath, avg_vath, me_metaptyxiako, me_didaktoriko,
                      me_entopiotita
                    </code>
                  </p>
                </div>
              </details>
            </div>
          </div>

          {/* Source, method & limitations */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#00E5FF]" />
              Πηγή, μέθοδος & περιορισμοί
            </h2>
            <div className="text-sm text-slate-300 leading-relaxed space-y-3">
              <p>
                Τα δεδομένα προέρχονται από τις επίσημες δημόσιες ανακοινώσεις του
                ΑΣΕΠ για τον διαγωνισμό 2ΓΒ/2026. Το στιγμιότυπο (snapshot)
                ανακτήθηκε στις <strong>1 Νοεμβρίου 2026</strong>.
              </p>
              <p>
                <strong>GDPR-conscious:</strong> Τα datasets δεν περιλαμβάνουν
                προσωπικά στοιχεία υποψηφίων (κανένα όνομα, ΑΔΤ ή ατομική
                βαθμολογία). Περιλαμβάνουν μόνο θέσεις, γεωγραφική κατανομή και
                συγκεντρωτικά στατιστικά ανά ειδικότητα.
              </p>
              <p>
                <strong>Χωρίς εγγύηση:</strong> Δεν παρέχεται καμία εγγύηση για την
                ακρίβεια ή την πληρότητα των δεδομένων. Για επίσημη χρήση,
                επαληθεύστε πάντα έναντι των αρχικών πηγών του ΑΣΕΠ στο{" "}
                <a
                  href="https://info.asep.gr/"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-[#00E5FF] hover:underline"
                >
                  info.asep.gr
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
