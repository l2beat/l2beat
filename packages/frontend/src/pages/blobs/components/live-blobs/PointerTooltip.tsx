import type { ReactNode } from 'react'
import { cn } from '~/utils/cn'

const GAP = 14

/**
 * A tooltip that follows the pointer over a drawing, where there is no
 * element per mark to hang the site's own tooltip on. It sits beside the
 * pointer, on whichever side has room. It fades in when it shows up, then
 * follows the pointer and changes at once: easing there would only lag.
 */
export function PointerTooltip({
  x,
  y,
  containerWidth,
  interactive = false,
  children,
}: {
  /** Pointer position inside the drawing's box */
  x: number
  y: number
  containerWidth: number
  /** Takes taps and clicks, rather than letting them through to the drawing */
  interactive?: boolean
  children: ReactNode
}) {
  const flip = x > containerWidth * 0.6
  return (
    <div
      className={cn(
        'absolute z-10 w-max max-w-[260px] rounded-lg bg-surface-primary p-3 text-left font-medium text-paragraph-13 text-primary starting:opacity-0 shadow-popover transition-opacity duration-150 ease-out dark:bg-header-secondary',
        !interactive && 'pointer-events-none',
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
