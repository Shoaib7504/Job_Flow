"use client";

import { useState } from "react";
import { PlusCircle, Loader2 } from "lucide-react";
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
  const [draft, setDraft] = useState({
    company: "",
    role: "",
    stage: "SAVED",
    appliedAt: new Date().toISOString().split("T")[0],
    link: "",
    location: "",
    salary: "",
    source: SOURCES[1] || "LinkedIn", // LinkedIn default
    priority: "MEDIUM",
    notes: "",
  });

  const resetForm = () => {
    setDraft({
      company: "",
      role: "",
      stage: "SAVED",
      appliedAt: new Date().toISOString().split("T")[0],
      link: "",
      location: "",
      salary: "",
      source: SOURCES[1] || "LinkedIn",
      priority: "MEDIUM",
      notes: "",
    });
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
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-md bg-primary/10 text-primary">
              <PlusCircle className="size-5" />
            </div>
            <div>
              <DialogTitle className="font-display text-xl">New Application</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Add a new role to your dossier pipeline and track its momentum.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Priority Fields: Company & Role */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="company" className="label-caps">
                Company <span className="text-destructive">*</span>
              </Label>
              <Input
                id="company"
                required
                placeholder="e.g. Acme Corp"
                value={draft.company}
                onChange={(e) => setDraft({ ...draft, company: e.target.value })}
                className="bg-surface"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="role" className="label-caps">
                Position / Role <span className="text-destructive">*</span>
              </Label>
              <Input
                id="role"
                required
                placeholder="e.g. Senior Frontend Engineer"
                value={draft.role}
                onChange={(e) => setDraft({ ...draft, role: e.target.value })}
                className="bg-surface"
              />
            </div>
          </div>

          {/* Status & Application Date */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="stage" className="label-caps">Status / Stage</Label>
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
              <Label htmlFor="appliedAt" className="label-caps">Application Date</Label>
              <Input
                id="appliedAt"
                type="date"
                value={draft.appliedAt}
                onChange={(e) => setDraft({ ...draft, appliedAt: e.target.value })}
                className="bg-surface"
              />
            </div>
          </div>

          {/* Job URL & Location */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="link" className="label-caps">Job Posting URL</Label>
              <Input
                id="link"
                type="url"
                placeholder="https://company.com/careers/role"
                value={draft.link}
                onChange={(e) => setDraft({ ...draft, link: e.target.value })}
                className="bg-surface"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location" className="label-caps">Location</Label>
              <Input
                id="location"
                placeholder="e.g. Remote, San Francisco, CA"
                value={draft.location}
                onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                className="bg-surface"
              />
            </div>
          </div>

          {/* Secondary Details: Salary & Source & Priority */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="salary" className="label-caps">Salary Range</Label>
              <Input
                id="salary"
                placeholder="$140k - $160k"
                value={draft.salary}
                onChange={(e) => setDraft({ ...draft, salary: e.target.value })}
                className="bg-surface"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="source" className="label-caps">Source</Label>
              <select
                id="source"
                value={draft.source}
                onChange={(e) => setDraft({ ...draft, source: e.target.value })}
                className="h-10 w-full rounded-md border border-input bg-surface px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {SOURCES.map((src) => (
                  <option key={src} value={src}>
                    {src}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="priority" className="label-caps">Priority</Label>
              <select
                id="priority"
                value={draft.priority}
                onChange={(e) => setDraft({ ...draft, priority: e.target.value })}
                className="h-10 w-full rounded-md border border-input bg-surface px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="label-caps">Initial Notes / Prep</Label>
            <Textarea
              id="notes"
              rows={3}
              placeholder="Referral name, hiring manager contact, interview details..."
              value={draft.notes}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              className="resize-none bg-surface"
            />
          </div>

          <DialogFooter className="pt-2">
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
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-transform active:translate-y-0 disabled:opacity-60"
            >
              {submitting && <Loader2 className="size-4 animate-spin" />}
              Save Dossier
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
