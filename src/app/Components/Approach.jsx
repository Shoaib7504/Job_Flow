import Reveal from "./Reveal";
import SectionMark from "./SectionMark";

const MODULES = [
  { name: "Applications", note: "Every role as an editorial dossier — stage, source, salary, next action." },
  { name: "Companies", note: "See how many roles, threads and people you have in play per company." },
  { name: "Interviews", note: "Loops, panels and recruiter screens attached to the role they belong to." },
  { name: "Reminders", note: "Follow-ups that surface on the day they matter, not two weeks later." },
  { name: "Calendar", note: "A single week view of everything scheduled across your search." },
  { name: "Analytics", note: "Response, interview and offer conversion — measured, not guessed." },
];

export default function Approach() {
  return (
    <section id="approach" className="border-b border-border bg-surface/40">
      <div className="mx-auto w-11/12 px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <SectionMark n="02" title="The JobFlow approach" />
        </Reveal>
        <Reveal>
          <h3 className="mt-10 max-w-2xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            One workspace. Every opportunity.
          </h3>
        </Reveal>
        <div className="mt-12 border-t border-border">
          {MODULES.map((m, i) => (
            <Reveal key={m.name} delay={i * 50}>
              <div className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 border-b border-border py-6 transition-colors duration-200 hover:bg-surface md:grid-cols-[auto_minmax(0,14rem)_minmax(0,1fr)]">
                <span className="num hidden text-xs text-muted-foreground md:block">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h4 className="font-display text-2xl font-medium tracking-tight transition-transform duration-200 group-hover:translate-x-1">
                  {m.name}
                </h4>
                <p className="col-span-full text-base text-muted-foreground md:col-span-1">
                  {m.note}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}