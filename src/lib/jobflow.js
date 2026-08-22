export const STAGES = ["SAVED", "APPLIED", "SCREENING", "INTERVIEW", "OFFER"];

export const ALL_STAGES = ["SAVED", "APPLIED", "SCREENING", "INTERVIEW", "OFFER", "REJECTED", "WITHDRAWN"];

export const SOURCES = [
  "Referral",
  "LinkedIn",
  "Company site",
  "Job board",
  "Cold email",
  "Recruiter",
  "Other",
];

export function stageIndex(stage) {
  const i = STAGES.indexOf(stage);
  if (i !== -1) return i;
  if (stage === "REJECTED" || stage === "WITHDRAWN") return -1;
  return 0;
}

export function isNegativeStage(stage) {
  return stage === "REJECTED" || stage === "WITHDRAWN";
}

export const STAGE_META = {
  SAVED: { label: "Saved", badge: "bg-surface-2 text-muted-foreground border-border" },
  APPLIED: { label: "Applied", badge: "bg-primary/10 text-primary border-primary/20" },
  SCREENING: { label: "Screening", badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
  INTERVIEW: { label: "Interview", badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" },
  OFFER: { label: "Offer", badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
  REJECTED: { label: "Rejected", badge: "bg-destructive/10 text-destructive border-destructive/20" },
  WITHDRAWN: { label: "Withdrawn", badge: "bg-muted text-muted-foreground border-border" },
};

export function fmtShort(iso) {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function fmtDate(iso) {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function relative(input) {
  if (!input) return "N/A";
  const then = new Date(input).getTime();
  const mins = Math.max(0, Math.round((Date.now() - then) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.round(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  return fmtShort(input);
}

export function getNextAction(app) {
  if (!app) return null;
  const now = Date.now();
  const appliedDays = Math.round((now - new Date(app.appliedAt).getTime()) / (1000 * 60 * 60 * 24));
  const updatedDays = Math.round((now - new Date(app.updatedAt).getTime()) / (1000 * 60 * 60 * 24));

  // 1. Upcoming Interview (highest priority)
  const upcomingInterview = app.interviews
    ?.filter((i) => new Date(i.at).getTime() > now)
    .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime())[0];

  if (upcomingInterview) {
    const hoursLeft = Math.round((new Date(upcomingInterview.at).getTime() - now) / (1000 * 60 * 60));
    return {
      urgency: hoursLeft <= 48 ? "high" : "medium",
      title: `Prepare for ${upcomingInterview.kind} with ${app.company}`,
      subtitle: `${upcomingInterview.withWhom ? `With ${upcomingInterview.withWhom} · ` : ""}${fmtDate(upcomingInterview.at)} (${relative(upcomingInterview.at)})`,
      actionLabel: "View Details & Prep",
      appId: app.id,
      company: app.company,
      role: app.role,
      type: "interview",
    };
  }

  // 2. Pending Unfinished Reminder
  const pendingReminder = app.reminders
    ?.filter((r) => !r.done)
    .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime())[0];

  if (pendingReminder) {
    return {
      urgency: "high",
      title: `${pendingReminder.label} (${app.company})`,
      subtitle: `Due ${fmtDate(pendingReminder.at)}`,
      actionLabel: "View Application",
      appId: app.id,
      company: app.company,
      role: app.role,
      type: "reminder",
    };
  }

  // 3. Stale Application in APPLIED or SCREENING stage (> 7 days without update)
  if ((app.stage === "APPLIED" || app.stage === "SCREENING") && updatedDays >= 7) {
    return {
      urgency: "high",
      title: `Follow up with ${app.company} — ${app.role}`,
      subtitle: `Applied ${appliedDays} days ago, no status change in ${updatedDays} days`,
      actionLabel: "Send Follow-up",
      appId: app.id,
      company: app.company,
      role: app.role,
      type: "followup",
    };
  }

  // 4. Saved application not yet submitted
  if (app.stage === "SAVED") {
    return {
      urgency: "medium",
      title: `Submit application to ${app.company}`,
      subtitle: `Role: ${app.role} · Saved ${relative(app.appliedAt)}`,
      actionLabel: "Mark Applied",
      appId: app.id,
      company: app.company,
      role: app.role,
      type: "submit",
    };
  }

  // 5. Active application default next action
  if (!isNegativeStage(app.stage)) {
    return {
      urgency: "low",
      title: `Track response from ${app.company}`,
      subtitle: `Current stage: ${app.stage} · Last updated ${relative(app.updatedAt)}`,
      actionLabel: "View Dossier",
      appId: app.id,
      company: app.company,
      role: app.role,
      type: "track",
    };
  }

  return null;
}

