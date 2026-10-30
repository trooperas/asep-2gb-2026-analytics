import React from "react";

export interface InductivePuzzle {
  id: number;
  title: string;
  category: "matrix" | "rotation" | "addition" | "inversion" | "math_shapes";
  categoryLabel: string;
  difficulty: "Εύκολο" | "Μεσαίο" | "Δύσκολο";
  gridType: "3x3" | "sequence" | "shape_puzzle";
  gridCells: React.ReactNode[];
  options: React.ReactNode[];
  correctIndex: number;
  hintText: string;
  explanation: string;
}

export const INDUCTIVE_PUZZLES: InductivePuzzle[] = [
  // ==============================================================
  // ΝΕΟ ΣΕΤ: 10 ΑΡΙΘΜΗΤΙΚΑ ΣΧΗΜΑΤΑ (DNEWS / EPSO STYLE)
  // ==============================================================
  {
    id: 101,
    title: "Σε κάθε τρίγωνο ο κεντρικός αριθμός προκύπτει από τις 3 κορυφές. Ποιος αριθμός αντικαθιστά το ερωτηματικό;",
    category: "math_shapes",
    categoryLabel: "Αριθμητικό Τρίγωνο: (Κορυφή × Αριστερά) - Δεξιά",
    difficulty: "Μεσαίο",
    gridType: "shape_puzzle",
    gridCells: [
      <svg key="t1" className="w-20 h-20 sm:w-24 sm:h-24" viewBox="0 0 100 90">
        <polygon points="50,10 90,80 10,80" fill="#0A0E1A" stroke="#00E5FF" strokeWidth="2.5" />
        <circle cx="50" cy="52" r="14" fill="#00E5FF" opacity="0.15" />
        <text x="50" y="57" textAnchor="middle" fill="#00E5FF" fontSize="15" fontWeight="bold">19</text>
        <text x="50" y="24" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">7</text>
        <text x="24" y="76" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">4</text>
        <text x="76" y="76" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">9</text>
      </svg>,
      <svg key="t2" className="w-20 h-20 sm:w-24 sm:h-24" viewBox="0 0 100 90">
        <polygon points="50,10 90,80 10,80" fill="#0A0E1A" stroke="#00E5FF" strokeWidth="2.5" />
        <circle cx="50" cy="52" r="14" fill="#00E5FF" opacity="0.15" />
        <text x="50" y="57" textAnchor="middle" fill="#00E5FF" fontSize="15" fontWeight="bold">33</text>
        <text x="50" y="24" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">6</text>
        <text x="24" y="76" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">8</text>
        <text x="76" y="76" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">15</text>
      </svg>,
      <svg key="t3" className="w-20 h-20 sm:w-24 sm:h-24" viewBox="0 0 100 90">
        <polygon points="50,10 90,80 10,80" fill="#0A0E1A" stroke="#FF006E" strokeWidth="2.5" />
        <circle cx="50" cy="52" r="14" fill="#FF006E" opacity="0.2" />
        <text x="50" y="58" textAnchor="middle" fill="#FF006E" fontSize="17" fontWeight="bold">?</text>
        <text x="50" y="24" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">9</text>
        <text x="24" y="76" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">5</text>
        <text x="76" y="76" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">17</text>
      </svg>,
    ],
    options: [
      <span key="1a" className="font-mono text-base font-bold text-white">Α: 31</span>,
      <span key="1b" className="font-mono text-base font-bold text-[#00E5FF]">Β: 28</span>,
      <span key="1c" className="font-mono text-base font-bold text-white">Γ: 62</span>,
      <span key="1d" className="font-mono text-base font-bold text-white">Δ: 45</span>,
      <span key="1e" className="font-mono text-base font-bold text-white">Ε: 25</span>,
    ],
    correctIndex: 1,
    hintText: "Πολλαπλασιάστε την κορυφή με την αριστερή γωνία και αφαιρέστε τη δεξιά γωνία.",
    explanation: "Κανόνας: Κέντρο = (Κορυφή × Αριστερά) - Δεξιά. Έλεγχος: 7×4-9=19, 6×8-15=33. Άρα: 9×5-17 = 45-17 = 28 (Επιλογή Β). Παγίδα: Το 31 είναι το άθροισμα των κορυφών.",
  },
  {
    id: 102,
    title: "Σε κάθε κύκλο ο κεντρικός αριθμός προκύπτει από τα 4 τεταρτημόρια. Ποιος αριθμός λείπει;",
    category: "math_shapes",
    categoryLabel: "Κύκλος Τεταρτημορίων: Σταυρωτές Πράξεις",
    difficulty: "Δύσκολο",
    gridType: "shape_puzzle",
    gridCells: [
      <svg key="c1" className="w-20 h-20 sm:w-24 sm:h-24" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill="#0A0E1A" stroke="#00E5FF" strokeWidth="2.5" />
        <line x1="50" y1="8" x2="50" y2="92" stroke="#334155" strokeWidth="1.5" />
        <line x1="8" y1="50" x2="92" y2="50" stroke="#334155" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="16" fill="#0A0E1A" stroke="#00E5FF" strokeWidth="2" />
        <text x="50" y="55" textAnchor="middle" fill="#00E5FF" fontSize="13" fontWeight="bold">21</text>
        <text x="30" y="34" textAnchor="middle" fill="#fff" fontSize="13">3</text>
        <text x="70" y="34" textAnchor="middle" fill="#fff" fontSize="13">5</text>
        <text x="30" y="74" textAnchor="middle" fill="#fff" fontSize="13">2</text>
        <text x="70" y="74" textAnchor="middle" fill="#fff" fontSize="13">4</text>
      </svg>,
      <svg key="c2" className="w-20 h-20 sm:w-24 sm:h-24" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill="#0A0E1A" stroke="#00E5FF" strokeWidth="2.5" />
        <line x1="50" y1="8" x2="50" y2="92" stroke="#334155" strokeWidth="1.5" />
        <line x1="8" y1="50" x2="92" y2="50" stroke="#334155" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="16" fill="#0A0E1A" stroke="#00E5FF" strokeWidth="2" />
        <text x="50" y="55" textAnchor="middle" fill="#00E5FF" fontSize="13" fontWeight="bold">40</text>
        <text x="30" y="34" textAnchor="middle" fill="#fff" fontSize="13">6</text>
        <text x="70" y="34" textAnchor="middle" fill="#fff" fontSize="13">9</text>
        <text x="30" y="74" textAnchor="middle" fill="#fff" fontSize="13">4</text>
        <text x="70" y="74" textAnchor="middle" fill="#fff" fontSize="13">2</text>
      </svg>,
      <svg key="c3" className="w-20 h-20 sm:w-24 sm:h-24" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill="#0A0E1A" stroke="#FF006E" strokeWidth="2.5" />
        <line x1="50" y1="8" x2="50" y2="92" stroke="#334155" strokeWidth="1.5" />
        <line x1="8" y1="50" x2="92" y2="50" stroke="#334155" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="16" fill="#0A0E1A" stroke="#FF006E" strokeWidth="2" />
        <text x="50" y="56" textAnchor="middle" fill="#FF006E" fontSize="16" fontWeight="bold">?</text>
        <text x="30" y="34" textAnchor="middle" fill="#fff" fontSize="13">7</text>
        <text x="70" y="34" textAnchor="middle" fill="#fff" fontSize="13">8</text>
        <text x="30" y="74" textAnchor="middle" fill="#fff" fontSize="13">3</text>
        <text x="70" y="74" textAnchor="middle" fill="#fff" fontSize="13">5</text>
      </svg>,
    ],
    options: [
      <span key="2a" className="font-mono text-base font-bold text-white">Α: 23</span>,
      <span key="2b" className="font-mono text-base font-bold text-white">Β: 48</span>,
      <span key="2c" className="font-mono text-base font-bold text-[#00E5FF]">Γ: 60</span>,
      <span key="2d" className="font-mono text-base font-bold text-white">Δ: 72</span>,
      <span key="2e" className="font-mono text-base font-bold text-white">Ε: 35</span>,
    ],
    correctIndex: 2,
    hintText: "Κέντρο = (Πάνω-Αριστερά + Κάτω-Δεξιά) × (Πάνω-Δεξιά - Κάτω-Αριστερά).",
    explanation: "Κανόνας: (Π-Αρ + Κ-Δεξ) × (Π-Δεξ - Κ-Αρ). Έλεγχος: (3+4)×(5-2) = 7×3 = 21, (6+2)×(9-4) = 8×5 = 40. Άρα: (7+5)×(8-3) = 12×5 = 60 (Επιλογή Γ).",
  },
  {
    id: 103,
    title: "Στην πυραμίδα κάθε αριθμός προκύπτει από τους δύο ακριβώς από κάτω του. Ποιος αριθμός είναι στη βάση (?);",
    category: "math_shapes",
    categoryLabel: "Αριθμητική Πυραμίδα: (Αρ × Δεξ) - (Αρ + Δεξ)",
    difficulty: "Δύσκολο",
    gridType: "shape_puzzle",
    gridCells: [
      <div key="pyr" className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center font-mono space-y-1.5 text-xs sm:text-sm">
        <div className="text-[#00E5FF] font-bold text-base">219</div>
        <div className="text-slate-300">23 &nbsp; • &nbsp; 11</div>
        <div className="text-slate-400">5 &nbsp; • &nbsp; 7 &nbsp; • &nbsp; 3</div>
        <div className="text-pink-400 font-bold bg-slate-950 p-1 rounded border border-slate-800">
          4 &nbsp; | &nbsp; 3 &nbsp; | &nbsp; 5 &nbsp; | &nbsp; [ ? ]
        </div>
      </div>
    ],
    options: [
      <span key="3a" className="font-mono text-base font-bold text-white">Α: 4</span>,
      <span key="3b" className="font-mono text-base font-bold text-white">Β: 5</span>,
      <span key="3c" className="font-mono text-base font-bold text-white">Γ: 1</span>,
      <span key="3d" className="font-mono text-base font-bold text-[#00E5FF]">Δ: 2</span>,
      <span key="3e" className="font-mono text-base font-bold text-white">Ε: 3</span>,
    ],
    correctIndex: 3,
    hintText: "Κανόνας: Επάνω = (Αριστερά × Δεξιά) - (Αριστερά + Δεξιά). Λύστε εξίσωση: 5 × x - (5 + x) = 3.",
    explanation: "Κανόνας: Επάνω = (Αρ × Δεξ) - (Αρ + Δεξ). Έλεγχος: 4,3 -> 12-7=5. Για τη βάση: 5 × x - (5 + x) = 3 -> 4x - 5 = 3 -> 4x = 8 -> x = 2 (Επιλογή Δ).",
  },
  {
    id: 104,
    title: "Σε κάθε εξάγωνο το κέντρο προκύπτει από τις 6 κορυφές. Ποιος αριθμός αντικαθιστά το ?;",
    category: "math_shapes",
    categoryLabel: "Εξάγωνο: Άθροισμα Διαμετρικών Γινομένων",
    difficulty: "Μεσαίο",
    gridType: "shape_puzzle",
    gridCells: [
      <div key="hex" className="text-xs text-slate-300 p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 font-mono">
        <div>Εξάγωνο 1: (2×5) + (3×1) + (4×6) = 10+3+24 = <strong className="text-[#00E5FF]">37</strong></div>
        <div>Εξάγωνο 2: (3×2) + (1×4) + (5×2) = 6+4+10 = <strong className="text-[#00E5FF]">20</strong></div>
        <div className="text-pink-400 font-bold pt-1">Εξάγωνο 3: (4×5) + (3×1) + (2×3) = 20+3+6 = [ ? ]</div>
      </div>
    ],
    options: [
      <span key="4a" className="font-mono text-base font-bold text-white">Α: 18</span>,
      <span key="4b" className="font-mono text-base font-bold text-[#00E5FF]">Β: 29</span>,
      <span key="4c" className="font-mono text-base font-bold text-white">Γ: 32</span>,
      <span key="4d" className="font-mono text-base font-bold text-white">Δ: 24</span>,
      <span key="4e" className="font-mono text-base font-bold text-white">Ε: 30</span>,
    ],
    correctIndex: 1,
    hintText: "Πολλαπλασιάστε ανά δύο τις διαμετρικά αντίθετες κορυφές και αθροίστε τα 3 γινόμενα.",
    explanation: "Κέντρο = Άθροισμα των γινομένων των απέναντι κορυφών. Για το 3ο εξάγωνο: 4×5 + 3×1 + 2×3 = 20 + 3 + 6 = 29 (Επιλογή Β). Παγίδα: Το 18 είναι το απλό άθροισμα.",
  },
  {
    id: 105,
    title: "Στον αριθμητικό τροχό κάθε εσωτερικός αριθμός προκύπτει δεξιόστροφα. Ποιος είναι ο αριθμός ?;",
    category: "math_shapes",
    categoryLabel: "Αριθμητικός Τροχός: Κυκλική Ροή",
    difficulty: "Δύσκολο",
    gridType: "shape_puzzle",
    gridCells: [
      <div key="wheel" className="text-xs text-slate-300 p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 font-mono">
        <div>3 × 5 - 2 = <strong className="text-[#00E5FF]">13</strong></div>
        <div>5 × 2 - 6 = <strong className="text-[#00E5FF]">4</strong></div>
        <div>2 × 6 - 4 = <strong className="text-[#00E5FF]">8</strong></div>
        <div>6 × 4 - 7 = <strong className="text-[#00E5FF]">17</strong></div>
        <div className="text-pink-400 font-bold">4 × 7 - 3 = [ ? ]</div>
      </div>
    ],
    options: [
      <span key="5a" className="font-mono text-base font-bold text-white">Α: 21</span>,
      <span key="5b" className="font-mono text-base font-bold text-white">Β: 28</span>,
      <span key="5c" className="font-mono text-base font-bold text-white">Γ: 19</span>,
      <span key="5d" className="font-mono text-base font-bold text-[#00E5FF]">Δ: 25</span>,
      <span key="5e" className="font-mono text-base font-bold text-white">Ε: 31</span>,
    ],
    correctIndex: 3,
    hintText: "Εσωτερικός = (Εξωτερικός) × (Επόμενος δεξιόστροφα) - (Μεθεπόμενος εξωτερικός).",
    explanation: "Κανόνας ροής: Στοιχείο(i) × Στοιχείο(i+1) - Στοιχείο(i+2). Ο κύκλος κλείνει: 4 × 7 - 3 = 28 - 3 = 25 (Επιλογή Δ).",
  },
  {
    id: 106,
    title: "Σε κάθε τρίγωνο οι αριθμοί στις πλευρές προκύπτουν από τις κορυφές. Ποιος είναι ο αριθμός ?;",
    category: "math_shapes",
    categoryLabel: "Τρίγωνο Πλευρών: (Γινόμενο Κορυφών) - (Άθροισμα)",
    difficulty: "Μεσαίο",
    gridType: "shape_puzzle",
    gridCells: [
      <div key="tr_side" className="text-xs text-slate-300 p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 font-mono">
        <div>Κορυφές 3 &amp; 5 -&gt; Πλευρά: 15 - 8 = <strong className="text-[#00E5FF]">7</strong></div>
        <div>Κορυφές 5 &amp; 4 -&gt; Πλευρά: 20 - 9 = <strong className="text-[#00E5FF]">11</strong></div>
        <div>Κορυφές 4 &amp; 8 -&gt; Πλευρά: 32 - 12 = <strong className="text-[#00E5FF]">20</strong></div>
        <div className="text-pink-400 font-bold">Κορυφές 8 &amp; 3 -&gt; Πλευρά: 24 - 11 = [ ? ]</div>
      </div>
    ],
    options: [
      <span key="6a" className="font-mono text-base font-bold text-white">Α: 24</span>,
      <span key="6b" className="font-mono text-base font-bold text-white">Β: 11</span>,
      <span key="6c" className="font-mono text-base font-bold text-[#00E5FF]">Γ: 13</span>,
      <span key="6d" className="font-mono text-base font-bold text-white">Δ: 16</span>,
      <span key="6e" className="font-mono text-base font-bold text-white">Ε: 8</span>,
    ],
    correctIndex: 2,
    hintText: "Αριθμός πλευράς = (Γινόμενο των δύο κορυφών) - (Άθροισμά τους).",
    explanation: "Κανόνας: (α × β) - (α + β). Για τις κορυφές 8 και 3: (8 × 3) - (8 + 3) = 24 - 11 = 13 (Επιλογή Γ). Παγίδες: Το 24 είναι το γινόμενο και το 11 το άθροισμα.",
  },
  {
    id: 107,
    title: "Στο πλέγμα 3x3 οι αριθμοί συνδέονται με κατακόρυφο κανόνα. Ποιος αριθμός λείπει (κάτω αριστερά);",
    category: "math_shapes",
    categoryLabel: "Αριθμητικό Matrix: (Γραμμή 1 × Γραμμή 2) - Γραμμή 1",
    difficulty: "Μεσαίο",
    gridType: "shape_puzzle",
    gridCells: [
      <div key="grid_v" className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-center space-y-1 text-sm">
        <div className="grid grid-cols-3 gap-2 text-slate-300"><span>2</span><span>3</span><span>5</span></div>
        <div className="grid grid-cols-3 gap-2 text-slate-300"><span>4</span><span>6</span><span>2</span></div>
        <div className="grid grid-cols-3 gap-2 text-[#00E5FF] font-bold border-t border-slate-800 pt-1">
          <span className="text-pink-400 font-bold">[ ? ]</span>
          <span>15</span>
          <span>5</span>
        </div>
      </div>
    ],
    options: [
      <span key="7a" className="font-mono text-base font-bold text-white">Α: 8</span>,
      <span key="7b" className="font-mono text-base font-bold text-[#00E5FF]">Β: 6</span>,
      <span key="7c" className="font-mono text-base font-bold text-white">Γ: 10</span>,
      <span key="7d" className="font-mono text-base font-bold text-white">Δ: 4</span>,
      <span key="7e" className="font-mono text-base font-bold text-white">Ε: 12</span>,
    ],
    correctIndex: 1,
    hintText: "Ο κανόνας είναι ανά στήλη: 3η γραμμή = (1η × 2η) - 1η.",
    explanation: "Κατακόρυφος κανόνας: Στήλη 2: 3×6-3 = 15. Στήλη 3: 5×2-5 = 5. Άρα στην 1η στήλη: 2×4-2 = 8-2 = 6 (Επιλογή Β).",
  },
  {
    id: 108,
    title: "Σε κάθε πεντάγωνο το κέντρο προκύπτει από τις κορυφές. Ποιος αριθμός αντικαθιστά το ?;",
    category: "math_shapes",
    categoryLabel: "Πεντάγωνο: Γινόμενο Κορυφών ÷ Άθροισμα",
    difficulty: "Δύσκολο",
    gridType: "shape_puzzle",
    gridCells: [
      <div key="pent" className="text-xs text-slate-300 p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 font-mono">
        <div>Πεντάγωνο 1: Γινόμενο 120 ÷ Άθροισμα 15 = <strong className="text-[#00E5FF]">8</strong></div>
        <div>Πεντάγωνο 2: Γινόμενο 48 ÷ Άθροισμα 12 = <strong className="text-[#00E5FF]">4</strong></div>
        <div className="text-pink-400 font-bold pt-1">Πεντάγωνο 3: (2×3×4×1×6) ÷ (2+3+4+1+6) = 144 ÷ 16 = [ ? ]</div>
      </div>
    ],
    options: [
      <span key="8a" className="font-mono text-base font-bold text-white">Α: 12</span>,
      <span key="8b" className="font-mono text-base font-bold text-white">Β: 16</span>,
      <span key="8c" className="font-mono text-base font-bold text-white">Γ: 7</span>,
      <span key="8d" className="font-mono text-base font-bold text-[#00E5FF]">Δ: 9</span>,
      <span key="8e" className="font-mono text-base font-bold text-white">Ε: 8</span>,
    ],
    correctIndex: 3,
    hintText: "Κέντρο = (Γινόμενο όλων των κορυφών) ÷ (Άθροισμα όλων των κορυφών).",
    explanation: "Κανόνας: Γινόμενο ÷ Άθροισμα. Κορυφές 2, 3, 4, 1, 6: Γινόμενο = 144, Άθροισμα = 16. Άρα: 144 ÷ 16 = 9 (Επιλογή Δ).",
  },
  {
    id: 109,
    title: "Στους συνδεδεμένους ρόμβους το κέντρο μεταβιβάζεται στον επόμενο. Ποιος είναι ο αριθμός ?;",
    category: "math_shapes",
    categoryLabel: "Αλυσιδωτοί Ρόμβοι: (Πάνω × Κάτω) - (Αρ × Δεξ)",
    difficulty: "Δύσκολο",
    gridType: "shape_puzzle",
    gridCells: [
      <div key="rhomb" className="text-xs text-slate-300 p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 font-mono">
        <div>Ρόμβος 1: (5×4) - (2×3) = 20 - 6 = <strong className="text-[#00E5FF]">14</strong> (πάει στον επόμενο)</div>
        <div>Ρόμβος 2: (6×3) - (14×1) = 18 - 14 = <strong className="text-[#00E5FF]">4</strong> (πάει στον επόμενο)</div>
        <div className="text-pink-400 font-bold">Ρόμβος 3: (7×5) - (4 × ?) = 15  -&gt; 35 - 4x = 15</div>
      </div>
    ],
    options: [
      <span key="9a" className="font-mono text-base font-bold text-white">Α: 4</span>,
      <span key="9b" className="font-mono text-base font-bold text-[#00E5FF]">Β: 5</span>,
      <span key="9c" className="font-mono text-base font-bold text-white">Γ: 6</span>,
      <span key="9d" className="font-mono text-base font-bold text-white">Δ: 3</span>,
      <span key="9e" className="font-mono text-base font-bold text-white">Ε: 8</span>,
    ],
    correctIndex: 1,
    hintText: "Λύστε την εξίσωση: 35 - 4x = 15  =&gt;  4x = 20.",
    explanation: "Κανόνας: (Πάνω × Κάτω) - (Αρ × Δεξ) = Κέντρο. Στον 3ο ρόμβο: 35 - 4x = 15 -> 4x = 20 -> x = 5 (Επιλογή Β).",
  },
  {
    id: 110,
    title: "Στο άστρο το κέντρο προκύπτει από τα δύο τρίγωνα. Ποιος είναι ο κεντρικός αριθμός ?;",
    category: "math_shapes",
    categoryLabel: "Διπλό Άστρο: Διαφορά Τετραγώνων (Σ1² - Σ2²)",
    difficulty: "Δύσκολο",
    gridType: "shape_puzzle",
    gridCells: [
      <div key="star" className="text-xs text-slate-300 p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 font-mono">
        <div>Άστρο 1: 9² - 6² = 81 - 36 = <strong className="text-[#00E5FF]">45</strong></div>
        <div>Άστρο 2: 8² - 6² = 64 - 36 = <strong className="text-[#00E5FF]">28</strong></div>
        <div className="text-pink-400 font-bold pt-1">Άστρο 3: 10² - 7² = 100 - 49 = [ ? ]</div>
      </div>
    ],
    options: [
      <span key="10a" className="font-mono text-base font-bold text-white">Α: 39</span>,
      <span key="10b" className="font-mono text-base font-bold text-white">Β: 44</span>,
      <span key="10c" className="font-mono text-base font-bold text-white">Γ: 56</span>,
      <span key="10d" className="font-mono text-base font-bold text-white">Δ: 48</span>,
      <span key="10e" className="font-mono text-base font-bold text-[#00E5FF]">Ε: 51</span>,
    ],
    correctIndex: 4,
    hintText: "Κέντρο = (Άθροισμα κορυφών τριγώνου 1)² - (Άθροισμα κορυφών τριγώνου 2)².",
    explanation: "Κανόνας διαφοράς τετραγώνων: Σ1² - Σ2². Για το 3ο άστρο: 10² - 7² = 100 - 49 = 51 (Επιλογή Ε).",
  },

  // ==============================================================
  // ΚΛΑΣΙΚΑ MATRIX 3x3 & ΑΚΟΛΟΥΘΙΕΣ RAVEN
  // ==============================================================
  {
    id: 1,
    title: "Ποιο σχήμα συμπληρώνει το πλέγμα 3x3 (κάτω δεξιά);",
    category: "matrix",
    categoryLabel: "Πλέγμα 3x3: Ακτίνες & Σχήματα",
    difficulty: "Μεσαίο",
    gridType: "3x3",
    gridCells: [
      <svg key="c1" className="w-10 h-10" viewBox="0 0 40 40"><circle cx="20" cy="20" r="14" fill="none" stroke="#334155" strokeWidth="2" /><line x1="20" y1="20" x2="20" y2="8" stroke="#00E5FF" strokeWidth="3" strokeLinecap="round" /></svg>,
      <svg key="c2" className="w-10 h-10" viewBox="0 0 40 40"><circle cx="20" cy="20" r="14" fill="none" stroke="#334155" strokeWidth="2" /><line x1="20" y1="20" x2="32" y2="20" stroke="#00E5FF" strokeWidth="3" strokeLinecap="round" /><line x1="20" y1="20" x2="20" y2="8" stroke="#00E5FF" strokeWidth="3" strokeLinecap="round" /></svg>,
      <svg key="c3" className="w-10 h-10" viewBox="0 0 40 40"><circle cx="20" cy="20" r="14" fill="none" stroke="#334155" strokeWidth="2" /><line x1="20" y1="20" x2="32" y2="20" stroke="#00E5FF" strokeWidth="3" strokeLinecap="round" /><line x1="20" y1="20" x2="20" y2="32" stroke="#00E5FF" strokeWidth="3" strokeLinecap="round" /><line x1="20" y1="20" x2="20" y2="8" stroke="#00E5FF" strokeWidth="3" strokeLinecap="round" /></svg>,
      <svg key="c4" className="w-10 h-10" viewBox="0 0 40 40"><rect x="8" y="8" width="24" height="24" rx="4" fill="none" stroke="#334155" strokeWidth="2" /><line x1="20" y1="20" x2="20" y2="8" stroke="#FF006E" strokeWidth="3" strokeLinecap="round" /></svg>,
      <svg key="c5" className="w-10 h-10" viewBox="0 0 40 40"><rect x="8" y="8" width="24" height="24" rx="4" fill="none" stroke="#334155" strokeWidth="2" /><line x1="20" y1="20" x2="32" y2="20" stroke="#FF006E" strokeWidth="3" strokeLinecap="round" /><line x1="20" y1="20" x2="20" y2="8" stroke="#FF006E" strokeWidth="3" strokeLinecap="round" /></svg>,
      <svg key="c6" className="w-10 h-10" viewBox="0 0 40 40"><rect x="8" y="8" width="24" height="24" rx="4" fill="none" stroke="#334155" strokeWidth="2" /><line x1="20" y1="20" x2="32" y2="20" stroke="#FF006E" strokeWidth="3" strokeLinecap="round" /><line x1="20" y1="20" x2="20" y2="32" stroke="#FF006E" strokeWidth="3" strokeLinecap="round" /><line x1="20" y1="20" x2="20" y2="8" stroke="#FF006E" strokeWidth="3" strokeLinecap="round" /></svg>,
      <svg key="c7" className="w-10 h-10" viewBox="0 0 40 40"><polygon points="20,6 34,34 6,34" fill="none" stroke="#334155" strokeWidth="2" /><line x1="20" y1="22" x2="20" y2="10" stroke="#00FFA3" strokeWidth="3" strokeLinecap="round" /></svg>,
      <svg key="c8" className="w-10 h-10" viewBox="0 0 40 40"><polygon points="20,6 34,34 6,34" fill="none" stroke="#334155" strokeWidth="2" /><line x1="20" y1="22" x2="30" y2="22" stroke="#00FFA3" strokeWidth="3" strokeLinecap="round" /><line x1="20" y1="22" x2="20" y2="10" stroke="#00FFA3" strokeWidth="3" strokeLinecap="round" /></svg>,
      <div key="c9" className="w-full h-full rounded-xl bg-pink-500/10 border-2 border-dashed border-pink-500/60 flex items-center justify-center font-bold text-pink-400 text-xl font-mono">?</div>,
    ],
    options: [
      <svg key="o0" className="w-10 h-10" viewBox="0 0 40 40"><polygon points="20,6 34,34 6,34" fill="none" stroke="#334155" strokeWidth="2" /><line x1="20" y1="22" x2="20" y2="10" stroke="#00FFA3" strokeWidth="3" /></svg>,
      <svg key="o1" className="w-10 h-10" viewBox="0 0 40 40"><polygon points="20,6 34,34 6,34" fill="none" stroke="#334155" strokeWidth="2" /><line x1="20" y1="22" x2="30" y2="22" stroke="#00FFA3" strokeWidth="3" strokeLinecap="round" /><line x1="20" y1="22" x2="20" y2="30" stroke="#00FFA3" strokeWidth="3" strokeLinecap="round" /><line x1="20" y1="22" x2="20" y2="10" stroke="#00FFA3" strokeWidth="3" strokeLinecap="round" /></svg>,
      <svg key="o2" className="w-10 h-10" viewBox="0 0 40 40"><circle cx="20" cy="20" r="14" fill="none" stroke="#334155" strokeWidth="2" /><line x1="20" y1="20" x2="32" y2="20" stroke="#00FFA3" strokeWidth="3" /></svg>,
      <svg key="o3" className="w-10 h-10" viewBox="0 0 40 40"><polygon points="20,6 34,34 6,34" fill="none" stroke="#00FFA3" strokeWidth="2" /></svg>,
      <svg key="o4" className="w-10 h-10" viewBox="0 0 40 40"><rect x="8" y="8" width="24" height="24" fill="none" stroke="#334155" strokeWidth="2" /><line x1="20" y1="8" x2="20" y2="32" stroke="#00FFA3" strokeWidth="3" /></svg>,
    ],
    correctIndex: 1,
    hintText: "Κάθετα το εξωτερικό σχήμα είναι ίδιο (Τρίγωνο). Οριζόντια οι ακτίνες αυξάνονται από 1 σε 2 και σε 3.",
    explanation: "Στο πλέγμα, κάθε γραμμή διατηρεί το ίδιο εξωτερικό σχήμα (3η γραμμή = Τρίγωνα) και προσθέτει διαδοχικά μία ακτίνα δεξιόστροφα. Άρα το σωστό σχήμα είναι το Τρίγωνο με 3 ακτίνες (Επιλογή Β).",
  },
  {
    id: 2,
    title: "Ποιο σχήμα συνεχίζει τη δεξιόστροφη περιστροφή;",
    category: "rotation",
    categoryLabel: "Περιστροφή κατά 90°",
    difficulty: "Εύκολο",
    gridType: "sequence",
    gridCells: [
      <svg key="s1" className="w-12 h-12" viewBox="0 0 48 48"><rect width="48" height="48" rx="8" fill="#0A0E1A" stroke="#334155" strokeWidth="2" /><path d="M24 10 L34 22 L27 22 L27 38 L21 38 L21 22 L14 22 Z" fill="#00E5FF" /></svg>,
      <svg key="s2" className="w-12 h-12" viewBox="0 0 48 48"><rect width="48" height="48" rx="8" fill="#0A0E1A" stroke="#334155" strokeWidth="2" /><path d="M38 24 L26 14 L26 21 L10 21 L10 27 L26 27 L26 34 Z" fill="#00E5FF" /></svg>,
      <svg key="s3" className="w-12 h-12" viewBox="0 0 48 48"><rect width="48" height="48" rx="8" fill="#0A0E1A" stroke="#334155" strokeWidth="2" /><path d="M24 38 L14 26 L21 26 L21 10 L27 10 L27 26 L34 26 Z" fill="#00E5FF" /></svg>,
      <div key="sq" className="w-12 h-12 rounded-lg bg-pink-500/10 border-2 border-dashed border-pink-500/60 flex items-center justify-center font-bold text-pink-400 text-xl font-mono">?</div>,
    ],
    options: [
      <svg key="o0" className="w-10 h-10" viewBox="0 0 48 48"><path d="M10 24 L22 34 L22 27 L38 27 L38 21 L22 21 L22 14 Z" fill="#00E5FF" /></svg>,
      <svg key="o1" className="w-10 h-10" viewBox="0 0 48 48"><path d="M24 10 L34 22 L27 22 L27 38 L21 38 L21 22 L14 22 Z" fill="#00E5FF" /></svg>,
      <svg key="o2" className="w-10 h-10" viewBox="0 0 48 48"><circle cx="24" cy="24" r="10" fill="#00E5FF" /></svg>,
      <svg key="o3" className="w-10 h-10" viewBox="0 0 48 48"><path d="M24 38 L14 26 L21 26 L21 10 L27 10 L27 26 L34 26 Z" fill="#00E5FF" /></svg>,
      <svg key="o4" className="w-10 h-10" viewBox="0 0 48 48"><rect x="14" y="14" width="20" height="20" rx="4" fill="#00E5FF" /></svg>,
    ],
    correctIndex: 0,
    hintText: "Πάνω (0°) -> Δεξιά (90°) -> Κάτω (180°). Τι ακολουθεί;",
    explanation: "Περιστροφή κατά 90° δεξιόστροφα. Μετά το βέλος προς τα κάτω, το επόμενο δείχνει αριστερά (270° - Επιλογή Α).",
  },
];