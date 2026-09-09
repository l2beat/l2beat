import type { ReactNode } from 'react'
import { cn } from '~/utils/cn'

/** Names the sky colour the root takes for overscroll - see globals.css. */
export type PageBackdropName = 'garden' | 'plot'

/**
 * A viewport-sized layer that follows the reader, for `SideNavLayout`'s
 * `backdrop` slot. Sticky rather than fixed so it scrolls away with the page;
 * the negative bottom margin gives back the height it takes up.
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
  return (
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
  )
}
