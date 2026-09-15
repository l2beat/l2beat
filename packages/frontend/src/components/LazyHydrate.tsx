import type { ReactNode } from 'react'
import { useIsNearViewport } from '~/hooks/useIsNearViewport'

interface Props {
  children: ReactNode
  /** Hydrate immediately, for content that must run effects on load. */
  eager?: boolean
  className?: string
}

/**
 * Keeps the server-rendered markup in place and mounts the React tree only
 * once the wrapper approaches the viewport. Until then React hydrates an
 * element with no children and leaves the existing innerHTML alone, so
 * below-the-fold sections cost nothing on the hydration task.
 *
 * Not a Suspense boundary on purpose: React client-renders a boundary it has
 * not hydrated yet as soon as any context above it changes, and next-themes
 * does that right after mount. That would drop the server markup or force
 * every section to hydrate at once.
 */
export function LazyHydrate({ children, eager = false, className }: Props) {
  const [ref, isNear] = useIsNearViewport()
  const isServer = typeof window === 'undefined'

  if (isServer || eager || isNear) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  }
  return (
    <div
      ref={ref}
      className={className}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: '' }}
    />
  )
}
