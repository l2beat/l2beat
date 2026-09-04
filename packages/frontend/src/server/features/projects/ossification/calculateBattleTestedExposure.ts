const SECONDS_PER_YEAR = 365 * 24 * 60 * 60

export interface BattleTestedExposurePoint {
  timestamp: number
  value: number
}

/**
 * Integrates TVS over the unchanged-period clock using linear interpolation
 * between samples and a flat extension after the latest sample.
 *
 * A sample at or before `from` lets us clip the first interval precisely. If
 * the series starts later, exposure starts at the first known sample instead
 * of assuming an earlier value.
 */
export function calculateBattleTestedExposure(
  series: readonly BattleTestedExposurePoint[],
  from: number,
  to: number,
): number | null {
  if (to <= from) return 0

  const byTimestamp = new Map<number, number>()
  for (const point of series) {
    if (
      Number.isFinite(point.timestamp) &&
      Number.isFinite(point.value) &&
      point.timestamp <= to
    ) {
      byTimestamp.set(point.timestamp, point.value)
    }
  }
  const points = [...byTimestamp]
    .map(([timestamp, value]) => ({ timestamp, value }))
    .sort((a, b) => a.timestamp - b.timestamp)

  const previous = points.findLast((point) => point.timestamp <= from)
  const later = points.filter((point) => point.timestamp > from)

  let current: BattleTestedExposurePoint | undefined
  if (previous) {
    const next = later[0]
    const valueAtStart =
      previous.timestamp < from && next
        ? interpolate(previous, next, from)
        : previous.value
    current = { timestamp: from, value: valueAtStart }
  } else {
    current = later.shift()
  }
  if (!current) return null

  let integral = 0
  for (const point of later) {
    integral +=
      ((current.value + point.value) / 2) *
      (point.timestamp - current.timestamp)
    current = point
  }
  integral += current.value * (to - current.timestamp)

  return integral / SECONDS_PER_YEAR
}

function interpolate(
  before: BattleTestedExposurePoint,
  after: BattleTestedExposurePoint,
  timestamp: number,
): number {
  const progress =
    (timestamp - before.timestamp) / (after.timestamp - before.timestamp)
  return before.value + progress * (after.value - before.value)
}
