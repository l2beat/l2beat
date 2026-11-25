import { useLayoutEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
import { cn } from '~/utils/cn'

/** Long enough to read as counting, short enough to be done before the next block */
const ROLL_MS = 900

/**
 * Counts up to each new value and glows only if the formatted text climbs too:
 * a share that stays 36.2% must not light up. Text is written straight to the
 * element, so counting does not render React.
 */
export function RollingNumber({
  value,
  format,
  className,
}: {
  value: number
  format: (value: number) => string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const shown = useRef(value)
  const reducedMotion = usePrefersReducedMotion()

  // before paint, so the first value never shows blank
  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    const from = shown.current
    if (from === value || reducedMotion) {
      shown.current = value
      writeText(element, format(value))
      return
    }
    if (value > from && format(value) !== format(from)) {
      element.animate([{ color: 'var(--brand)' }, {}], {
        duration: ROLL_MS * 1.5,
        easing: 'ease-out',
      })
    }
    const start = performance.now()
    let frame = requestAnimationFrame(function step(now) {
      const t = Math.min(1, (now - start) / ROLL_MS)
      shown.current = from + (value - from) * (1 - (1 - t) ** 3)
      writeText(element, format(shown.current))
      if (t < 1) frame = requestAnimationFrame(step)
    })
    return () => cancelAnimationFrame(frame)
  }, [value, format, reducedMotion])

  return <span ref={ref} className={cn('tabular-nums', className)} />
}

/**
 * `textContent` swaps in a new node, and an inserted node makes the page
 * recheck its `:has()` rules and lay out again, on every frame of a count.
 */
export function writeText(element: HTMLElement, text: string) {
  const node = element.firstChild
  if (node instanceof Text && node === element.lastChild) {
    if (node.data !== text) node.data = text
    return
  }
  element.textContent = text
}
