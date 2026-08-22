"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Clock,
  PlusCircle,
  Sparkles,
  TrendingUp,
  Zap,
  Play,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell, PageHeader, useAppShell } from "@/app/Components/jobflow/AppShell";
import { JourneyRail } from "@/app/Components/jobflow/Journey";
import { DashboardSkeleton } from "@/app/Components/jobflow/Skeletons";
import { useStore } from "@/lib/store";
import {
  STAGES,
  STAGE_META,
  fmtDate,
  fmtShort,
  getNextAction,
  isNegativeStage,
  relative,
  stageIndex,
} from "@/lib/jobflow";
import { cn } from "@/lib/utils";

const NOW = Date.now();

export default function Dashboard() {
  const { apps, isFetching, loadSampleWorkspace } = useStore();
  const { openAddModal } = useAppShell();

  // Time of day greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "GOOD MORNING";
    if (hour < 18) return "GOOD AFTERNOON";
    return "GOOD EVENING";
  }, []);

  const stats = useMemo(() => {
    const total = apps.length;
    const active = apps.filter((a) => !isNegativeStage(a.stage)).length;
    const interviews = apps.filter((a) => stageIndex(a.stage) >= 3).length;
    const offers = apps.filter((a) => stageIndex(a.stage) >= 4).length;
    const applied = apps.filter((a) => stageIndex(a.stage) >= 1).length;
    const conversion = applied ? Math.round((interviews / applied) * 100) : 0;
    
    const oneWeekAgo = NOW - 7 * 86400000;
    const addedThisWeek = apps.filter((a) => new Date(a.appliedAt).getTime() > oneWeekAgo).length;

    return { total, active, interviews, offers, conversion, addedThisWeek };
  }, [apps]);

  // Extract all actionable tasks for "Today's Action Center"
  const todayTasks = useMemo(() => {
    if (!apps.length) return [];
    return apps
      .map((app) => getNextAction(app))
      .filter(Boolean)
      .sort((a, b) => {
        const weight = { high: 3, medium: 2, low: 1 };
        return weight[b.urgency] - weight[a.urgency];
      });
  }, [apps]);

  const momentum = useMemo(() => {
    const weeks = Array.from({ length: 8 }, (_, i) => {
      const end = NOW - (7 - i) * 7 * 86400000;
      const start = end - 7 * 86400000;
      const count = apps.filter((a) => {
        const t = new Date(a.appliedAt).getTime();
        return t > start && t <= end;
      }).length;
      return { week: `W${i + 1}`, count };
    });
    return weeks;
  }, [apps]);

  const distribution = useMemo(
    () =>
      STAGES.map((s) => ({
        stage: s,
        count: apps.filter((a) => a.stage === s).length,
      })),
    [apps],
  );
  const maxStage = Math.max(1, ...distribution.map((d) => d.count));

  const upcomingInterviews = useMemo(
    () =>
      apps
        .flatMap((a) => a.interviews.map((i) => ({ ...i, app: a })))
        .filter((i) => new Date(i.at).getTime() > NOW)
        .sort((a, b) => +new Date(a.at) - +new Date(b.at))
        .slice(0, 4),
    [apps],
  );

  const recentApps = useMemo(
    () =>
      [...apps]
        .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
        .slice(0, 5),
    [apps],
  );

  const topSource = useMemo(() => {
    const map = new Map();
    apps.forEach((a) => {
      const e = map.get(a.source) || { total: 0, advanced: 0 };
      e.total += 1;
      if (stageIndex(a.stage) >= 3) e.advanced += 1;
      map.set(a.source, e);
    });
    return [...map.entries()]
      .map(([source, v]) => ({ source, ...v, rate: v.total ? v.advanced / v.total : 0 }))
      .sort((a, b) => b.rate - a.rate)[0];
  }, [apps]);

  if (!apps.length && isFetching) {
    return (
      <AppShell>
        <DashboardSkeleton />
      </AppShell>
    );
  }

  // 🔴 Rich Empty State when 0 applications exist
  if (apps.length === 0) {
    return (
      <AppShell>
        <PageHeader
          eyebrow="Job-Search Operating System"
          title={`${greeting} — YOUR SEARCH STARTS HERE`}
          description="Add your first application and we'll build your pipeline and daily action items automatically."
        />

        <div className="rounded-xl border border-primary/20 bg-surface p-8 sm:p-12 text-center my-6 space-y-6 shadow-sm">
          <div className="p-4 rounded-full bg-primary/10 text-primary w-fit mx-auto">
            <Sparkles className="size-8" />
          </div>

          <div className="max-w-lg mx-auto space-y-2">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Your Workspace Starts Empty
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Add a real job application in 10 seconds, or click below to load sample demo applications to experience the full command center.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-md transition-transform hover:-translate-y-px cursor-pointer"
            >
              <PlusCircle className="size-4" />
              + Add Application
            </button>

            <button
              onClick={loadSampleWorkspace}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-surface-2 px-5 py-3 text-sm font-medium text-foreground hover:border-border-strong transition-colors cursor-pointer"
            >
              <Play className="size-4 text-primary fill-primary" />
              Load Sample Workspace
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Job-Search Operating System"
        title={`${greeting} — You have ${todayTasks.length} things to do today.`}
        description="A live read of where every opportunity stands and what needs your attention right now."
        actions={
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-transform hover:-translate-y-px active:translate-y-0 cursor-pointer"
          >
            <PlusCircle className="size-4" />
            + Add Application
          </button>
        }
      />

      {/* 🔴 "TODAY'S ACTION CENTER" (Killer UX Feature) */}
      <section className="mb-8 overflow-hidden rounded-xl border border-primary/25 bg-gradient-to-br from-primary/10 via-surface to-surface p-6 shadow-sm relative">
        <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary uppercase tracking-wider">
              <Zap className="size-3.5 fill-primary" /> Today&apos;s Action Center
            </span>
          </div>
          <span className="num text-xs text-muted-foreground font-semibold">
            {todayTasks.length} Pending Actions
          </span>
        </div>

        {todayTasks.length > 0 ? (
          <div className="space-y-3">
            {todayTasks.slice(0, 3).map((item) => (
              <div
                key={item.appId}
                className={cn(
                  "flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border bg-surface transition-all hover:border-border-strong",
                  item.urgency === "high" ? "border-destructive/30 bg-destructive/5" : "border-border",
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "size-3 rounded-full mt-1 shrink-0",
                      item.urgency === "high"
                        ? "bg-destructive ring-4 ring-destructive/10"
                        : item.urgency === "medium"
                        ? "bg-amber-500 ring-4 ring-amber-500/10"
                        : "bg-blue-500",
                    )}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.subtitle}</p>
                  </div>
                </div>

                <Link
                  href={`/applications/${item.appId}`}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow shrink-0 self-start sm:self-auto hover:-translate-y-px transition-transform"
                >
                  {item.actionLabel}
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-3 py-2 text-muted-foreground">
            <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">All caught up for today!</p>
              <p className="text-xs">No overdue follow-ups or pending reminders. Keep adding opportunities to keep your pipeline warm.</p>
            </div>
          </div>
        )}
      </section>

      {/* Integrated Statistics Grid */}
      <section className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-4">
        {[
          { label: "Total Applications", value: stats.total, meta: `${stats.addedThisWeek >= 0 ? `+${stats.addedThisWeek}` : stats.addedThisWeek} this week` },
          { label: "Active Pursuits", value: stats.active, meta: "in active pipeline" },
          { label: "Interviews", value: stats.interviews, meta: `${stats.offers} offer stage` },
          { label: "Conversion Rate", value: `${stats.conversion}%`, meta: "applied → interview" },
        ].map((s) => (
          <div key={s.label} className="bg-surface px-5 py-5 transition-colors hover:bg-surface-2/50">
            <p className="label-caps text-[11px]">{s.label}</p>
            <p className="num mt-2 text-3xl font-semibold tracking-tight">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.meta}</p>
          </div>
        ))}
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_1fr]">
        {/* Application Momentum Chart */}
        <section className="panel noise p-5 sm:p-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
            <div className="min-w-0">
              <p className="label-caps">Application Momentum</p>
              <h2 className="mt-1 text-lg font-semibold">Weekly Cadence (Last 8 Weeks)</h2>
            </div>
            <span className="num shrink-0 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground bg-surface">
              {momentum.reduce((n, m) => n + m.count, 0)} submitted
            </span>
          </div>

          <div className="mt-6 h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={momentum} margin={{ left: -24, right: 4, top: 4 }}>
                <defs>
                  <linearGradient id="mom" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="week"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                />
                <Tooltip
                  cursor={{ stroke: "var(--color-border-strong)" }}
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  fill="url(#mom)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pipeline Distribution Bars */}
          <div className="mt-8 border-t border-border pt-6">
            <div className="flex items-center justify-between">
              <p className="label-caps">Pipeline Stage Distribution</p>
              <Link href="/pipeline" className="text-xs text-primary hover:underline flex items-center gap-1">
                View Kanban <ArrowUpRight className="size-3" />
              </Link>
            </div>
            <ul className="mt-4 space-y-3">
              {distribution.map((d) => (
                <li
                  key={d.stage}
                  className="grid grid-cols-[92px_minmax(0,1fr)_32px] items-center gap-3"
                >
                  <span className="label-caps text-[11px]">{d.stage}</span>
                  <span className="h-[6px] w-full overflow-hidden rounded-full bg-surface-2">
                    <span
                      className="block h-full rounded-full bg-primary/80 transition-[width] duration-500"
                      style={{ width: `${(d.count / maxStage) * 100}%` }}
                    />
                  </span>
                  <span className="num text-right text-xs font-medium">{d.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Side Panel: Career Signals & Upcoming Interviews */}
        <div className="space-y-8">
          {/* Career Signals */}
          <section className="panel p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" strokeWidth={1.75} />
              <p className="label-caps">Career Signals</p>
            </div>
            <ul className="mt-5 divide-y divide-border">
              <li className="pb-4">
                <p className="text-sm font-medium">Interview Conversion Rate</p>
                <p className="num mt-1 text-2xl font-semibold">{stats.conversion}%</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stats.interviews} of your applied roles reached an interview stage.
                </p>
              </li>
              {topSource && (
                <li className="py-4">
                  <p className="text-sm font-medium">Strongest Sourcing Channel</p>
                  <p className="mt-1 text-lg font-medium text-foreground">{topSource.source}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {Math.round(topSource.rate * 100)}% advance rate across {topSource.total}{" "}
                    tracked applications.
                  </p>
                </li>
              )}
            </ul>
          </section>

          {/* Upcoming Interviews */}
          <section className="panel p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarClock className="size-4 text-primary" strokeWidth={1.75} />
                <p className="label-caps">Upcoming Interviews</p>
              </div>
              <Link href="/calendar" className="text-xs text-primary hover:underline">
                View Calendar
              </Link>
            </div>
            <ul className="mt-5 space-y-3">
              {upcomingInterviews.map((i) => (
                <li key={i.id}>
                  <Link
                    href={`/applications/${i.app.id}`}
                    className="group grid grid-cols-[auto_minmax(0,1fr)] gap-3 p-2 rounded-md hover:bg-surface-2 transition-colors"
                  >
                    <span className="num shrink-0 rounded border border-border px-2 py-1 text-xs text-muted-foreground bg-surface">
                      {fmtShort(i.at)}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium group-hover:text-primary">
                        {i.app.company}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {i.kind} · {i.withWhom}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
              {!upcomingInterviews.length && (
                <li className="text-xs text-muted-foreground py-2">No upcoming interviews scheduled.</li>
              )}
            </ul>
          </section>
        </div>
      </div>

      {/* Recent Applications List */}
      <section className="mt-8 panel p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-primary" strokeWidth={1.75} />
            <p className="label-caps">Recent Applications & Progress</p>
          </div>
          <Link href="/applications" className="text-xs text-primary hover:underline flex items-center gap-1">
            View All ({apps.length}) <ArrowUpRight className="size-3" />
          </Link>
        </div>

        {recentApps.length > 0 ? (
          <div className="divide-y divide-border">
            {recentApps.map((a) => {
              const meta = STAGE_META[a.stage] || STAGE_META.SAVED;
              return (
                <div
                  key={a.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 transition-colors hover:bg-surface-2/40 px-2 rounded-md"
                >
                  <div className="min-w-0 flex-1">
                    <Link href={`/applications/${a.id}`} className="group flex items-center gap-2">
                      <span className="font-medium text-sm text-foreground group-hover:text-primary truncate">
                        {a.company}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">— {a.role}</span>
                    </Link>
                    <JourneyRail stage={a.stage} className="mt-2 max-w-xs" />
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={cn("label-caps text-[10px] px-2 py-0.5 rounded border", meta.badge)}>
                      {meta.label}
                    </span>
                    <span className="num text-xs text-muted-foreground">
                      Updated {relative(a.updatedAt)}
                    </span>
                    <Link
                      href={`/applications/${a.id}`}
                      className="rounded border border-border p-1 text-muted-foreground hover:text-foreground hover:border-border-strong transition-colors"
                      title="View Dossier"
                    >
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No applications tracked yet. Click <strong>+ Add Application</strong> above to start your job search pipeline.
          </div>
        )}
      </section>
    </AppShell>
  );
}