import { normalizeSeries, type ValuePoint } from './normalizeSeries'

export const TIMELINE_SAMPLES = 52

/**
 * Last known value at each point of an even grid from `from` to `to`
 * inclusive, null before the series starts. Null when every sample is null.
 */
export function sampleTimeline(
  series: ValuePoint[],
  from: number,
  to: number,
): (number | null)[] | null {
  const points = normalizeSeries(series, to)
  const step = (to - from) / (TIMELINE_SAMPLES - 1)

  const values = Array.from({ length: TIMELINE_SAMPLES }, (_, i) => {
    const point = points.findLast((p) => p.timestamp <= from + i * step)
    // Whole dollars keep the SSR payload small.
    return point ? Math.round(point.value) : null
  })

  return values.some((value) => value !== null) ? values : null
}
