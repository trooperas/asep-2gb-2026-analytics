import type { Metadata } from "next";
import ThesiClient from "./ThesiClient";

type Props = {
  params: Promise<{ kod: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kod } = await params;
  return {
    title: { absolute: `Θέση ${kod} | ASEP Analytics` },
    alternates: {
      canonical: `https://asepanalytics.app/thesi/${kod}`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { kod } = await params;
  return <ThesiClient kod={kod} />;
}
