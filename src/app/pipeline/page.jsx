"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronRight, PlusCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader, useAppShell } from "@/app/Components/jobflow/AppShell";
import { useStore } from "@/lib/store";
import { STAGES, STAGE_META, isNegativeStage, relative, stageIndex } from "@/lib/jobflow";
import { cn } from "@/lib/utils";

export default function Pipeline() {
  const { apps, setStage } = useStore();
  const { openAddModal } = useAppShell();
  const [dragging, setDragging] = useState(null);
  const [over, setOver] = useState(null);
  const [showArchived, setShowArchived] = useState(false);

  const rejectedApps = apps.filter((a) => a.stage === "REJECTED");
  const withdrawnApps = apps.filter((a) => a.stage === "WITHDRAWN");
  const archivedCount = rejectedApps.length + withdrawnApps.length;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Opportunity Map"
        title="Pipeline Stage Kanban"
        description="Every active opportunity plotted along the journey. Drag a dossier forward to record progress, or use one-click advance."
        actions={
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-transform hover:-translate-y-px active:translate-y-0"
          >
            <PlusCircle className="size-4" /> + Add Application
          </button>
        }
      />

      {/* Main 5-Stage Kanban Columns */}
      <div className="-mx-4 overflow-x-auto px-4 pb-4 sm:-mx-8 sm:px-8">
        <div className="flex min-w-[1000px] gap-4">
          {STAGES.map((stage, si) => {
            const items = apps.filter((a) => a.stage === stage);
            const nextStage = STAGES[si + 1];

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
                  "flex w-[270px] shrink-0 flex-col rounded-lg border bg-surface/80 shadow-sm transition-colors duration-200",
                  over === stage ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border",
                )}
              >
                <header className="flex items-center justify-between border-b border-border px-4 py-3 bg-surface-2/40 rounded-t-lg">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2 rounded-full"
                      style={{
                        background: `color-mix(in oklab, var(--color-primary) ${30 + si * 16}%, transparent)`,
                      }}
                    />
                    <span className="label-caps font-semibold text-xs text-foreground">{stage}</span>
                  </div>
                  <span className="num text-xs font-medium rounded-full bg-surface border border-border px-2 py-0.5 text-muted-foreground">
                    {items.length}
                  </span>
                </header>

                <ul className="flex flex-col gap-2.5 p-3 min-h-[360px]">
                  {items.map((a) => (
                    <li key={a.id}>
                      <div
                        draggable
                        onDragStart={() => setDragging(a.id)}
                        onDragEnd={() => setDragging(null)}
                        className={cn(
                          "group block rounded-md border border-border bg-surface p-3.5 shadow-2xs transition-all duration-150 hover:-translate-y-px hover:border-border-strong hover:shadow-sm cursor-grab active:cursor-grabbing",
                          dragging === a.id && "opacity-40 scale-[0.98]",
                        )}
                      >
                        <Link href={`/applications/${a.id}`} className="block">
                          <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                            {a.company}
                          </p>
                          <p className="truncate text-xs text-muted-foreground mt-0.5">{a.role}</p>
                        </Link>

                        <div className="mt-3 flex items-center justify-between pt-2 border-t border-border/50">
                          <span className="label-caps text-[10px] text-muted-foreground truncate max-w-[110px]">
                            {a.source || "Direct"}
                          </span>
                          <span className="num text-[11px] text-muted-foreground">
                            {relative(a.updatedAt)}
                          </span>
                        </div>

                        {/* One-click Advance Stage Action */}
                        {nextStage && (
                          <div className="mt-2 flex justify-end">
                            <button
                              type="button"
                              onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                  await setStage(a.id, nextStage);
                                  toast.success(`Advanced ${a.company} to ${nextStage}`);
                                } catch (err) {
                                  toast.error(err.message || `Failed to advance stage`);
                                }
                              }}
                              title={`Advance to ${nextStage}`}
                              className="inline-flex items-center gap-1 rounded bg-surface-2 px-2 py-1 text-[10px] font-medium text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                              <span>Next: {nextStage}</span>
                              <ArrowRight className="size-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}

                  {!items.length && (
                    <li className="flex flex-1 items-center justify-center rounded-md border border-dashed border-border px-3 py-10 text-center text-xs text-muted-foreground bg-surface-2/20">
                      No applications in {stage} stage.
                    </li>
                  )}
                </ul>
              </section>
            );
          })}
        </div>
      </div>

      <p className="mt-2 text-xs text-muted-foreground md:hidden">
        Swipe horizontally to view all pipeline stages.
      </p>

      {/* Negative / Archived States Section */}
      {archivedCount > 0 && (
        <section className="mt-8 border-t border-border pt-6">
          <button
            onClick={() => setShowArchived((v) => !v)}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {showArchived ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
            <span>Completed & Closed Applications ({archivedCount})</span>
            <span className="text-xs text-muted-foreground font-normal">
              (Rejected: {rejectedApps.length}, Withdrawn: {withdrawnApps.length})
            </span>
          </button>

          {showArchived && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...rejectedApps, ...withdrawnApps].map((a) => {
                const meta = STAGE_META[a.stage] || STAGE_META.REJECTED;
                return (
                  <Link
                    key={a.id}
                    href={`/applications/${a.id}`}
                    className="block rounded-lg border border-border bg-surface p-4 opacity-75 hover:opacity-100 transition-opacity"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-sm">{a.company}</p>
                        <p className="text-xs text-muted-foreground">{a.role}</p>
                      </div>
                      <span className={cn("label-caps text-[10px] px-2 py-0.5 rounded border", meta.badge)}>
                        {meta.label}
                      </span>
                    </div>
                    <p className="num text-xs text-muted-foreground mt-3">
                      Closed {relative(a.updatedAt)}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      )}
    </AppShell>
  );
}