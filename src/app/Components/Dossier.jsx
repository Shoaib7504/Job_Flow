import { cn } from "@/lib/utils";
import Reveal from "./Reveal";
import SectionMark from "./SectionMark";

export default function Dossier() {
  return (
    <section className="border-b border-border bg-surface/40">
      <div className="mx-auto w-11/12 px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <SectionMark n="05" title="Application experience" />
        </Reveal>
        <div className="mt-10 grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <h3 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              A dossier, not a card.
            </h3>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Each opportunity opens as a full editorial page: the story of the role, the stage
              you&apos;re at, and the one thing to do next.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <article className="rounded-lg border border-border bg-background p-6 sm:p-8">
              <p className="label-caps">Referral · Remote — EU</p>
              <h4 className="mt-3 font-display text-3xl font-semibold tracking-tight">Linear</h4>
              <p className="text-sm text-muted-foreground">Senior Product Engineer</p>
              <dl className="mt-8 grid grid-cols-2 gap-y-6 border-y border-border py-6 sm:grid-cols-4">
                {[
                  ["Stage", "Interview"],
                  ["Location", "Remote — EU"],
                  ["Salary", "$180k–210k"],
                  ["Applied", "Jul 28"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="label-caps text-[10px]">{k}</dt>
                    <dd className="num mt-1.5 text-sm">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 space-y-3">
                {[
                  ["Application created", "Jul 28"],
                  ["Recruiter screen", "Aug 10"],
                  ["Moved to interview", "Aug 16"],
                ].map(([t, d], i) => (
                  <div key={t} className="flex items-baseline gap-3">
                    <span
                      className={cn(
                        "size-1.5 shrink-0 translate-y-[-1px] rounded-full",
                        i === 2 ? "bg-primary" : "bg-border",
                      )}
                    />
                    <span className="text-sm">{t}</span>
                    <span className="num ml-auto text-xs text-muted-foreground">{d}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex items-center justify-between gap-4 rounded-md bg-surface-2 px-4 py-3">
                <span className="label-caps text-[10px]">Next action</span>
                <span className="text-sm">Prep systems-thinking story · Aug 21</span>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}