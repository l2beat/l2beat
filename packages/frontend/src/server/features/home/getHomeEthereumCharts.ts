import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import type { ChartRange } from '~/utils/range/range'
import { getFullySyncedDaRange } from '../data-availability/throughput/utils/getFullySyncedDaRange'
import { countPerSecond } from '../layer2s/activity/utils/countPerSecond'
import { getActivitySyncInfo } from '../layer2s/activity/utils/getActivitySyncInfo'
import { getFullySyncedActivityRange } from '../layer2s/activity/utils/getFullySyncedActivityRange'
import {
  computeRangeTotal,
  computeWeeklyAverageChange,
  EMPTY_HOME_KPI,
  type HomeKpi,
  type HomeSeriesPoint,
} from './homeSeries'

export interface HomeEthereumCharts {
  /** UOPS; the figure is the past day's. */
  activity: HomeKpi
  /** Blob data posted; the figure is the total over the range. */
  da: HomeKpi & { trackedShare: number | undefined }
}

export const EMPTY_HOME_ETHEREUM_CHARTS: HomeEthereumCharts = {
  activity: EMPTY_HOME_KPI,
  da: { ...EMPTY_HOME_KPI, trackedShare: undefined },
}

export async function getHomeEthereumCharts(
  range: ChartRange,
): Promise<HomeEthereumCharts> {
  if (env.MOCK) {
    return getMockHomeEthereumCharts(range)
  }

  const [activity, da] = await Promise.all([
    getEthereumActivitySparkline(range),
    getEthereumDaSparkline(range),
  ])

  return { activity, da }
}

async function getEthereumActivitySparkline(
  range: ChartRange,
): Promise<HomeEthereumCharts['activity']> {
  const db = getDb()
  const adjustedRange = await getFullySyncedActivityRange(range)

  const [records, syncInfo] = await Promise.all([
    db.activity.getByProjectsAndTimeRange([ProjectId.ETHEREUM], adjustedRange),
    getActivitySyncInfo(ProjectId.ETHEREUM, adjustedRange[1]),
  ])

  if (!syncInfo.hasSyncData || records.length === 0) {
    return EMPTY_HOME_ETHEREUM_CHARTS.activity
  }

  const { syncedUntil } = syncInfo
  const uopsByTimestamp = new Map<number, number>(
    records.map((r) => [r.timestamp, r.uopsCount ?? r.count]),
  )

  const firstTimestamp = records[0]?.timestamp ?? adjustedRange[1]
  const timestamps = generateTimestamps(
    [firstTimestamp, adjustedRange[1]],
    'day',
  )

  const chart = timestamps.map((timestamp): HomeSeriesPoint => {
    if (timestamp > syncedUntil) {
      return [timestamp, null]
    }
    return [timestamp, countPerSecond(uopsByTimestamp.get(timestamp) ?? 0)]
  })

  const pastDayCount = uopsByTimestamp.get(syncedUntil)
  return {
    chart,
    value:
      pastDayCount !== undefined ? countPerSecond(pastDayCount) : undefined,
    change: computeWeeklyAverageChange(chart),
  }
}

async function getEthereumDaSparkline(
  range: ChartRange,
): Promise<HomeEthereumCharts['da']> {
  const db = getDb()

  const [from, to] = getFullySyncedDaRange(range)
  // The headline is the total over the range, so its change compares that
  // total with the range before it: the totals are fetched for both.
  const previousFrom = from !== null ? from - (to - from) : null

  const totalRecords = await db.dataAvailability.getByProjectIdsAndTimeRange(
    ['ethereum'],
    [previousFrom, to],
  )

  const totalByDay = new Map<number, number>()
  for (const record of totalRecords) {
    const day = UnixTime.toStartOf(record.timestamp, 'day')
    totalByDay.set(day, (totalByDay.get(day) ?? 0) + Number(record.totalSize))
  }

  const allDays = [...totalByDay.entries()].sort(([a], [b]) => a - b)
  const days = allDays.filter(([day]) => from === null || day >= from)
  const firstDay = days.at(0)?.[0]
  const lastDay = days.at(-1)?.[0]
  if (firstDay === undefined || lastDay === undefined) {
    return EMPTY_HOME_ETHEREUM_CHARTS.da
  }

  const chart = generateTimestamps([firstDay, lastDay], 'day').map(
    (timestamp): HomeSeriesPoint => [
      timestamp,
      totalByDay.get(timestamp) ?? null,
    ],
  )

  const { total, change } = computeRangeTotal(allDays, from, previousFrom)

  // What the projects we track posted, over the same range as the total;
  // summed in the database, a row per timestamp rather than per project.
  const trackedRecords =
    await db.dataAvailability.getSummedProjectsByDaLayersAndTimeRange(
      ['ethereum'],
      [firstDay, lastDay + UnixTime.DAY],
    )
  const trackedTotal = trackedRecords.reduce(
    (acc, record) => acc + Number(record.totalSize),
    0,
  )

  return {
    chart,
    value: total,
    trackedShare: total > 0 ? Math.min(trackedTotal / total, 1) : undefined,
    change,
  }
}

function getMockHomeEthereumCharts(range: ChartRange): HomeEthereumCharts {
  const adjustedRange: [UnixTime, UnixTime] = [range[0] ?? 1590883200, range[1]]
  const timestamps = generateTimestamps(adjustedRange, 'day')

  return {
    activity: {
      chart: timestamps.map((timestamp) => [+timestamp, 11]),
      value: 11,
      change: 0,
    },
    da: {
      chart: timestamps.map((timestamp) => [+timestamp, 250_000_000_000]),
      value: timestamps.length * 250_000_000_000,
      trackedShare: 0.87,
      change: 0,
    },
  }
}
