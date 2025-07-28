import type { ProjectsSummedDataAvailabilityRecord } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getRangeWithMax } from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/rangeToDays'
import { getActivityForProjectAndRange } from '../../scaling/activity/getActivityForProjectAndRange'
import { DataPostedTimeRange } from '../../scaling/data-posted/range'
import { generateTimestamps } from '../../utils/generateTimestamps'
import { rangeToResolution } from './utils/range'

export type ScalingProjectDaThroughputChart = {
  chart: ScalingProjectDaThroughputChartPoint[]
  range: [UnixTime | null, UnixTime]
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
  const target = UnixTime.toStartOf(UnixTime.now(), 'hour') - UnixTime.HOUR

  const [from, to] = getRangeWithMax(
    {
      type: params.range,
    },
    resolution,
    {
      now: target,
    },
  )

  const [throughput, activityRecords] = await Promise.all([
    db.dataAvailability.getByProjectIdsAndTimeRange(
      [params.projectId],
      [from, target],
    ),
    getActivityForProjectAndRange(params.projectId, params.range),
  ])

  if (throughput.length === 0) {
    return undefined
  }

  const { grouped, minTimestamp } = groupByTimestamp(throughput, resolution)
  const chartAdjustedTo =
    resolution === 'hourly'
      ? to - UnixTime.HOUR
      : resolution === 'sixHourly'
        ? to - UnixTime.HOUR * 6
        : to - UnixTime.DAY

  const timestamps = generateTimestamps(
    [minTimestamp, chartAdjustedTo],
    resolution,
  )
  const syncedUntil = throughput.at(-1)?.timestamp
  assert(syncedUntil, 'syncedUntil is undefined')

  let total = 0
  const chart: ScalingProjectDaThroughputChartPoint[] = timestamps.map(
    (timestamp) => {
      const posted =
        timestamp <= syncedUntil ? (grouped[timestamp] ?? null) : null
      total += posted ?? 0
      return [timestamp, posted]
    },
  )

  const days = Math.round((chartAdjustedTo - minTimestamp) / UnixTime.DAY)
  const avgPerDay = total / days

  const uopsCount = activityRecords.reduce((acc, record) => {
    return acc + (record.uopsCount ?? record.count)
  }, 0)

  return {
    chart,
    range: [minTimestamp, chartAdjustedTo],
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
  for (const record of records) {
    const timestamp = UnixTime.toStartOf(
      record.timestamp,
      resolution === 'daily'
        ? 'day'
        : resolution === 'sixHourly'
          ? 'six hours'
          : 'hour',
    )
    const value = record.totalSize
    if (!result[timestamp]) {
      result[timestamp] = Number(value)
    } else {
      result[timestamp] += Number(value)
    }
    minTimestamp = Math.min(minTimestamp, timestamp)
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
    range: [from, to],
    syncedUntil: UnixTime.now(),
    stats: {
      total,
      avgPerDay,
      postedPerUop: total / uopsCount,
    },
  }
}
