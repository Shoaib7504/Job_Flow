"use client";

import { cn } from "@/lib/utils";

export function Dialog({ open, onOpenChange, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        aria-hidden
        onClick={() => onOpenChange?.(false)}
        className="absolute inset-0 animate-fade bg-foreground/25 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-lg animate-rise rounded-lg border border-border bg-popover shadow-2xl"
      >
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ children, className }) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

export function DialogHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="font-display text-xl font-semibold tracking-tight">{children}</h2>;
}

export function DialogFooter({ children, className }) {
  return <div className={cn("flex justify-end gap-2", className)}>{children}</div>;
}