import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Βοηθός",
  robots: { index: false, follow: true },
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}