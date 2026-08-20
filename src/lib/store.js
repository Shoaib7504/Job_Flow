"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "job-flow.applications";

let apps = [];
let loaded = false;
const listeners = new Set();

function uid() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function loadStorage() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to load applications from localStorage:", e);
    return [];
  }
}

function saveStorage(data) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save applications to localStorage:", e);
  }
}

function initStorage() {
  if (typeof window !== "undefined" && !loaded) {
    apps = loadStorage();
    loaded = true;
  }
}

initStorage();

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) {
      apps = loadStorage();
      emit();
    }
  });
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
            ...(a.timeline || []),
            { id: uid(), at: new Date().toISOString(), label: `Moved to ${stage}` },
          ],
        }
      : a,
  );
  saveStorage(apps);
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
  saveStorage(apps);
  emit();
  return app;
}

function addNote(id, text) {
  apps = apps.map((a) =>
    a.id === id ? { ...a, notes: text, updatedAt: new Date().toISOString() } : a,
  );
  saveStorage(apps);
  emit();
}

function addInterview(id, { kind, withWhom, at }) {
  apps = apps.map((a) =>
    a.id === id
      ? {
          ...a,
          updatedAt: new Date().toISOString(),
          interviews: [...(a.interviews || []), { id: uid(), kind, withWhom, at }],
          timeline: [
            ...(a.timeline || []),
            { id: uid(), at: new Date().toISOString(), label: `Interview scheduled: ${kind}` },
          ],
        }
      : a,
  );
  saveStorage(apps);
  emit();
}

function addReminder(id, { label, at }) {
  apps = apps.map((a) =>
    a.id === id
      ? {
          ...a,
          updatedAt: new Date().toISOString(),
          reminders: [...(a.reminders || []), { id: uid(), label, at, done: false }],
        }
      : a,
  );
  saveStorage(apps);
  emit();
}

function toggleReminder(id, reminderId) {
  apps = apps.map((a) =>
    a.id === id
      ? {
          ...a,
          reminders: (a.reminders || []).map((r) => (r.id === reminderId ? { ...r, done: !r.done } : r)),
        }
      : a,
  );
  saveStorage(apps);
  emit();
}

function remove(id) {
  apps = apps.filter((a) => a.id !== id);
  saveStorage(apps);
  emit();
}

const EMPTY_ARRAY = [];

export function useStore() {
  const state = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => {
      if (typeof window !== "undefined" && !loaded) {
        initStorage();
      }
      return apps;
    },
    () => EMPTY_ARRAY,
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