import { STAGES, stageIndex } from "@/lib/jobflow";
import { cn } from "@/lib/utils";

export function JourneyRail({ stage, className }) {
  const idx = stageIndex(stage);
  return (
    <div className={cn("flex items-center gap-1", className)} aria-label={`Stage ${stage}`}>
      {STAGES.map((s, i) => (
        <span
          key={s}
          className={cn(
            "h-[3px] w-5 rounded-full transition-colors duration-300",
            i < idx && "bg-primary/40",
            i === idx && "bg-primary",
            i > idx && "bg-border",
          )}
        />
      ))}
    </div>
  );
}

export function Journey({ stage, onSelect }) {
  const idx = stageIndex(stage);
  return (
    <div className="overflow-x-auto pb-2">
      <ol className="flex min-w-[640px] items-start">
        {STAGES.map((s, i) => {
          const state = i < idx ? "done" : i === idx ? "current" : "todo";
          return (
            <li key={s} className="relative flex flex-1 flex-col items-center gap-3">
              {i > 0 && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-[-50%] top-[11px] h-px w-full transition-colors duration-500",
                    i <= idx ? "bg-primary/50" : "bg-border",
                  )}
                />
              )}
              <button
                type="button"
                onClick={() => onSelect?.(s)}
                disabled={!onSelect}
                aria-current={state === "current" ? "step" : undefined}
                className={cn(
                  "relative z-10 grid size-[22px] place-items-center rounded-full border transition-all duration-300",
                  onSelect && "cursor-pointer hover:scale-110",
                  state === "done" && "border-primary/50 bg-primary/15",
                  state === "current" &&
                    "animate-node border-primary bg-primary shadow-[0_0_0_4px_var(--color-accent)]",
                  state === "todo" && "border-border bg-surface",
                )}
              >
                {state === "done" && <span className="size-1.5 rounded-full bg-primary" />}
                {state === "current" && (
                  <span className="size-1.5 rounded-full bg-primary-foreground" />
                )}
              </button>
              <span
                className={cn(
                  "label-caps text-center transition-colors duration-300",
                  state === "current" && "text-foreground",
                  state === "done" && "text-primary",
                )}
              >
                {s}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
