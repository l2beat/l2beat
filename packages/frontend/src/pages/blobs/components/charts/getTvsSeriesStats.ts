import { calculatePercentageChange } from '~/utils/calculatePercentageChange'
import type { TvsSeriesPoint } from './mergeTvsSeries'

type SeriesKey = Exclude<keyof TvsSeriesPoint, 'timestamp'>

export interface TvsSeriesStats {
  total: number
  change: number
}

/**
 * The headline total of the selected series and its change over the chart.
 * Both are read where every selected series has a value: the series sync
 * apart, and the newest point of the one ahead would otherwise count the
 * lagging one as zero.
 */
export function getTvsSeriesStats(
  data: TvsSeriesPoint[] | undefined,
  selected: SeriesKey[],
): TvsSeriesStats | undefined {
  if (!data) return undefined

  // a series with no value anywhere has nothing to wait for
  const withValues = selected.filter((key) =>
    data.some((point) => point[key] !== null),
  )
  const complete = data.filter((point) =>
    withValues.every((key) => point[key] !== null),
  )
  const oldest = complete.at(0)
  const newest = complete.at(-1)
  if (!oldest || !newest) return undefined

  const sum = (point: TvsSeriesPoint) =>
    withValues.reduce((acc, key) => acc + (point[key] ?? 0), 0)

  return {
    total: sum(newest),
    change: calculatePercentageChange(sum(newest), sum(oldest)),
  }
}
