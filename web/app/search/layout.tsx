import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Αναζήτηση Υποψηφίων & Θέσεων",
  robots: { index: false, follow: true },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}