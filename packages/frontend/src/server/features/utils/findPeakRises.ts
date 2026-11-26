import { percentile } from './changeEvents'

/**
 * Finds the rises a viewer sees on a daily line: each local peak, where the
 * rise up to it began, and the usual highs before that, which it is compared
 * with. Whether a rise is big enough to pin depends on the chart's y axis,
 * so that is left to the chart.
 *
 * A peak is measured against up to three levels, tightest first: the peak
 * itself, the level of the days around it, and the level of its whole
 * window. A spike is described by the first; a step with a later bump on its
 * plateau needs a wider one to reach back to where the step began.
 */

// A candidate peak is its category's highest day within this window, which
// grows with the visible range so a long range gets fewer, bigger peaks.
const MIN_WINDOW_DAYS = 7
const RANGE_DAYS_PER_WINDOW = 8
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

/** How many days before the visible range the baselines can need. */
export const RISE_HISTORY_DAYS = BASELINE_DAYS + BASELINE_GAP_DAYS

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

/**
 * `totals` holds one value per day, null where there is no data; days before
 * `start` are history for the baselines, not candidates.
 */
export function findPeakRises(
  totals: (number | null)[],
  start: number,
): PeakRise[] {
  const end = totals.length - 1
  const window = Math.max(
    MIN_WINDOW_DAYS,
    Math.round((end - start + 1) / RANGE_DAYS_PER_WINDOW),
  )
  const result: PeakRise[] = []

  for (let i = start; i <= end; i++) {
    const value = totals[i]
    if (value === null || value === undefined) continue
    const lo = Math.max(start, i - window)
    const hi = Math.min(end, i + window)
    if (!isWindowPeak(totals, i, lo, hi)) continue

    const levels: RiseLevel[] = []
    for (const level of [
      value,
      percentile(
        values(
          totals,
          Math.max(start, i - NEAR_DAYS),
          Math.min(end, i + NEAR_DAYS),
        ),
        LEVEL_PERCENTILE,
      ),
      percentile(values(totals, lo, hi), LEVEL_PERCENTILE),
    ]) {
      if (level === undefined) continue
      const measured = measureRise(totals, i, start, level)
      // A level that ends at the same onset adds nothing new.
      if (!measured || levels.some((l) => l.onset <= measured.onset)) continue
      if (measured.baseline >= value) continue
      levels.push(measured)
    }
    if (levels.length > 0) result.push({ peak: i, levels })
  }
  return result
}

/** The window's highest day; ties go to the earliest. */
function isWindowPeak(
  totals: (number | null)[],
  i: number,
  lo: number,
  hi: number,
) {
  const value = totals[i] as number
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
  start: number,
  level: number,
): RiseLevel | undefined {
  const threshold = ONSET_SHARE * level
  let onset = peak
  while (onset - 1 >= start && continuesBefore(totals, onset, threshold)) {
    onset--
  }
  // Still going at the range's start: the rise began off-screen.
  if (onset === start && continuesBefore(totals, start, threshold)) {
    return undefined
  }
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

function values(totals: (number | null)[], lo: number, hi: number) {
  const result: number[] = []
  for (let j = lo; j <= hi; j++) {
    const value = totals[j]
    if (value !== null && value !== undefined) result.push(value)
  }
  return result
}
