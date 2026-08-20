"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/app/Components/jobflow/AppShell";
import { Journey } from "@/app/Components/jobflow/Journey";
import { useStore } from "@/lib/store";
import { STAGES, fmtDate, relative, stageIndex } from "@/lib/jobflow";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function DetailPage() {
  return (
    <Suspense fallback={null}>
      <Detail />
    </Suspense>
  );
}

function Detail() {
  const { id } = useParams();
  const navigate = useRouter();
  const { apps, setStage, addNote, addInterview, addReminder, toggleReminder, remove } =
    useStore();
  const app = apps.find((a) => a.id === id);
  const [notes, setNotes] = useState(null);
  const [interview, setInterview] = useState({ kind: "", withWhom: "", at: "" });
  const [reminder, setReminder] = useState({ label: "", at: "" });

  if (!app) {
    return (
      <AppShell>
        <p className="text-sm text-muted-foreground">
          This dossier isn&apos;t available.{" "}
          <Link href="/applications" className="text-primary">
            Back to applications
          </Link>
        </p>
      </AppShell>
    );
  }

  const idx = stageIndex(app.stage);
  const next = STAGES[idx + 1];

  return (
    <AppShell>
      <Link
        href="/applications"
        className="label-caps mb-6 inline-flex items-center gap-1.5 hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Applications
      </Link>

      <header className="grid grid-cols-[minmax(0,1fr)] gap-6 border-b border-border pb-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="min-w-0">
          <p className="label-caps">
            {app.source} · {app.location}
          </p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{app.company}</h1>
          <p className="mt-2 text-base text-muted-foreground">{app.role}</p>
          <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
            {[
              ["Salary", app.salary],
              ["Applied", fmtDate(app.appliedAt)],
              ["Updated", relative(app.updatedAt)],
              ["Priority", app.priority],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="label-caps">{k}</dt>
                <dd className="num mt-1 text-sm">{v}</dd>
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
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm transition-colors hover:border-border-strong"
            >
              Job post <ExternalLink className="size-3.5" />
            </a>
          )}
          {next && (
            <button
              onClick={() => {
                setStage(app.id, next);
                toast.success(`Advanced to ${next}`);
              }}
              className="rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-transform duration-150 hover:-translate-y-px"
            >
              Advance to {next}
            </button>
          )}
          <button
            onClick={() => {
              remove(app.id);
              toast("Dossier removed");
              void navigate.push("/applications");
            }}
            aria-label="Delete application"
            className="rounded-md border border-border p-2 text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </header>

      {/* Journey */}
      <section className="mt-8 panel noise p-5 sm:p-8">
        <p className="label-caps">Application journey</p>
        <div className="mt-6">
          <Journey
            stage={app.stage}
            onSelect={(s) => {
              setStage(app.id, s);
              toast.success(`Stage set to ${s}`);
            }}
          />
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Select a node to change the stage. Progress is recorded in the timeline.
        </p>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-8">
          {/* Timeline */}
          <section className="panel p-5 sm:p-6">
            <p className="label-caps">Timeline</p>
            <div className="relative mt-5 pl-5">
              <span aria-hidden className="absolute left-[3px] top-1.5 h-[calc(100%-12px)] w-px bg-border" />
              <ol>
                {app.timeline.map((t) => (
                  <li key={t.id} className="relative pb-5 last:pb-0">
                    <span
                      className={cn(
                        "absolute -left-5 top-1.5 size-[7px] rounded-full",
                        t.type === "stage" ? "bg-primary" : "bg-border-strong",
                      )}
                    />
                    <p className="text-sm">{t.label}</p>
                    <p className="num mt-1 text-xs text-muted-foreground">
                      {fmtDate(t.at)} · {relative(t.at)}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Notes */}
          <section className="panel p-5 sm:p-6">
            <p className="label-caps">Notes</p>
            <Textarea
              value={notes ?? app.notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              placeholder="Research, contacts, prep points…"
              className="mt-4 resize-none bg-surface"
            />
            <button
              onClick={() => {
                addNote(app.id, notes ?? app.notes);
                setNotes(null);
                toast.success("Notes saved");
              }}
              className="mt-3 rounded-md border border-border px-3 py-2 text-sm transition-colors hover:border-border-strong"
            >
              Save notes
            </button>
          </section>
        </div>

        <div className="space-y-8">
          {/* Interviews */}
          <section className="panel p-5 sm:p-6">
            <p className="label-caps">Interviews</p>
            <ul className="mt-4 divide-y divide-border">
              {app.interviews.map((i) => (
                <li key={i.id} className="py-3">
                  <p className="text-sm font-medium">{i.kind}</p>
                  <p className="num mt-1 text-xs text-muted-foreground">
                    {fmtDate(i.at)} · {i.withWhom}
                  </p>
                </li>
              ))}
              {!app.interviews.length && (
                <li className="py-3 text-xs text-muted-foreground">Nothing scheduled.</li>
              )}
            </ul>
            <form
              className="mt-4 space-y-3 border-t border-border pt-4"
              onSubmit={(e) => {
                e.preventDefault();
                addInterview(app.id, {
                  kind: interview.kind,
                  withWhom: interview.withWhom || "TBD",
                  at: new Date(interview.at).toISOString(),
                });
                setInterview({ kind: "", withWhom: "", at: "" });
                toast.success("Interview scheduled");
              }}
            >
              <div className="space-y-1.5">
                <Label className="label-caps">Type</Label>
                <Input
                  required
                  value={interview.kind}
                  onChange={(e) => setInterview({ ...interview, kind: e.target.value })}
                  placeholder="Technical loop"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="label-caps">With</Label>
                  <Input
                    value={interview.withWhom}
                    onChange={(e) => setInterview({ ...interview, withWhom: e.target.value })}
                    placeholder="Hiring manager"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="label-caps">Date</Label>
                  <Input
                    required
                    type="date"
                    value={interview.at}
                    onChange={(e) => setInterview({ ...interview, at: e.target.value })}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full rounded-md border border-border px-3 py-2 text-sm transition-colors hover:border-border-strong"
              >
                Schedule interview
              </button>
            </form>
          </section>

          {/* Reminders */}
          <section className="panel p-5 sm:p-6">
            <p className="label-caps">Reminders</p>
            <ul className="mt-4 space-y-3">
              {app.reminders.map((r) => (
                <li key={r.id} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={r.done}
                    onChange={() => toggleReminder(app.id, r.id)}
                    className="mt-1 size-3.5 accent-[var(--color-primary)]"
                  />
                  <span className="min-w-0">
                    <span className={cn("block text-sm", r.done && "text-muted-foreground line-through")}>
                      {r.label}
                    </span>
                    <span className="num block text-xs text-muted-foreground">{fmtDate(r.at)}</span>
                  </span>
                </li>
              ))}
              {!app.reminders.length && (
                <li className="text-xs text-muted-foreground">No reminders yet.</li>
              )}
            </ul>
            <form
              className="mt-4 space-y-3 border-t border-border pt-4"
              onSubmit={(e) => {
                e.preventDefault();
                addReminder(app.id, {
                  label: reminder.label,
                  at: new Date(reminder.at).toISOString(),
                });
                setReminder({ label: "", at: "" });
                toast.success("Reminder added");
              }}
            >
              <Input
                required
                value={reminder.label}
                onChange={(e) => setReminder({ ...reminder, label: e.target.value })}
                placeholder="Follow up with recruiter"
              />
              <Input
                required
                type="date"
                value={reminder.at}
                onChange={(e) => setReminder({ ...reminder, at: e.target.value })}
              />
              <button
                type="submit"
                className="w-full rounded-md border border-border px-3 py-2 text-sm transition-colors hover:border-border-strong"
              >
                Add reminder
              </button>
            </form>
          </section>
        </div>
      </div>
    </AppShell>
  );
}