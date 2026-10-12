import { type ReactNode, useLayoutEffect, useRef, useState } from 'react'
import { cn } from '~/utils/cn'

const GAP = 14

/**
 * For drawings with no element per mark to hang the site's tooltip on. Fades
 * in, then follows the pointer without easing, which would only lag.
 */
export function PointerTooltip({
  x,
  y,
  containerWidth,
  interactive = false,
  children,
}: {
  /** Inside the drawing's box */
  x: number
  y: number
  containerWidth: number
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

/** Right, else left, else as far right as fits: on a phone neither side may have room */
function besidePointer(x: number, width: number, containerWidth: number) {
  if (x + GAP + width <= containerWidth) return x + GAP
  if (x - GAP - width >= 0) return x - GAP - width
  return Math.max(0, containerWidth - width)
}
