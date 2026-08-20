"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUp, ArrowUpRight, Check } from "lucide-react";
import Logo from "./Logo";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#approach" },
      { label: "Analytics", href: "#analytics" },
      { label: "Journey", href: "#journey" },
      { label: "Workspace", href: "/dashboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Journal", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help center", href: "/help" },
      { label: "Status", href: "/status" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export default function SiteFooter() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <footer className="relative border-t border-border paper-grid">
      <div className="mx-auto w-11/12 px-5 sm:px-8">
        <div className="grid gap-14 py-16 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 max-w-xs text-base leading-relaxed text-muted-foreground">
              Every application is a journey forward. JobFlow keeps each step visible — from first
              save to offer.
            </p>
            <form
              className="mt-8"
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setJoined(true);
              }}
            >
              <label className="label-caps block" htmlFor="footer-email">
                The weekly pipeline · one email, Fridays
              </label>
              <div className="mt-3 flex items-center gap-2">
                <input
                  id="footer-email"
                  type="email"
                  required
                  suppressHydrationWarning
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-11 w-full min-w-0 flex-1 rounded-md border border-border bg-surface px-3.5 text-base placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
                />
                <button
                  type="submit"
                  disabled={joined}
                  className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-[0_1px_2px_rgba(0,0,0,0.18)] transition-transform duration-150 hover:-translate-y-px active:translate-y-0 disabled:cursor-default disabled:opacity-85"
                >
                  {joined ? <Check className="size-4" strokeWidth={2.25} /> : <ArrowUpRight className="size-4" strokeWidth={2} />}
                  {joined ? "Subscribed" : "Subscribe"}
                </button>
              </div>
            </form>
          </div>

          <nav
            className="grid grid-cols-2 gap-10 sm:grid-cols-3"
            aria-label="Footer navigation"
          >
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="label-caps text-xs text-foreground">{col.title}</p>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-base text-muted-foreground transition-colors duration-150 hover:text-foreground"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-border py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="label-caps text-xs">© {new Date().getFullYear()} JobFlow</p>
          <p className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            All systems moving forward
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="label-caps text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="label-caps text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms
            </Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors duration-150 hover:bg-surface hover:text-foreground"
            >
              Back to top <ArrowUp className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}