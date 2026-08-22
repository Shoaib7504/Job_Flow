import Reveal from "./Reveal";
import SectionMark from "./SectionMark";
import { BellRing, CalendarCheck, FolderKanban, Zap } from "lucide-react";

const BENEFITS = [
  {
    icon: BellRing,
    title: "Never forget a follow-up.",
    desc: "JobFlow automatically tracks application age and surfaces stagnant roles on your dashboard before opportunities go cold.",
  },
  {
    icon: FolderKanban,
    title: "Never lose an application.",
    desc: "Every job posting, salary range, recruiter contact, and note lives in a structured, searchable dossier.",
  },
  {
    icon: CalendarCheck,
    title: "Never miss an interview.",
    desc: "All recruiter screens, technical loops, and deadlines are centralized in a single timeline and calendar view.",
  },
  {
    icon: Zap,
    title: "Know exactly what to do next.",
    desc: "Your daily dashboard acts as your career operating system — telling you the single most urgent task every morning.",
  },
];

export default function Approach() {
  return (
    <section id="approach" className="border-b border-border bg-surface/40">
      <div className="mx-auto w-11/12 max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <Reveal>
          <SectionMark n="02" title="Concrete Benefits" />
        </Reveal>

        <Reveal>
          <h3 className="mt-8 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
            What JobFlow Saves You From Doing.
          </h3>
          <p className="mt-4 max-w-xl text-base text-muted-foreground">
            No more manual spreadsheet updating, lost email threads, or missed interview prep.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {BENEFITS.map((b, i) => {
            const Icon = b.icon;
            return (
              <Reveal key={b.title} delay={i * 60}>
                <div className="flex flex-col h-full rounded-xl border border-border bg-surface p-6 sm:p-8 transition-all hover:border-primary/40 hover:shadow-md">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-5">
                    <Icon className="size-6" />
                  </div>
                  <h4 className="font-display text-xl font-semibold tracking-tight text-foreground">
                    {b.title}
                  </h4>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground flex-1">
                    {b.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}