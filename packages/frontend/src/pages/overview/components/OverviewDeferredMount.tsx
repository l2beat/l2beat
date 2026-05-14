import { useEffect, useState, type ReactNode } from 'react'
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

  return ready ? children : fallback
}

/** Placeholders for overview columns 2–3 (Ethereum / Scaling + Interop). */
export function OverviewChartColumnsSkeleton() {
  return (
    <>
      <Skeleton className="min-h-[300px] w-full rounded-xl" />
      <Skeleton className="min-h-[400px] w-full rounded-xl" />
    </>
  )
}

export function OverviewTopChainsSkeleton() {
  return <Skeleton className="min-h-[260px] w-full rounded-xl" />
}
