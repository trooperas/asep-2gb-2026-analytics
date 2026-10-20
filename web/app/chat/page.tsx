"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Search,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function ChatPage() {
  return (
    <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto flex flex-col items-center justify-center">
      <Link
        href="/"
        className="text-sm text-slate-400 hover:text-[#00E5FF] transition-colors inline-flex items-center gap-2 mb-8 self-start"
      >
        ← Επιστροφή στην Αρχική
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6 sm:p-10 rounded-3xl border border-[#00E5FF]/20 text-center space-y-6 relative overflow-hidden"
      >
        {/* Glow Ambient */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Icon & Badge */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.2)]">
            <Clock className="w-7 h-7 text-[#00E5FF] animate-pulse" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            Προσωρινη Παυση Λειτουργιας
          </div>
        </div>

        {/* Title & Human Story */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Ο AI Assistant παίρνει μια μικρή ανάσα! ☕
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto">
            Λόγω της <strong>τεράστιας και απρόσμενης επισκεψιμότητας</strong> των τελευταίων ημερών, τα διαθέσιμα tokens και οι πόροι του πειραματικού AI βοηθού εξαντλήθηκαν ταχύτατα.
          </p>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-lg mx-auto">
            Επειδή η πλατφόρμα είναι ένα ανεξάρτητο, ερασιτεχνικό community project χωρίς εταιρικό budget, 
            αναστέλλουμε προσωρινά τη λειτουργία του chatbot ώστε να διασφαλίσουμε ότι 
            <strong>όλες οι υπόλοιπες λειτουργίες του site παραμένουν 100% γρήγορες και διαθέσιμες</strong> για όλους.
          </p>
        </div>

        {/* Alternatives Card */}
        <div className="pt-4 border-t border-slate-800 space-y-3 text-left">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 text-center">
            Μπορειτε να βρειτε ολες τις πληροφοριες εδω:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <Link
              href="/search"
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-[#00E5FF] hover:bg-[#00E5FF]/5 transition-all flex items-center justify-between no-underline group"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-[#00E5FF]" />
                <span className="text-xs font-semibold text-white group-hover:text-[#00E5FF]">
                  Αναζήτηση Υποψηφίου
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/xartis"
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-[#00E5FF] hover:bg-[#00E5FF]/5 transition-all flex items-center justify-between no-underline group"
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-pink-400" />
                <span className="text-xs font-semibold text-white group-hover:text-pink-400">
                  Χάρτης Θέσεων ανά Νομό
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Footer note */}
        <div className="text-[11px] text-slate-400 pt-2 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Όλοι οι πίνακες αποτελεσμάτων & βάσεων παραμένουν πλήρως προσβάσιμοι.</span>
        </div>
      </motion.div>
    </main>
  );
}