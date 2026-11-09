import type { Metadata } from "next";

type Props = {
  params: Promise<{ kod: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kod } = await params;

  return {
    // `absolute` keeps the final title exactly as specified instead of letting
    // the root layout's "%s | ΑΣΕΠ Analytics Hub" template append a second brand.
    title: { absolute: `Θέση ${kod} | ASEP Analytics` },
    alternates: {
      canonical: `/thesi/${kod}`,
    },
  };
}

export default function ThesiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
