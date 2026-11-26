import { useLayoutEffect, useRef } from 'react'
import { writeText } from '~/components/RollingNumber'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
import { cn } from '~/utils/cn'
import { formatSignificant } from './metrics'

/** Our estimate is ink, and what is paid above it is brand pink */
export const OURS = 'var(--primary)'
export const OVER = 'var(--brand)'

/** Ordinary tips by size, smallest first, as the backend groups them */
export const TIP_BANDS = [
  {
    key: 'low',
    label: 'Under 0.1 gwei',
    color: 'var(--chart-stacked-blue)',
    text: 'text-white',
    maxGwei: 0.1,
  },
  {
    key: 'middle',
    label: '0.1 to 1 gwei',
    color: 'var(--chart-stacked-purple)',
    text: 'text-white',
    maxGwei: 1,
  },
  {
    key: 'high',
    label: '1 to 2.5 gwei',
    color: 'var(--chart-stacked-pink)',
    text: 'text-black',
    maxGwei: Number.POSITIVE_INFINITY,
  },
] as const

export const formatGwei = (value: number) => formatSignificant(value, 2)

export const formatMultiple = (value: number) =>
  `${Number(value.toPrecision(2)).toLocaleString('en-US')}×`

/** "0.0000093" → the zeros, then the digits that matter */
function splitZeros(text: string): [string, string] {
  const match = text.match(/^(0\.0*)(\d.*)$/)
  return match ? [match[1] ?? '', match[2] ?? ''] : ['', text]
}

/** A gwei value with its leading zeros dimmed, so 0.0000093 reads as 93 */
export function Gwei({
  value,
  zerosClassName = 'opacity-35',
}: {
  value: number
  zerosClassName?: string
}) {
  const [zeros, digits] = splitZeros(formatGwei(value))
  return (
    <span className="tabular-nums">
      <span className={zerosClassName}>{zeros}</span>
      {digits}
    </span>
  )
}

/** Gwei that counts to each new value, as RollingNumber does */
export function RollingGwei({ value }: { value: number }) {
  const zerosRef = useRef<HTMLSpanElement>(null)
  const digitsRef = useRef<HTMLSpanElement>(null)
  const shown = useRef(value)
  const reducedMotion = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const zeros = zerosRef.current
    const digits = digitsRef.current
    if (!zeros || !digits) return
    const write = (v: number) => {
      const [z, d] = splitZeros(formatGwei(v))
      writeText(zeros, z)
      writeText(digits, d)
    }
    const from = shown.current
    if (from === value || reducedMotion) {
      shown.current = value
      write(value)
      return
    }
    const start = performance.now()
    // On a log scale: tips move by powers of ten, not by steps
    const logFrom = Math.log(Math.max(from, 1e-12))
    const logTo = Math.log(Math.max(value, 1e-12))
    let frame = requestAnimationFrame(function step(now) {
      const t = Math.min(1, (now - start) / 900)
      shown.current =
        t === 1
          ? value
          : Math.exp(logFrom + (logTo - logFrom) * (1 - (1 - t) ** 3))
      write(shown.current)
      if (t < 1) frame = requestAnimationFrame(step)
    })
    return () => cancelAnimationFrame(frame)
  }, [value, reducedMotion])

  return (
    <span className="tabular-nums">
      <span ref={zerosRef} className="opacity-35" />
      <span ref={digitsRef} />
    </span>
  )
}

export function WalletIcon({
  src,
  className,
}: {
  src: string
  className?: string
}) {
  return (
    <img
      src={src}
      alt=""
      width={16}
      height={16}
      className={cn('size-4 shrink-0 rounded-xs', className)}
    />
  )
}
