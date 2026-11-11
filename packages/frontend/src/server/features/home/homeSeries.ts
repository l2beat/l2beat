import { UnixTime } from '@l2beat/shared-pure'

/**
 * A day of a home sparkline: its value, then the parts it breaks down into,
 * if any, for the tooltip (e.g. rollups and validiums & optimiums).
 */
export type HomeSeriesPoint = [
  timestamp: number,
  value: number | null,
  ...parts: (number | null)[],
]

/**
 * What a home sparkline draws: a daily figure as its weekly averages (see
 * `toWeeklyAverages`). Levels (TVS) and flows (activity, deposits) alike, so
 * the charts side by side on the page show the same amount of detail.
 */
export interface HomeSparklineSeries {
  points: HomeSeriesPoint[]
  /**
   * Amounts per day (deposits, blob data) beside a total: the high and low
   * say "/day", so the chart's scale does not read as the figure's.
   */
  perDay: boolean
  /** The tooltip's names for each point's parts, in their order. */
  partLabels?: string[]
}

/** A headline figure with its change, and the sparkline under it. */
export interface HomeKpi {
  chart: HomeSparklineSeries
  /** The latest level, e.g. TVS, or the total over the range. */
  value: number | undefined
  /** Ratio over the chart's period, e.g. 0.12 for +12%. */
  change: number | undefined
}

export const EMPTY_HOME_KPI: HomeKpi = {
  chart: { points: [], perDay: false },
  value: undefined,
  change: undefined,
}

export function getLatestValue(series: HomeSeriesPoint[]): number | undefined {
  return series.findLast(([, value]) => value !== null)?.[1] ?? undefined
}

/** The change from the first value to the last: for levels, e.g. TVS. */
export function computeSeriesChange(
  series: HomeSeriesPoint[],
): number | undefined {
  const withData = series.filter(([, value]) => value !== null)
  return getChange(withData.at(0)?.[1], withData.at(-1)?.[1])
}

function getChange(
  first: number | null | undefined,
  last: number | null | undefined,
): number | undefined {
  if (first == null || first === 0 || last == null) {
    return undefined
  }
  return last / first - 1
}

export const WEEK_DAYS = 7

/**
 * Seven-day buckets counted back from the latest day, so the last point is
 * the latest full week. Each is stamped with its first day and holds the mean
 * of the days that have data, for the value and each part alike. Days left
 * over at the start, too few for a week, are dropped rather than drawn as one.
 */
export function toWeeklyAverages(points: HomeSeriesPoint[]): HomeSeriesPoint[] {
  const series = toOnePerDay(points)
  const weeks: HomeSeriesPoint[] = []
  const start = series.length >= WEEK_DAYS ? series.length % WEEK_DAYS : 0
  for (let end = series.length; end > start; end -= WEEK_DAYS) {
    const days = series.slice(Math.max(start, end - WEEK_DAYS), end)
    const [firstDay] = days
    if (!firstDay) continue
    // The value, then each part.
    const [value = null, ...parts] = firstDay
      .slice(1)
      .map((_, column) => average(days.map((day) => day[column + 1] ?? null)))
    weeks.push([firstDay[0], value, ...parts])
  }
  return weeks.reverse()
}

/**
 * A level (TVS) ends with the latest hour after that day's midnight: keep
 * each day's latest point with data, so a week is seven days, not seven
 * points.
 */
function toOnePerDay(series: HomeSeriesPoint[]): HomeSeriesPoint[] {
  const days: HomeSeriesPoint[] = []
  for (const point of series) {
    const last = days.at(-1)
    const day = UnixTime.toStartOf(UnixTime(point[0]), 'day')
    if (last && UnixTime.toStartOf(UnixTime(last[0]), 'day') === day) {
      if (point[1] !== null) days[days.length - 1] = point
    } else {
      days.push(point)
    }
  }
  return days
}

/** The mean of the values that are there; null when none is. */
function average(values: (number | null)[]): number | null {
  const present = values.filter((value): value is number => value !== null)
  return present.length > 0
    ? present.reduce((sum, value) => sum + value, 0) / present.length
    : null
}

/** A daily series drawn as its weekly averages. */
export function toWeeklySparkline(
  series: HomeSeriesPoint[],
  options: Omit<HomeSparklineSeries, 'points'>,
): HomeSparklineSeries {
  return { points: toWeeklyAverages(series), ...options }
}

/**
 * The change from the first week's average to the last week's: for daily
 * flows, e.g. activity, which swing too much day to day for two single days
 * to stand for the trend. The weeks are the ones their sparklines draw.
 */
export function computeWeeklyAverageChange(
  series: HomeSeriesPoint[],
): number | undefined {
  if (series.filter(([, value]) => value !== null).length < 2 * WEEK_DAYS) {
    return undefined
  }
  const weeks = toWeeklyAverages(series)
  return getChange(weeks.at(0)?.[1], weeks.at(-1)?.[1])
}

/**
 * Where the period as long as `[from, to]` before it starts, for a total's
 * change. The range runs to the start of `to`'s day: days are whole.
 */
export function getPreviousRangeStart([from, to]: [number | null, number]):
  | number
  | null {
  return from !== null ? from - (UnixTime.toStartOf(to, 'day') - from) : null
}

/**
 * The total from `from` on, and its change against the same length of time
 * before it, from points fetched back to `previousFrom` and sorted by time.
 * Only against a range the points cover in full, so a short history does not
 * read as growth.
 */
export function computeRangeTotal(
  points: [timestamp: number, value: number][],
  from: number | null,
  previousFrom: number | null,
): { total: number; change: number | undefined } {
  let total = 0
  let previousTotal = 0
  for (const [timestamp, value] of points) {
    if (from === null || timestamp >= from) {
      total += value
    } else {
      previousTotal += value
    }
  }
  const firstTimestamp = points[0]?.[0]
  const coversPrevious =
    previousFrom !== null &&
    firstTimestamp !== undefined &&
    firstTimestamp <= previousFrom
  return {
    total,
    change:
      coversPrevious && previousTotal > 0
        ? total / previousTotal - 1
        : undefined,
  }
}
