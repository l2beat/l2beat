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
 * What a home sparkline draws, as it draws it, so the client does not have
 * to know how each figure is bucketed.
 */
export type HomeSparklineSeries =
  | {
      /** A value per day, e.g. TVS at the end of each day. */
      kind: 'daily'
      points: HomeSeriesPoint[]
      /** The tooltip's names for each point's parts, in their order. */
      partLabels?: string[]
    }
  | {
      /**
       * Daily figures that swing day to day (activity, deposits), as weekly
       * averages: the trend the change describes. See `toWeeklyAverages`.
       */
      kind: 'weekly'
      points: [timestamp: number, value: number | null][]
      /**
       * Amounts per day (deposits, blob data) beside a total: the high and
       * low say "/day", so the chart's scale does not read as the figure's.
       */
      perDay: boolean
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
  chart: { kind: 'daily', points: [] },
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
 * of the days that have data. Days left over at the start, too few for a
 * week, are dropped rather than drawn as one.
 */
export function toWeeklyAverages(
  series: HomeSeriesPoint[],
): [timestamp: number, value: number | null][] {
  const weeks: [number, number | null][] = []
  const start = series.length >= WEEK_DAYS ? series.length % WEEK_DAYS : 0
  for (let end = series.length; end > start; end -= WEEK_DAYS) {
    const days = series.slice(Math.max(start, end - WEEK_DAYS), end)
    const [firstDay] = days
    if (!firstDay) continue
    const values = days.flatMap(([, value]) => (value === null ? [] : [value]))
    weeks.push([
      firstDay[0],
      values.length > 0
        ? values.reduce((sum, v) => sum + v, 0) / values.length
        : null,
    ])
  }
  return weeks.reverse()
}

/** A daily series drawn as its weekly averages. */
export function toWeeklySparkline(
  series: HomeSeriesPoint[],
  { perDay }: { perDay: boolean },
): HomeSparklineSeries {
  return { kind: 'weekly', points: toWeeklyAverages(series), perDay }
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
