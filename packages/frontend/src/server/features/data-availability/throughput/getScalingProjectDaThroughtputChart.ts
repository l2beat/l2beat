import type { ProjectsSummedDataAvailabilityRecord } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { rangeToDays } from '~/utils/range/rangeToDays'
import { getActivityForProjectAndRange } from '../../scaling/activity/getActivityForProjectAndRange'
import { DataPostedTimeRange } from '../../scaling/data-posted/range'
import { generateTimestamps } from '../../utils/generateTimestamps'
import { isThroughputSynced } from './isThroughputSynced'
import { THROUGHPUT_ENABLED_DA_LAYERS } from './utils/consts'
import { getThroughputExpectedTimestamp } from './utils/getThroughputExpectedTimestamp'
import { getThroughputRange, rangeToResolution } from './utils/range'

export type ScalingProjectDaThroughputChart = {
  chart: ScalingProjectDaThroughputChartPoint[]
  syncedUntil: UnixTime
  stats: {
    total: number
    avgPerDay: number
    postedPerUop: number
  }
}
type ScalingProjectDaThroughputChartPoint = [
  timestamp: number,
  ethereum: number | null,
  celestia: number | null,
  avail: number | null,
  eigenda: number | null,
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

  const range = getThroughputRange({ type: params.range })
  const [throughput, activityRecords] = await Promise.all([
    db.dataAvailability.getByProjectIdsAndTimeRange([params.projectId], range),
    getActivityForProjectAndRange(params.projectId, params.range),
  ])

  if (throughput.length === 0) {
    return undefined
  }

  const syncedUntil = throughput.at(-1)?.timestamp
  assert(syncedUntil, 'syncedUntil is undefined')

  const { grouped, minTimestamp, maxTimestamp } = groupByTimestamp(
    throughput,
    resolution,
  )

  const lastDataForLayers: Record<
    string,
    {
      lastTimestamp: number
      firstTimestamp: number
    }
  > = {}
  for (const layer of THROUGHPUT_ENABLED_DA_LAYERS) {
    const lastValue = Object.entries(grouped).findLast(
      ([_, values]) => values[layer] && values[layer] > 0,
    )
    const firstValue = Object.entries(grouped).find(
      ([_, values]) => values[layer] && values[layer] > 0,
    )
    if (lastValue && firstValue) {
      lastDataForLayers[layer] = {
        lastTimestamp: Number(lastValue[0]),
        firstTimestamp: Number(firstValue[0]),
      }
    }
  }

  const expectedTo = getThroughputExpectedTimestamp(resolution)
  const adjustedTo = isThroughputSynced(syncedUntil, false)
    ? maxTimestamp
    : expectedTo

  const timestamps = generateTimestamps([minTimestamp, adjustedTo], resolution)

  let total = 0
  const chart: ScalingProjectDaThroughputChartPoint[] = timestamps.map(
    (timestamp) => {
      const posted = grouped[timestamp]
      if (posted) {
        total += Object.values(posted).reduce((sum, val) => sum + val, 0)
      }
      const getDaValue = (layer: string) => {
        const lastData = lastDataForLayers[layer]
        const isBetween =
          lastData &&
          timestamp >= lastData.firstTimestamp &&
          timestamp <= lastData.lastTimestamp
        return isBetween ? (grouped[timestamp]?.[layer] ?? 0) : null
      }
      return [
        timestamp,
        getDaValue('ethereum'),
        getDaValue('celestia'),
        getDaValue('avail'),
        getDaValue('eigenda'),
      ]
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
  let maxTimestamp = Number.NEGATIVE_INFINITY
  const result: Record<number, Record<string, number>> = {}

  const offset = UnixTime.toStartOf(
    UnixTime.now(),
    resolution === 'daily'
      ? 'day'
      : resolution === 'sixHourly'
        ? 'six hours'
        : 'hour',
  )

  const fullySyncedRecords = records.filter((r) => r.timestamp < offset)

  for (const record of fullySyncedRecords) {
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
      result[timestamp] = {}
    }
    const currentDaLayerValue = result[timestamp][record.daLayer] ?? 0
    result[timestamp][record.daLayer] = currentDaLayerValue + Number(value)
    minTimestamp = Math.min(minTimestamp, timestamp)
    maxTimestamp = Math.max(maxTimestamp, timestamp)
  }
  return {
    grouped: result,
    minTimestamp: UnixTime(minTimestamp),
    maxTimestamp: UnixTime(maxTimestamp),
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
      const ethereum = Math.random() * 900_000_000 + 90_000_000
      const celestia = Math.random() * 900_000_000 + 90_000_000
      const avail = Math.random() * 900_000_000 + 90_000_000
      const eigenda = Math.random() * 900_000_000 + 90_000_000
      total += ethereum + celestia + avail + eigenda
      return [timestamp, ethereum, celestia, avail, eigenda]
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
