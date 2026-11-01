import { ChevronDown } from "lucide-react";

export type HomeFaqItem = { q: string; a: string };

/**
 * Single source of truth for the homepage FAQ.
 * Rendered visibly at the bottom of the homepage AND serialised into the
 * FAQPage JSON-LD in app/page.tsx, so the schema text can never drift from
 * the visible text.
 */
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

export default function HomeFaq() {
  return (
    <section
      aria-labelledby="home-faq-heading"
      className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 sm:py-16"
    >
      <h2
        id="home-faq-heading"
        className="text-xl sm:text-2xl font-bold text-white mb-6"
      >
        Συχνές Ερωτήσεις για τον 2ΓΒ/2026
      </h2>

      <div className="space-y-2.5">
        {homeFaq.map((item, index) => (
          <details
            key={index}
            id={`faq-${index}`}
            className="group glass rounded-2xl border border-white/10 overflow-hidden open:border-[#00E5FF]/40 transition-colors"
          >
            <summary className="flex items-center justify-between gap-3 p-4 sm:p-5 cursor-pointer select-none list-none">
              <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                {item.q}
              </h3>
              <span className="shrink-0 w-7 h-7 rounded-lg bg-white/5 group-open:bg-[#00E5FF] group-open:text-slate-950 flex items-center justify-center text-slate-300 transition-transform duration-300 group-open:rotate-180">
                <ChevronDown className="w-4 h-4" />
              </span>
            </summary>
            <p className="px-4 sm:px-5 pb-4 sm:pb-5 -mt-1 text-sm text-slate-300 leading-relaxed">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
