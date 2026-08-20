export const STAGES = ["SAVED", "APPLIED", "SCREENING", "INTERVIEW", "OFFER"];

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
  return i === -1 ? 0 : i;
}

export function fmtShort(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function relative(input) {
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
