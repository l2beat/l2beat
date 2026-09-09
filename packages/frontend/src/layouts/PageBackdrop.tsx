import type { ReactNode } from 'react'
import { cn } from '~/utils/cn'

export type PageBackdropName = 'garden' | 'plot'

// The colours the scene meets the viewport edge with, top and bottom.
const EDGES: Record<PageBackdropName, { sky: string; ground: string }> = {
  garden: { sky: 'bg-garden-sky', ground: 'bg-garden-ground' },
  plot: { sky: 'bg-plot-sky', ground: 'bg-plot-ground' },
}

/**
 * A viewport-sized layer that follows the reader, for `SideNavLayout`'s
 * `backdrop` slot. Sticky rather than fixed so it scrolls away with the page;
 * the negative bottom margin gives back the height it takes up.
 *
 * Rubber-band overscroll drags fixed elements along with the page, so a strip
 * parked just outside the viewport slides into the exposed area: sky above,
 * ground below. The root background in globals.css covers browsers that do
 * not move fixed elements.
 */
export function PageBackdrop({
  name,
  children,
  className,
}: {
  name: PageBackdropName
  children: ReactNode
  className?: string
}) {
  const edges = EDGES[name]
  return (
    <>
      <div
        aria-hidden
        data-backdrop={name}
        className={cn(
          '-z-10 -mb-[100svh] pointer-events-none sticky top-0 h-svh overflow-hidden',
          className,
        )}
      >
        {children}
      </div>
      <div
        aria-hidden
        className={cn(
          '-top-[100svh] -z-10 pointer-events-none fixed inset-x-0 h-svh',
          edges.sky,
        )}
      />
      <div
        aria-hidden
        className={cn(
          '-bottom-[100svh] -z-10 pointer-events-none fixed inset-x-0 h-svh',
          edges.ground,
        )}
      />
    </>
  )
}
