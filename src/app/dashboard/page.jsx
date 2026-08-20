"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowUpRight, CalendarClock, Sparkles, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell, PageHeader } from "@/app/Components/jobflow/AppShell";
import { JourneyRail } from "@/app/Components/jobflow/Journey";
import { useStore } from "@/lib/store";
import { STAGES, fmtShort, relative, stageIndex } from "@/lib/jobflow";

const NOW = Date.now();

export default function Dashboard() {
  const { apps } = useStore();

  const stats = useMemo(() => {
    const total = apps.length;
    const active = apps.filter((a) => !["ACCEPTED"].includes(a.stage)).length;
    const interviews = apps.filter((a) => stageIndex(a.stage) >= 3).length;
    const offers = apps.filter((a) => stageIndex(a.stage) >= 4).length;
    const applied = apps.filter((a) => stageIndex(a.stage) >= 1).length;
    const conversion = applied ? Math.round((interviews / applied) * 100) : 0;
    return { total, active, interviews, offers, conversion };
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

  const upcoming = useMemo(
    () =>
      apps
        .flatMap((a) => a.interviews.map((i) => ({ ...i, app: a })))
        .filter((i) => new Date(i.at).getTime() > NOW)
        .sort((a, b) => +new Date(a.at) - +new Date(b.at))
        .slice(0, 4),
    [apps],
  );

  const followUps = useMemo(
    () =>
      apps
        .filter((a) => stageIndex(a.stage) >= 1 && stageIndex(a.stage) <= 2)
        .sort((a, b) => +new Date(a.updatedAt) - +new Date(b.updatedAt))
        .slice(0, 3),
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

  const activity = useMemo(
    () =>
      apps
        .flatMap((a) => a.timeline.map((t) => ({ ...t, app: a })))
        .sort((a, b) => +new Date(b.at) - +new Date(a.at))
        .slice(0, 7),
    [apps],
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow="Career command center"
        title="Good momentum. Keep the pipeline warm."
        description="A live read of where every opportunity stands, what needs attention today, and where your best signal is coming from."
        actions={
          <Link
            href="/applications"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-transform duration-150 hover:-translate-y-px"
          >
            New application
            <ArrowUpRight className="size-4" />
          </Link>
        }
      />

      {/* Integrated statistics strip */}
      <section className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-4">
        {[
          { label: "Tracked", value: stats.total, meta: "opportunities" },
          { label: "In motion", value: stats.active, meta: "active pursuits" },
          { label: "Interviewing", value: stats.interviews, meta: "late stage" },
          { label: "Conversion", value: `${stats.conversion}%`, meta: "applied → interview" },
        ].map((s) => (
          <div key={s.label} className="bg-surface px-5 py-6">
            <p className="label-caps">{s.label}</p>
            <p className="num mt-3 text-3xl">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.meta}</p>
          </div>
        ))}
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_1fr]">
        {/* Momentum */}
        <section className="panel noise p-5 sm:p-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
            <div className="min-w-0">
              <p className="label-caps">Application momentum</p>
              <h2 className="mt-1.5 text-lg font-semibold">Last eight weeks</h2>
            </div>
            <span className="num shrink-0 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground">
              {momentum.reduce((n, m) => n + m.count, 0)} total
            </span>
          </div>
          <div className="mt-6 h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={momentum} margin={{ left: -24, right: 4, top: 4 }}>
                <defs>
                  <linearGradient id="mom" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.22} />
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
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="var(--color-primary)"
                  strokeWidth={1.5}
                  fill="url(#mom)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pipeline distribution */}
          <div className="mt-8 border-t border-border pt-6">
            <p className="label-caps">Pipeline distribution</p>
            <ul className="mt-4 space-y-3">
              {distribution.map((d) => (
                <li
                  key={d.stage}
                  className="grid grid-cols-[92px_minmax(0,1fr)_32px] items-center gap-3"
                >
                  <span className="label-caps">{d.stage}</span>
                  <span className="h-[6px] w-full overflow-hidden rounded-full bg-surface-2">
                    <span
                      className="block h-full rounded-full bg-primary/70 transition-[width] duration-500"
                      style={{ width: `${(d.count / maxStage) * 100}%` }}
                    />
                  </span>
                  <span className="num text-right text-xs">{d.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="space-y-8">
          {/* Career signals */}
          <section className="panel p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" strokeWidth={1.75} />
              <p className="label-caps">Career signals</p>
            </div>
            <ul className="mt-5 divide-y divide-border">
              <li className="pb-4">
                <p className="text-sm font-medium">Interview conversion</p>
                <p className="num mt-1 text-2xl">{stats.conversion}%</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stats.interviews} of your applied roles reached an interview stage.
                </p>
              </li>
              {topSource && (
                <li className="py-4">
                  <p className="text-sm font-medium">Strongest source</p>
                  <p className="mt-1 text-lg">{topSource.source}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {Math.round(topSource.rate * 100)}% advance rate across {topSource.total}{" "}
                    applications.
                  </p>
                </li>
              )}
              <li className="pt-4">
                <p className="text-sm font-medium">Follow-up opportunities</p>
                <ul className="mt-2 space-y-2">
                  {followUps.map((a) => (
                    <li key={a.id}>
                      <Link
                        href={`/applications/${a.id}`}
                        className="group flex items-center gap-3 text-sm"
                      >
                        <span className="min-w-0 flex-1 truncate group-hover:text-primary">
                          {a.company}
                        </span>
                        <span className="num text-xs text-muted-foreground">
                          {relative(a.updatedAt)}
                        </span>
                      </Link>
                    </li>
                  ))}
                  {!followUps.length && (
                    <li className="text-xs text-muted-foreground">Nothing waiting on you.</li>
                  )}
                </ul>
              </li>
            </ul>
          </section>

          {/* Upcoming interviews */}
          <section className="panel p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <CalendarClock className="size-4 text-primary" strokeWidth={1.75} />
              <p className="label-caps">Upcoming interviews</p>
            </div>
            <ul className="mt-5 space-y-4">
              {upcoming.map((i) => (
                <li key={i.id}>
                  <Link
                    href={`/applications/${i.app.id}`}
                    className="group grid grid-cols-[auto_minmax(0,1fr)] gap-3"
                  >
                    <span className="num rounded-md border border-border px-2 py-1 text-xs">
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
              {!upcoming.length && (
                <li className="text-xs text-muted-foreground">No interviews scheduled yet.</li>
              )}
            </ul>
          </section>
        </div>
      </div>

      {/* Activity */}
      <section className="mt-8 panel p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 text-primary" strokeWidth={1.75} />
          <p className="label-caps">Recent activity</p>
        </div>
        <ul className="mt-5 divide-y divide-border">
          {activity.map((t) => (
            <li key={t.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3">
              <div className="min-w-0">
                <Link href={`/applications/${t.app.id}`} className="truncate text-sm hover:text-primary">
                  <span className="font-medium">{t.app.company}</span>
                  <span className="text-muted-foreground"> — {t.label}</span>
                </Link>
                <JourneyRail stage={t.app.stage} className="mt-2" />
              </div>
              <span className="num shrink-0 text-xs text-muted-foreground">{relative(t.at)}</span>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}