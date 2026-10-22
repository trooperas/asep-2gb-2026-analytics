import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type BreadcrumbProps = {
  href: string;
  label: string;
};

export default function Breadcrumb({ href, label }: BreadcrumbProps) {
  return (
    <div className="mb-4">
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-[#00E5FF]"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        <span>{label}</span>
      </Link>
    </div>
  );
}