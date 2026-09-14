import type { ReactNode } from 'react'
import { useIsNearViewport } from '~/hooks/useIsNearViewport'

interface Props {
  children: ReactNode
  /** Hydrate immediately, for content that must run effects on load. */
  eager?: boolean
}

/**
 * Keeps the server-rendered markup in place and mounts the React tree only
 * once the wrapper approaches the viewport. Until then React hydrates an
 * element with no children and leaves the existing innerHTML alone, so
 * below-the-fold sections cost nothing on the hydration task.
 */
export function LazyHydrate({ children, eager = false }: Props) {
  const [ref, isNear] = useIsNearViewport()
  const isServer = typeof window === 'undefined'

  if (isServer || eager || isNear) {
    return <div ref={ref}>{children}</div>
  }
  return (
    <div
      ref={ref}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: '' }}
    />
  )
}
