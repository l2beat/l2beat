import { Skeleton } from '@l2beat/frontend'

export function Shapes() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-10 w-32 rounded-lg" />
    </div>
  )
}

export function TableRowPlaceholder() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="ml-auto h-4 w-20" />
        </div>
      ))}
    </div>
  )
}
