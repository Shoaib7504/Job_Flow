"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  Trash2,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/app/Components/jobflow/AppShell";
import { Journey } from "@/app/Components/jobflow/Journey";
import { DossierSkeleton } from "@/app/Components/jobflow/Skeletons";
import { useStore } from "@/lib/store";
import {
  ALL_STAGES,
  STAGES,
  STAGE_META,
  fmtDate,
  getNextAction,
  relative,
  stageIndex,
} from "@/lib/jobflow";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function DetailPage() {
  return (
    <Suspense fallback={<DossierSkeleton />}>
      <Detail />
    </Suspense>
  );
}

function Detail() {
  const { id } = useParams();
  const navigate = useRouter();
  const { apps, isFetching, setStage, addNote, addInterview, addReminder, toggleReminder, remove } =
    useStore();

  const app = apps.find((a) => a.id === id);
  const [notes, setNotes] = useState(null);
  const [savingNotes, setSavingNotes] = useState(false);
  const [interview, setInterview] = useState({ kind: "", withWhom: "", at: "" });
  const [reminder, setReminder] = useState({ label: "", at: "" });
  const [confirmDelete, setConfirmDelete] = useState(false);

  const nextAction = useMemo(() => getNextAction(app), [app]);

  if (!app && isFetching) {
    return (
      <AppShell>
        <DossierSkeleton />
      </AppShell>
    );
  }

  if (!app) {
    return (
      <AppShell>
        <div className="rounded-lg border border-border bg-surface p-12 text-center my-8 space-y-4">
          <h2 className="font-display text-xl font-semibold">Dossier Not Found</h2>
          <p className="text-sm text-muted-foreground">
            This application record does not exist or may have been removed.
          </p>
          <Link
            href="/applications"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            <ArrowLeft className="size-4" /> Back to Applications
          </Link>
        </div>
      </AppShell>
    );
  }

  const idx = stageIndex(app.stage);
  const nextStage = STAGES[idx + 1];
  const meta = STAGE_META[app.stage] || STAGE_META.SAVED;

  return (
    <AppShell>
      <Link
        href="/applications"
        className="label-caps mb-6 inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-3.5" /> Back to Applications
      </Link>

      {/* Header & Meta Dossier Overview */}
      <header className="grid grid-cols-[minmax(0,1fr)] gap-6 border-b border-border pb-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn("label-caps text-xs px-2.5 py-0.5 rounded border", meta.badge)}>
              {meta.label}
            </span>
            <span className="text-xs text-muted-foreground">
              {app.source || "Direct"} {app.location ? `· ${app.location}` : ""}
            </span>
          </div>

          <h1 className="text-3xl font-semibold sm:text-4xl tracking-tight text-foreground font-display">
            {app.company}
          </h1>
          <p className="text-lg text-muted-foreground">{app.role}</p>

          <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3 pt-2 border-t border-border/50">
            {[
              ["Salary", app.salary || "Not specified"],
              ["Applied", fmtDate(app.appliedAt)],
              ["Updated", relative(app.updatedAt)],
              ["Priority", app.priority || "MEDIUM"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="label-caps text-[11px]">{k}</dt>
                <dd className="num mt-0.5 text-sm font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {app.link && (
            <a
              href={app.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3.5 py-2 text-sm font-medium transition-colors hover:border-border-strong"
            >
              Job Posting <ExternalLink className="size-3.5" />
            </a>
          )}

          {nextStage && (
            <button
              type="button"
              onClick={async () => {
                try {
                  await setStage(app.id, nextStage);
                  toast.success(`Advanced stage to ${nextStage}`);
                } catch (err) {
                  toast.error(err.message || `Failed to advance to ${nextStage}`);
                }
              }}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-transform duration-150 hover:-translate-y-px active:translate-y-0"
            >
              Advance to {nextStage}
            </button>
          )}

          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              title="Delete Dossier"
              aria-label="Delete application dossier"
              className="rounded-md border border-border p-2 text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1.5 rounded-md border border-destructive/40 bg-destructive/5 p-1">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await remove(app.id);
                    toast.success(`${app.company} dossier removed`);
                    navigate.push("/applications");
                  } catch (err) {
                    toast.error(err.message || "Failed to remove dossier");
                  }
                }}
                className="rounded bg-destructive px-2 py-1 text-xs font-medium text-destructive-foreground"
              >
                Confirm Delete
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-surface-2"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ⚡ NEXT ACTION Banner */}
      {nextAction && (
        <section className="mt-6 rounded-lg border border-primary/25 bg-primary/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-primary/10 text-primary shrink-0 mt-0.5">
              <Zap className="size-4 fill-primary" />
            </div>
            <div>
              <p className="label-caps text-[11px] text-primary">⚡ Recommended Next Action</p>
              <p className="text-sm font-semibold text-foreground mt-0.5">{nextAction.title}</p>
              <p className="text-xs text-muted-foreground">{nextAction.subtitle}</p>
            </div>
          </div>

          {app.stage === "APPLIED" && (
            <button
              onClick={async () => {
                try {
                  await addReminder(app.id, {
                    label: `Followed up with ${app.company}`,
                    at: new Date().toISOString(),
                  });
                  toast.success("Follow-up reminder recorded");
                } catch (err) {
                  toast.error(err.message || "Failed to add follow-up");
                }
              }}
              className="shrink-0 rounded-md border border-primary/30 bg-surface px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
            >
              Record Follow-up
            </button>
          )}
        </section>
      )}

      {/* Stage Journey & Interactive Node Picker */}
      <section className="mt-8 panel noise p-5 sm:p-8">
        <div className="flex items-center justify-between">
          <p className="label-caps">Application Journey Stage</p>
          <div className="flex items-center gap-2">
            <label htmlFor="stageSelect" className="text-xs text-muted-foreground">Status:</label>
            <select
              id="stageSelect"
              value={app.stage}
              onChange={async (e) => {
                const s = e.target.value;
                try {
                  await setStage(app.id, s);
                  toast.success(`Stage changed to ${s}`);
                } catch (err) {
                  toast.error(err.message || `Failed to change stage to ${s}`);
                }
              }}
              className="h-8 rounded border border-border bg-surface px-2 text-xs font-medium outline-none"
            >
              {ALL_STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <Journey
            stage={app.stage}
            onSelect={async (s) => {
              try {
                await setStage(app.id, s);
                toast.success(`Stage set to ${s}`);
              } catch (err) {
                toast.error(err.message || `Failed to update stage to ${s}`);
              }
            }}
          />
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Click any stage node to update status immediately. All transitions are logged below in the timeline.
        </p>
      </section>

      {/* Main Dossier Content: Timeline, Notes, Interviews, Reminders */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-8">
          {/* Narrative Event Timeline */}
          <section className="panel p-5 sm:p-6">
            <p className="label-caps">Narrative Event Timeline</p>
            <div className="relative mt-5 pl-5">
              <span aria-hidden className="absolute left-[3px] top-1.5 h-[calc(100%-12px)] w-px bg-border" />
              <ol className="space-y-4">
                {app.timeline.map((t) => (
                  <li key={t.id} className="relative pb-1">
                    <span
                      className={cn(
                        "absolute -left-5 top-1.5 size-[7px] rounded-full",
                        t.type === "stage" || t.label.includes("Moved to")
                          ? "bg-primary ring-4 ring-primary/10"
                          : "bg-border-strong",
                      )}
                    />
                    <p className="text-sm font-medium text-foreground">{t.label}</p>
                    <p className="num mt-0.5 text-xs text-muted-foreground">
                      {fmtDate(t.at)} · {relative(t.at)}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Inline Dossier Notes */}
          <section className="panel p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="label-caps">Dossier Notes & Prep</p>
              {notes !== null && (
                <span className="text-xs text-amber-500 font-medium">Unsaved changes</span>
              )}
            </div>
            <Textarea
              value={notes ?? app.notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              placeholder="Record recruiter contacts, interview prep notes, salary negotiations, or research..."
              className="mt-4 resize-none bg-surface font-sans text-sm"
            />
            <div className="mt-3 flex items-center justify-end">
              <button
                type="button"
                disabled={savingNotes}
                onClick={async () => {
                  setSavingNotes(true);
                  try {
                    await addNote(app.id, notes ?? app.notes);
                    setNotes(null);
                    toast.success("Notes saved successfully");
                  } catch (err) {
                    toast.error(err.message || "Failed to save notes");
                  } finally {
                    setSavingNotes(false);
                  }
                }}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-transform active:translate-y-0 disabled:opacity-60"
              >
                {savingNotes ? "Saving..." : "Save Notes"}
              </button>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          {/* Scheduled Interviews */}
          <section className="panel p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="label-caps">Scheduled Interviews</p>
              <span className="num text-xs text-muted-foreground">{app.interviews.length}</span>
            </div>

            <ul className="mt-4 divide-y divide-border">
              {app.interviews.map((i) => (
                <li key={i.id} className="py-3">
                  <p className="text-sm font-semibold text-foreground">{i.kind}</p>
                  <p className="num mt-1 text-xs text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="size-3" />
                    {fmtDate(i.at)} · {i.withWhom || "TBD"}
                  </p>
                </li>
              ))}
              {!app.interviews.length && (
                <li className="py-3 text-xs text-muted-foreground">No interviews scheduled yet.</li>
              )}
            </ul>

            {/* Schedule New Interview Form */}
            <form
              className="mt-4 space-y-3 border-t border-border pt-4"
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await addInterview(app.id, {
                    kind: interview.kind,
                    withWhom: interview.withWhom || "TBD",
                    at: new Date(interview.at).toISOString(),
                  });
                  setInterview({ kind: "", withWhom: "", at: "" });
                  toast.success("Interview scheduled");
                } catch (err) {
                  toast.error(err.message || "Failed to schedule interview");
                }
              }}
            >
              <div className="space-y-1">
                <Label className="label-caps text-[10px]">Interview Type</Label>
                <Input
                  required
                  value={interview.kind}
                  onChange={(e) => setInterview({ ...interview, kind: e.target.value })}
                  placeholder="e.g. Recruiter Screen, Technical Loop"
                  className="h-9 bg-surface text-sm"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="label-caps text-[10px]">With</Label>
                  <Input
                    value={interview.withWhom}
                    onChange={(e) => setInterview({ ...interview, withWhom: e.target.value })}
                    placeholder="e.g. Hiring Manager"
                    className="h-9 bg-surface text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="label-caps text-[10px]">Date</Label>
                  <Input
                    required
                    type="date"
                    value={interview.at}
                    onChange={(e) => setInterview({ ...interview, at: e.target.value })}
                    className="h-9 bg-surface text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-xs font-medium hover:border-border-strong hover:bg-surface-2 transition-colors"
              >
                + Schedule Interview
              </button>
            </form>
          </section>

          {/* Action Reminders */}
          <section className="panel p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="label-caps">Action Reminders</p>
              <span className="num text-xs text-muted-foreground">{app.reminders.length}</span>
            </div>

            <ul className="mt-4 space-y-3">
              {app.reminders.map((r) => (
                <li key={r.id} className="flex items-start gap-3 p-1.5 rounded hover:bg-surface-2/40">
                  <input
                    type="checkbox"
                    checked={r.done}
                    onChange={async () => {
                      try {
                        await toggleReminder(app.id, r.id);
                        toast.success(r.done ? "Reminder reopened" : "Reminder completed");
                      } catch (err) {
                        toast.error(err.message || "Failed to update reminder");
                      }
                    }}
                    className="mt-1 size-4 accent-primary cursor-pointer"
                  />
                  <span className="min-w-0 flex-1">
                    <span className={cn("block text-sm font-medium", r.done && "text-muted-foreground line-through")}>
                      {r.label}
                    </span>
                    <span className="num block text-xs text-muted-foreground">Due {fmtDate(r.at)}</span>
                  </span>
                </li>
              ))}
              {!app.reminders.length && (
                <li className="text-xs text-muted-foreground">No reminders set.</li>
              )}
            </ul>

            {/* Add Reminder Form */}
            <form
              className="mt-4 space-y-3 border-t border-border pt-4"
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await addReminder(app.id, {
                    label: reminder.label,
                    at: new Date(reminder.at).toISOString(),
                  });
                  setReminder({ label: "", at: "" });
                  toast.success("Reminder created");
                } catch (err) {
                  toast.error(err.message || "Failed to create reminder");
                }
              }}
            >
              <div className="space-y-1">
                <Label className="label-caps text-[10px]">Reminder Task</Label>
                <Input
                  required
                  value={reminder.label}
                  onChange={(e) => setReminder({ ...reminder, label: e.target.value })}
                  placeholder="e.g. Follow up on tech assessment"
                  className="h-9 bg-surface text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label className="label-caps text-[10px]">Due Date</Label>
                <Input
                  required
                  type="date"
                  value={reminder.at}
                  onChange={(e) => setReminder({ ...reminder, at: e.target.value })}
                  className="h-9 bg-surface text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-xs font-medium hover:border-border-strong hover:bg-surface-2 transition-colors"
              >
                + Add Reminder
              </button>
            </form>
          </section>
        </div>
      </div>
    </AppShell>
  );
}