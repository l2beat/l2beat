import { type RefObject, useEffect, useLayoutEffect, useRef } from 'react'
import { PINNED_CELL_ATTRIBUTE } from '~/components/table/utils/commonPinningStyles'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
import { cn } from '~/utils/cn'
import { toRgba } from '~/utils/color'
import { EASE_OUT_QUINT } from '~/utils/easing'

/** Long enough to read as counting, short enough to be done before the next block */
const ROLL_MS = 900
const POP_MS = 1400
const POP_IN = 0.1
const POP_OUT = 0.8
const POP_IN_MS = POP_IN * POP_MS
const POP_OUT_MS = POP_OUT * POP_MS
const FLASH_MS = 1800

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

/** One "+5" per block: a later batch of the block on show adds to it rather than popping again */
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
          { opacity: 0, easing: EASE_OUT_QUINT },
          { opacity: 1, offset: POP_IN },
          { opacity: 1, offset: POP_OUT, easing: EASE_OUT_QUINT },
          { opacity: 0 },
        ]
      : [
          {
            opacity: 0,
            transform: 'translateY(4px) scale(0.9)',
            easing: EASE_OUT_QUINT,
          },
          { opacity: 1, transform: 'none', offset: POP_IN },
          {
            opacity: 1,
            transform: 'translateY(-3px)',
            offset: POP_OUT,
            easing: EASE_OUT_QUINT,
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
        'pointer-events-none font-bold text-brand-deep tabular-nums opacity-0',
        className,
      )}
    >
      {arrival && `+${format(arrival.amount)}`}
    </span>
  )
}

/** A new object each landing, so effects keyed on it fire */
export interface Arrival {
  /** All that landed of the block so far */
  amount: number
  slot: number
}

const FLASH_STRENGTH = 0.22
/** Spelled out again in `FLASH_CLASS_NAME`, for Tailwind to find */
const FLASH_COLOR_VARIABLE = '--live-flash'

/** Pinned cells are opaque and stacked over the row, so each needs a wash of its own */
export const FLASH_CLASS_NAME =
  "after:pointer-events-none after:absolute after:inset-0 after:bg-(--live-flash) after:opacity-0 after:content-['']"

/**
 * Only the wash's opacity moves, which the compositor runs without repainting:
 * easing the row's shadow or background repaints it and its masked pinned
 * cells every frame, which in Safari stalls a swipe on the belt. One wash per
 * row, as a row background painted cell by cell shows seams on fractional pixels
 */
export function useFlash(
  ref: RefObject<HTMLElement | null>,
  arrival: Arrival | undefined,
  color: string,
) {
  useEffect(() => {
    const row = ref.current
    if (!arrival || !row) return
    row.style.setProperty(FLASH_COLOR_VARIABLE, toRgba(color, FLASH_STRENGTH))
    const washed = [row, ...row.querySelectorAll(`[${PINNED_CELL_ATTRIBUTE}]`)]
    for (const element of washed) {
      element.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: FLASH_MS,
        easing: 'ease-out',
        pseudoElement: '::after',
      })
    }
  }, [ref, arrival, color])
}
