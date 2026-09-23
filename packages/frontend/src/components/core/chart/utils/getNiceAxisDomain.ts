import type { NumberDomain } from 'recharts'

// Tick steps, as multiples of a power of ten, that read as round labels.
const NICE_MULTIPLES = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 15, 20, 25, 30]

/**
 * Widens the data domain so that `tickCount` evenly spaced ticks all land on
 * round values ($0, $5B, $10B, $15B) and the top tick sits at or above the
 * data. Recharts' own nice ticks allow any step in 0.05 increments, which
 * gives labels like $6.5B, $13B, $19.5B.
 *
 * Recharts splits a fixed domain into `tickCount - 1` steps and rounds the
 * step up to 0.05 of its power of ten, or to a whole number when the step is
 * between 1 and 10, so 1.5 and 2.5 are skipped there.
 */
export function getNiceAxisDomain(
  [min, max]: NumberDomain,
  tickCount: number,
  { startAtZero }: { startAtZero: boolean },
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

  const magnitude = 10 ** Math.floor(Math.log10((max - lower) / intervals))
  for (const multiple of NICE_MULTIPLES) {
    const step = round(multiple * magnitude)
    if (step >= 1 && step < 10 && !Number.isInteger(step)) continue
    const niceMin = round(Math.floor(lower / step) * step)
    const niceMax = round(niceMin + step * intervals)
    if (niceMax >= max) return [niceMin, niceMax]
  }
  return [lower, max]
}

// Drops float noise (0.1 * 3 = 0.30000000000000004), which would otherwise
// push Recharts to the next step up.
function round(value: number) {
  return Number(value.toPrecision(12))
}
