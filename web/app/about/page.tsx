import React from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { Sparkles, HelpCircle, ShieldCheck, ExternalLink, Zap } from "lucide-react";

export const metadata = {
  title: "Σχετικά με την Πλατφόρμα",
  description: "Πληροφορίες για το project, τα δεδομένα και τον δημιουργό του ΑΣΕΠ Hub.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-20 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <Breadcrumb href="/" label="Επιστροφή στην Αρχική" />

      <div className="mx-auto w-full max-w-4xl">
      <div className="space-y-10">
        {/* Title */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            Side Project • Behind the Scenes
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-white">
            Γιατί και πώς φτιάχτηκε{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-pink-500">
              αυτή η πλατφόρμα
            </span>
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            Μια προσπάθεια να βγει νόημα από 54 διάσπαρτα Exce που εξέδωσε ο ΑΣΕΠ.
          </p>
        </div>

        {/* The Human Story */}
        <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#00E5FF]" />
            Πώς ξεκίνησε η ιδέα
          </h2>
          <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
            Με την έκδοση των προσωρινών αποτελεσμάτων του 2ΓΒ/2026, είχα γνωστούς που είχαν συμμετάσχει στον διαγωνισμό και προσπαθούσαν να καταλάβουν τι γίνεται. 
            Ο ΑΣΕΠ ανέβασε 54 ξεχωριστά αρχεία Excel — ένα για κάθε ειδικότητα συν τα συγκεντρωτικά. 
            Για να δεις πού βρίσκεσαι, ποιος διορίστηκε πού και ποιες θέσεις έμειναν κενές, έπρεπε να ανοίγεις 3 καρτέλες ταυτόχρονα και να ψάχνεις με τις ώρες. Συν το αρχικό ΦΕΚ της προκήρυξης με τις 322 σελίδες του.
          </p>
          <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
            Αποφάσισα λοιπόν να τα συγκεντρώσω όλα σε ένα ενιαίο, καθαρό μέρος, ώστε όλοι οι υποψήφιοι να βρίσκουν αμέσως την απάντηση που ψάχνουν χωρίς να χάνονται στα αρχεία.
          </p>
        </div>

        {/* Τεχνικά & AI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Sparkles className="w-5 h-5 text-pink-400" />
              Πώς στήθηκε (με AI βοήθεια)
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Επειδή ο όγκος ήταν τεράστιος και ο χρόνος ελάχιστος, χρησιμοποίησα εργαλεία Τεχνητής Νοημοσύνης (duh!) για να έχω γρήγορα τα Python scripts καθαρισμού, το γραφικό του χάρτη και το Next.js frontend.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Προσωπικά Δεδομένα
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Όλα τα δεδομένα προέρχονται αποκλειστικά από τις δημόσιες ανακοινώσεις του ΑΣΕΠ. 
              Οι Αριθμοί Δελτίου Ταυτότητας (ΑΔΤ) είναι ήδη καλυμμένοι με αστερίσκους (***) όπως ακριβώς δόθηκαν στη δημοσιότητα, διασφαλίζοντας την ιδιωτικότητα των υποψηφίων.
            </p>
          </div>
        </div>

        {/* Επίσημες Πηγές ΑΣΕΠ με nofollow */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Επίσημες Πηγές Αναφοράς (ΑΣΕΠ)
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <a
              href="https://info.asep.gr/node/80114"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center gap-1.5 text-xs text-[#00E5FF] hover:underline"
            >
              <span>📄 Προσωρινά Αποτελέσματα 2ΓΒ/2026 (ΑΣΕΠ)</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
            <span className="hidden sm:inline text-slate-600">•</span>
            <a
              href="https://info.asep.gr/node/78661"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center gap-1.5 text-xs text-[#00E5FF] hover:underline"
            >
              <span>🏛️ Κεντρική Σελίδα Διαγωνισμού 2ΓΒ/2026</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          </div>
        </div>

        {/* AI & Tokens Warning - Human & Funny */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900/80 to-[#0A0E1A] border border-[#00E5FF]/20 space-y-3">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            🤖 Σχετικά με τον AI Assistant
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Ο AI βοηθός της πλατφόρμας είναι <strong>καθαρά πειραματικός</strong>. Διαβάζει κατευθείαν από τα επίσημα δεδομένα των πινάκων για να απαντά σε ερωτήσεις. 
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            ⚠️ <em>Σημείωση:</em> Επειδή δεν έχω άπειρους πόρους και δωρεάν tokens, υπάρχει όριο ερωτήσεων ανά χρήστη. Οπότε... <strong>«choose your words carefully»</strong> 😉 και ρωτήστε συγκεκριμένα πράγματα (π.χ. με ονοματεπώνυμο ή κωδικό θέσης)!
          </p>
        </div>

        {/* Server Costs & Ko-fi Support Box */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900/90 via-[#0A0E1A] to-[#070A13] border border-[#00E5FF]/30 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <span>☕ Υποστήριξη των Εξόδων Φιλοξενίας (Vercel Pro)</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Μέσα σε μία μόλις εβδομάδα, η πλατφόρμα ξεπέρασε τις <strong>100.000 προβολές σελίδων</strong>! 
            Για να αντέξει το σύστημα αυτόν τον τεράστιο όγκο επισκεπτών χωρίς διακοπές, αναβάθμισα την υποδομή σε 
            <strong> Vercel Pro</strong> με δικά μου έξοδα.
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Η εφαρμογή θα παραμείνει <strong>100% ανοιχτή και δωρεάν για όλους</strong>. 
            Αν το εργαλείο σάς βοήθησε και θέλετε να συνεισφέρετε στα μηνιαία λειτουργικά έξοδα:
          </p>
          <div className="pt-2">
            <a
              href="https://ko-fi.com/fokion" // 👈 Βάλε το δικό σου Ko-fi URL
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00E5FF] text-slate-950 font-bold text-xs sm:text-sm hover:scale-105 transition-all no-underline shadow-lg"
            >
              <span>☕ Κεράστε έναν καφέ στο Ko-fi</span>
            </a>
          </div>
        </div>

        {/* Sign-off */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <div>
            Καλά αποτελέσματα σε όλους τους υποψηφίους!
          </div>
          <a
            href="https://www.linkedin.com/in/fokionas/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-slate-200 hover:text-[#00E5FF] transition-colors font-medium text-xs bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800"
          >
            {/* Inline SVG for LinkedIn */}
            <svg className="w-3.5 h-3.5 fill-[#00E5FF]" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
            </svg>
            <span>Fokion στο LinkedIn</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>
      </div>
      </div>
    </main>
  );
}