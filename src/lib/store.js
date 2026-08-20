"use client";

import { useSyncExternalStore } from "react";

const DAY = 86400000;
const now = Date.now();

const seed = [
  {
    id: "a1",
    company: "Linear",
    role: "Senior Product Engineer",
    stage: "INTERVIEW",
    source: "Referral",
    appliedAt: new Date(now - 41 * DAY).toISOString(),
    updatedAt: new Date(now - 2 * DAY).toISOString(),
    interviews: [
      {
        id: "i1",
        at: new Date(now + 2 * DAY).toISOString(),
        kind: "Team interview",
        withWhom: "Maya Chen",
      },
      {
        id: "i2",
        at: new Date(now + 5 * DAY).toISOString(),
        kind: "System design",
        withWhom: "Priya Nair",
      },
    ],
    timeline: [
      { id: "t1", at: new Date(now - 41 * DAY).toISOString(), label: "Application submitted" },
      { id: "t2", at: new Date(now - 38 * DAY).toISOString(), label: "Recruiter screen" },
      { id: "t3", at: new Date(now - 2 * DAY).toISOString(), label: "Interviews scheduled" },
    ],
  },
  {
    id: "a2",
    company: "Vercel",
    role: "Frontend Engineer",
    stage: "OFFER",
    source: "Company site",
    appliedAt: new Date(now - 52 * DAY).toISOString(),
    updatedAt: new Date(now - 1 * DAY).toISOString(),
    interviews: [
      {
        id: "i3",
        at: new Date(now - 12 * DAY).toISOString(),
        kind: "Final round",
        withWhom: "Diego Alvarez",
      },
    ],
    timeline: [
      { id: "t4", at: new Date(now - 52 * DAY).toISOString(), label: "Application submitted" },
      { id: "t5", at: new Date(now - 20 * DAY).toISOString(), label: "Take-home completed" },
      { id: "t6", at: new Date(now - 1 * DAY).toISOString(), label: "Offer received" },
    ],
  },
  {
    id: "a3",
    company: "Stripe",
    role: "Backend Engineer",
    stage: "SCREENING",
    source: "LinkedIn",
    appliedAt: new Date(now - 9 * DAY).toISOString(),
    updatedAt: new Date(now - 1 * DAY).toISOString(),
    interviews: [
      {
        id: "i4",
        at: new Date(now + 3 * DAY).toISOString(),
        kind: "Recruiter call",
        withWhom: "Jordan Lee",
      },
    ],
    timeline: [
      { id: "t7", at: new Date(now - 9 * DAY).toISOString(), label: "Application submitted" },
      { id: "t8", at: new Date(now - 1 * DAY).toISOString(), label: "Moved to screening" },
    ],
  },
  {
    id: "a4",
    company: "Notion",
    role: "Full-stack Engineer",
    stage: "APPLIED",
    source: "Job board",
    appliedAt: new Date(now - 4 * DAY).toISOString(),
    updatedAt: new Date(now - 4 * DAY).toISOString(),
    interviews: [],
    timeline: [
      { id: "t9", at: new Date(now - 4 * DAY).toISOString(), label: "Application submitted" },
    ],
  },
  {
    id: "a5",
    company: "Ramp",
    role: "Product Engineer",
    stage: "INTERVIEW",
    source: "Referral",
    appliedAt: new Date(now - 30 * DAY).toISOString(),
    updatedAt: new Date(now - 6 * DAY).toISOString(),
    interviews: [
      {
        id: "i5",
        at: new Date(now + 7 * DAY).toISOString(),
        kind: "Hiring manager",
        withWhom: "Sofia Reyes",
      },
    ],
    timeline: [
      { id: "t10", at: new Date(now - 30 * DAY).toISOString(), label: "Application submitted" },
      { id: "t11", at: new Date(now - 14 * DAY).toISOString(), label: "Phone screen" },
      { id: "t12", at: new Date(now - 6 * DAY).toISOString(), label: "Interview scheduled" },
    ],
  },
  {
    id: "a6",
    company: "Figma",
    role: "Design Engineer",
    stage: "OFFER",
    source: "Company site",
    appliedAt: new Date(now - 64 * DAY).toISOString(),
    updatedAt: new Date(now - 3 * DAY).toISOString(),
    interviews: [
      {
        id: "i6",
        at: new Date(now - 15 * DAY).toISOString(),
        kind: "Portfolio review",
        withWhom: "Nina Okafor",
      },
    ],
    timeline: [
      { id: "t13", at: new Date(now - 64 * DAY).toISOString(), label: "Application submitted" },
      { id: "t14", at: new Date(now - 30 * DAY).toISOString(), label: "Portfolio review" },
      { id: "t15", at: new Date(now - 3 * DAY).toISOString(), label: "Offer received" },
    ],
  },
  {
    id: "a7",
    company: "Railway",
    role: "Platform Engineer",
    stage: "SAVED",
    source: "Job board",
    appliedAt: new Date(now - 2 * DAY).toISOString(),
    updatedAt: new Date(now - 2 * DAY).toISOString(),
    interviews: [],
    timeline: [
      { id: "t16", at: new Date(now - 2 * DAY).toISOString(), label: "Saved for later" },
    ],
  },
  {
    id: "a8",
    company: "Resend",
    role: "Software Engineer",
    stage: "SCREENING",
    source: "LinkedIn",
    appliedAt: new Date(now - 16 * DAY).toISOString(),
    updatedAt: new Date(now - 1 * DAY).toISOString(),
    interviews: [
      {
        id: "i7",
        at: new Date(now + 1 * DAY).toISOString(),
        kind: "Tech screen",
        withWhom: "Arjun Mehta",
      },
    ],
    timeline: [
      { id: "t17", at: new Date(now - 16 * DAY).toISOString(), label: "Application submitted" },
      { id: "t18", at: new Date(now - 7 * DAY).toISOString(), label: "Moved to screening" },
    ],
  },
  {
    id: "a9",
    company: "Supabase",
    role: "Developer Relations Engineer",
    stage: "APPLIED",
    source: "Referral",
    appliedAt: new Date(now - 7 * DAY).toISOString(),
    updatedAt: new Date(now - 7 * DAY).toISOString(),
    interviews: [],
    timeline: [
      { id: "t19", at: new Date(now - 7 * DAY).toISOString(), label: "Application submitted" },
    ],
  },
  {
    id: "a10",
    company: "Loops",
    role: "Marketing Engineer",
    stage: "SAVED",
    source: "Company site",
    appliedAt: new Date(now - 1 * DAY).toISOString(),
    updatedAt: new Date(now - 1 * DAY).toISOString(),
    interviews: [],
    timeline: [
      { id: "t20", at: new Date(now - 1 * DAY).toISOString(), label: "Saved for later" },
    ],
  },
  {
    id: "a11",
    company: "Mercury",
    role: "Frontend Engineer",
    stage: "INTERVIEW",
    source: "Job board",
    appliedAt: new Date(now - 48 * DAY).toISOString(),
    updatedAt: new Date(now - 4 * DAY).toISOString(),
    interviews: [
      {
        id: "i8",
        at: new Date(now + 9 * DAY).toISOString(),
        kind: "Onsite",
        withWhom: "Lena Fischer",
      },
    ],
    timeline: [
      { id: "t21", at: new Date(now - 48 * DAY).toISOString(), label: "Application submitted" },
      { id: "t22", at: new Date(now - 22 * DAY).toISOString(), label: "Phone screen" },
      { id: "t23", at: new Date(now - 4 * DAY).toISOString(), label: "Onsite scheduled" },
    ],
  },
];

let apps = seed.map((a) => ({
  reminders: [],
  notes: "",
  priority: "MEDIUM",
  link: "",
  ...a,
}));
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