import Link from "next/link";
import { ArrowRight, Calendar, CheckCircle2, Clock, Sparkles, Zap } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative border-b border-border paper-grid">
      <div className="mx-auto w-11/12 max-w-6xl px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-20">
        <p className="label-caps animate-rise tracking-widest text-primary font-semibold">
          Career Operating System
        </p>

        <h1
          className="mt-4 font-display text-[2.4rem] font-semibold leading-[1.02] tracking-[-0.03em] animate-rise sm:text-[4.2rem] lg:text-[5.4rem]"
          style={{ animationDelay: "60ms" }}
        >
          <span className="block text-foreground">YOUR JOB SEARCH,</span>
          <span className="block text-muted-foreground font-light">WITHOUT THE CHAOS.</span>
        </h1>

        <div
          className="mt-6 grid gap-6 animate-rise lg:grid-cols-[1fr_auto] lg:items-end"
          style={{ animationDelay: "140ms" }}
        >
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-xl">
            Track every application, interview, deadline, and opportunity in one intelligent workspace.
            Know exactly what to do next.
          </p>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-md transition-transform duration-150 hover:-translate-y-px active:translate-y-0 cursor-pointer"
            >
              Start tracking <ArrowRight className="size-4" />
            </Link>
            <a
              href="#dashboard-preview"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-5 py-3.5 text-base font-medium text-foreground transition-colors duration-150 hover:bg-surface-2 cursor-pointer"
            >
              Explore demo
            </a>
          </div>
        </div>

        {/* Live Interactive Product/Dashboard Mockup Banner */}
        <div id="dashboard-preview" className="mt-12 rounded-xl border border-border bg-surface/90 shadow-2xl p-4 sm:p-8 animate-rise" style={{ animationDelay: "200ms" }}>
          {/* Mock Browser Header */}
          <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-destructive/60" />
              <span className="size-3 rounded-full bg-amber-500/60" />
              <span className="size-3 rounded-full bg-emerald-500/60" />
              <span className="ml-3 label-caps text-xs text-muted-foreground font-semibold">JobFlow Live Workspace</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-Time Sync Active</span>
            </div>
          </div>

          {/* Dashboard Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="rounded-lg border border-border bg-surface-2/40 p-4">
              <p className="label-caps text-[10px]">Applications</p>
              <p className="num text-2xl font-bold mt-1 text-foreground">12</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">+3 this week</p>
            </div>
            <div className="rounded-lg border border-border bg-surface-2/40 p-4">
              <p className="label-caps text-[10px]">Interviews</p>
              <p className="num text-2xl font-bold mt-1 text-purple-600 dark:text-purple-400">4</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">2 this week</p>
            </div>
            <div className="rounded-lg border border-border bg-surface-2/40 p-4">
              <p className="label-caps text-[10px]">Follow-ups</p>
              <p className="num text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400">3</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Need attention</p>
            </div>
            <div className="rounded-lg border border-border bg-surface-2/40 p-4">
              <p className="label-caps text-[10px]">Offers</p>
              <p className="num text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">2</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">17% conversion</p>
            </div>
          </div>

          {/* Today's Next Actions Stack */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 sm:p-5 mb-6 space-y-3">
            <div className="flex items-center gap-2 text-primary font-semibold text-xs label-caps">
              <Zap className="size-4 fill-primary" /> Today&apos;s Next Actions
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 p-3 rounded-md bg-surface border border-border">
                <span className="size-2.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground">Follow up with Acme Corp</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Applied 9 days ago · Recruiter contact pending</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-md bg-surface border border-border">
                <span className="size-2.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground">Prepare Technical Loop with Linear</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Tomorrow at 10:00 AM · Architecture review</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Pipeline Bar */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="label-caps text-[11px]">5-Stage Application Pipeline</span>
              <span className="num text-muted-foreground">12 tracked</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5 text-center text-[11px] font-medium">
              {[
                { stage: "Saved", count: 3, color: "bg-surface-2 text-muted-foreground" },
                { stage: "Applied", count: 4, color: "bg-primary/10 text-primary" },
                { stage: "Screening", count: 2, color: "bg-amber-500/10 text-amber-600" },
                { stage: "Interview", count: 2, color: "bg-purple-500/10 text-purple-600" },
                { stage: "Offer", count: 1, color: "bg-emerald-500/10 text-emerald-600" },
              ].map((item) => (
                <div key={item.stage} className={`p-2.5 rounded border border-border/80 ${item.color}`}>
                  <p className="label-caps text-[9px] truncate">{item.stage}</p>
                  <p className="num text-sm font-semibold mt-0.5">{item.count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
