import type { Metadata } from "next";
import stats from "@/public/data/global_stats.json";
import Hero from "@/components/hero/Hero";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <main>
      <Hero stats={stats} />
    </main>
  );
}