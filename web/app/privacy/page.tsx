import React from "react";
import Link from "next/link";
import { ShieldCheck, Mail, EyeOff, Cookie } from "lucide-react";

export const metadata = {
  title: "Πολιτική Απορρήτου",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen py-28 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <Link
        href="/"
        className="text-sm text-slate-400 hover:text-[#00E5FF] transition-colors inline-flex items-center gap-2 mb-8"
      >
        ← Επιστροφή στην Αρχική
      </Link>

      <div className="space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            GDPR & Διαφάνεια
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
            Προσωπικά Δεδομένα & Cookies
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            Σε απλά ελληνικά.
          </p>
        </div>

        {/* 1. Πηγή Δεδομένων */}
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <h2 className="text-lg font-semibold text-white">1. Από πού προέρχονται τα στοιχεία;</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Όλα τα στοιχεία που εμφανίζονται στην πλατφόρμα προέρχονται <strong>αποκλειστικά από τους δημόσιους πίνακες αποτελεσμάτων</strong> που ανάρτησε ο ΑΣΕΠ στην επίσημη ιστοσελίδα του για τον διαγωνισμό 2ΓΒ/2026.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Δεν διαθέτουμε καμία πρόσβαση σε μη δημόσια αρχεία, ούτε συλλέγουμε τηλέφωνα, διευθύνσεις ή άλλα ευαίσθητα δεδομένα. Οι Αριθμοί Δελτίου Ταυτότητας (ΑΔΤ) παραμένουν προστατευμένοι με μάσκα (***972) ακριβώς όπως δημοσιεύθηκαν.
          </p>
        </div>

        {/* 2. Cookies */}
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-white font-semibold text-lg">
            <Cookie className="w-5 h-5 text-[#00E5FF]" />
            2. Χρησιμοποιούμε Cookies;
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            <strong>Όχι.</strong> Η ιστοσελίδα δεν χρησιμοποιεί διαφημιστικά cookies ούτε cookies εντοπισμού προφίλ. 
            Χρησιμοποιούμε μόνο ανώνυμα τεχνικά στατιστικά επισκεψιμότητας (μέσω Vercel Analytics) χωρίς αποθήκευση προσωπικών αναγνωριστικών, αποκλειστικά για να γνωρίζουμε πόσοι επισκέπτες μπαίνουν στην πλατφόρμα.
          </p>
        </div>

        {/* 3. Δικαίωμα Απόκρυψης / Take-down (ΠΟΛΥ ΣΗΜΑΝΤΙΚΟ) */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-[#0A0E1A] border border-[#00E5FF]/30 space-y-4">
        <div className="flex items-center gap-2 text-white font-semibold text-lg">
            <EyeOff className="w-5 h-5 text-pink-400" />
            3. Θέλετε να αποκρύψετε το όνομά σας;
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
            Σεβόμαστε απόλυτα την επιθυμία οποιουδήποτε υποψηφίου να μην εμφανίζεται το ονοματεπώνυμό του στις αναζητήσεις αυτής της ανεξάρτητης πλατφόρμας.
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">
            Αν επιθυμείτε την <strong>άμεση ανωνυμοποίηση</strong> των στοιχείων σας (π.χ. εμφάνιση μόνο με Α.Μ.), μπορείτε να στείλετε ένα απλό μήνυμα στο LinkedIn:
        </p>
        <a 
            href="https://www.linkedin.com/in/fokionas/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm text-[#00E5FF] hover:border-[#00E5FF]/50 transition-colors flex items-center gap-2 w-fit"
        >
            <svg className="w-4 h-4 text-[#00E5FF]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            <span>linkedin.com/in/fokionas</span>
        </a>
        <p className="text-xs text-slate-500">
            Αναφέρετε απλώς τον Α.Μ. της αίτησής σας και το όνομα σας θα αφαιρεθεί άμεσα από τους δείκτες αναζήτησης.
        </p>
        </div>

        {/* 4. Μη Επίσημος Χαρακτήρας */}
        <div className="text-xs text-slate-500 leading-relaxed border-t border-slate-800 pt-6">
          * Η παρούσα ιστοσελίδα αποτελεί ιδιωτική, μη κερδοσκοπική πρωτοβουλία επεξεργασίας ανοιχτών δεδομένων και δεν συνδέεται επίσημα με το Ανώτατο Συμβούλιο Επιλογής Προσωπικού (ΑΣΕΠ).
        </div>
      </div>
    </main>
  );
}