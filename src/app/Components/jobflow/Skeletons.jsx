import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-fade">
      <div className="space-y-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-8 w-80 sm:w-96" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>

      {/* Stats row skeleton */}
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-surface px-5 py-6 space-y-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>

      {/* Next Action hero skeleton */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 space-y-4">
        <Skeleton className="h-4 w-32" />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2 w-full max-w-lg">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-10 w-32 shrink-0" />
        </div>
      </div>

      {/* Main content grid skeleton */}
      <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
        <div className="rounded-lg border border-border bg-surface p-6 space-y-6">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-48 w-full" />
        </div>
        <div className="space-y-8">
          <div className="rounded-lg border border-border bg-surface p-6 space-y-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="space-y-4 animate-fade">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center justify-between">
        <Skeleton className="h-10 w-full lg:w-72" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-16" />
        </div>
      </div>
      <div className="rounded-lg border border-border bg-surface divide-y divide-border">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-16 hidden md:block" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DossierSkeleton() {
  return (
    <div className="space-y-8 animate-fade">
      <div className="space-y-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="rounded-lg border border-border bg-surface p-6 space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-16 w-full" />
      </div>
      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}
