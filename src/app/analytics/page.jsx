"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell, PageHeader } from "@/app/Components/jobflow/AppShell";
import { useStore } from "@/lib/store";
import { STAGES, stageIndex } from "@/lib/jobflow";

const axis = { fontSize: 11, fill: "var(--color-muted-foreground)" };
const tooltipStyle = {
  background: "var(--color-popover)",
  border: "1px solid var(--color-border)",
  borderRadius: 10,
  fontSize: 12,
};

const NOW = Date.now();

export default function Analytics() {
  const { apps } = useStore();

  const funnel = useMemo(
    () =>
      STAGES.map((s) => ({
        stage: s,
        count: apps.filter((a) => stageIndex(a.stage) >= stageIndex(s)).length,
      })),
    [apps],
  );

  const bySource = useMemo(() => {
    const map = new Map();
    apps.forEach((a) => {
      const e = map.get(a.source) || { total: 0, advanced: 0 };
      e.total += 1;
      if (stageIndex(a.stage) >= 3) e.advanced += 1;
      map.set(a.source, e);
    });
    return [...map.entries()].map(([source, v]) => ({ source, ...v }));
  }, [apps]);

  const cadence = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const end = NOW - (11 - i) * 7 * 86400000;
        const start = end - 7 * 86400000;
        return {
          week: `W${i + 1}`,
          applications: apps.filter((a) => {
            const t = new Date(a.appliedAt).getTime();
            return t > start && t <= end;
          }).length,
        };
      }),
    [apps],
  );

  const dropoff = funnel.map((f, i) => ({
    from: f.stage,
    rate:
      i === 0 || !funnel[i - 1]?.count
        ? 100
        : Math.round((f.count / (funnel[i - 1]?.count || 1)) * 100),
  }));

  return (
    <AppShell>
      <PageHeader
        eyebrow="Career intelligence"
        title="Analytics"
        description="How your search converts — funnel depth, source quality, and application cadence."
      />

      <section className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-4">
        {dropoff.slice(1, 5).map((d) => (
          <div key={d.from} className="bg-surface px-5 py-6">
            <p className="label-caps">→ {d.from}</p>
            <p className="num mt-3 text-3xl">{d.rate}%</p>
            <p className="mt-1 text-xs text-muted-foreground">pass-through rate</p>
          </div>
        ))}
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="panel p-5 sm:p-6">
          <p className="label-caps">Funnel depth</p>
          <div className="mt-6 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnel} margin={{ left: -24 }}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="stage" tickLine={false} axisLine={false} tick={axis} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={axis} />
                <Tooltip cursor={{ fill: "var(--color-surface-2)" }} contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="var(--color-primary)" radius={[3, 3, 0, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel p-5 sm:p-6">
          <p className="label-caps">Application cadence</p>
          <div className="mt-6 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cadence} margin={{ left: -24 }}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} tick={axis} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={axis} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="var(--color-primary)"
                  strokeWidth={1.5}
                  dot={{ r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="mt-8 panel p-5 sm:p-6">
        <p className="label-caps">Source performance</p>
        <ul className="mt-5 divide-y divide-border">
          {bySource.map((s) => {
            const rate = s.total ? Math.round((s.advanced / s.total) * 100) : 0;
            return (
              <li
                key={s.source}
                className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto] items-center gap-4 py-4"
              >
                <span className="truncate text-sm">{s.source}</span>
                <span className="h-[6px] overflow-hidden rounded-full bg-surface-2">
                  <span
                    className="block h-full rounded-full bg-primary/70 transition-[width] duration-500"
                    style={{ width: `${rate}%` }}
                  />
                </span>
                <span className="num text-xs text-muted-foreground">
                  {rate}% · {s.total}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </AppShell>
  );
}