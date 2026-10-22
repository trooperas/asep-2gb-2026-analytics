import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ΑΣΕΠ Analytics Hub",
    short_name: "ΑΣΕΠ Hub",
    description: "Αποτελέσματα 2ΓΒ/2026, Βάσεις & Προετοιμασία 2027",
    start_url: "/",
    id: "/", // 👈 Ζητήθηκε από το DevTools
    display: "standalone",
    background_color: "#05070D",
    theme_color: "#05070D",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    // 👇 Ενεργοποιεί το πλούσιο παράθυρο τύπου Google Play (Richer Install UI)
    screenshots: [
      {
        src: "/og-image.png",
        sizes: "1200x630",
        type: "image/png",
        form_factor: "wide",
      },
      {
        src: "/og-image.png",
        sizes: "1200x630",
        type: "image/png",
      },
    ],
  };
}