export const STAGES = ["SAVED", "APPLIED", "SCREENING", "INTERVIEW", "OFFER"];

export function stageIndex(stage) {
  const i = STAGES.indexOf(stage);
  return i === -1 ? 0 : i;
}
