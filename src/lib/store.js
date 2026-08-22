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
    loadSampleWorkspace,
  };
}

export async function loadSampleWorkspace() {
  const now = Date.now();
  const sampleApps = [
    {
      id: uid(),
      company: "Acme Corp",
      role: "Senior React Developer",
      location: "San Francisco, CA (Hybrid)",
      salary: "$150,000 - $175,000",
      source: "Referral",
      stage: "APPLIED",
      priority: "HIGH",
      link: "https://acme.example.com/careers/react-dev",
      notes: "Referred by Sarah from previous team. Follow up expected within 7 days.",
      appliedAt: new Date(now - 9 * 86400000).toISOString(),
      updatedAt: new Date(now - 9 * 86400000).toISOString(),
      interviews: [],
      reminders: [
        { id: uid(), label: "Send polite follow-up email to recruiter", at: new Date(now).toISOString(), done: false },
      ],
      timeline: [
        { id: uid(), at: new Date(now - 9 * 86400000).toISOString(), label: "Application submitted" },
      ],
    },
    {
      id: uid(),
      company: "Linear",
      role: "Frontend Engineer",
      location: "Remote",
      salary: "$160,000",
      source: "LinkedIn",
      stage: "INTERVIEW",
      priority: "HIGH",
      link: "https://linear.app/careers",
      notes: "Technical architecture discussion scheduled. Review React 19 concurrent features.",
      appliedAt: new Date(now - 14 * 86400000).toISOString(),
      updatedAt: new Date(now - 1 * 86400000).toISOString(),
      interviews: [
        { id: uid(), kind: "Technical Loop", withWhom: "Lead Engineer", at: new Date(now + 86400000).toISOString() },
      ],
      reminders: [],
      timeline: [
        { id: uid(), at: new Date(now - 14 * 86400000).toISOString(), label: "Application submitted" },
        { id: uid(), at: new Date(now - 7 * 86400000).toISOString(), label: "Moved to SCREENING" },
        { id: uid(), at: new Date(now - 1 * 86400000).toISOString(), label: "Moved to INTERVIEW" },
      ],
    },
    {
      id: uid(),
      company: "Stripe",
      role: "Product Engineer",
      location: "New York, NY",
      salary: "$180,000",
      source: "Company site",
      stage: "SAVED",
      priority: "HIGH",
      link: "https://stripe.com/jobs",
      notes: "Need to polish resume project section before submitting.",
      appliedAt: new Date(now - 2 * 86400000).toISOString(),
      updatedAt: new Date(now - 2 * 86400000).toISOString(),
      interviews: [],
      reminders: [],
      timeline: [
        { id: uid(), at: new Date(now - 2 * 86400000).toISOString(), label: "Saved role to dossier" },
      ],
    },
    {
      id: uid(),
      company: "Vercel",
      role: "UI Systems Engineer",
      location: "Remote",
      salary: "$170,000",
      source: "Job board",
      stage: "SCREENING",
      priority: "MEDIUM",
      link: "https://vercel.com/careers",
      notes: "Recruiter screen completed cleanly. Awaiting hiring manager calendar invite.",
      appliedAt: new Date(now - 5 * 86400000).toISOString(),
      updatedAt: new Date(now - 2 * 86400000).toISOString(),
      interviews: [],
      reminders: [],
      timeline: [
        { id: uid(), at: new Date(now - 5 * 86400000).toISOString(), label: "Application submitted" },
        { id: uid(), at: new Date(now - 2 * 86400000).toISOString(), label: "Moved to SCREENING" },
      ],
    },
    {
      id: uid(),
      company: "Supabase",
      role: "Fullstack Engineer",
      location: "Remote",
      salary: "$165,000",
      source: "Cold email",
      stage: "OFFER",
      priority: "HIGH",
      link: "https://supabase.com/careers",
      notes: "Offer received! Reviewing equity package and health benefits.",
      appliedAt: new Date(now - 25 * 86400000).toISOString(),
      updatedAt: new Date(now - 1 * 86400000).toISOString(),
      interviews: [
        { id: uid(), kind: "Recruiter Screen", withWhom: "Talent Partner", at: new Date(now - 20 * 86400000).toISOString() },
        { id: uid(), kind: "Final Loop", withWhom: "Engineering VP", at: new Date(now - 5 * 86400000).toISOString() },
      ],
      reminders: [],
      timeline: [
        { id: uid(), at: new Date(now - 25 * 86400000).toISOString(), label: "Application submitted" },
        { id: uid(), at: new Date(now - 20 * 86400000).toISOString(), label: "Moved to SCREENING" },
        { id: uid(), at: new Date(now - 10 * 86400000).toISOString(), label: "Moved to INTERVIEW" },
        { id: uid(), at: new Date(now - 1 * 86400000).toISOString(), label: "Moved to OFFER" },
      ],
    },
  ];

  apps = sampleApps;
  emit();
  return sampleApps;
}