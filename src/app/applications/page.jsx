"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus, Search, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/app/Components/jobflow/AppShell";
import { JourneyRail } from "@/app/Components/jobflow/Journey";
import { useStore } from "@/lib/store";
import { SOURCES, STAGES, fmtDate, relative, stageIndex } from "@/lib/jobflow";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SORT_KEYS = ["updatedAt", "company", "stage", "appliedAt"];

export default function ApplicationsPage() {
  return (
    <Suspense fallback={null}>
      <Applications />
    </Suspense>
  );
}

function Applications() {
  const { apps, add } = useStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [sort, setSort] = useState(SORT_KEYS[0]);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({
    company: "",
    role: "",
    location: "",
    salary: "",
    source: SOURCES[0],
    stage: "SAVED",
  });

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

  return (
    <AppShell>
      <PageHeader
        eyebrow={`${rows.length} dossiers`}
        title="Applications"
        description="Every opportunity, structured. Filter by stage, search across roles, and open a dossier for the full journey."
        actions={
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-transform duration-150 hover:-translate-y-px"
          >
            <Plus className="size-4" /> New
          </button>
        }
      />

      {/* Filter bar */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-border bg-surface px-3 py-2">
          <Search className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search company, role, location…"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {q && (
            <button onClick={() => setQ("")} aria-label="Clear search">
              <X className="size-3.5 text-muted-foreground" />
            </button>
          )}
        </div>
        <div className="-mx-4 flex gap-1 overflow-x-auto px-4 lg:mx-0 lg:px-0">
          <FilterChip active={!activeStage} onClick={() => setStageFilter(null)}>
            All
          </FilterChip>
          {STAGES.map((s) => (
            <FilterChip key={s} active={activeStage === s} onClick={() => setStageFilter(s)}>
              {s}
            </FilterChip>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="shrink-0 rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none"
          aria-label="Sort applications"
        >
          <option value="updatedAt">Recently updated</option>
          <option value="appliedAt">Recently applied</option>
          <option value="company">Company A–Z</option>
          <option value="stage">Furthest stage</option>
        </select>
      </div>

      {/* Desktop index */}
      <div className="hidden overflow-hidden rounded-lg border border-border bg-surface md:block">
        <div className="grid grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)_140px_120px_100px] gap-4 border-b border-border px-5 py-3">
          {["Opportunity", "Journey", "Source", "Applied", "Updated"].map((h) => (
            <span key={h} className="label-caps">
              {h}
            </span>
          ))}
        </div>
        <ul>
          {rows.map((a, i) => (
            <li key={a.id} className="animate-rise" style={{ animationDelay: `${i * 18}ms` }}>
              <Link
                href={`/applications/${a.id}`}
                className="grid grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)_140px_120px_100px] items-center gap-4 border-b border-border px-5 py-4 transition-colors duration-150 last:border-0 hover:bg-surface-2/70"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{a.company}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {a.role} · {a.location}
                  </p>
                </div>
                <div className="min-w-0">
                  <JourneyRail stage={a.stage} />
                  <p className="label-caps mt-2">{a.stage}</p>
                </div>
                <span className="truncate text-xs text-muted-foreground">{a.source}</span>
                <span className="num text-xs text-muted-foreground">{fmtDate(a.appliedAt)}</span>
                <span className="num text-xs text-muted-foreground">{relative(a.updatedAt)}</span>
              </Link>
            </li>
          ))}
        </ul>
        {!rows.length && (
          <p className="px-5 py-10 text-center text-sm text-muted-foreground">
            No applications match this view.
          </p>
        )}
      </div>

      {/* Mobile dossier cards */}
      <ul className="space-y-3 md:hidden">
        {rows.map((a) => (
          <li key={a.id}>
            <Link
              href={`/applications/${a.id}`}
              className="block rounded-lg border border-border bg-surface p-4"
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{a.company}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.role}</p>
                </div>
                <span className="label-caps shrink-0">{a.stage}</span>
              </div>
              <JourneyRail stage={a.stage} className="mt-3" />
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>{a.source}</span>
                <span className="num">{relative(a.updatedAt)}</span>
              </div>
            </Link>
          </li>
        ))}
        {!rows.length && (
          <li className="py-10 text-center text-sm text-muted-foreground">
            No applications match this view.
          </li>
        )}
      </ul>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">New application</DialogTitle>
          </DialogHeader>
          <form
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const created = await add(draft);
                setOpen(false);
                setDraft({
                  company: "",
                  role: "",
                  location: "",
                  salary: "",
                  source: SOURCES[0],
                  stage: "SAVED",
                });
                toast.success(`${created?.company || draft.company} added to your pipeline`);
              } catch (err) {
                toast.error(err.message || "Failed to add application");
              }
            }}
          >
            <Field label="Company">
              <Input
                required
                value={draft.company}
                onChange={(e) => setDraft({ ...draft, company: e.target.value })}
              />
            </Field>
            <Field label="Role">
              <Input
                required
                value={draft.role}
                onChange={(e) => setDraft({ ...draft, role: e.target.value })}
              />
            </Field>
            <Field label="Location">
              <Input
                value={draft.location}
                onChange={(e) => setDraft({ ...draft, location: e.target.value })}
              />
            </Field>
            <Field label="Salary">
              <Input
                value={draft.salary}
                onChange={(e) => setDraft({ ...draft, salary: e.target.value })}
              />
            </Field>
            <Field label="Source">
              <select
                value={draft.source}
                onChange={(e) => setDraft({ ...draft, source: e.target.value })}
                className="h-10 w-full rounded-md border border-input bg-surface px-3 text-sm outline-none"
              >
                {SOURCES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Stage">
              <select
                value={draft.stage}
                onChange={(e) => setDraft({ ...draft, stage: e.target.value })}
                className="h-10 w-full rounded-md border border-input bg-surface px-3 text-sm outline-none"
              >
                {STAGES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <DialogFooter className="sm:col-span-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                Create dossier
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="label-caps">{label}</Label>
      {children}
    </div>
  );
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "label-caps shrink-0 rounded-md border px-2.5 py-2 transition-colors duration-150",
        active
          ? "border-primary/40 bg-accent text-accent-foreground"
          : "border-border hover:border-border-strong",
      )}
    >
      {children}
    </button>
  );
}