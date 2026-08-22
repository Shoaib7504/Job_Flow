"use client";

import { createContext, useContext, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Briefcase,
  CalendarDays,
  Kanban,
  LayoutDashboard,
  PlusCircle,
  Search,
  Settings,
  User,
  LogOut,
} from "lucide-react";
import Logo from "@/app/Components/Logo";
import RequireAuth from "@/app/Components/RequireAuth";
import { ThemeToggle } from "@/app/Components/jobflow/ThemeToggle";
import { AddApplicationModal } from "@/app/Components/jobflow/AddApplicationModal";
import { useAuth, useLogout } from "@/hooks/use-auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const AppShellContext = createContext({
  openAddModal: () => {},
});

export const useAppShell = () => useContext(AppShellContext);

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Applications", href: "/applications", icon: Briefcase },
  { label: "Pipeline", href: "/pipeline", icon: Kanban },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

const MOBILE_NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Applications", href: "/applications", icon: Briefcase },
  { label: "Pipeline", href: "/pipeline", icon: Kanban },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
];

export function AppShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const logoutMutation = useLogout();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => toast.success("Signed out — see you soon."),
      onError: (err) => toast.error(err.message ?? "Could not sign out."),
      onSettled: () => logout(),
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/applications?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <RequireAuth>
      <AppShellContext.Provider value={{ openAddModal: () => setAddModalOpen(true) }}>
        <SidebarProvider>
          <Sidebar collapsible="icon">
            <SidebarHeader className="border-b border-sidebar-border px-2 py-3">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="JobFlow">
                    <Link href="/">
                      <Logo wordmark={false} link={false} />
                      <span className="font-display font-semibold tracking-tight">JobFlow</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel className="label-caps text-[10px]">Workspace</SidebarGroupLabel>
                <SidebarMenu>
                  {NAV.map((item) => {
                    const Icon = item.icon;
                    const active =
                      pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          tooltip={item.label}
                          className={cn(
                            "gap-2.5 px-3 transition-colors duration-150",
                            active && "font-medium text-sidebar-accent-foreground bg-sidebar-accent",
                          )}
                        >
                          <Link href={item.href}>
                            <Icon className="size-4" strokeWidth={1.75} />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border p-2">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setAddModalOpen(true)}
                    tooltip="Add Application"
                    className="gap-2.5 bg-primary px-3 py-2 font-medium text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground cursor-pointer shadow-sm transition-transform active:translate-y-0"
                  >
                    <PlusCircle className="size-4 shrink-0" strokeWidth={2} />
                    <span>New Application</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
          </Sidebar>

          <SidebarInset className="pb-16 md:pb-0">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md">
              <SidebarTrigger />
              <Logo className="md:hidden" />

              {/* Quick Search Bar */}
              <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-xs max-w-xs w-full transition-colors focus-within:border-primary/40">
                <Search className="size-3.5 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none w-full placeholder:text-muted-foreground"
                />
              </form>

              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm transition-transform hover:-translate-y-px active:translate-y-0"
                >
                  <PlusCircle className="size-3.5" />
                  <span className="hidden xs:inline">+ Add</span>
                </button>

                <ThemeToggle />

                {user && (
                  <button
                    type="button"
                    onClick={handleLogout}
                    title="Log out"
                    aria-label="Log out"
                    className="rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
                  >
                    <LogOut className="size-4" />
                  </button>
                )}
              </div>
            </header>

            {/* Main Content Area */}
            <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-8 lg:px-10">
              {children}
            </main>

            {/* Mobile Bottom Navigation Bar (md:hidden) */}
            <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-16 border-t border-border bg-background/95 backdrop-blur md:hidden items-center justify-around px-2">
              {MOBILE_NAV.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 py-1 px-3 text-[11px] font-medium transition-colors",
                      active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className={cn("size-5", active && "stroke-[2.25]")} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Global Add Application Modal */}
            <AddApplicationModal open={addModalOpen} onOpenChange={setAddModalOpen} />
          </SidebarInset>
        </SidebarProvider>
      </AppShellContext.Provider>
    </RequireAuth>
  );
}

export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <header className="mb-8">
      {eyebrow && <p className="label-caps animate-rise">{eyebrow}</p>}
      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {actions}
      </div>
      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </header>
  );
}