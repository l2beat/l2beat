import { type ReactNode, useLayoutEffect, useRef, useState } from 'react'
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
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  // measured before paint, so it never shows on a side it does not fit
  useLayoutEffect(() => {
    if (ref.current) setWidth(ref.current.offsetWidth)
  })

  return (
    <div
      ref={ref}
      className={cn(
        'absolute z-10 w-max max-w-[260px] rounded-lg bg-surface-primary p-3 text-left font-medium text-paragraph-13 text-primary starting:opacity-0 shadow-popover transition-opacity duration-150 ease-out dark:bg-header-secondary',
        !interactive && 'pointer-events-none',
      )}
      style={{ left: besidePointer(x, width, containerWidth), top: y + GAP }}
    >
      {children}
    </div>
  )
}

/**
 * Right of the pointer where the tooltip fits, else left of it, else as far
 * right as it fits: on a phone the drawing can be narrower than the pointer's
 * gap and the tooltip together on either side
 */
function besidePointer(x: number, width: number, containerWidth: number) {
  if (x + GAP + width <= containerWidth) return x + GAP
  if (x - GAP - width >= 0) return x - GAP - width
  return Math.max(0, containerWidth - width)
}
