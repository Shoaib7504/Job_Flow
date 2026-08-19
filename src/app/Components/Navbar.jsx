"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Product", href: "#approach" },
  { label: "Analytics", href: "#analytics" },
  { label: "Journey", href: "#journey" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 mx-auto w-11/12 rounded-xl border-b border-border bg-background/85 shadow-sm backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-5 sm:px-8">
        <Link href="/">
          <span className={cn("flex items-center gap-2")}>
            <span className="grid size-6 place-items-center rounded-[6px] bg-primary">
              <span className="block size-1.5 rounded-full bg-primary-foreground" />
            </span>
            <span className="font-display text-[15px] font-semibold tracking-tight">
              JobFlow
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="label-caps hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/auth"
            className="hidden rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground sm:block"
          >
            Log in
          </Link>
          <Link
            href="/dashboard"
            className="hidden rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-transform duration-150 hover:-translate-y-px active:translate-y-0 sm:inline-flex"
          >
            Register
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex size-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="flex flex-col px-5 py-4 sm:px-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="label-caps py-3 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
              <Link
                href="/auth"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Log in
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="rounded-md bg-primary px-3.5 py-2 text-center text-sm font-medium text-primary-foreground"
              >
                Register
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;