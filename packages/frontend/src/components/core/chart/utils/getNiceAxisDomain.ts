import type { NumberDomain } from 'recharts'

/**
 * What counts as a round step depends on the unit the ticks are formatted in:
 * - `decimal`: counts and currencies, 1, 1.5, 2, 2.5, 3, 4, 5, 6 or 8 times a
 *   power of ten ($5B, $10B, 150 UOPS)
 * - `binary`: bytes, 1 or 1.5 times a power of two (256 MiB, 768 MiB, 1 GiB)
 * - `duration`: seconds, whole clock units (30s, 2m 30s, 15m, 6h, 1d)
 */
export type NiceTickScale = 'decimal' | 'binary' | 'duration'

const DECIMAL_MULTIPLES = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8]
const BINARY_MULTIPLES = [1, 1.5]

const MINUTE = 60
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const MAX_DURATION_STEP = 30 * DAY
const DURATION_STEPS = [
  1,
  2,
  5,
  10,
  15,
  30,
  MINUTE,
  1.5 * MINUTE,
  2 * MINUTE,
  2.5 * MINUTE,
  5 * MINUTE,
  10 * MINUTE,
  15 * MINUTE,
  20 * MINUTE,
  30 * MINUTE,
  HOUR,
  1.5 * HOUR,
  2 * HOUR,
  3 * HOUR,
  4 * HOUR,
  6 * HOUR,
  12 * HOUR,
  DAY,
  2 * DAY,
  3 * DAY,
  7 * DAY,
  14 * DAY,
  MAX_DURATION_STEP,
]

/**
 * Widens the data domain so that `tickCount` evenly spaced ticks all land on
 * round values and the top tick sits at or above the data. Recharts' own nice
 * ticks allow any step in 0.05 increments, which gives labels like $6.5B,
 * $13B, $19.5B. Pair with {@link getEvenTicks}, since Recharts would round
 * steps like 256 MiB to its own increments.
 */
export function getNiceAxisDomain(
  [min, max]: NumberDomain,
  tickCount: number,
  {
    startAtZero,
    scale = 'decimal',
  }: { startAtZero: boolean; scale?: NiceTickScale },
): NumberDomain {
  const lower = startAtZero ? Math.min(0, min) : min
  const intervals = tickCount - 1
  if (
    !Number.isFinite(lower) ||
    !Number.isFinite(max) ||
    max <= lower ||
    intervals < 1
  ) {
    return [lower, max]
  }

  const roughStep = (max - lower) / intervals
  for (const step of getCandidateSteps(roughStep, scale)) {
    const niceMin = round(Math.floor(lower / step) * step)
    const niceMax = round(niceMin + step * intervals)
    if (niceMax >= max) return [niceMin, niceMax]
  }
  return [lower, max]
}

/** `tickCount` ticks spread evenly over the domain, ends included. */
export function getEvenTicks([min, max]: NumberDomain, tickCount: number) {
  const step = (max - min) / (tickCount - 1)
  return Array.from({ length: tickCount }, (_, i) => round(min + i * step))
}

// Ascending steps from a bit below the rough step up to well above it, so
// the first one that covers the data once snapped to its grid wins.
function getCandidateSteps(roughStep: number, scale: NiceTickScale) {
  if (scale === 'duration' && roughStep <= MAX_DURATION_STEP) {
    return DURATION_STEPS
  }
  const [base, multiples] =
    scale === 'binary' ? [2, BINARY_MULTIPLES] : [10, DECIMAL_MULTIPLES]
  const exponent = Math.floor(Math.log(roughStep) / Math.log(base))
  const steps: number[] = []
  for (let e = exponent - 1; e <= exponent + 3; e++) {
    for (const multiple of multiples) {
      steps.push(round(multiple * base ** e))
    }
  }
  return steps
}

// Drops float noise, e.g. 0.1 * 3 = 0.30000000000000004
function round(value: number) {
  return Number(value.toPrecision(12))
}
