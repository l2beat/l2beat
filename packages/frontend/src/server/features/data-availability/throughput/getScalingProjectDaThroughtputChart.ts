import type { ProjectsSummedDataAvailabilityRecord } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import groupBy from 'lodash/groupBy'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { rangeToDays } from '~/utils/range/rangeToDays'
import { getActivityForProjectAndRange } from '../../scaling/activity/getActivityForProjectAndRange'
import { DataPostedTimeRange } from '../../scaling/data-posted/range'
import { generateTimestamps } from '../../utils/generateTimestamps'
import { isThroughputSynced } from './isThroughputSynced'
import {
  getFullySyncedDaThroughputRange,
  rangeToResolution,
} from './utils/range'

export type ScalingProjectDaThroughputChart = {
  chart: ScalingProjectDaThroughputChartPoint[]
  syncedUntil: UnixTime
  stats: {
    total: number
    avgPerDay: number
    postedPerUop: number
  }
}
export type ScalingProjectDaThroughputChartPoint = [
  timestamp: number,
  value: number | null,
]

export const ScalingProjectDaThroughputChartParams = v.object({
  range: DataPostedTimeRange,
  projectId: v.string(),
})
export type ScalingProjectDaThroughputChartParams = v.infer<
  typeof ScalingProjectDaThroughputChartParams
>

export async function getScalingProjectDaThroughputChart(
  params: ScalingProjectDaThroughputChartParams,
): Promise<ScalingProjectDaThroughputChart | undefined> {
  if (env.MOCK) {
    return getMockScalingProjectDaThroughputChart(params)
  }

  const db = getDb()
  const resolution = rangeToResolution({ type: params.range })

  const range = getFullySyncedDaThroughputRange({ type: params.range })
  const [throughput, activityRecords] = await Promise.all([
    db.dataAvailability.getByProjectIdsAndTimeRange([params.projectId], range),
    getActivityForProjectAndRange(params.projectId, params.range),
  ])

  if (throughput.length === 0) {
    return undefined
  }

  const { grouped, minTimestamp } = groupByTimestamp(
    throughput.filter((r) => r.timestamp <= 1753758443),
    resolution,
  )
  const syncedUntil = Math.max(...Object.keys(grouped).map(Number))
  assert(syncedUntil, 'syncedUntil is undefined')

  const adjustedTo = isThroughputSynced(syncedUntil, false)
    ? syncedUntil
    : range[1]

  const timestamps = generateTimestamps([minTimestamp, adjustedTo], resolution)

  let total = 0
  const chart: ScalingProjectDaThroughputChartPoint[] = timestamps.map(
    (timestamp) => {
      const posted = timestamp <= syncedUntil ? (grouped[timestamp] ?? 0) : null
      if (posted !== null) {
        total += posted
      }
      return [timestamp, posted]
    },
  )

  const days = Math.round((syncedUntil - minTimestamp) / UnixTime.DAY)
  const avgPerDay = total / days

  const throughputTimestamps = throughput.map((r) => r.timestamp)
  const uopsCount = activityRecords
    .filter(
      (r) =>
        r.timestamp >= Math.min(...throughputTimestamps) &&
        r.timestamp <= Math.max(...throughputTimestamps),
    )
    .reduce((acc, record) => {
      return acc + (record.uopsCount ?? record.count)
    }, 0)

  return {
    chart,
    syncedUntil,
    stats: {
      total,
      avgPerDay,
      postedPerUop: total / uopsCount,
    },
  }
}

function groupByTimestamp(
  records: ProjectsSummedDataAvailabilityRecord[],
  resolution: 'hourly' | 'sixHourly' | 'daily',
) {
  let minTimestamp = Number.POSITIVE_INFINITY
  const result: Record<number, number> = {}

  const grouped = groupBy(records, (r) =>
    UnixTime.toStartOf(
      r.timestamp,
      resolution === 'daily'
        ? 'day'
        : resolution === 'sixHourly'
          ? 'six hours'
          : 'hour',
    ),
  )
  const expectedLength =
    resolution === 'daily' ? 24 : resolution === 'sixHourly' ? 6 : 1

  for (const [timestamp, records] of Object.entries(grouped)) {
    const unixTimestamp = Number(timestamp)
    if (records.length !== expectedLength) {
      continue
    }
    const value = records.reduce((acc, r) => acc + r.totalSize, 0n)
    result[unixTimestamp] = Number(value)
    minTimestamp = Math.min(minTimestamp, unixTimestamp)
  }
  return {
    grouped: result,
    minTimestamp: UnixTime(minTimestamp),
  }
}

function getMockScalingProjectDaThroughputChart({
  range,
}: ScalingProjectDaThroughputChartParams): ScalingProjectDaThroughputChart {
  const days = rangeToDays({ type: range }) ?? 730
  const to = UnixTime.toStartOf(UnixTime.now(), 'day')
  const from = to - days * UnixTime.DAY

  const timestamps = generateTimestamps([from, to], 'daily')

  let total = 0
  const chart: ScalingProjectDaThroughputChartPoint[] = timestamps.map(
    (timestamp) => {
      const throughputValue = Math.random() * 900_000_000 + 90_000_000
      total += throughputValue
      return [timestamp, Math.round(throughputValue)]
    },
  )

  const numberOfDays = Math.round((to - from) / UnixTime.DAY)
  const avgPerDay = total / numberOfDays

  const uopsCount = 100_000_000

  return {
    chart,
    syncedUntil: UnixTime.now(),
    stats: {
      total,
      avgPerDay,
      postedPerUop: total / uopsCount,
    },
  }
}
