"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

function getSnapshot() {
  return (
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );
}

function getServerSnapshot() {
  return false;
}

function subscribe(callback) {
  window.addEventListener("theme-change", callback);
  return () => window.removeEventListener("theme-change", callback);
}

function toggleTheme() {
  const next = !getSnapshot();
  document.documentElement.classList.toggle("dark", next);
  localStorage.setItem("theme", next ? "dark" : "light");
  window.dispatchEvent(new Event("theme-change"));
}

export function ThemeToggle({ className }) {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={
        "inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground " +
        (className ?? "")
      }
    >
      {dark ? (
        <Sun className="size-5" strokeWidth={1.75} />
      ) : (
        <Moon className="size-5" strokeWidth={1.75} />
      )}
      <span className="whitespace-nowrap">{dark ? "Light Mode" : "Dark Mode"}</span>
    </button>
  );
}