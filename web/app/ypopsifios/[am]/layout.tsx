import type { Metadata } from "next";

export const metadata: Metadata = {
  // 👈 Λέει στη Google να ΜΗΝ ευρετηριάζει τα προσωπικά προφίλ/ονόματα υποψηφίων
  robots: {
    index: false,
    follow: true,
  },
};

export default function YpopsifiosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}