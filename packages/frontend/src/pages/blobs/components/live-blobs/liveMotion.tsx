import {
  type RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { cn } from '~/utils/cn'
import { usePrefersReducedMotion } from './hooks'

/** Long enough to read as counting, short enough to be done before the next block */
const ROLL_MS = 900
const POP_MS = 1600
const FLASH_MS = 1800
const REORDER_MS = 600
const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)'

/**
 * A number that counts its way to every new value instead of jumping, and
 * glows while it climbs. The text is written straight to the element, so a
 * frame of counting does not render React.
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
    if (value > from) {
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
 * Puts `text` in the element's own text node, and only when it changes.
 * `textContent` swaps in a new node, and an inserted node makes the page
 * check its `:has()` rules and lay out again, on every frame of a count.
 */
export function writeText(element: HTMLElement, text: string) {
  const node = element.firstChild
  if (node instanceof Text && node === element.lastChild) {
    if (node.data !== text) node.data = text
    return
  }
  element.textContent = text
}

/**
 * "+5" rising off a number when something new lands in it. A new `id`
 * starts it again, so every arrival gets its own.
 */
export function Pop({
  arrival,
  format = String,
  className,
}: {
  arrival: Arrival | undefined
  format?: (amount: number) => string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  useLayoutEffect(() => {
    if (!arrival || !ref.current) return
    ref.current.animate(
      reducedMotion
        ? [{ opacity: 1 }, { opacity: 1, offset: 0.7 }, { opacity: 0 }]
        : [
            { opacity: 0, transform: 'translateY(6px) scale(0.8)' },
            { opacity: 1, transform: 'translateY(0) scale(1)', offset: 0.15 },
            { opacity: 1, transform: 'translateY(-4px)', offset: 0.7 },
            { opacity: 0, transform: 'translateY(-12px)' },
          ],
      { duration: POP_MS, easing: 'ease-out', fill: 'forwards' },
    )
  }, [arrival, reducedMotion])
  return (
    <span
      ref={ref}
      aria-hidden
      className={cn(
        'pointer-events-none font-bold text-brand tabular-nums opacity-0',
        className,
      )}
    >
      {arrival && `+${format(arrival.amount)}`}
    </span>
  )
}

export interface Arrival {
  amount: number
  id: number
}

/** Washes `ref` in `color` and lets it fade, each time a new arrival comes */
export function useFlash(
  ref: RefObject<HTMLElement | null>,
  arrival: Arrival | undefined,
  color: string,
) {
  useEffect(() => {
    if (!arrival || !ref.current) return
    ref.current.animate([{ backgroundColor: color }, {}], {
      duration: FLASH_MS,
      easing: 'ease-out',
    })
  }, [ref, arrival, color])
}

/**
 * Slides rows to their new places when the order changes, instead of letting
 * them jump (FLIP: each row is drawn where it was and eased to where it is).
 * Rows are found by `data-flip-key`.
 */
export function useReorder(
  containerRef: RefObject<HTMLElement | null>,
  order: string,
) {
  const tops = useRef(new Map<string, number>())
  const reducedMotion = usePrefersReducedMotion()
  // biome-ignore lint/correctness/useExhaustiveDependencies: `order` is what moves the rows
  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return
    const next = new Map<string, number>()
    const rows = container.querySelectorAll<HTMLElement>('[data-flip-key]')
    for (const row of rows) {
      const key = row.dataset.flipKey
      if (key === undefined) continue
      // within the container, so scrolling the page between updates moves nothing
      const top = row.offsetTop
      next.set(key, top)
      const was = tops.current.get(key)
      if (reducedMotion || tops.current.size === 0) continue
      if (was === undefined) {
        row.animate([{ opacity: 0 }, {}], { duration: REORDER_MS })
      } else if (was !== top) {
        row.animate(
          [{ transform: `translateY(${was - top}px)` }, { transform: 'none' }],
          { duration: REORDER_MS, easing: EASE_OUT },
        )
      }
    }
    tops.current = next
  }, [containerRef, order, reducedMotion])
}

/** The time, in unix seconds, renewed every `everyMs` */
export function useNow(everyMs: number) {
  const [now, setNow] = useState(() => Date.now() / 1000)
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now() / 1000), everyMs)
    return () => clearInterval(timer)
  }, [everyMs])
  return now
}
