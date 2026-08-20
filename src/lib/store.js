"use client";

import { useSyncExternalStore } from "react";
import { api, getToken } from "./api";

let apps = [];
let loaded = false;
let isFetching = false;
const listeners = new Set();

function uid() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function emit() {
  listeners.forEach((l) => l());
}

export async function fetchApplications() {
  if (!getToken()) {
    apps = [];
    loaded = true;
    emit();
    return;
  }
  try {
    isFetching = true;
    emit();
    const res = await api.get("/applications");
    const serverApps = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
    apps = serverApps;
  } catch (err) {
    console.error("Failed to fetch applications from server database:", err);
  } finally {
    isFetching = false;
    loaded = true;
    emit();
  }
}

function initStore() {
  if (typeof window !== "undefined" && !loaded) {
    // Clear any previous legacy localStorage application data
    try {
      window.localStorage.removeItem("job-flow.applications");
    } catch {
      // ignore
    }
    loaded = true;
    if (getToken()) {
      fetchApplications();
    }
  }
}

initStore();

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "job-flow.token") {
      if (getToken()) {
        fetchApplications();
      } else {
        apps = [];
        emit();
      }
    }
  });
}

async function setStage(id, stage) {
  const previousApps = apps;
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
  emit();

  try {
    const res = await api.patch(`/applications/${id}`, { action: "stage", stage });
    if (res?.data) {
      apps = apps.map((a) => (a.id === id ? res.data : a));
      emit();
    }
  } catch (err) {
    console.error("Failed to update application stage on server:", err);
    apps = previousApps;
    emit();
    throw err;
  }
}

async function add(draft) {
  const tempId = uid();
  const optimisticApp = {
    id: tempId,
    company: draft.company,
    role: draft.role,
    location: draft.location ?? "",
    salary: draft.salary ?? "",
    source: draft.source || "Other",
    stage: draft.stage || "SAVED",
    priority: draft.priority || "MEDIUM",
    link: draft.link ?? "",
    notes: draft.notes ?? "",
    appliedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    interviews: [],
    reminders: [],
    timeline: [
      { id: uid(), at: new Date().toISOString(), label: "Application submitted" },
    ],
  };

  apps = [optimisticApp, ...apps];
  emit();

  try {
    const res = await api.post("/applications", {
      company: draft.company,
      role: draft.role,
      location: draft.location || "",
      salary: draft.salary || "",
      source: draft.source || "Other",
      stage: draft.stage || "SAVED",
      priority: draft.priority || "MEDIUM",
      link: draft.link || "",
      notes: draft.notes || "",
    });

    const serverApp = res?.data || res;
    if (serverApp && serverApp.id) {
      apps = apps.map((a) => (a.id === tempId ? serverApp : a));
      emit();
      return serverApp;
    }
  } catch (err) {
    console.error("Failed to create application on server database:", err);
    apps = apps.filter((a) => a.id !== tempId);
    emit();
    throw err;
  }

  return optimisticApp;
}

async function addNote(id, text) {
  const previousApps = apps;
  apps = apps.map((a) =>
    a.id === id ? { ...a, notes: text, updatedAt: new Date().toISOString() } : a,
  );
  emit();

  try {
    const res = await api.patch(`/applications/${id}`, { action: "note", text });
    if (res?.data) {
      apps = apps.map((a) => (a.id === id ? res.data : a));
      emit();
    }
  } catch (err) {
    console.error("Failed to add note on server database:", err);
    apps = previousApps;
    emit();
    throw err;
  }
}

async function addInterview(id, { kind, withWhom, at }) {
  const previousApps = apps;
  const interviewDate = at ? new Date(at).toISOString() : new Date().toISOString();
  apps = apps.map((a) =>
    a.id === id
      ? {
          ...a,
          updatedAt: new Date().toISOString(),
          interviews: [...(a.interviews || []), { id: uid(), kind, withWhom: withWhom || "TBD", at: interviewDate }],
          timeline: [
            ...(a.timeline || []),
            { id: uid(), at: new Date().toISOString(), label: `Interview scheduled: ${kind}` },
          ],
        }
      : a,
  );
  emit();

  try {
    const res = await api.patch(`/applications/${id}`, {
      action: "interview",
      kind,
      withWhom: withWhom || "TBD",
      at: interviewDate,
    });
    if (res?.data) {
      apps = apps.map((a) => (a.id === id ? res.data : a));
      emit();
    }
  } catch (err) {
    console.error("Failed to add interview on server database:", err);
    apps = previousApps;
    emit();
    throw err;
  }
}

async function addReminder(id, { label, at }) {
  const previousApps = apps;
  const reminderDate = at ? new Date(at).toISOString() : new Date().toISOString();
  apps = apps.map((a) =>
    a.id === id
      ? {
          ...a,
          updatedAt: new Date().toISOString(),
          reminders: [...(a.reminders || []), { id: uid(), label, at: reminderDate, done: false }],
        }
      : a,
  );
  emit();

  try {
    const res = await api.patch(`/applications/${id}`, {
      action: "reminder",
      label,
      at: reminderDate,
    });
    if (res?.data) {
      apps = apps.map((a) => (a.id === id ? res.data : a));
      emit();
    }
  } catch (err) {
    console.error("Failed to add reminder on server database:", err);
    apps = previousApps;
    emit();
    throw err;
  }
}

async function toggleReminder(id, reminderId) {
  const previousApps = apps;
  apps = apps.map((a) =>
    a.id === id
      ? {
          ...a,
          reminders: (a.reminders || []).map((r) =>
            r.id === reminderId ? { ...r, done: !r.done } : r,
          ),
        }
      : a,
  );
  emit();

  try {
    const res = await api.patch(`/applications/${id}`, {
      action: "toggleReminder",
      reminderId,
    });
    if (res?.data) {
      apps = apps.map((a) => (a.id === id ? res.data : a));
      emit();
    }
  } catch (err) {
    console.error("Failed to toggle reminder on server database:", err);
    apps = previousApps;
    emit();
    throw err;
  }
}

async function remove(id) {
  const previousApps = apps;
  apps = apps.filter((a) => a.id !== id);
  emit();

  try {
    await api.delete(`/applications/${id}`);
  } catch (err) {
    console.error("Failed to delete application from server database:", err);
    apps = previousApps;
    emit();
    throw err;
  }
}

async function updateApp(id, updates) {
  const previousApps = apps;
  apps = apps.map((a) => (a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a));
  emit();

  try {
    const res = await api.put(`/applications/${id}`, updates);
    if (res?.data) {
      apps = apps.map((a) => (a.id === id ? res.data : a));
      emit();
    }
  } catch (err) {
    console.error("Failed to update application on server database:", err);
    apps = previousApps;
    emit();
    throw err;
  }
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
        initStore();
      }
      return apps;
    },
    () => EMPTY_ARRAY,
  );

  return {
    apps: state,
    isFetching,
    fetchApplications,
    setStage,
    add,
    addNote,
    addInterview,
    addReminder,
    toggleReminder,
    remove,
    updateApp,
  };
}