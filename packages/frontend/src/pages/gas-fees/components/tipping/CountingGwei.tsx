import { useEffect, useRef } from 'react'
import { writeText } from '~/components/RollingNumber'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
import { formatGwei, splitLeadingZeros } from '../../utils/format'

const COUNT_MS = 600

/** A tip in gwei with its leading zeros dimmed, counting to each new value */
export function CountingGwei({ value }: { value: number }) {
  const zerosRef = useRef<HTMLSpanElement>(null)
  const digitsRef = useRef<HTMLSpanElement>(null)
  const shown = useRef(value)
  const reducedMotion = usePrefersReducedMotion()
  const [zeros, digits] = splitLeadingZeros(formatGwei(value))

  useEffect(() => {
    const from = shown.current
    if (from === value) return
    const write = (v: number) => {
      const [z, d] = splitLeadingZeros(formatGwei(v))
      if (zerosRef.current) writeText(zerosRef.current, z)
      if (digitsRef.current) writeText(digitsRef.current, d)
    }
    if (reducedMotion) {
      write(value)
      shown.current = value
      return
    }
    const start = performance.now()
    let frame = 0
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT_MS)
      const eased = 1 - (1 - t) ** 3
      // Tips span decades, so they count in ratios
      const v =
        from > 0 && value > 0
          ? from * (value / from) ** eased
          : from + (value - from) * eased
      write(v)
      shown.current = v
      if (t < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [value, reducedMotion])

  return (
    <span className="font-bold text-2xl tabular-nums leading-none">
      <span ref={zerosRef} className="text-secondary/60">
        {zeros}
      </span>
      <span ref={digitsRef}>{digits}</span>
    </span>
  )
}
