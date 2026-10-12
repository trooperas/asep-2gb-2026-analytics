import React from "react";
import Link from "next/link";
import { Sparkles, Cpu, Clock, ShieldCheck, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Σχετικά με το Project & AI Story — ΑΣΕΠ 2ΓΒ/2026",
  description: "Πώς αναλύθηκαν 54 αρχεία αποτελεσμάτων σε λίγες ώρες με τη χρήση AI-assisted workflows.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen py-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link
        href="/"
        className="text-sm text-slate-400 hover:text-[#00E5FF] transition-colors inline-flex items-center gap-2 mb-8"
      >
        ← Επιστροφή στην Αρχική
      </Link>

      <div className="space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Augmented Data Initiative
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-white">
            Πώς χτίστηκε αυτή η πλατφόρμα{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-pink-500">
              μέσα σε λίγες ώρες
            </span>
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            Μια ανοιχτή αποτύπωση για τη δύναμη της Τεχνητής Νοημοσύνης, τη δημόσια πληροφορία και το μέλλον της ανάλυσης δεδομένων.
          </p>
        </div>

        {/* The Story Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <Clock className="w-6 h-6 text-[#00E5FF]" />
            <h3 className="font-semibold text-white">Αυθημερόν Υλοποίηση</h3>
            <p className="text-sm text-slate-400">
              Τα προσωρινά αποτελέσματα εκδόθηκαν σε 54 ασύνδετα Excel. Η πλατφόρμα σχεδιάστηκε, αναλύθηκε και δημοσιεύθηκε την ίδια ημέρα.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <Cpu className="w-6 h-6 text-pink-400" />
            <h3 className="font-semibold text-white">100% AI-Assisted</h3>
            <p className="text-sm text-slate-400">
              Κανένας άνθρωπος δεν θα μπορούσε να ολοκληρώσει αυτό το έργο σε ώρες. Ο κώδικας, τα ETL scripts και τα visual components παρήχθησαν με AI co-piloting.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h3 className="font-semibold text-white">Διαφάνεια & GDPR</h3>
            <p className="text-sm text-slate-400">
              Πλήρης σεβασμός στα προσωπικά δεδομένα με αυτόματο masking ταυτοτήτων και χρήση αποκλειστικά δημόσιων κρατικών εγγράφων.
            </p>
          </div>
        </div>

        {/* Detailed Narrative */}
        <div className="prose prose-invert max-w-none space-y-6 text-slate-300 leading-relaxed">
          <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-3">
            Το Κίνητρο & Η Διαδικασία
          </h2>
          <p>
            Ως μη επαγγελματίας του χώρου της πληροφορικής (non-IT), το ενδιαφέρον μου ήταν να δοκιμάσω τα όρια των σύγχρονων εργαλείων AI σε ένα πραγματικό, πλούσιο και χαοτικό dataset: 
            <strong> 51.900+ εγγραφές, 52 ειδικότητες και χιλιάδες σελίδες προκήρυξης.</strong>
          </p>
          <p>
            Αντί για μέρες χειροκίνητου προγραμματισμού, χρησιμοποιήθηκε μια collaborative προσέγγιση ανθρώπου και AI:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-400">
            <li><strong>Καθαρισμός Δεδομένων:</strong> Scripts σε Python για ενοποίηση των 54 αρχείων και chunking χωρίς ανάγκη ακριβής βάσης δεδομένων.</li>
            <li><strong>Interactive UI:</strong> Σχεδιασμός διαδραστικού χάρτη Ελλάδας (GeoJSON) με ταυτόχρονη απεικόνιση θέσεων και κενών.</li>
            <li><strong>Groq AI Engine:</strong> Ενσωμάτωση εξειδικευμένου LLM βοηθού με rate-limiting και real-time tool calling.</li>
          </ul>

          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-[#0A0E1A] border border-slate-800 mt-8">
            <h3 className="text-lg font-semibold text-white mb-2">Σημείωμα Δεοντολογίας</h3>
            <p className="text-sm text-slate-400 mb-4">
              Το παρόν project αποτελεί ένα πείραμα ταχείας οπτικοποίησης δεδομένων (rapid prototyping) και δεν υποκαθιστά τους επίσημους πίνακες του ΑΣΕΠ. Δεν διεκδικεί πρωτοτυπία παραδοσιακής ανάπτυξης λογισμικού, αλλά αναδεικνύει τι είναι εφικτό σήμερα όταν ένας περίεργος αναλυτής αξιοποιεί την Τεχνητή Νοημοσύνη.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com/in/fokionas/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF]/20 text-xs font-semibold transition-all"
                >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
                <span>Σύνδεση στο LinkedIn</span>
                <ExternalLink className="w-3 h-3" />
                </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}