import type { ProjectsSummedDataAvailabilityRecord } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getRangeWithMax } from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/rangeToDays'
import { DataPostedTimeRange } from '../../scaling/data-posted/range'
import { generateTimestamps } from '../../utils/generateTimestamps'
import { rangeToResolution } from './utils/range'

export type ScalingProjectDaThroughputChart = {
  chart: ScalingProjectDaThroughputChartPoint[]
  range: [UnixTime | null, UnixTime]
  syncedUntil: UnixTime
}
export type ScalingProjectDaThroughputChartPoint = [
  timestamp: number,
  value: number | null,
]

export const ScalingProjectDaThroughputChartParams = v.object({
  range: v.union([
    v.object({
      type: DataPostedTimeRange,
    }),
    v.object({
      type: v.literal('custom'),
      from: v.number(),
      to: v.number(),
    }),
  ]),
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
  const resolution = rangeToResolution(params.range)
  const target = UnixTime.toStartOf(UnixTime.now(), 'hour') - UnixTime.HOUR
  const adjustedTarget =
    params.range.type === 'custom' ? params.range.to : target

  const [from, to] = getRangeWithMax(params.range, resolution, {
    now: adjustedTarget,
  })

  const throughput = await db.dataAvailability.getByProjectIdsAndTimeRange(
    [params.projectId],
    [from, adjustedTarget],
  )

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

  return {
    chart: timestamps.map((timestamp) => {
      return [timestamp, grouped[timestamp] ?? null]
    }),
    range: [minTimestamp, chartAdjustedTo],
    syncedUntil,
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
  const days = rangeToDays(range) ?? 730
  const to = UnixTime.toStartOf(UnixTime.now(), 'day')
  const from = to - days * UnixTime.DAY

  const timestamps = generateTimestamps([from, to], 'daily')
  return {
    chart: timestamps.map((timestamp) => {
      const throughputValue = Math.random() * 900_000_000 + 90_000_000

      return [timestamp, Math.round(throughputValue)]
    }),
    range: [from, to],
    syncedUntil: UnixTime.now(),
  }
}
