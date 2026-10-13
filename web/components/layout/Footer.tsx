import React from "react";
import Link from "next/link";
import { ExternalLink, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#070a13] py-10 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Αριστερά: Στοιχεία Διαγωνισμού & Disclaimer */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
            <div className="flex items-center gap-2 text-slate-200 font-semibold tracking-wide">
              <span className="h-2 w-2 rounded-full bg-[#00E5FF] animate-pulse" />
              ΑΣΕΠ 2ΓΒ/2026 Analytics Hub
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              Ανεξάρτητη πλατφόρμα επεξεργασίας δημόσιων δεδομένων αποτελεσμάτων. 
              Τα στοιχεία ταυτότητας παρουσιάζονται σε πλήρη συμμόρφωση (ανωνυμοποιημένα/masked).
            </p>
          </div>

          {/* Δεξιά: Signature & LinkedIn Links */}
          <div className="flex flex-col items-center md:items-end space-y-2">
            <div className="text-xs text-slate-400">
              Concept & Architecture by
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/in/fokionas/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/60 text-slate-200 hover:text-[#00E5FF] hover:border-[#00E5FF]/50 transition-all duration-200 text-xs font-medium shadow-sm"
              >
                <svg className="w-3.5 h-3.5 fill-[#00E5FF]" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
                <span>Fokion</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>

              <a
                href="https://github.com/trooperas/asep-2gb-2026-analytics"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/60 text-slate-200 hover:text-white hover:border-slate-500 transition-all duration-200 text-xs font-medium shadow-sm"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                </svg>
                <span>Source Code</span>
              </a>
            </div>

            <Link href="/about" className="text-[11px] text-[#00E5FF] hover:underline flex items-center gap-1 mt-1">
              ⚡ Built in a day with AI — Διαβάστε πώς
            </Link>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400/80" />
            <span>GDPR-Conscious • Static Data Engine</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">

            <Link href="/privacy" className="hover:text-slate-300 transition-colors underline">
              Απόρρητο & GDPR
            </Link>

          </div>
          <div>
            © {new Date().getFullYear()} • Open for collaboration & data initiatives
          </div>
        </div>
      </div>
    </footer>
  );
}