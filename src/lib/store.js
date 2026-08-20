"use client";

import { useSyncExternalStore } from "react";

let apps = [];
const listeners = new Set();

function uid() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function emit() {
  listeners.forEach((l) => l());
}

function setStage(id, stage) {
  apps = apps.map((a) =>
    a.id === id
      ? {
          ...a,
          stage,
          updatedAt: new Date().toISOString(),
          timeline: [
            ...a.timeline,
            { id: uid(), at: new Date().toISOString(), label: `Moved to ${stage}` },
          ],
        }
      : a,
  );
  emit();
}

function add(draft) {
  const app = {
    id: uid(),
    company: draft.company,
    role: draft.role,
    location: draft.location ?? "",
    salary: draft.salary ?? "",
    source: draft.source,
    stage: draft.stage,
    priority: "MEDIUM",
    link: "",
    notes: "",
    appliedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    interviews: [],
    reminders: [],
    timeline: [
      { id: uid(), at: new Date().toISOString(), label: "Application submitted" },
    ],
  };
  apps = [app, ...apps];
  emit();
  return app;
}

function addNote(id, text) {
  apps = apps.map((a) =>
    a.id === id ? { ...a, notes: text, updatedAt: new Date().toISOString() } : a,
  );
  emit();
}

function addInterview(id, { kind, withWhom, at }) {
  apps = apps.map((a) =>
    a.id === id
      ? {
          ...a,
          updatedAt: new Date().toISOString(),
          interviews: [...a.interviews, { id: uid(), kind, withWhom, at }],
          timeline: [
            ...a.timeline,
            { id: uid(), at: new Date().toISOString(), label: `Interview scheduled: ${kind}` },
          ],
        }
      : a,
  );
  emit();
}

function addReminder(id, { label, at }) {
  apps = apps.map((a) =>
    a.id === id
      ? {
          ...a,
          updatedAt: new Date().toISOString(),
          reminders: [...a.reminders, { id: uid(), label, at, done: false }],
        }
      : a,
  );
  emit();
}

function toggleReminder(id, reminderId) {
  apps = apps.map((a) =>
    a.id === id
      ? {
          ...a,
          reminders: a.reminders.map((r) => (r.id === reminderId ? { ...r, done: !r.done } : r)),
        }
      : a,
  );
  emit();
}

function remove(id) {
  apps = apps.filter((a) => a.id !== id);
  emit();
}

export function useStore() {
  const state = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => apps,
    () => apps,
  );
  return {
    apps: state,
    setStage,
    add,
    addNote,
    addInterview,
    addReminder,
    toggleReminder,
    remove,
  };
}