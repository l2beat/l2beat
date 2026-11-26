import { percentile } from './changeEvents'

/**
 * Finds the rises on a daily line: each local peak, where the rise up to it
 * began, and the usual highs before that, which it is compared with. They
 * are found over the whole history, so a rise is the same whatever range a
 * chart shows. Whether one is big enough to pin depends on which series the
 * chart shows, so that is left to the chart (see `getLocalMax`).
 *
 * A peak is measured against up to three levels, tightest first: the peak
 * itself, the level of the days around it, and the level of its whole
 * window. A spike is described by the first; a step with a later bump on its
 * plateau needs a wider one to reach back to where the step began.
 */

// A candidate peak is its category's highest day within this window.
const WINDOW_DAYS = 46
const NEAR_DAYS = 7
const LEVEL_PERCENTILE = 0.75
// A rise runs back as long as days stay this close to its level. A day below
// it doesn't end the rise when enough days in the week before are close,
// which bridges weekends and short dips.
const ONSET_SHARE = 0.9
const BRIDGE_DAYS = 7
const BRIDGE_MIN_DAYS = 2
// The usual highs: days in the top tenth of a stretch that ends a while
// before the rise, so the rise's own ramp stays out of it.
const BASELINE_DAYS = 42
const BASELINE_GAP_DAYS = 14
const USUAL_HIGH_PERCENTILE = 0.9
// A rise is judged against the series' scale around it, as a year-long
// chart centred on it would draw it.
const SCALE_DAYS = 182

export interface RiseLevel {
  /** Index of the day the rise began. */
  onset: number
  /** Indexes of the usual highs it is compared with. */
  highs: number[]
  baseline: number
}

export interface PeakRise {
  /** Index of the peak. */
  peak: number
  /** Tightest first, each starting earlier than the one before. */
  levels: RiseLevel[]
}

/** `totals` holds one value per day, null where there is no data. */
export function findPeakRises(totals: (number | null)[]): PeakRise[] {
  const result: PeakRise[] = []

  for (let i = 0; i < totals.length; i++) {
    const value = totals[i]
    if (value === null || value === undefined) continue
    if (!isWindowPeak(totals, i)) continue

    const levels: RiseLevel[] = []
    for (const level of [
      value,
      percentile(values(totals, i, NEAR_DAYS), LEVEL_PERCENTILE),
      percentile(values(totals, i, WINDOW_DAYS), LEVEL_PERCENTILE),
    ]) {
      if (level === undefined) continue
      const measured = measureRise(totals, i, level)
      // A level that ends at the same onset adds nothing new.
      if (!measured || levels.some((l) => l.onset <= measured.onset)) continue
      if (measured.baseline >= value) continue
      levels.push(measured)
    }
    if (levels.length > 0) result.push({ peak: i, levels })
  }
  return result
}

/** The highest value within `SCALE_DAYS` of day `i`. */
export function getLocalMax(totals: (number | null)[], i: number) {
  return Math.max(0, ...values(totals, i, SCALE_DAYS))
}

/** The window's highest day; ties go to the earliest. */
function isWindowPeak(totals: (number | null)[], i: number) {
  const value = totals[i] as number
  const lo = Math.max(0, i - WINDOW_DAYS)
  const hi = Math.min(totals.length - 1, i + WINDOW_DAYS)
  for (let j = lo; j <= hi; j++) {
    const other = totals[j]
    if (other === null || other === undefined) continue
    if (other > value || (other === value && j < i)) return false
  }
  return true
}

function measureRise(
  totals: (number | null)[],
  peak: number,
  level: number,
): RiseLevel | undefined {
  const threshold = ONSET_SHARE * level
  let onset = peak
  while (onset > 0 && continuesBefore(totals, onset, threshold)) onset--
  while ((totals[onset] ?? 0) < threshold) onset++

  const from = onset - BASELINE_GAP_DAYS - BASELINE_DAYS
  if (from < 0) return undefined
  const stretch: number[] = []
  for (let j = from; j < from + BASELINE_DAYS; j++) {
    const value = totals[j]
    if (value === null || value === undefined) return undefined
    stretch.push(value)
  }
  const usualHigh = percentile(stretch, USUAL_HIGH_PERCENTILE) as number
  const highs = stretch.flatMap((value, k) =>
    value >= usualHigh ? [from + k] : [],
  )
  const baseline =
    highs.reduce((sum, j) => sum + (totals[j] as number), 0) / highs.length
  return { onset, highs, baseline }
}

/** Whether the rise reaches back past day `day - 1`. */
function continuesBefore(
  totals: (number | null)[],
  day: number,
  threshold: number,
) {
  if ((totals[day - 1] ?? 0) >= threshold) return true
  let close = 0
  for (let j = Math.max(0, day - BRIDGE_DAYS); j < day; j++) {
    if ((totals[j] ?? 0) >= threshold) close++
  }
  return close >= BRIDGE_MIN_DAYS
}

/** The values within `days` of day `i`. */
function values(totals: (number | null)[], i: number, days: number) {
  const result: number[] = []
  const lo = Math.max(0, i - days)
  const hi = Math.min(totals.length - 1, i + days)
  for (let j = lo; j <= hi; j++) {
    const value = totals[j]
    if (value !== null && value !== undefined) result.push(value)
  }
  return result
}
