import { Skeleton } from '~/components/core/Skeleton'

export function RowsSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-7 w-full" />
      ))}
    </>
  )
}

export function BreakdownSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-2 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-7 w-full" />
      <Skeleton className="h-7 w-full" />
      <Skeleton className="h-7 w-full" />
    </div>
  )
}

export function EmptyState() {
  return (
    <div className="flex min-h-16 items-center justify-center font-medium text-secondary text-xs">
      No data.
    </div>
  )
}
