"use client";

import { useState } from "react";
import { PlusCircle, Loader2, ChevronDown, ChevronUp, Zap } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { SOURCES, STAGES } from "@/lib/jobflow";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function AddApplicationModal({ open, onOpenChange }) {
  const { add } = useStore();
  const [submitting, setSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [draft, setDraft] = useState({
    company: "",
    role: "",
    stage: "APPLIED",
    appliedAt: new Date().toISOString().split("T")[0],
    link: "",
    location: "",
    salary: "",
    source: SOURCES[1] || "LinkedIn",
    priority: "MEDIUM",
    notes: "",
  });

  const resetForm = () => {
    setDraft({
      company: "",
      role: "",
      stage: "APPLIED",
      appliedAt: new Date().toISOString().split("T")[0],
      link: "",
      location: "",
      salary: "",
      source: SOURCES[1] || "LinkedIn",
      priority: "MEDIUM",
      notes: "",
    });
    setShowAdvanced(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!draft.company.trim() || !draft.role.trim()) {
      toast.error("Please provide both Company and Position title.");
      return;
    }

    setSubmitting(true);
    try {
      const created = await add({
        ...draft,
        appliedAt: draft.appliedAt ? new Date(draft.appliedAt).toISOString() : new Date().toISOString(),
      });
      toast.success(`${created?.company || draft.company} added to your pipeline`);
      onOpenChange(false);
      resetForm();
    } catch (err) {
      toast.error(err.message || "Failed to add application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-md bg-primary/10 text-primary shrink-0">
              <Zap className="size-5 fill-primary" />
            </div>
            <div>
              <DialogTitle className="font-display text-xl">Quick Application Entry</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Found a job? Add it to your pipeline in 10 seconds.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Core 4 Essential Fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="company" className="label-caps text-[11px]">
                Company <span className="text-destructive">*</span>
              </Label>
              <Input
                id="company"
                required
                autoFocus
                placeholder="e.g. Acme Corp"
                value={draft.company}
                onChange={(e) => setDraft({ ...draft, company: e.target.value })}
                className="bg-surface"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="role" className="label-caps text-[11px]">
                Position / Job Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="role"
                required
                placeholder="e.g. Frontend Developer"
                value={draft.role}
                onChange={(e) => setDraft({ ...draft, role: e.target.value })}
                className="bg-surface"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="stage" className="label-caps text-[11px]">Stage</Label>
              <select
                id="stage"
                value={draft.stage}
                onChange={(e) => setDraft({ ...draft, stage: e.target.value })}
                className="h-10 w-full rounded-md border border-input bg-surface px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="link" className="label-caps text-[11px]">Job URL</Label>
              <Input
                id="link"
                type="url"
                placeholder="https://company.com/job/123"
                value={draft.link}
                onChange={(e) => setDraft({ ...draft, link: e.target.value })}
                className="bg-surface text-xs font-mono"
              />
            </div>
          </div>

          {/* Optional Expandable Details */}
          <div className="border-t border-border/60 pt-3">
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              {showAdvanced ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
              <span>{showAdvanced ? "Hide extra fields" : "+ Add location, salary, source & notes"}</span>
            </button>

            {showAdvanced && (
              <div className="space-y-4 pt-3 animate-fade">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="location" className="label-caps text-[10px]">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g. Remote, San Francisco, CA"
                      value={draft.location}
                      onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                      className="bg-surface h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="appliedAt" className="label-caps text-[10px]">Application Date</Label>
                    <Input
                      id="appliedAt"
                      type="date"
                      value={draft.appliedAt}
                      onChange={(e) => setDraft({ ...draft, appliedAt: e.target.value })}
                      className="bg-surface h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="salary" className="label-caps text-[10px]">Salary Range</Label>
                    <Input
                      id="salary"
                      placeholder="$140k - $160k"
                      value={draft.salary}
                      onChange={(e) => setDraft({ ...draft, salary: e.target.value })}
                      className="bg-surface h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="source" className="label-caps text-[10px]">Source</Label>
                    <select
                      id="source"
                      value={draft.source}
                      onChange={(e) => setDraft({ ...draft, source: e.target.value })}
                      className="h-9 w-full rounded-md border border-input bg-surface px-2.5 text-xs outline-none"
                    >
                      {SOURCES.map((src) => (
                        <option key={src} value={src}>
                          {src}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="priority" className="label-caps text-[10px]">Priority</Label>
                    <select
                      id="priority"
                      value={draft.priority}
                      onChange={(e) => setDraft({ ...draft, priority: e.target.value })}
                      className="h-9 w-full rounded-md border border-input bg-surface px-2.5 text-xs outline-none"
                    >
                      <option value="HIGH">High</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="LOW">Low</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="notes" className="label-caps text-[10px]">Initial Notes / Contact</Label>
                  <Textarea
                    id="notes"
                    rows={2}
                    placeholder="Recruiter contact info, referral name..."
                    value={draft.notes}
                    onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                    className="resize-none bg-surface text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="pt-2 flex items-center justify-between">
            <span className="num text-[11px] text-muted-foreground hidden xs:inline">
              Press Enter to save
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-transform active:translate-y-0 disabled:opacity-60 cursor-pointer"
              >
                {submitting ? <Loader2 className="size-4 animate-spin" /> : <PlusCircle className="size-4" />}
                Create Application
              </button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
