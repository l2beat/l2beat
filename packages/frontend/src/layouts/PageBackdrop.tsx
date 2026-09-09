import type { ReactNode } from 'react'
import { cn } from '~/utils/cn'

/**
 * A viewport-sized layer that follows the reader, for `SideNavLayout`'s
 * `backdrop` slot. Sticky rather than fixed so it stays inside the content
 * column; the negative bottom margin gives back the height it takes up.
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
