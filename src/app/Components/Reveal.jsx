"use client";

import { useReveal } from "./jobflow/OpportunityMap";

export default function Reveal({ children, delay = 0, className }) {
  const { ref, shown } = useReveal();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(14px)",
        transition:
          "opacity 400ms ease, transform 400ms cubic-bezier(0.22,1,0.36,1)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}