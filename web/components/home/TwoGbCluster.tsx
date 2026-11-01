import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Stats {
  total_candidates: number;
  total_dioristoi: number;
  total_eidikotites: number;
  pososto_epityxias: number;
  min_vath: number;
  max_vath: number;
  avg_vath: number;
  total_theseis: number;
  kenes_theseis: number;
}

export type HomeFaqItem = { q: string; a: string };

export const homeFaq: HomeFaqItem[] = [
  {
    q: "Τι είναι τα αποτελέσματα ΑΣΕΠ 2ΓΒ/2026;",
    a: "Είναι τα οριστικά αποτελέσματα του 2ου Πανελλήνιου Γραπτού Διαγωνισμού του ΑΣΕΠ, που προκηρύχθηκε ως 2ΓΒ/2026. Περιλαμβάνουν τους πίνακες κατάταξης, τις βάσεις ανά ειδικότητα και τους διοριστέους σε 52 ειδικότητες και 4.747 θέσεις.",
  },
  {
    q: "Γιατί βλέπω τις γραφές 2ΓΒ, 2gb, 2by και 2βγ;",
    a: "Όλες οι γραφές αναφέρονται στην ίδια προκήρυξη: 2ΓΒ/2026 είναι η επίσημη μορφή, ενώ 2gb 2026, 2by 2026, 2βγ και 2γβ/2026 προκύπτουν από λατινικά πληκτρολόγια και παραλλαγές πληκτρολόγησης. Το ίδιο ισχύει για τους όρους «αποτελέσματα 2ΓΒ», «apotelesmata 2gb» και «στατιστικά 2ΓΒ/2026».",
  },
  {
    q: "Πόσοι υποψήφιοι, διοριστέοι και θέσεις υπάρχουν στον 2ΓΒ/2026;",
    a: "Σύμφωνα με τα δεδομένα που έχει επεξεργαστεί το Hub, οι υποψήφιοι είναι 20.828, οι διοριστέοι 3.819 και οι θέσεις 4.747, από τις οποίες 928 έμειναν κενές. Το ποσοστό επιτυχίας διαμορφώνεται στο 18,3%.",
  },
  {
    q: "Ποιες είναι οι βαθμολογίες και οι βάσεις του 2ΓΒ/2026;",
    a: "Η χαμηλότερη βαθμολογία είναι 24,92 μόρια, η υψηλότερη 141,31 μόρια και ο μέσος όρος 80,54 μόρια. Η βάση ορίζεται χωριστά για κάθε ειδικότητα, οπότε η σύγκριση έχει νόημα μόνο εντός της ίδιας ειδικότητας.",
  },
  {
    q: "Πού μπορώ να δω τα στατιστικά (statistika) των αποτελεσμάτων 2ΓΒ/2026;",
    a: "Στη σελίδα Στατιστικά του Hub εμφανίζονται η κατανομή βαθμολογιών, οι διοριστέοι ανά ειδικότητα και συγκριτικά διαγράμματα για κάθε ειδικότητα.",
  },
  {
    q: "Πώς βρίσκω τη θέση μου και τα μόριά μου στον 2ΓΒ/2026;",
    a: "Με αναζήτηση μέσω του Αριθμού Μητρώου (ΑΜ) του υποψηφίου στη σελίδα αναζήτησης υποψηφίου, όπου εμφανίζονται η βαθμολογία, η σειρά κατάταξης και οι ειδικότητες.",
  },
  {
    q: "Πού βλέπω τις κενές θέσεις και τον χάρτη θέσεων του 2ΓΒ/2026;",
    a: "Στη σελίδα Κενές Θέσεις καταγράφονται οι 928 θέσεις που έμειναν ακάλυπτες, ενώ στον Χάρτη Θέσεων αποτυπώνεται η γεωγραφική κατανομή των θέσεων του 2ΓΒ/2026.",
  },
];

const intl = new Intl.NumberFormat("el-GR");
const intl2 = new Intl.NumberFormat("el-GR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export default function TwoGbCluster({ stats }: { stats: Stats }) {
  const items = [
    { label: "Υποψήφιοι", value: intl.format(stats.total_candidates) },
    { label: "Διοριστέοι", value: intl.format(stats.total_dioristoi) },
    { label: "Θέσεις", value: intl.format(stats.total_theseis) },
    { label: "Κενές Θέσεις", value: intl.format(stats.kenes_theseis) },
    { label: "Ειδικότητες", value: intl.format(stats.total_eidikotites) },
    {
      label: "Ποσοστό Επιτυχίας",
      value: `${intl2.format(stats.pososto_epityxias)}%`,
    },
  ];

  return (
    <section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
      {/* Intro */}
      <div className="space-y-3">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          Αποτελέσματα ΑΣΕΠ 2ΓΒ/2026
        </h2>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Αναζητήστε πληροφορίες για την επίσημη προκήρυξη{" "}
          <strong className="text-[#00E5FF]">2ΓΒ/2026</strong> και όλες τις
          σχετικές γραφές: 2gb, 2by, 2βγ, 2γβ/2026, «αποτελέσματα 2ΓΒ»,
          «apotelesmata 2gb», «στατιστικά 2ΓΒ/2026».
        </p>
      </div>

      {/* Numbers Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="glass rounded-2xl border border-white/10 p-4 sm:p-5 text-center"
          >
            <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">
              {item.label}
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-[#00E5FF]">
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="glass rounded-2xl border border-white/10 p-5 sm:p-8 space-y-6">
        <h2 className="flex items-center gap-2 text-[#00E5FF] font-bold text-xs uppercase tracking-wider">
          <span>Συχνές Ερωτήσεις για τον 2ΓΒ/2026</span>
        </h2>
        <div className="space-y-5">
          {homeFaq.map((item, index) => (
            <div
              key={index}
              id={`faq-${index}`}
              className="space-y-1.5"
            >
              <h3 className="text-base sm:text-lg font-bold text-white">
                {item.q}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Σχετικές σελίδες */}
      <div className="glass rounded-2xl border border-white/10 p-5 sm:p-8 space-y-4">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Σχετικές σελίδες
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <li>
            <Link
              href="/stats"
              className="text-[#00E5FF] hover:underline inline-flex items-center gap-1"
            >
              Στατιστικά 2ΓΒ/2026 <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </li>
          <li>
            <Link
              href="/kenes-theseis"
              className="text-[#00E5FF] hover:underline inline-flex items-center gap-1"
            >
              Κενές θέσεις 2ΓΒ/2026 <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </li>
          <li>
            <Link
              href="/xartis"
              className="text-[#00E5FF] hover:underline inline-flex items-center gap-1"
            >
              Χάρτης θέσεων ΑΣΕΠ <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </li>
          <li>
            <Link
              href="/eidikotita"
              className="text-[#00E5FF] hover:underline inline-flex items-center gap-1"
            >
              Ειδικότητες & βάσεις 2ΓΒ/2026{" "}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </li>
          <li>
            <Link
              href="/ypopsifios"
              className="text-[#00E5FF] hover:underline inline-flex items-center gap-1"
            >
              Αναζήτηση υποψηφίου με ΑΜ <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </li>
          <li>
            <Link
              href="/proetoimasia"
              className="text-[#00E5FF] hover:underline inline-flex items-center gap-1"
            >
              Προετοιμασία 3ου διαγωνισμού 2027{" "}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
