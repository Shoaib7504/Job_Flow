"use client";

import Reveal from "./Reveal";
import SectionMark from "./SectionMark";
import { OpportunityMap, useReveal } from "./jobflow/OpportunityMap";

export default function JourneySection() {
  const { ref, shown } = useReveal();

  return (
    <section id="journey" className="border-b border-border paper-grid">
      <div className="mx-auto w-11/12 px-5 py-20 sm:px-8 sm:py-32">
        <Reveal>
          <SectionMark n="03" title="Application journey" />
        </Reveal>
        <Reveal>
          <p className="mt-10 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            Every application is a journey forward. JobFlow makes each step visible, so momentum is
            something you can see instead of something you hope for.
          </p>
        </Reveal>
        <div ref={ref} className="mt-16 sm:mt-24">
          <OpportunityMap active={shown ? 4 : 0} />
        </div>
        <div className="mt-16 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
          {[
            ["Advance in one click", "Move a role forward and the timeline writes itself."],
            ["Nothing goes cold", "Stalled applications rise to the top of your day."],
            ["Always reversible", "Stages are a record, not a trap — step back anytime."],
          ].map(([t, d], i) => (
            <Reveal key={t} delay={i * 70}>
              <div className="h-full bg-surface p-6">
                <h4 className="font-display text-lg font-medium">{t}</h4>
                <p className="mt-2 text-base text-muted-foreground">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}