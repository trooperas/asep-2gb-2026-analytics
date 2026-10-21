import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // Διατήρηση του δικού σου setting για μεγάλα datasets
    largePageDataBytes: 128 * 1000 * 1000, // 128 MB
    // Tree-shaking για δραστική μείωση του unused JS στα κινητά (-160 KiB!)
    optimizePackageImports: ["lucide-react", "recharts", "framer-motion"],
  },
  // Διατήρηση των δικών σου Turbopack ρυθμίσεων
  turbopack: {
    resolveAlias: {},
  },
};

export default nextConfig;