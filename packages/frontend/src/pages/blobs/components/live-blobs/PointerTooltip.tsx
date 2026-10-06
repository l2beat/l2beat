import type { ReactNode } from 'react'
import { cn } from '~/utils/cn'

const GAP = 14

/**
 * A tooltip that follows the pointer over a drawing, where there is no
 * element per mark to hang the site's own tooltip on. It sits beside the
 * pointer, on whichever side has room.
 */
export function PointerTooltip({
  x,
  y,
  containerWidth,
  children,
}: {
  /** Pointer position inside the drawing's box */
  x: number
  y: number
  containerWidth: number
  children: ReactNode
}) {
  const flip = x > containerWidth * 0.6
  return (
    <div
      className={cn(
        'pointer-events-none absolute z-10 w-max max-w-[260px] rounded-lg bg-surface-primary p-3 text-left font-medium text-paragraph-13 text-primary shadow-popover dark:bg-header-secondary',
      )}
      style={{
        left: flip ? undefined : x + GAP,
        right: flip ? containerWidth - x + GAP : undefined,
        top: y + GAP,
      }}
    >
      {children}
    </div>
  )
}
