"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Briefcase,
  CalendarDays,
  Command,
  Kanban,
  LayoutDashboard,
  Moon,
  PlusCircle,
  Search,
  Settings,
  Sun,
  Sparkles,
  ArrowRight,
  X,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useStore } from "@/lib/store";
import { useAppShell } from "@/app/Components/jobflow/AppShell";
import { STAGE_META } from "@/lib/jobflow";
import { cn } from "@/lib/utils";

export function CommandPalette({ open, onOpenChange }) {
  const router = useRouter();
  const { apps, loadSampleWorkspace } = useStore();
  const { openAddModal } = useAppShell();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Global Actions & Commands
  const actions = useMemo(
    () => [
      {
        id: "add-app",
        title: "+ Add New Application",
        category: "Actions",
        icon: PlusCircle,
        perform: () => {
          onOpenChange(false);
          openAddModal();
        },
      },
      {
        id: "load-sample",
        title: "⚡ Load Sample Workspace Data",
        category: "Actions",
        icon: Sparkles,
        perform: () => {
          loadSampleWorkspace();
          onOpenChange(false);
        },
      },
      {
        id: "nav-dash",
        title: "Go to Dashboard",
        category: "Navigation",
        icon: LayoutDashboard,
        perform: () => {
          router.push("/dashboard");
          onOpenChange(false);
        },
      },
      {
        id: "nav-apps",
        title: "Go to Applications",
        category: "Navigation",
        icon: Briefcase,
        perform: () => {
          router.push("/applications");
          onOpenChange(false);
        },
      },
      {
        id: "nav-pipe",
        title: "Go to Pipeline Kanban",
        category: "Navigation",
        icon: Kanban,
        perform: () => {
          router.push("/pipeline");
          onOpenChange(false);
        },
      },
      {
        id: "nav-cal",
        title: "Go to Calendar",
        category: "Navigation",
        icon: CalendarDays,
        perform: () => {
          router.push("/calendar");
          onOpenChange(false);
        },
      },
      {
        id: "nav-analytics",
        title: "Go to Analytics",
        category: "Navigation",
        icon: BarChart3,
        perform: () => {
          router.push("/analytics");
          onOpenChange(false);
        },
      },
      {
        id: "nav-settings",
        title: "Go to Settings",
        category: "Navigation",
        icon: Settings,
        perform: () => {
          router.push("/settings");
          onOpenChange(false);
        },
      },
    ],
    [router, onOpenChange, openAddModal, loadSampleWorkspace],
  );

  // Filtered Applications matching query
  const matchingApps = useMemo(() => {
    if (!query.trim()) return apps.slice(0, 4);
    const q = query.toLowerCase();
    return apps.filter(
      (a) => a.company.toLowerCase().includes(q) || a.role.toLowerCase().includes(q),
    );
  }, [apps, query]);

  // Combined List
  const filteredActions = useMemo(() => {
    if (!query.trim()) return actions;
    const q = query.toLowerCase();
    return actions.filter((a) => a.title.toLowerCase().includes(q));
  }, [actions, query]);

  const totalItems = filteredActions.length + matchingApps.length;

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % Math.max(1, totalItems));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => (i - 1 + totalItems) % Math.max(1, totalItems));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex < filteredActions.length) {
        filteredActions[selectedIndex]?.perform();
      } else {
        const app = matchingApps[selectedIndex - filteredActions.length];
        if (app) {
          router.push(`/applications/${app.id}`);
          onOpenChange(false);
        }
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-xl border border-border bg-popover shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3 bg-surface">
          <Search className="size-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or search applications (e.g. Acme, Linear)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="num hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-surface-2 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            Esc
          </kbd>
        </div>

        <div className="max-h-[340px] overflow-y-auto p-2 divide-y divide-border/40">
          {/* Global Commands */}
          {filteredActions.length > 0 && (
            <div className="space-y-1 pb-2">
              <p className="label-caps px-3 py-1 text-[10px] text-muted-foreground">Commands & Navigation</p>
              {filteredActions.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = selectedIndex === idx;
                return (
                  <button
                    key={item.id}
                    onClick={item.perform}
                    className={cn(
                      "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md text-xs transition-colors cursor-pointer text-left",
                      isSelected ? "bg-primary text-primary-foreground font-medium" : "hover:bg-surface-2 text-foreground",
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className="size-4 shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </div>
                    <ArrowRight className={cn("size-3.5 shrink-0 opacity-70", isSelected && "opacity-100")} />
                  </button>
                );
              })}
            </div>
          )}

          {/* Dossiers / Applications */}
          {matchingApps.length > 0 && (
            <div className="space-y-1 pt-2">
              <p className="label-caps px-3 py-1 text-[10px] text-muted-foreground">Application Dossiers</p>
              {matchingApps.map((app, idx) => {
                const itemIdx = filteredActions.length + idx;
                const isSelected = selectedIndex === itemIdx;
                const meta = STAGE_META[app.stage] || STAGE_META.SAVED;
                return (
                  <button
                    key={app.id}
                    onClick={() => {
                      router.push(`/applications/${app.id}`);
                      onOpenChange(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md text-xs transition-colors cursor-pointer text-left",
                      isSelected ? "bg-primary text-primary-foreground font-medium" : "hover:bg-surface-2 text-foreground",
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{app.company}</span>
                        <span className="opacity-75 truncate">— {app.role}</span>
                      </div>
                    </div>
                    <span className={cn("label-caps text-[9px] px-1.5 py-0.5 rounded border shrink-0", isSelected ? "border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground" : meta.badge)}>
                      {meta.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {totalItems === 0 && (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No matching commands or applications found for &quot;{query}&quot;.
            </div>
          )}
        </div>

        <div className="border-t border-border bg-surface-2/40 px-4 py-2 flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="flex items-center gap-2">
            <kbd className="num rounded border border-border px-1 py-0.5 bg-surface text-[10px]">↑↓</kbd> navigate
            <kbd className="num rounded border border-border px-1 py-0.5 bg-surface text-[10px]">↵</kbd> select
          </span>
          <span className="flex items-center gap-1 font-mono text-[10px]">
            <Command className="size-3" /> + K
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
