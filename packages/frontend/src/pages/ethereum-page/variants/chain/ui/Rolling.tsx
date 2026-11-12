import { useLayoutEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
import { writeText } from '~/pages/blobs/components/live-blobs/liveMotion'
import { cn } from '~/utils/cn'
import { REWIND_HOLD_MS, useRewind } from '../state/rewind'

const ROLL_MS = 650
const REWIND_ROLL_MS = 1100

/**
 * A number that counts to each new value. During a reorg it first holds the
 * replaced block's value, then rolls back to the replacement's in the rewind
 * blue, so the reader sees which numbers the reorg touched. Text goes straight
 * to the DOM, so counting renders no React.
 */
export function Rolling({
  value,
  format,
  className,
  placeholder = 'w-[5ch]',
}: {
  value: number | undefined
  format: (value: number) => string
  className?: string
  /** Width of the skeleton while the stream connects */
  placeholder?: string
}) {
  if (value === undefined) {
    return (
      <span
        aria-hidden
        className={cn(
          'inline-block h-[0.8em] animate-pulse rounded bg-primary/10 align-baseline',
          placeholder,
          className,
        )}
      />
    )
  }
  return <Counter value={value} format={format} className={className} />
}

function Counter({
  value,
  format,
  className,
}: {
  value: number
  format: (value: number) => string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const shown = useRef<number>(undefined)
  const reducedMotion = usePrefersReducedMotion()
  const { active } = useRewind()
  const rewindAt = active?.seenAt

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    const from = shown.current
    if (from === undefined || from === value || reducedMotion) {
      shown.current = value
      writeText(element, format(value))
      return
    }
    if (format(from) === format(value)) {
      shown.current = value
      return
    }
    const hold =
      rewindAt === undefined
        ? 0
        : Math.max(0, rewindAt + REWIND_HOLD_MS - Date.now())
    const rewinding = rewindAt !== undefined
    const duration = rewinding ? REWIND_ROLL_MS : ROLL_MS
    if (rewinding) {
      element.animate(
        [
          { color: 'var(--chart-ethereum)' },
          { color: 'var(--chart-ethereum)', offset: 0.75 },
          {},
        ],
        { duration: hold + duration + 600 },
      )
    }
    const start = performance.now() + hold
    let frame = requestAnimationFrame(function step(now) {
      const t = Math.min(1, Math.max(0, (now - start) / duration))
      const eased = rewinding ? easeInOut(t) : 1 - (1 - t) ** 3
      shown.current = from + (value - from) * eased
      writeText(element, format(shown.current))
      if (t < 1) frame = requestAnimationFrame(step)
    })
    return () => cancelAnimationFrame(frame)
  }, [value, format, reducedMotion, rewindAt])

  return <span ref={ref} className={cn('tabular-nums', className)} />
}

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2
}
