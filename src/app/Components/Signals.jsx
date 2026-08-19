import Reveal from "./Reveal";
import SectionMark from "./SectionMark";

const SIGNALS = [
  { k: "Interview conversion", v: "40%", d: "Up 12 points across the last eight weeks." },
  { k: "Needs follow-up", v: "3", d: "Applications with no reply for over a week." },
  { k: "Strongest source", v: "Referral", d: "100% advance rate across 3 applications." },
];

export default function Signals() {
  return (
    <section id="analytics" className="border-b border-border">
      <div className="mx-auto w-11/12 px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <SectionMark n="04" title="Career signals" />
        </Reveal>
        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {SIGNALS.map((s, i) => (
            <Reveal key={s.k} delay={i * 80}>
              <div className="border-t border-foreground/80 pt-5">
                <p className="label-caps">{s.k}</p>
                <p className="num mt-4 text-5xl tracking-tight sm:text-6xl">{s.v}</p>
                <p className="mt-3 text-base text-muted-foreground">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="label-caps mt-12 text-[10px]">Demo content — your workspace starts empty</p>
        </Reveal>
      </div>
    </section>
  );
}