import type { HomeSparklineDataPoint } from './HomeSparkline'

/**
 * Seven-day buckets counted back from the latest day, so the last point is
 * the latest full week. Each is stamped with its first day and holds the mean
 * of the days that have data. Days left over at the start, too few for a
 * week, are dropped rather than drawn as one.
 */
export function toWeeklyAverages(
  data: HomeSparklineDataPoint[],
): HomeSparklineDataPoint[] {
  const weeks: HomeSparklineDataPoint[] = []
  const start = data.length >= 7 ? data.length % 7 : 0
  for (let end = data.length; end > start; end -= 7) {
    const days = data.slice(Math.max(start, end - 7), end)
    const [firstDay] = days
    if (!firstDay) continue
    const values = days.flatMap((d) => (d.value === null ? [] : [d.value]))
    weeks.push({
      timestamp: firstDay.timestamp,
      value:
        values.length > 0
          ? values.reduce((sum, v) => sum + v, 0) / values.length
          : null,
    })
  }
  return weeks.reverse()
}
