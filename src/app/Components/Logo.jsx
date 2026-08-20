import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Logo({ className, wordmark = true, link = true }) {
  const mark = (
    <>
      <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-primary text-primary-foreground shadow-[0_1px_2px_rgba(0,0,0,0.18)] ring-1 ring-inset ring-white/15 transition-transform duration-300 ease-out group-hover:-rotate-6 group-hover:scale-105">
        <svg
          viewBox="0 0 24 24"
          className="size-[22px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M4 17.5 10 17.5 10 12.5 16 12.5 16 7.5" />
          <path d="M16 7.5 13 10.5M16 7.5 19 10.5" />
          <circle cx="4" cy="17.5" r="1.3" fill="currentColor" stroke="none" />
          <circle cx="10" cy="12.5" r="1.3" fill="currentColor" stroke="none" />
          <circle cx="16" cy="7.5" r="1.3" fill="currentColor" stroke="none" />
        </svg>
      </span>
      {wordmark && (
        <span className="font-display text-lg font-semibold tracking-tight">
          Job<span className="text-primary">Flow</span>
        </span>
      )}
    </>
  );

  if (!link) {
    return <span className={cn("group inline-flex items-center gap-2.5", className)}>{mark}</span>;
  }

  return (
    <Link
      href="/"
      aria-label="JobFlow home"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      {mark}
    </Link>
  );
}