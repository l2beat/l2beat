import { cn } from '~/utils/cn'

/** A log scale between two powers of ten, given as their exponents */
export interface DecadeDomain {
  lo: number
  hi: number
}

/** The whole powers of ten around the positive values, at least one apart */
export function getDecadeDomain(values: number[]): DecadeDomain | undefined {
  const logs = values.filter((value) => value > 0).map(Math.log10)
  if (logs.length === 0) return undefined
  const lo = Math.floor(Math.min(...logs))
  return { lo, hi: Math.max(lo + 1, Math.ceil(Math.max(...logs))) }
}

export function getDecades({ lo, hi }: DecadeDomain) {
  return Array.from({ length: hi - lo + 1 }, (_, i) => lo + i)
}

/**
 * Where a value sits between two powers of ten on a log scale, from 0 to 1.
 * Rounded, because Math.log10 can differ in its last digit between the server
 * and a browser, which React reports as a hydration mismatch.
 */
export function logShare(value: number, { lo, hi }: DecadeDomain) {
  if (value <= 0) return 0
  const share = (Math.log10(value) - lo) / (hi - lo)
  return Math.round(Math.min(1, Math.max(0, share)) * 1e6) / 1e6
}

/** A line at every power of ten of the scale, across its parent */
export function DecadeGrid({
  domain,
  className = 'border-divider border-l border-dashed opacity-70',
}: {
  domain: DecadeDomain
  className?: string
}) {
  return getDecades(domain).map((power) => (
    <span
      key={power}
      className={cn('absolute inset-y-0', className)}
      style={{ left: `${logShare(10 ** power, domain) * 100}%` }}
    />
  ))
}
