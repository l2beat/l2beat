import type { ReactNode } from 'react'
import { cn } from '~/utils/cn'

/**
 * A viewport-sized layer that follows the reader down the page, for
 * `SideNavLayout`'s `backdrop` slot. Sticky rather than fixed so it stays
 * inside the content column: it never paints under the nav, and it scrolls
 * away with the column instead of leaking into whatever comes after.
 *
 * The negative bottom margin gives back the height it takes up, so the page
 * content starts at the top as if the backdrop were not in the flow at all.
 */
export function PageBackdrop({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      aria-hidden
      className={cn(
        '-z-10 -mb-[100svh] pointer-events-none sticky top-0 h-svh overflow-hidden',
        className,
      )}
    >
      {children}
    </div>
  )
}
