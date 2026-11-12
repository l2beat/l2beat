import { createContext, use, useLayoutEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
import { writeText } from '~/pages/blobs/components/live-blobs/liveMotion'
import { cn } from '~/utils/cn'
import { EASE_OUT_QUINT } from '~/utils/easing'

/** Shorter than a slot, so a count is over well before the next block */
const ROLL_MS = 700
/** A rewind rolls slower, so the reader sees the numbers go back */
const REWIND_ROLL_MS = 1300
const FLASH_MS = 1100

/** True while a reorg is being replayed: every number that moves then is the chain undoing itself */
export const RewindContext = createContext(false)

/**
 * A number that counts to each new value and washes its cell once, like a
 * quote on a trading screen. The wash says "this changed", not "this is good":
 * it has no direction, as a higher fee is not better or worse in itself.
 * Text is written straight to the element, so counting renders no React.
 */
export function Ticker({
  value,
  format,
  className,
}: {
  value: number | undefined
  format: (value: number) => string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const shown = useRef(value)
  const reducedMotion = usePrefersReducedMotion()
  const rewinding = use(RewindContext)

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    const from = shown.current
    if (value === undefined) {
      shown.current = undefined
      writeText(element, '—')
      return
    }
    if (from === undefined || from === value || reducedMotion) {
      shown.current = value
      writeText(element, format(value))
      if (from !== undefined && from !== value) flash(element, rewinding)
      return
    }
    if (format(from) !== format(value)) flash(element, rewinding)
    const duration = rewinding ? REWIND_ROLL_MS : ROLL_MS
    const start = performance.now()
    let frame = requestAnimationFrame(function step(now) {
      const t = Math.min(1, (now - start) / duration)
      const current = from + (value - from) * (1 - (1 - t) ** 3)
      shown.current = current
      writeText(element, format(current))
      if (t < 1) frame = requestAnimationFrame(step)
      else shown.current = value
    })
    return () => cancelAnimationFrame(frame)
  }, [value, format, reducedMotion, rewinding])

  return (
    <span
      ref={ref}
      className={cn(
        '-mx-0.5 rounded-[3px] px-0.5 font-mono slashed-zero tabular-nums',
        className,
      )}
    >
      {value === undefined ? '—' : format(value)}
    </span>
  )
}

function flash(element: HTMLElement, rewinding: boolean) {
  const color = rewinding
    ? 'color-mix(in oklab, var(--negative) 28%, transparent)'
    : 'color-mix(in oklab, var(--brand) 20%, transparent)'
  element.animate(
    [{ backgroundColor: color }, { backgroundColor: 'transparent' }],
    { duration: FLASH_MS, easing: EASE_OUT_QUINT },
  )
}
