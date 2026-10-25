import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

function normalizeText(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getPositionDetails(kod: string) {
  try {
    const filePath = join(process.cwd(), "public", "data", "positions.json");
    const data = JSON.parse(readFileSync(filePath, "utf-8"));
    return data.find((p: any) => String(p.kod_thesis) === String(kod)) || null;
  } catch { return null; }
}

// --- ΝΕΑ ΣΥΝΑΡΤΗΣΗ: Ψάχνει τον υποψήφιο στα chunks και επιστρέφει τα πλήρη στοιχεία ---
function getCandidateDetails(am: string) {
  try {
    const chunkIndexPath = join(process.cwd(), "public", "data", "chunk_index.json");
    const chunkIndex = JSON.parse(readFileSync(chunkIndexPath, "utf-8"));
    const chunksDir = join(process.cwd(), "public", "data", "chunks");

    const targetAm = String(am).replace(/\.0$/, "").trim();

    // Διατρέχουμε όλα τα chunks για να βρούμε τον υποψήφιο
    for (const [slug, chunkFiles] of Object.entries(chunkIndex)) {
      for (const chunkName of chunkFiles as string[]) {
        const cPath = join(chunksDir, chunkName);
        if (existsSync(cPath)) {
          const chunkData = JSON.parse(readFileSync(cPath, "utf-8"));
          const found = chunkData.find((r: any) => String(r.am).replace(/\.0$/, "").trim() === targetAm);
          
          if (found) {
            // Βρήκαμε τον υποψήφιο! Επιστρέφουμε τα στοιχεία του.
            // Το slug είναι το κλειδί (π.χ. pe-archaiologon...). Θα το μετατρέψουμε σε φιλικό κείμενο.
            
            // 1. Βρίσκουμε το σωστό όνομα ειδικότητας από το eidikotites_index
            let eidikotitaName = slug.replace(/-/g, ' ').toUpperCase(); // Fallback
            try {
              const indexFilePath = join(process.cwd(), "public", "data", "eidikotites_index.json");
              const indexData = JSON.parse(readFileSync(indexFilePath, "utf-8"));
              const foundEid = indexData.find((e: any) => e.slug === slug);
              if (foundEid) eidikotitaName = foundEid.eidikotita;
            } catch {}

            // 2. Ελέγχουμε αν έχει διοριστεί
            const thesiDiorismou = found.thesi_diorismou ? String(found.thesi_diorismou).replace(/\.0$/, "").trim() : null;
            
            return {
              am: found.am,
              eponymo: found.eponymo,
              onoma: found.onoma,
              vathmologia: found.vathmologia,
              aa: found.aa,
              eidikotitaName: eidikotitaName,
              thesiDiorismou: thesiDiorismou, // Αν είναι null, δεν έχει διοριστεί
            };
          }
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Candidate search error:", error);
    return null;
  }
}

function getStatsByEidikotitaName(eidikotitaName: string) {
  try {
    const indexFilePath = join(process.cwd(), "public", "data", "eidikotites_index.json");
    const indexData = JSON.parse(readFileSync(indexFilePath, "utf-8"));
    const normalizedSearch = normalizeText(eidikotitaName);
    
    const foundEidikotita = indexData.find((e: any) => 
      normalizeText(e.eidikotita) === normalizedSearch || 
      normalizeText(e.eidikotita).includes(normalizedSearch)
    );

    if (!foundEidikotita) return null;
    const correctSlug = foundEidikotita.slug;

    const chunkIndexPath = join(process.cwd(), "public", "data", "chunk_index.json");
    const chunkIndex = JSON.parse(readFileSync(chunkIndexPath, "utf-8"));
    const chunkFiles = chunkIndex[correctSlug];

    if (!chunkFiles || chunkFiles.length === 0) return null;

    const chunksDir = join(process.cwd(), "public", "data", "chunks");
    const allRecords: any[] = [];

    for (const chunkName of chunkFiles) {
      const cPath = join(chunksDir, chunkName);
      if (existsSync(cPath)) {
        const chunkData = JSON.parse(readFileSync(cPath, "utf-8"));
        allRecords.push(...chunkData);
      }
    }

    if (allRecords.length === 0) return null;

    const appointed = allRecords.filter((r) => !!r.thesi_diorismou);
    const appointedScores = appointed
      .map((r) => parseFloat(r.vathmologia))
      .filter((s) => !isNaN(s) && s > 0);

    const totalCount = allRecords.length;
    const dioristoiCount = appointed.length;
    const avg_vath = appointedScores.length
      ? appointedScores.reduce((a, b) => a + b, 0) / appointedScores.length
      : 0;
    const max_vath = appointedScores.length ? Math.max(...appointedScores) : 0;
    const min_vath = appointedScores.length ? Math.min(...appointedScores) : 0;

    return { slug: correctSlug, count: totalCount, dioristoi: dioristoiCount, avg_vath, max_vath, min_vath };
  } catch (error) {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { action, payload } = await request.json();

    if (!action) {
      return NextResponse.json({ error: "No action provided" }, { status: 400 });
    }

    // --- 1. ΑΡΧΙΚΟ ΜΕΝΟΥ ---
    if (action === "START") {
      return NextResponse.json({
        reply: pickRandom([
          "Γεια σου! 👋 Είμαι ο έξυπνος βοηθός του ASEP Analytics.\n\nΠώς μπορώ να σε βοηθήσω σήμερα;",
          "Καλώς ήρθες! 👋 Είμαι εδώ για να σε βοηθήσω με τα δεδομένα του ΑΣΕΠ.\n\nΤι θα ήθελες να κάνουμε;",
          "Χαίρομαι που σε βλέπω! 👋 Πες μου, τι ψάχνεις σήμερα;"
        ]),
        options: [
          { label: "Βρες τη θέση μου", value: "MENU_FIND_POSITION", iconName: "map-pin" },
          { label: "Δες τα Στατιστικά", value: "MENU_STATS", iconName: "file-text" },
          { label: "Προετοιμασία 2027", value: "MENU_PREP", iconName: "sparkles" },
          { label: "Αναζήτηση Υποψηφίου", value: "MENU_SEARCH_NAME", iconName: "search" },
        ]
      });
    }

    // --- 2. ΒΡΕΣ ΤΗ ΘΕΣΗ ΜΟΥ ---
    if (action === "MENU_FIND_POSITION") {
      return NextResponse.json({
        reply: pickRandom([
          "Τέλεια! Θέλεις να ψάξεις με βάση τον Αριθμό Αίτησης (Α.Μ.) σου ή με βάση τον Κωδικό Θέσης;",
          "Φυσικά! Πώς θέλεις να το ψάξουμε; Με το Α.Μ. σου ή με τον Κωδικό Θέσης;",
          "Πάμε να το βρούμε! Έχεις τον Αριθμό Αίτησης (Α.Μ.) ή τον Κωδικό Θέσης πρόχειρο;"
        ]),
        options: [
          { label: "Έχω Αριθμό Αίτησης (Α.Μ.)", value: "INPUT_AM", iconName: "user" },
          { label: "Έχω Κωδικό Θέσης", value: "INPUT_THESI", iconName: "map-pin" },
          { label: "Πίσω στο μενού", value: "START", iconName: "refresh" }
        ]
      });
    }

    // --- 3. ΑΝΑΖΗΤΗΣΗ ΜΕ ΑΜ ---
    if (action === "INPUT_AM") {
      return NextResponse.json({ 
        reply: pickRandom([
          "Γράψε μου τον Αριθμό Αίτησης (Α.Μ.) σου παρακάτω (π.χ. 12345) και θα τον ψάξω αμέσως.",
          "Δώσε μου το Α.Μ. σου και θα δω τι βρήκες! (π.χ. 12345)",
          "Περιμένω το Α.Μ. σου! Γράψ' το εδώ και θα σου πω τα πάντα."
        ]), 
        expectingInput: "AM" 
      });
    }

    // --- 4. ΑΝΑΖΗΤΗΣΗ ΜΕ ΚΩΔΙΚΟ ΘΕΣΗΣ ---
    if (action === "INPUT_THESI") {
      return NextResponse.json({ 
        reply: pickRandom([
          "Γράψε μου τον κωδικό θέσης παρακάτω (π.χ. 1031) και θα τον ψάξω.",
          "Ποιος είναι ο κωδικός θέσης που ψάχνεις; (π.χ. 1031)",
          "Δώσε μου τον κωδικό και θα σου πω όλες τις λεπτομέρειες."
        ]), 
        expectingInput: "THESI" 
      });
    }

    // --- 5. ΣΤΑΤΙΣΤΙΚΑ (ΜΕ CONTEXT) ---
    if (action === "MENU_STATS") {
      const eidikotitaName = payload?.eidikotitaName;
      
      if (eidikotitaName) {
        const stats = getStatsByEidikotitaName(eidikotitaName);
        
        if (stats) {
          let sauce = "";
          if (stats.dioristoi > stats.count / 2) sauce = "Φαίνεται πως οι πιθανότητες είναι με το μέρος σου! 🍀";
          else if (stats.avg_vath > 80) sauce = "Ο ανταγωνισμός είναι υψηλός, αλλά μην πτοείσαι! 💪";
          else sauce = "Τα πράγματα φαίνονται αρκετά βατά! 😊";

          return NextResponse.json({
            reply: pickRandom([
              `Βρήκα τα στατιστικά για την ειδικότητα "${eidikotitaName}"! 📊\n\nΣυνολικά υπάρχουν ${stats.count} υποψήφιοι, ενώ διορίστηκαν ${stats.dioristoi} άτομα. Η μέση βαθμολογία είναι ${stats.avg_vath.toFixed(2)} μόρια (Max: ${stats.max_vath.toFixed(2)}, Min: ${stats.min_vath.toFixed(2)}). ${sauce}`,
              `Ορίστε τι βρήκα για την ειδικότητα "${eidikotitaName}": 📊\n\nΑπό τους ${stats.count} υποψηφίους, διορίστηκαν οι ${stats.dioristoi}. Η μέση βαθμολογία αγγίζει τα ${stats.avg_vath.toFixed(2)} μόρια. ${sauce}`,
              `Έτοιμα τα στοιχεία! 📊\n\nΣτην ειδικότητα "${eidikotitaName}" είχαμε ${stats.count} υποψηφίους, με ${stats.dioristoi} διορισμούς. Μέση βαθμολογία: ${stats.avg_vath.toFixed(2)}. ${sauce}`
            ]),
            link: `/eidikotita/${stats.slug}`,
            linkText: `📊 Προβολή Στατιστικών Ειδικότητας`,
            options: [
              { label: "Δες τον Χάρτη Θέσεων", value: "MENU_MAP", iconName: "map-pin" },
              { label: "Πίσω στο μενού", value: "START", iconName: "refresh" }
            ]
          });
        }
        
        return NextResponse.json({
          reply: "Χμμ, δεν βρήκα αναλυτικά στατιστικά για αυτή την ειδικότητα. Ίσως να δοκιμάσεις τα γενικά στατιστικά;",
          link: `/stats`,
          linkText: `📊 Γενικά Στατιστικά`,
          options: [{ label: "Πίσω στο μενού", value: "START", iconName: "refresh" }]
        });
      }

      return NextResponse.json({
        reply: pickRandom([
          "Τα στατιστικά είναι η ειδικότητά μου! 📊 Μπορείς να δεις όλες τις βάσεις μορίων.",
          "Λατρεύω τα νούμερα! 📊 Δες όλες τις βάσεις και την κατανομή ανά ειδικότητα.",
          "Πάμε να δούμε τα στατιστικά! 📊 Έχω όλα τα δεδομένα έτοιμα."
        ]),
        link: "/stats",
        linkText: "📊 Προβολή Όλων των Στατιστικών",
        options: [
          { label: "Δες τον Χάρτη Θέσεων", value: "MENU_MAP", iconName: "map-pin" },
          { label: "Πίσω στο μενού", value: "START", iconName: "refresh" }
        ]
      });
    }

    // --- 6. ΠΡΟΕΤΟΙΜΑΣΙΑ 2027 ---
    if (action === "MENU_PREP") {
      return NextResponse.json({
        reply: pickRandom([
          "Καλή σκέψη να ξεκινήσεις νωρίς! 📚 Έχω τις επίσημες ερωτήσεις και τα τεστ δεξιοτήτων για το 2027.",
          "Το μέλλον ανήκει σε όσους προετοιμάζονται! 📚 Δες τις ερωτήσεις και τα τεστ για το 2027.",
          "Μπράβο που το σκέφτεσαι από τώρα! 📚 Ξεκίνα την προετοιμασία για το 2027."
        ]),
        link: "/proetoimasia",
        linkText: "📚 Ξεκίνα την Προετοιμασία",
        options: [
          { label: "Βαρόμετρο Ζήτησης Φορέων", value: "MENU_ZITIS", iconName: "sparkles" },
          { label: "Πίσω στο μενού", value: "START", iconName: "refresh" }
        ]
      });
    }

    // --- 7. ΧΑΡΤΗΣ ---
    if (action === "MENU_MAP") {
      return NextResponse.json({
        reply: pickRandom([
          "Ο διαδραστικός χάρτης δείχνει πού κατανέμονται οι θέσεις ανά Περιφέρεια. 🗺️",
          "Θες να δεις γεωγραφικά τις θέσεις; Ο χάρτης είναι έτοιμος! 🗺️",
          "Δες πού βρίσκονται οι θέσεις ανά την Ελλάδα! 🗺️"
        ]),
        link: "/xartis",
        linkText: "🗺️ Άνοιγμα Χάρτη",
        options: [{ label: "Πίσω στο μενού", value: "START", iconName: "refresh" }]
      });
    }

    // --- 8. ΖΗΤΗΣΗ ΦΟΡΕΩΝ ---
    if (action === "MENU_ZITIS") {
      return NextResponse.json({
        reply: pickRandom([
          "Δες ποιοι φορείς συγκέντρωσαν τον υψηλότερο ανταγωνισμό. 📈",
          "Ποιοι φορείς είχαν τη μεγαλύτερη ζήτηση; Δες το βαρόμετρο! 📈",
          "Μια ματιά στο βαρόμετρο ζήτησης θα σε βοηθήσει να επιλέξεις στρατηγικά. 📈"
        ]),
        link: "/zitisi",
        linkText: "📈 Βαρόμετρο Ζήτησης",
        options: [{ label: "Πίσω στο μενού", value: "START", iconName: "refresh" }]
      });
    }

    // --- 9. ΑΝΑΖΗΤΗΣΗ ΜΕ ΕΠΩΝΥΜΟ ---
    if (action === "MENU_SEARCH_NAME") {
      return NextResponse.json({ 
        reply: pickRandom([
          "Φυσικά! Γράψε μου το επώνυμο του υποψηφίου παρακάτω και θα ψάξω στους πίνακες.",
          "Ποιο επώνυμο ψάχνεις; Γράψ' το εδώ και θα το βρω.",
          "Δώσε μου το επώνυμο και θα σου πω τι βρήκα."
        ]), 
        expectingInput: "SURNAME" 
      });
    }

    // --- 10. ΑΠΕΥΘΕΙΑΣ LINK ---
    if (action === "DIRECT_LINK") {
      const link = payload?.link;
      const linkText = payload?.linkText;
      if (link) {
        return NextResponse.json({
          reply: pickRandom([
            "Έτοιμο! Πάτα το κουμπί για να ανοίξεις τη σελίδα.",
            "Ορίστε το link που ζήτησες! Πάτα για να το δεις.",
            "Το βρήκα! Πάτα εδώ για να μεταφερθείς."
          ]),
          link: link,
          linkText: linkText || "Άνοιγμα",
          options: [{ label: "Πίσω στο μενού", value: "START", iconName: "refresh" }]
        });
      }
    }

    // --- 11. ΕΛΕΓΧΟΣ INPUT (ΑΜ, ΘΕΣΗ, ΕΠΩΝΥΜΟ) ---
    if (action === "SUBMIT_INPUT") {
      const input = payload?.text || "";
      const type = payload?.type;

      if (type === "AM") {
        if (!/^\d{4,6}$/.test(input)) {
          return NextResponse.json({ 
            reply: pickRandom([
              "Ο Αριθμός Αίτησης (Α.Μ.) πρέπει να είναι αριθμός (π.χ. 12345). Δοκίμασε ξανά.",
              "Χμμ, αυτό δεν μοιάζει με Α.Μ. Θέλει μόνο νούμερα (π.χ. 12345).",
              "Περίμενε, το Α.Μ. έχει μόνο νούμερα. Δοκίμασε ξανά."
            ]), 
            expectingInput: "AM" 
          });
        }
        
        const candidate = getCandidateDetails(input);
        if (candidate) {
          const fullName = `${candidate.eponymo} ${candidate.onoma || ''}`.trim();
          
          // Διαμόρφωση του status (Διορίστηκε ή όχι)
          let statusText = "";
          if (candidate.thesiDiorismou) {
            statusText = `Διορίστηκες στη θέση με κωδικό ${candidate.thesiDiorismou}! 🎉`;
          } else {
            statusText = `Δεν βλέπω κάποιον διορισμό στο όνομά σου. Μπορεί να είσαι στους επιλαχόντες ή να μην έφτασες τη βάση. Μην απογοητεύεσαι!`;
          }

          return NextResponse.json({
            reply: pickRandom([
              `Βρήκα τον υποψήφιο! 🎯\n\nΕίναι ο/η ${fullName} και βρίσκεται στη σειρά κατάταξης με αύξοντα αριθμό ${candidate.aa} στην ειδικότητα ${candidate.eidikotitaName}.\n\n${statusText}`,
              `Τον/Την βρήκα! 🎯\n\nΟ/Η ${fullName} είναι στη θέση ${candidate.aa} της κατάταξης για την ειδικότητα ${candidate.eidikotitaName}.\n\n${statusText}`,
              `Ορίστε! 🎯\n\nΒρήκα τον/την ${fullName}. Η σειρά κατάταξής του/της είναι ${candidate.aa} στην ειδικότητα ${candidate.eidikotitaName}.\n\n${statusText}`
            ]),
            link: `/ypopsifios/${candidate.am}`,
            linkText: `👤 Προβολή Καρτέλας`,
            options: [{ label: "Δες τα Στατιστικά", value: "MENU_STATS", iconName: "file-text" }, { label: "Νέα Αναζήτηση", value: "START", iconName: "refresh" }]
          });
        }
        
        return NextResponse.json({ 
          reply: pickRandom([
            `Δεν βρήκα υποψήφιο με Α.Μ. ${input}. Σίγουρα το έγραψες σωστά;`,
            `Χμμ, δεν βρήκα κάτι με αυτό το Α.Μ. (${input}). Δοκίμασε ξανά.`,
            `Δεν υπάρχει υποψήφιος με Α.Μ. ${input}. Μήπως έκανες κάποιο λάθος;`
          ]), 
          options: [{ label: "Νέα Αναζήτηση", value: "START", iconName: "refresh" }] 
        });
      }

      if (type === "THESI") {
        if (!/^\d{3,5}$/.test(input)) {
          return NextResponse.json({ 
            reply: pickRandom([
              "Ο κωδικός θέσης πρέπει να είναι αριθμός (π.χ. 1031). Δοκίμασε ξανά.",
              "Χμμ, ο κωδικός θέσης έχει μόνο νούμερα. Δοκίμασε ξανά.",
              "Ο κωδικός θέσης δεν μπορεί να έχει γράμματα. Δοκίμασε ξανά."
            ]), 
            expectingInput: "THESI" 
          });
        }

        const pos = getPositionDetails(input);
        if (pos) {
          return NextResponse.json({
            reply: pickRandom([
              `Βρήκα τη θέση! 🎯\n\nΑντιστοιχεί στον φορέα ${pos.foreas} με έδρα ${pos.edra}. Η ειδικότητα είναι ${pos.eidikotita} και αφορά ${pos.theseis} θέση(εις).`,
              `Την εντόπισα! 🎯\n\nΕίναι στον φορέα ${pos.foreas} (${pos.edra}) για την ειδικότητα ${pos.eidikotita}. Προκηρύχθηκαν ${pos.theseis} θέση(εις).`,
              `Ορίστε η θέση! 🎯\n\nΟ φορέας είναι ${pos.foreas}, με έδρα ${pos.edra}. Ψάχνουν για ${pos.eidikotita} και αφορά ${pos.theseis} θέση(εις).`
            ]),
            link: `/thesi/${pos.kod_thesis}`,
            linkText: `📍 Προβολή Θέσης`,
            options: [
              { label: "Δες τα Στατιστικά της Ειδικότητας", value: `MENU_STATS_NAME_${encodeURIComponent(pos.eidikotita)}`, iconName: "file-text" },
              { label: "Νέα Αναζήτηση", value: "START", iconName: "refresh" }
            ]
          });
        }
        
        return NextResponse.json({ 
          reply: pickRandom([
            `Δεν βρήκα στοιχεία για τη θέση με κωδικό ${input}. Σίγουρα είναι σωστός;`,
            `Χμμ, δεν βρήκα τη θέση ${input}. Δοκίμασε ξανά.`,
            `Δεν υπάρχει θέση με κωδικό ${input}. Μήπως έκανες κάποιο λάθος;`
          ]), 
          options: [{ label: "Νέα Αναζήτηση", value: "START", iconName: "refresh" }] 
        });
      }

      if (type === "SURNAME") {
        try {
          const filePath = join(process.cwd(), "public", "data", "search_index.json");
          const index = JSON.parse(readFileSync(filePath, "utf-8"));
          
          const normalizedInput = normalizeText(input);
          const matches = index.filter((c: any) => normalizeText(c.eponymo || "").includes(normalizedInput));
          const uniqueMatches = Array.from(new Map(matches.map((c: any) => [c.am, c])).values());

          if (uniqueMatches.length === 0) {
            return NextResponse.json({ 
              reply: pickRandom([
                `Δεν βρήκα κανέναν υποψήφιο με επώνυμο που να περιέχει "${input}".`,
                `Χμμ, δεν βρήκα κανέναν με επώνυμο "${input}". Δοκίμασε διαφορετική ορθογραφία.`,
                `Δεν υπάρχει υποψήφιος με επώνυμο "${input}". Σίγουρα το έγραψες σωστά;`
              ]), 
              options: [{ label: "Νέα Αναζήτηση", value: "START", iconName: "refresh" }] 
            });
          }

          if (uniqueMatches.length === 1) {
            const c: any = uniqueMatches[0];
            return NextResponse.json({
              reply: pickRandom([
                `Βρήκα τον υποψήφιο ${c.eponymo} ${c.onoma || ''} (Α.Μ. Αίτησης: ${c.am}).`,
                `Ορίστε! Βρήκα τον/την ${c.eponymo} ${c.onoma || ''} με Α.Μ. ${c.am}.`,
                `Τον/Την βρήκα! Είναι ο/η ${c.eponymo} ${c.onoma || ''} (Α.Μ. ${c.am}).`
              ]),
              link: `/ypopsifios/${c.am}`,
              linkText: `👤 Προβολή Υποψηφίου`,
              options: [{ label: "Νέα Αναζήτηση", value: "START", iconName: "refresh" }]
            });
          }

          const topMatches = uniqueMatches.slice(0, 4);
          const options = topMatches.map((c: any) => ({
            label: `${c.eponymo} ${c.onoma || ''} (Α.Μ.: ${c.am})`,
            value: `DIRECT_AM_${c.am}`,
            iconName: "user"
          }));

          if (uniqueMatches.length > 4) {
            options.push({ label: `Προβολή όλων (${uniqueMatches.length})`, value: `SEARCH_ALL_${encodeURIComponent(input)}`, iconName: "search" });
          }

          return NextResponse.json({ 
            reply: pickRandom([
              `Βρήκα ${uniqueMatches.length} υποψηφίους με επώνυμο "${input}". Διάλεξε ποιος είσαι:`,
              `Υπάρχουν ${uniqueMatches.length} άτομα με επώνυμο "${input}". Ποιος από αυτούς είσαι;`,
              `Εντόπισα ${uniqueMatches.length} εγγραφές για "${input}". Διάλεξε το όνομά σου:`
            ]), 
            options: options 
          });

        } catch (err) {
          return NextResponse.json({ reply: "Κάτι πήγε στραβά με την αναζήτηση. Δοκίμασε ξανά." });
        }
      }
    }

    return NextResponse.json({ 
      reply: pickRandom([
        "Συγγνώμη, δεν κατάλαβα τι θέλεις να κάνω. Πάτα στο κουμπί για να ξεκινήσουμε.",
        "Χμμ, δεν είμαι σίγουρος τι εννοείς. Ας ξεκινήσουμε από την αρχή.",
        "Δεν κατάφερα να καταλάβω. Πάτα εδώ για να δεις τις επιλογές."
      ]), 
      options: [{ label: "Κεντρικό Μενού", value: "START", iconName: "refresh" }] 
    });
  } catch (error) {
    return NextResponse.json({ error: "System error" }, { status: 500 });
  }
}