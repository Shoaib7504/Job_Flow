import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";

export default function FinalCta() {
  return (
    <section className="border-b border-border paper-grid">
      <div className="mx-auto w-11/12 px-5 py-24 sm:px-8 sm:py-36">
        <Reveal>
          <h2 className="font-display text-[2.2rem] font-semibold leading-[1] tracking-[-0.03em] sm:text-[4rem]">
            <span className="block">YOUR NEXT OPPORTUNITY</span>
            <span className="block text-muted-foreground">STARTS WITH ONE APPLICATION.</span>
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <Link
            href="/dashboard"
            className="mt-10 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-base font-medium text-primary-foreground transition-transform duration-150 hover:-translate-y-px active:translate-y-0"
          >
            Start tracking <ArrowUpRight className="size-4" strokeWidth={1.75} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}