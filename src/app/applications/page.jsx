"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PlusCircle, Search, SlidersHorizontal, X } from "lucide-react";
import { AppShell, PageHeader, useAppShell } from "@/app/Components/jobflow/AppShell";
import { JourneyRail } from "@/app/Components/jobflow/Journey";
import { TableSkeleton } from "@/app/Components/jobflow/Skeletons";
import { useStore } from "@/lib/store";
import { ALL_STAGES, STAGES, STAGE_META, fmtDate, relative, stageIndex } from "@/lib/jobflow";
import { cn } from "@/lib/utils";

const SORT_KEYS = [
  { key: "updatedAt", label: "Recently updated" },
  { key: "appliedAt", label: "Recently applied" },
  { key: "company", label: "Company A–Z" },
  { key: "stage", label: "Furthest stage" },
];

export default function ApplicationsPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <Applications />
    </Suspense>
  );
}

function Applications() {
  const { apps, isFetching, loadSampleWorkspace } = useStore();
  const { openAddModal } = useAppShell();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [sort, setSort] = useState("updatedAt");

  const activeStage = searchParams.get("stage");

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return apps
      .filter((a) => (activeStage ? a.stage === activeStage : true))
      .filter((a) =>
        term
          ? `${a.company} ${a.role} ${a.location} ${a.source}`.toLowerCase().includes(term)
          : true,
      )
      .sort((a, b) => {
        if (sort === "company") return a.company.localeCompare(b.company);
        if (sort === "stage") return stageIndex(b.stage) - stageIndex(a.stage);
        if (sort === "appliedAt") return +new Date(b.appliedAt) - +new Date(a.appliedAt);
        return +new Date(b.updatedAt) - +new Date(a.updatedAt);
      });
  }, [apps, q, sort, activeStage]);

  const setStageFilter = (s) => {
    const params = new URLSearchParams(searchParams.toString());
    if (s) params.set("stage", s);
    else params.delete("stage");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const clearAllFilters = () => {
    setQ("");
    router.replace(pathname, { scroll: false });
  };

  const hasActiveFilters = Boolean(q || activeStage);

  if (!apps.length && isFetching) {
    return (
      <AppShell>
        <TableSkeleton />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow={`${apps.length} Total Dossiers · ${rows.length} Visible`}
        title="Applications"
        description="Every opportunity, structured. Filter by stage, search across roles, and open a dossier for the full journey."
        actions={
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-transform duration-150 hover:-translate-y-px active:translate-y-0"
          >
            <PlusCircle className="size-4" /> + Add Application
          </button>
        }
      />

      {/* Filter and Search Toolbar */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Search Box */}
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-border bg-surface px-3.5 py-2 transition-colors focus-within:border-primary/40">
            <Search className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search company, position title, location, or source..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {q && (
              <button onClick={() => setQ("")} aria-label="Clear search">
                <X className="size-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="size-4 text-muted-foreground" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Sort applications"
            >
              {SORT_KEYS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stage Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <FilterChip active={!activeStage} onClick={() => setStageFilter(null)}>
            All ({apps.length})
          </FilterChip>
          {ALL_STAGES.map((s) => {
            const count = apps.filter((a) => a.stage === s).length;
            if (count === 0 && activeStage !== s) return null; // hide zero-count stages unless selected
            return (
              <FilterChip key={s} active={activeStage === s} onClick={() => setStageFilter(s)}>
                {s} ({count})
              </FilterChip>
            );
          })}

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="ml-auto text-xs text-muted-foreground hover:text-primary underline flex items-center gap-1"
            >
              <X className="size-3" /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Desktop Application Table */}
      <div className="hidden overflow-hidden rounded-lg border border-border bg-surface md:block shadow-sm">
        <div className="grid grid-cols-[minmax(0,2.2fr)_minmax(0,1.2fr)_130px_120px_100px] gap-4 border-b border-border px-5 py-3 bg-surface-2/50">
          {["Opportunity", "Journey", "Source", "Applied", "Updated"].map((h) => (
            <span key={h} className="label-caps text-[11px]">
              {h}
            </span>
          ))}
        </div>
        <ul>
          {rows.map((a, i) => {
            const meta = STAGE_META[a.stage] || STAGE_META.SAVED;
            return (
              <li key={a.id} className="animate-rise" style={{ animationDelay: `${i * 15}ms` }}>
                <Link
                  href={`/applications/${a.id}`}
                  className="grid grid-cols-[minmax(0,2.2fr)_minmax(0,1.2fr)_130px_120px_100px] items-center gap-4 border-b border-border px-5 py-4 transition-colors duration-150 last:border-0 hover:bg-surface-2/70"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
                      {a.company}
                    </p>
                    <p className="truncate text-xs text-muted-foreground mt-0.5">
                      {a.role} {a.location ? `· ${a.location}` : ""}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <JourneyRail stage={a.stage} />
                    <span className={cn("inline-block label-caps text-[10px] px-2 py-0.5 rounded border mt-1.5", meta.badge)}>
                      {meta.label}
                    </span>
                  </div>
                  <span className="truncate text-xs text-muted-foreground">{a.source || "Direct"}</span>
                  <span className="num text-xs text-muted-foreground">{fmtDate(a.appliedAt)}</span>
                  <span className="num text-xs text-muted-foreground">{relative(a.updatedAt)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Mobile Application Dossier Cards */}
      <ul className="space-y-3 md:hidden">
        {rows.map((a) => {
          const meta = STAGE_META[a.stage] || STAGE_META.SAVED;
          return (
            <li key={a.id}>
              <Link
                href={`/applications/${a.id}`}
                className="block rounded-lg border border-border bg-surface p-4 transition-all hover:border-border-strong active:scale-[0.99]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-foreground">{a.company}</p>
                    <p className="truncate text-xs text-muted-foreground mt-0.5">{a.role}</p>
                  </div>
                  <span className={cn("label-caps text-[10px] shrink-0 px-2 py-0.5 rounded border", meta.badge)}>
                    {meta.label}
                  </span>
                </div>
                <JourneyRail stage={a.stage} className="mt-3" />
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground border-t border-border/60 pt-2.5">
                  <span>{a.source}</span>
                  <span className="num">Updated {relative(a.updatedAt)}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Editorial Empty States */}
      {!rows.length && (
        <div className="rounded-lg border border-dashed border-border bg-surface p-12 text-center my-6 space-y-4">
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="font-display text-lg font-semibold">
              {apps.length === 0 ? "No applications yet" : "No matching dossiers"}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {apps.length === 0
                ? "Start tracking your job search and keep every opportunity organized with dates, interview notes, and follow-up reminders."
                : "No applications match your current search query or active stage filter. Try adjusting your terms or resetting filters."}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {apps.length === 0 ? (
              <>
                <button
                  onClick={openAddModal}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm cursor-pointer"
                >
                  <PlusCircle className="size-4" />
                  + Add Your First Application
                </button>
                <button
                  onClick={loadSampleWorkspace}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-surface-2 px-4 py-2.5 text-sm font-medium text-foreground hover:border-border-strong transition-colors cursor-pointer"
                >
                  Load Sample Workspace
                </button>
              </>
            ) : (
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-2 cursor-pointer"
              >
                <X className="size-4" />
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "label-caps shrink-0 rounded-md border px-2.5 py-1.5 text-[11px] transition-colors duration-150 cursor-pointer",
        active
          ? "border-primary/40 bg-accent text-accent-foreground font-semibold"
          : "border-border hover:border-border-strong text-muted-foreground hover:text-foreground bg-surface",
      )}
    >
      {children}
    </button>
  );
}