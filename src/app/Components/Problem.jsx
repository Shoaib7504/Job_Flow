import Reveal from "./Reveal";
import SectionMark from "./SectionMark";

const CHAOS = [
  { label: "tracker_v3_final.xlsx", meta: "spreadsheet" },
  { label: "47 bookmarked roles", meta: "browser" },
  { label: "Re: Next steps?", meta: "inbox" },
  { label: "Interview — Thursday 14:00", meta: "calendar" },
  { label: "Follow up with Dana", meta: "sticky note" },
  { label: "Where did I apply again?", meta: "memory" },
];

export default function Problem() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto w-11/12 px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <SectionMark n="01" title="The chaos" />
        </Reveal>
        <div className="mt-10 grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <h3 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
              A job search lives in six places at once.
            </h3>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              Every opportunity gets split across a spreadsheet, a browser tab, an inbox thread and
              a calendar invite. Nothing tells you what actually needs attention today.
            </p>
          </Reveal>
          <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
            {CHAOS.map((c, i) => (
              <Reveal key={c.label} delay={i * 60} className="h-full">
                <div className="flex h-full items-baseline justify-between gap-4 bg-surface px-5 py-6 transition-colors duration-200 hover:bg-surface-2">
                  <span className="text-base">{c.label}</span>
                  <span className="label-caps shrink-0 text-xs">{c.meta}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}