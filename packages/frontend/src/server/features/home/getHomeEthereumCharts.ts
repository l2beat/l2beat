import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import type { ChartRange } from '~/utils/range/range'
import { getFullySyncedDaRange } from '../data-availability/throughput/utils/getFullySyncedDaRange'
import { countPerSecond } from '../layer2s/activity/utils/countPerSecond'
import { getActivitySyncInfo } from '../layer2s/activity/utils/getActivitySyncInfo'
import { getFullySyncedActivityRange } from '../layer2s/activity/utils/getFullySyncedActivityRange'
import { computeWeeklyAverageChange } from './computeSeriesChange'

export interface HomeEthereumCharts {
  activity: {
    chart: [number, number | null][]
    pastDayUops: number | undefined
    change: number | undefined
  }
  da: {
    chart: [number, number | null][]
    trackedShare: number | undefined
    change: number | undefined
  }
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
    return {
      chart: [],
      pastDayUops: undefined,
      change: undefined,
    }
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

  const chart: [number, number | null][] = timestamps.map((timestamp) => {
    if (timestamp > syncedUntil) {
      return [timestamp, null]
    }
    return [timestamp, uopsByTimestamp.get(timestamp) ?? 0]
  })

  const pastDayCount = uopsByTimestamp.get(syncedUntil)
  return {
    chart,
    pastDayUops:
      pastDayCount !== undefined ? countPerSecond(pastDayCount) : undefined,
    change: computeWeeklyAverageChange(chart.map(([_, value]) => value)),
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

  const allDays = [...totalByDay.keys()].sort((a, b) => a - b)
  const days = allDays.filter((day) => from === null || day >= from)
  const firstDay = days[0]
  const lastDay = days[days.length - 1]
  if (firstDay === undefined || lastDay === undefined) {
    return {
      chart: [],
      trackedShare: undefined,
      change: undefined,
    }
  }

  const chart: [number, number | null][] = generateTimestamps(
    [firstDay, lastDay],
    'day',
  ).map((timestamp) => [timestamp, totalByDay.get(timestamp) ?? null])

  const total = sumByDay(totalByDay, days)
  // Only against a range the data covers in full, so a short history does
  // not read as growth.
  const coversPrevious =
    previousFrom !== null &&
    allDays[0] !== undefined &&
    allDays[0] <= previousFrom
  const previousTotal = coversPrevious
    ? sumByDay(
        totalByDay,
        allDays.filter((day) => day < firstDay),
      )
    : 0

  // What the projects we track posted, over the same range as the total.
  const posterRecords = await db.dataAvailability.getByDaLayersAndTimeRange(
    ['ethereum'],
    [firstDay, lastDay + UnixTime.DAY],
    ['ethereum'],
  )
  const trackedTotal = posterRecords.reduce(
    (acc, record) => acc + Number(record.totalSize),
    0,
  )

  return {
    chart,
    trackedShare: total > 0 ? Math.min(trackedTotal / total, 1) : undefined,
    change: previousTotal > 0 ? total / previousTotal - 1 : undefined,
  }
}

function sumByDay(byDay: Map<number, number>, days: number[]): number {
  return days.reduce((sum, day) => sum + (byDay.get(day) ?? 0), 0)
}

function getMockHomeEthereumCharts(range: ChartRange): HomeEthereumCharts {
  const adjustedRange: [UnixTime, UnixTime] = [range[0] ?? 1590883200, range[1]]
  const timestamps = generateTimestamps(adjustedRange, 'day')

  return {
    activity: {
      chart: timestamps.map((timestamp) => [+timestamp, 950_400]),
      pastDayUops: 11,
      change: 0,
    },
    da: {
      chart: timestamps.map((timestamp) => [+timestamp, 250_000_000_000]),
      trackedShare: 0.87,
      change: 0,
    },
  }
}
