"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppShell, PageHeader } from "@/app/Components/jobflow/AppShell";
import { useStore } from "@/lib/store";
import { fmtDate } from "@/lib/jobflow";
import { cn } from "@/lib/utils";

const NOW = Date.now();

export default function CalendarPage() {
  const { apps } = useStore();
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const events = useMemo(
    () => [
      ...apps.flatMap((a) =>
        a.interviews.map((i) => ({ id: i.id, at: i.at, label: i.kind, app: a, kind: "interview" })),
      ),
      ...apps.flatMap((a) =>
        a.reminders.map((r) => ({ id: r.id, at: r.at, label: r.label, app: a, kind: "reminder" })),
      ),
    ],
    [apps],
  );

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: startOffset + days }, (_, i) =>
    i < startOffset ? null : i - startOffset + 1,
  );

  const eventsFor = (d) =>
    events.filter((e) => {
      const t = new Date(e.at);
      return t.getFullYear() === year && t.getMonth() === month && t.getDate() === d;
    });

  const upcoming = useMemo(
    () =>
      [...events]
        .sort((a, b) => +new Date(a.at) - +new Date(b.at))
        .filter((e) => +new Date(e.at) > NOW),
    [events],
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow="Schedule"
        title={cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
        description="Interviews and reminders across every open opportunity."
        actions={
          <div className="flex items-center gap-1">
            <button
              aria-label="Previous month"
              onClick={() => setCursor(new Date(year, month - 1, 1))}
              className="rounded-md border border-border p-2 transition-colors hover:border-border-strong"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              aria-label="Next month"
              onClick={() => setCursor(new Date(year, month + 1, 1))}
              className="rounded-md border border-border p-2 transition-colors hover:border-border-strong"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        }
      />

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <section className="overflow-hidden rounded-lg border border-border bg-surface">
          <div className="grid grid-cols-7 border-b border-border">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <span key={d} className="label-caps px-2 py-2 text-center">
                {d.slice(0, 2)}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((d, i) => {
              const dayEvents = d ? eventsFor(d) : [];
              const isToday =
                d && new Date().toDateString() === new Date(year, month, d).toDateString();
              return (
                <div
                  key={i}
                  className={cn(
                    "min-h-[76px] border-b border-r border-border p-1.5 sm:min-h-[104px] sm:p-2",
                    !d && "bg-surface-2/40",
                  )}
                >
                  {d && (
                    <>
                      <span
                        className={cn(
                          "num text-[11px]",
                          isToday
                            ? "rounded bg-primary px-1.5 py-0.5 text-primary-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {String(d).padStart(2, "0")}
                      </span>
                      <ul className="mt-1 space-y-1">
                        {dayEvents.slice(0, 2).map((e) => (
                          <li key={e.id}>
                            <Link
                              href={`/applications/${e.app.id}`}
                              className={cn(
                                "block truncate rounded px-1 py-0.5 text-[10px] leading-tight",
                                e.kind === "interview"
                                  ? "bg-accent text-accent-foreground"
                                  : "bg-surface-2 text-muted-foreground",
                              )}
                            >
                              {e.app.company}
                            </Link>
                          </li>
                        ))}
                        {dayEvents.length > 2 && (
                          <li className="num text-[10px] text-muted-foreground">
                            +{dayEvents.length - 2}
                          </li>
                        )}
                      </ul>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="panel p-5 sm:p-6">
          <p className="label-caps">Upcoming</p>
          <ul className="mt-5 divide-y divide-border">
            {upcoming.map((e) => (
              <li key={e.id} className="py-3">
                <Link href={`/applications/${e.app.id}`} className="group block">
                  <p className="text-sm font-medium group-hover:text-primary">{e.app.company}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{e.label}</p>
                  <p className="num mt-1 text-xs text-muted-foreground">{fmtDate(e.at)}</p>
                </Link>
              </li>
            ))}
            {!upcoming.length && (
              <li className="py-3 text-xs text-muted-foreground">Nothing on the horizon.</li>
            )}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}