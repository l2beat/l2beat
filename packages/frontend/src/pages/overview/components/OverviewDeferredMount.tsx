import { type ReactNode, useEffect, useState } from 'react'
import { Skeleton } from '~/components/core/Skeleton'

/**
 * Renders `fallback` on SSR and the first client paint, then mounts `children`
 * after idle time so heavy DB-backed charts do not block initial paint.
 */
export function OverviewDeferredMount({
  fallback,
  children,
}: {
  fallback: ReactNode
  children: ReactNode
}) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const idle = window.requestIdleCallback?.(
      () => {
        setReady(true)
      },
      { timeout: 600 },
    )
    if (idle !== undefined) {
      return () => window.cancelIdleCallback?.(idle)
    }
    const timeout = window.setTimeout(() => setReady(true), 1)
    return () => clearTimeout(timeout)
  }, [])

  return ready ? <div className="contents">{children}</div> : fallback
}

/** Placeholders for overview columns 2–3 (Scaling / Ethereum + Interop). */
export function OverviewChartColumnsSkeleton() {
  return (
    <div className="contents">
      <div className="flex h-full min-h-0 min-w-0 flex-col gap-4 xl:gap-6">
        <Skeleton className="min-h-0 flex-1 w-full rounded-xl" />
        <Skeleton className="min-h-0 flex-1 w-full rounded-xl" />
      </div>
      <Skeleton className="h-full min-h-[400px] w-full rounded-xl" />
    </div>
  )
}

export function OverviewTopChainsSkeleton() {
  return <OverviewTablesSkeleton />
}

export function OverviewTablesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
      <Skeleton className="min-h-[280px] w-full rounded-xl" />
      <Skeleton className="min-h-[280px] w-full rounded-xl" />
    </div>
  )
}
