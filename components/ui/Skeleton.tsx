import React from "react";

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function Skeleton({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200", className)}
      style={style}
    />
  );
}

export function TransactionSkeleton() {
  return (
    <div className="space-y-0">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-8 py-5 border-b border-slate-100">
          <Skeleton className="h-10 w-10 rounded-xl flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <Skeleton className="h-5 w-12 rounded-lg" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-9 w-20 rounded-xl" />
          <Skeleton className="h-9 w-20 rounded-xl" />
        </div>
      </div>

      {/* Main stats row */}
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 grid grid-cols-3 gap-6">
          <Skeleton className="col-span-2 h-[240px] rounded-3xl" />
          <div className="flex flex-col gap-6">
            <Skeleton className="h-[110px] rounded-3xl" />
            <Skeleton className="h-[110px] rounded-3xl" />
          </div>
        </div>
        <Skeleton className="col-span-12 lg:col-span-4 h-[240px] rounded-3xl" />
      </div>

      {/* Insights skeleton */}
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-12 gap-8">
        <Skeleton className="col-span-8 h-[350px] rounded-3xl" />
        <div className="col-span-4 space-y-6">
          <Skeleton className="h-[165px] rounded-3xl" />
          <Skeleton className="h-[165px] rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
