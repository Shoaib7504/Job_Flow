"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/app/Components/jobflow/AppShell";
import { useStore } from "@/lib/store";
import { STAGES, relative } from "@/lib/jobflow";
import { cn } from "@/lib/utils";

export default function Pipeline() {
  const { apps, setStage } = useStore();
  const [dragging, setDragging] = useState(null);
  const [over, setOver] = useState(null);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Opportunity map"
        title="Pipeline"
        description="Every opportunity plotted along the journey. Drag a dossier forward to record progress."
      />

      <div className="-mx-4 overflow-x-auto px-4 pb-4 sm:-mx-8 sm:px-8">
        <div className="flex min-w-[900px] gap-4">
          {STAGES.map((stage, si) => {
            const items = apps.filter((a) => a.stage === stage);
            return (
              <section
                key={stage}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOver(stage);
                }}
                onDragLeave={() => setOver((s) => (s === stage ? null : s))}
                onDrop={async () => {
                  if (dragging) {
                    const currentId = dragging;
                    try {
                      await setStage(currentId, stage);
                      toast.success(`Moved to ${stage}`);
                    } catch (err) {
                      toast.error(err.message || `Failed to move to ${stage}`);
                    }
                  }
                  setDragging(null);
                  setOver(null);
                }}
                className={cn(
                  "flex w-[260px] shrink-0 flex-col rounded-lg border bg-surface/60 transition-colors duration-200",
                  over === stage ? "border-primary/50 bg-accent/40" : "border-border",
                )}
              >
                <header className="flex items-center gap-2 border-b border-border px-4 py-3">
                  <span
                    className="size-1.5 rounded-full"
                    style={{
                      background: `color-mix(in oklab, var(--color-primary) ${20 + si * 16}%, transparent)`,
                    }}
                  />
                  <span className="label-caps">{stage}</span>
                  <span className="num ml-auto text-xs text-muted-foreground">{items.length}</span>
                </header>
                <ul className="flex flex-col gap-2 p-3">
                  {items.map((a) => (
                    <li key={a.id}>
                      <Link
                        href={`/applications/${a.id}`}
                        draggable
                        onDragStart={() => setDragging(a.id)}
                        onDragEnd={() => setDragging(null)}
                        className={cn(
                          "block rounded-md border border-border bg-surface p-3 transition-all duration-150 hover:-translate-y-px hover:border-border-strong",
                          dragging === a.id && "opacity-50",
                        )}
                      >
                        <p className="truncate text-sm font-medium">{a.company}</p>
                        <p className="truncate text-xs text-muted-foreground">{a.role}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="label-caps text-[10px]">{a.source}</span>
                          <span className="num text-[11px] text-muted-foreground">
                            {relative(a.updatedAt)}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                  {!items.length && (
                    <li className="rounded-md border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
                      Empty
                    </li>
                  )}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
      <p className="mt-2 text-xs text-muted-foreground sm:hidden">
        Scroll horizontally to see all stages.
      </p>
    </AppShell>
  );
}