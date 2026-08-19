import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { OpportunityMap } from "./jobflow/OpportunityMap";

export default function Hero() {
  return (
    <section className="relative border-b border-border paper-grid">
      <div className="mx-auto w-11/12 px-5 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-24">
        <p className="label-caps animate-rise">Career operating system</p>
        <h1
          className="mt-6 font-display text-[2.6rem] font-semibold leading-[0.98] tracking-[-0.03em] animate-rise sm:text-[4.5rem] lg:text-[5.6rem]"
          style={{ animationDelay: "60ms" }}
        >
          <span className="block">YOUR JOB SEARCH,</span>
          <span className="block text-muted-foreground">WITHOUT THE CHAOS.</span>
        </h1>
        <div
          className="mt-8 grid gap-8 animate-rise lg:grid-cols-[1fr_auto] lg:items-end"
          style={{ animationDelay: "140ms" }}
        >
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Track applications, interviews, deadlines, and opportunities in one intelligent
            workspace.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-base font-medium text-primary-foreground transition-transform duration-150 hover:-translate-y-px active:translate-y-0"
            >
              Start tracking <ArrowUpRight className="size-4" strokeWidth={1.75} />
            </Link>
            <a
              href="#journey"
              className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-base font-medium transition-colors duration-150 hover:bg-surface-2"
            >
              View demo
            </a>
          </div>
        </div>

        {/* Signature visual */}
        <div className="mt-16 rounded-lg border border-border bg-surface/70 p-6 sm:mt-20 sm:p-10">
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-2">
            <p className="label-caps">Opportunity map · demo workspace</p>
            <p className="num text-xs text-muted-foreground">progress → momentum → opportunity</p>
          </div>
          <OpportunityMap />
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
            <p className="num text-xs text-muted-foreground sm:text-sm">
              5 stages · 33 opportunities · updated live
            </p>
            <p className="num text-xs text-muted-foreground sm:text-sm">
              <span className="text-primary">17%</span> saved → offer
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
