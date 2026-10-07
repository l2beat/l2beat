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
/** A "+5" is in within its first tenth, read until four fifths in, then gone */
const POP_MS = 1400
const POP_IN = 0.1
const POP_OUT = 0.8
const POP_IN_MS = POP_IN * POP_MS
const POP_OUT_MS = POP_OUT * POP_MS
const FLASH_MS = 1800
const REORDER_MS = 600
/** A row new to the table, which has nowhere to slide from, fades in this fast */
const ENTER_MS = 300
const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)'

/**
 * A number that counts its way to every new value instead of jumping, and
 * glows while it climbs, as long as what it shows climbs too: a share that
 * stays 36.2% must not light up. The text is written straight to the element,
 * so a frame of counting does not render React.
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
 * "+5" rising off a number when something new lands in it, one per block: a
 * later batch of the block on show adds to it and keeps it up, rather than
 * popping it again.
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
  const shown = useRef<{ slot: number; animation: Animation }>(undefined)
  useLayoutEffect(() => {
    if (!arrival || !ref.current) return
    const last = shown.current
    const at = last?.animation.currentTime
    if (
      last?.slot === arrival.slot &&
      typeof at === 'number' &&
      at < POP_OUT_MS
    ) {
      // back to the start of its stay, if it was further in
      last.animation.currentTime = Math.min(at, POP_IN_MS)
      return
    }
    // Eased step by step: one curve over the whole would rush the way in and
    // drag out the way out, leaving a faint "+5" hanging about
    const keyframes = reducedMotion
      ? [
          { opacity: 0, easing: EASE_OUT },
          { opacity: 1, offset: POP_IN },
          { opacity: 1, offset: POP_OUT, easing: EASE_OUT },
          { opacity: 0 },
        ]
      : [
          {
            opacity: 0,
            transform: 'translateY(4px) scale(0.9)',
            easing: EASE_OUT,
          },
          { opacity: 1, transform: 'none', offset: POP_IN },
          {
            opacity: 1,
            transform: 'translateY(-3px)',
            offset: POP_OUT,
            easing: EASE_OUT,
          },
          { opacity: 0, transform: 'translateY(-8px)' },
        ]
    shown.current = {
      slot: arrival.slot,
      animation: ref.current.animate(keyframes, {
        duration: POP_MS,
        fill: 'forwards',
      }),
    }
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

/** What a number got as a batch landed. A new one each landing, to show it */
export interface Arrival {
  /** All that landed of the block so far */
  amount: number
  /** The block it came in */
  slot: number
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
        row.animate([{ opacity: 0 }, {}], {
          duration: ENTER_MS,
          easing: EASE_OUT,
        })
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

/** Renders again every `everyMs`, for what counts up between blocks */
export function useTick(everyMs: number) {
  const [, setTick] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setTick((tick) => tick + 1), everyMs)
    return () => clearInterval(timer)
  }, [everyMs])
}
