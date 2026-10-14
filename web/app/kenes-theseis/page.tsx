"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Building2,
  MapPin,
  HelpCircle,
  FileText,
  Filter,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface VacantPosition {
  kod_thesis: string;
  foreas: string;
  eidikotita: string;
  perifereia: string;
  dimos: string;
  nomos: string;
  edra: string;
  titloi: string;
  prosonta: string;
  entopiotita: string;
  total_slots: number;
  appointed: number;
  vacant: number;
}

export default function KenesTheseisPage() {
  const [data, setData] = useState<VacantPosition[]>([]);
  const [totalVacant, setTotalVacant] = useState(0);
  const [loading, setLoading] = useState(true);

  // Φίλτρα
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPerifereia, setSelectedPerifereia] = useState("");
  const [selectedEidikotita, setSelectedEidikotita] = useState("");

  useEffect(() => {
    fetch("/data/kenes_theseis.json")
      .then((r) => r.json())
      .then((res) => {
        setData(res.positions || []);
        setTotalVacant(res.total_vacant_slots || 928);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Λίστες για Dropdowns
  const uniquePerifereies = useMemo(() => {
    const set = new Set<string>();
    data.forEach((p) => {
      if (p.perifereia) set.add(p.perifereia.trim());
    });
    return Array.from(set).sort();
  }, [data]);

  const uniqueEidikotites = useMemo(() => {
    const set = new Set<string>();
    data.forEach((p) => {
      if (p.eidikotita) set.add(p.eidikotita.trim());
    });
    return Array.from(set).sort();
  }, [data]);

  // Φιλτραρισμένα αποτελέσματα
  const filteredPositions = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();

    return data.filter((p) => {
      const matchesSearch =
        !q ||
        p.kod_thesis.includes(q) ||
        p.foreas.toLowerCase().includes(q) ||
        p.eidikotita.toLowerCase().includes(q) ||
        p.dimos.toLowerCase().includes(q) ||
        p.edra.toLowerCase().includes(q);

      const matchesPerif =
        !selectedPerifereia || p.perifereia === selectedPerifereia;

      const matchesEid =
        !selectedEidikotita || p.eidikotita === selectedEidikotita;

      return matchesSearch && matchesPerif && matchesEid;
    });
  }, [data, searchTerm, selectedPerifereia, selectedEidikotita]);

  const totalFilteredVacant = useMemo(() => {
    return filteredPositions.reduce((sum, p) => sum + p.vacant, 0);
  }, [filteredPositions]);

  if (loading) {
    return (
      <main className="min-h-screen pt-32 text-center text-[#00E5FF]">
        Φόρτωση ανάλυσης κενών θέσεων...
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <Link
        href="/"
        className="text-sm text-slate-400 hover:text-[#00E5FF] transition-colors inline-flex items-center gap-2 mb-6"
      >
        ← Επιστροφή στην Αρχική
      </Link>

      {/* Header */}
      <div className="mb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Ειδική Έρευνα • 2ΓΒ/2026
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-display text-white tracking-tight">
          Ακτινογραφία{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-[#00E5FF]">
            {formatNumber(totalVacant)} Κενών Θέσεων
          </span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          Ανακαλύψτε ποιες θέσεις της προκήρυξης έμειναν εντελώς ακάλυπτες λόγω έλλειψης υποψηφίων
          με τα ειδικά απαιτούμενα προσόντα ή λόγω απροθυμίας δήλωσης. Αυτές οι θέσεις αποτελούν τη δεξαμενή
          για τις επόμενες συμπληρωματικές προσκλήσεις!
        </p>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <div className="glass p-5 rounded-2xl">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">
            Συνολικα Κενα
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400">
            {formatNumber(totalVacant)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">θέσεις στο Δημόσιο</div>
        </div>

        <div className="glass p-5 rounded-2xl">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">
            Ορφανοι Κωδικοι
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-[#00E5FF]">
            {formatNumber(data.length)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">διαφορετικές θέσεις</div>
        </div>

        <div className="glass p-5 rounded-2xl">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">
            Καλυψη Προκηρυξης
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">
            80.5%
          </div>
          <div className="text-[10px] text-slate-500 mt-1">19.5% έμεινε ακάλυπτο</div>
        </div>

        <div className="glass p-5 rounded-2xl">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">
            Επομενο Σταδιο
          </div>
          <div className="text-sm sm:text-base font-bold text-white mt-1">
            Συμπληρωματική
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">πρόσκληση επιλαχόντων</div>
        </div>
      </div>

      {/* Filters Box */}
      <div className="glass p-5 rounded-2xl mb-8 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Filter className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span>Φίλτρα Αναζήτησης Κενών</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Αναζήτηση με κωδικό, φορέα, δήμο..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
            />
          </div>

          {/* Περιφέρεια Dropdown */}
          <select
            value={selectedPerifereia}
            onChange={(e) => setSelectedPerifereia(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-300 focus:outline-none focus:border-[#00E5FF]"
          >
            <option value="">Όλες οι Περιφέρειες</option>
            {uniquePerifereies.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          {/* Ειδικότητα Dropdown */}
          <select
            value={selectedEidikotita}
            onChange={(e) => setSelectedEidikotita(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-300 focus:outline-none focus:border-[#00E5FF]"
          >
            <option value="">Όλες οι Ειδικότητες</option>
            {uniqueEidikotites.map((e) => (
              <option key={e} value={e}>
                {e.length > 45 ? e.substring(0, 45) + "..." : e}
              </option>
            ))}
          </select>
        </div>

        {(searchTerm || selectedPerifereia || selectedEidikotita) && (
          <div className="flex items-center justify-between text-xs pt-1 text-slate-400">
            <span>
              Βρέθηκαν <strong>{filteredPositions.length}</strong> κωδικοί με{" "}
              <strong>{totalFilteredVacant}</strong> κενές θέσεις.
            </span>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedPerifereia("");
                setSelectedEidikotita("");
              }}
              className="text-[#00E5FF] hover:underline cursor-pointer"
            >
              Καθαρισμός φίλτρων
            </button>
          </div>
        )}
      </div>

      {/* Positions List */}
      <div className="space-y-3">
        {filteredPositions.slice(0, 80).map((pos) => (
          <div
            key={pos.kod_thesis}
            className="glass p-4 sm:p-5 rounded-2xl hover:border-[#00E5FF]/40 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-mono font-bold text-base sm:text-lg text-[#00E5FF]">
                  #{pos.kod_thesis}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold font-mono">
                  {pos.vacant} {pos.vacant === 1 ? "ΚΕΝΗ ΘΕΣΗ" : "ΚΕΝΕΣ ΘΕΣΕΙΣ"}
                </span>
                <span className="text-xs text-slate-500">
                  (Προκηρύχθηκαν: {pos.total_slots} • Διορίστηκαν: {pos.appointed})
                </span>
              </div>

              <Link
                href={`/thesi/${pos.kod_thesis}`}
                className="text-xs text-[#00E5FF] hover:underline flex items-center gap-1 font-medium self-start sm:self-auto"
              >
                Αναλυτικά στοιχεία θέσης <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Φορέας & Ειδικότητα */}
            <div className="space-y-1">
              <div className="text-sm sm:text-base font-semibold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>{pos.foreas}</span>
              </div>
              <div className="text-xs text-slate-300 pl-6">{pos.eidikotita}</div>
            </div>

            {/* Τοποθεσία */}
            {(pos.perifereia || pos.dimos || pos.edra) && (
              <div className="flex items-center gap-2 text-xs text-slate-400 pl-6">
                <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                <span>
                  {pos.perifereia} {pos.dimos ? `• Δήμος ${pos.dimos}` : ""} {pos.edra ? `(${pos.edra})` : ""}
                </span>
              </div>
            )}

            {/* Αιτία / Προσόντα που πιθανόν άφησαν τη θέση κενή */}
            {(pos.titloi || pos.prosonta) && (
              <div className="mt-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                  Απαιτούμενοι Τίτλοι / Πρόσθετα Προσόντα (ΦΕΚ):
                </div>
                <div className="line-clamp-2 text-slate-300">
                  {pos.titloi} {pos.prosonta ? `• ${pos.prosonta}` : ""}
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredPositions.length === 0 && (
          <div className="glass p-12 rounded-2xl text-center text-slate-400">
            Δεν βρέθηκαν κενές θέσεις με αυτά τα κριτήρια αναζήτησης.
          </div>
        )}

        {filteredPositions.length > 80 && (
          <div className="text-center text-xs text-slate-500 py-4">
            Εμφανίζονται οι πρώτες 80 από τις {filteredPositions.length} κενές θέσεις. Χρησιμοποιήστε τα φίλτρα για να εντοπίσετε συγκεκριμένες περιοχές.
          </div>
        )}
      </div>
    </main>
  );
}