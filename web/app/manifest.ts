import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ΑΣΕΠ Analytics Hub",
    short_name: "ΑΣΕΠ Hub",
    description: "Αποτελέσματα 2ΓΒ/2026, Βάσεις & Προετοιμασία 2027",
    start_url: "/",
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
  };
}