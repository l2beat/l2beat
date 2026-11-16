import { UnixTime } from '@l2beat/shared-pure'
import { normalizeSeries, type ValuePoint } from './normalizeSeries'

const SECONDS_PER_YEAR = 365 * UnixTime.DAY

export interface Exposure {
  /** USD·years */
  value: number
  /** Start of the value data within the interval: `from`, or the first sample if later */
  since: number
  /** From `since` to `to`, so `value / years` is the average value */
  years: number
}

/**
 * Value secured between `from` and `to`, in USD·years: the trapezoid integral
 * of the series. Time before the first sample counts as zero and the last
 * sample is held flat until `to`. Null when there are no samples.
 */
export function calculateExposure(
  series: ValuePoint[],
  from: number,
  to: number,
): Exposure | null {
  const points = normalizeSeries(series, to)
  const first = points[0]
  if (!first) {
    return null
  }

  const firstAfterIndex = points.findIndex((p) => p.timestamp > from)
  const inside = firstAfterIndex === -1 ? [] : points.slice(firstAfterIndex)
  const before =
    firstAfterIndex === -1 ? points.at(-1) : points[firstAfterIndex - 1]

  const path: ValuePoint[] = []
  if (before) {
    path.push({ timestamp: from, value: interpolate(before, inside[0], from) })
  }
  path.push(...inside)
  const last = path.at(-1)
  if (last && last.timestamp < to) {
    path.push({ timestamp: to, value: last.value })
  }

  let integral = 0
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1]
    const b = path[i]
    if (a && b) {
      integral += ((a.value + b.value) / 2) * (b.timestamp - a.timestamp)
    }
  }
  const since = Math.max(from, first.timestamp)
  return {
    value: integral / SECONDS_PER_YEAR,
    since,
    years: Math.max(to - since, 0) / SECONDS_PER_YEAR,
  }
}

function interpolate(
  a: ValuePoint,
  b: ValuePoint | undefined,
  timestamp: number,
): number {
  if (!b) {
    return a.value
  }
  const ratio = (timestamp - a.timestamp) / (b.timestamp - a.timestamp)
  return a.value + (b.value - a.value) * ratio
}
