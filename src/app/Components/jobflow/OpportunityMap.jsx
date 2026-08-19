"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const MAP = [
  { stage: "SAVED", count: 12, conv: null },
  { stage: "APPLIED", count: 9, conv: "75%" },
  { stage: "SCREENING", count: 6, conv: "67%" },
  { stage: "INTERVIEW", count: 4, conv: "67%" },
  { stage: "OFFER", count: 2, conv: "50%" },
];

const MAX = 12;

/** Reveal on scroll (respects prefers-reduced-motion via CSS). */
export function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, shown };
}

/**
 * JobFlow's signature visual: the Opportunity Map.
 * A quiet editorial instrument — stage columns, volume bars, conversion
 * between steps, and a travelling pulse along the journey rail.
 */
export function OpportunityMap({ className, compact = false, active: activeProp }) {
  const { ref, shown } = useReveal();
  const [auto, setAuto] = useState(3);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    if (activeProp !== undefined) return;
    const t = setInterval(() => setAuto((v) => (v + 1) % MAP.length), 2800);
    return () => clearInterval(t);
  }, [activeProp]);

  const active = hover ?? activeProp ?? auto;

  return (
    <div
      ref={ref}
      className={cn("relative w-full", className)}
      aria-label="Opportunity map: saved to offer"
    >
      <div
        className={cn(
          "grid",
          compact ? "grid-cols-5 gap-1" : "grid-cols-5 gap-2 sm:gap-4",
        )}
      >
        {MAP.map((s, i) => {
          const state = i < active ? "done" : i === active ? "current" : "todo";
          return (
            <button
              key={s.stage}
              type="button"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              className={cn(
                "group relative flex flex-col text-left outline-none transition-colors duration-300",
                compact ? "gap-2" : "gap-3",
              )}
            >
              {/* conversion from previous stage */}
              {!compact && (
                <span
                  className={cn(
                    "num text-[10px] transition-colors duration-300",
                    state === "todo" ? "text-muted-foreground/45" : "text-muted-foreground",
                  )}
                >
                  {s.conv ? `↳ ${s.conv}` : "\u00A0"}
                </span>
              )}

              {/* count */}
              <span
                className={cn(
                  "num leading-none tabular-nums transition-all duration-300",
                  compact ? "text-lg" : "text-3xl sm:text-[2.75rem]",
                  state === "todo" ? "text-muted-foreground/40" : "text-foreground",
                  state === "current" && "text-primary",
                )}
                style={{
                  opacity: shown ? 1 : 0,
                  transform: shown ? "none" : "translateY(10px)",
                  transition: "opacity 400ms ease, transform 400ms cubic-bezier(0.22,1,0.36,1)",
                  transitionDelay: `${100 + i * 70}ms`,
                }}
              >
                {String(s.count).padStart(2, "0")}
              </span>

              {/* volume bar */}
              <span
                aria-hidden
                className={cn(
                  "relative block w-full overflow-hidden rounded-full bg-border/70",
                  compact ? "h-[3px]" : "h-[5px]",
                )}
              >
                <span
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-full transition-[width,background-color] duration-500",
                    state === "todo" ? "bg-foreground/20" : "bg-primary/45",
                    state === "current" && "bg-primary",
                  )}
                  style={{
                    width: shown ? `${(s.count / MAX) * 100}%` : "0%",
                    transitionDelay: `${140 + i * 70}ms`,
                  }}
                />
              </span>

              {/* stage label + node */}
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    "grid shrink-0 place-items-center rounded-full border transition-all duration-300",
                    compact ? "size-2.5" : "size-3",
                    state === "done" && "border-primary/50 bg-primary/20",
                    state === "current" &&
                      "border-primary bg-primary shadow-[0_0_0_4px_var(--color-accent)]",
                    state === "todo" && "border-border bg-surface",
                    "group-hover:scale-125",
                  )}
                />
                <span
                  className={cn(
                    "label-caps truncate transition-colors duration-300",
                    compact ? "text-[9px]" : "text-[10px] sm:text-[11px]",
                    state === "current" && "text-foreground",
                    state === "done" && "text-primary",
                  )}
                >
                  {s.stage}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* journey rail */}
      <div className={cn("relative", compact ? "mt-4" : "mt-7")}>
        <span aria-hidden className="block h-px w-full bg-border" />
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 h-px bg-primary/60"
          style={{
            width: shown ? `${((active + 1) / MAP.length) * 100}%` : "0%",
            transition: "width 500ms cubic-bezier(0.22,1,0.36,1)",
          }}
        />
        <span
          aria-hidden
          className="absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-primary animate-flow"
        />
      </div>
    </div>
  );
}
