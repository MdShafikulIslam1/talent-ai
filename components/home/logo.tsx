import Link from "next/link";

/** Four rounded squares in the three brand colours — one workspace, many tools. */
export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Talent AI home">
      <span className="grid grid-cols-2 gap-[3px]">
        <span className="h-[11px] w-[11px] rounded-[4px] bg-brand" />
        <span className="h-[11px] w-[11px] rounded-[4px] bg-flame" />
        <span className="h-[11px] w-[11px] rounded-[4px] bg-ink" />
        <span className="h-[11px] w-[11px] rounded-full bg-brand-300" />
      </span>
      <span className="text-[17px] font-bold tracking-tight text-ink">Talent AI</span>
    </Link>
  );
}
