import type { ProjectsSummedDataAvailabilityRecord } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import {
  ChartRange,
  type ChartResolution,
  rangeToResolution,
} from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/rangeToDays'
import { getActivityForProjectAndRange } from '../../layer2s/activity/getActivityForProjectAndRange'
import { generateTimestamps } from '../../utils/generateTimestamps'
import { getChartStartTimestamp } from '../../utils/getChartStartTimestamp'
import { isThroughputSynced } from './isThroughputSynced'
import { THROUGHPUT_ENABLED_DA_LAYERS } from './utils/consts'
import { getThroughputExpectedTimestamp } from './utils/getThroughputExpectedTimestamp'

export type Layer2sProjectDaThroughputChart = {
  chart: Layer2sProjectDaThroughputChartPoint[]
  syncedUntil: UnixTime
  stats: {
    total: number
    avgPerDay: number
    postedPerUop: number
  }
}
type Layer2sProjectDaThroughputChartPoint = [
  timestamp: number,
  ethereum: number | null,
  celestia: number | null,
  avail: number | null,
  eigenda: number | null,
]

export const Layer2sProjectDaThroughputChartParams = v.object({
  range: ChartRange,
  projectId: v.string(),
})
export type Layer2sProjectDaThroughputChartParams = v.infer<
  typeof Layer2sProjectDaThroughputChartParams
>

export async function getLayer2sProjectDaThroughputChart({
  projectId,
  range,
}: Layer2sProjectDaThroughputChartParams): Promise<Layer2sProjectDaThroughputChart | null> {
  if (env.MOCK) {
    return getMockLayer2sProjectDaThroughputChart({ range, projectId })
  }

  const db = getDb()
  const resolution = rangeToResolution(range)

  const [throughput, activityRecords, firstTimestamp] = await Promise.all([
    db.dataAvailability.getByProjectIdsAndTimeRange([projectId], range),
    getActivityForProjectAndRange(projectId, range),
    db.dataAvailability.getFirstTimestampByProjectIds([projectId]),
  ])

  if (throughput.length === 0) {
    return null
  }

  const syncedUntil = throughput.at(-1)?.timestamp
  assert(syncedUntil, 'syncedUntil is undefined')

  const { grouped, minTimestamp, maxTimestamp } = groupByTimestamp(
    throughput,
    resolution,
  )

  const lastTimestampForLayers: Record<string, number> = {}
  for (const layer of THROUGHPUT_ENABLED_DA_LAYERS) {
    const lastValue = Object.entries(grouped).findLast(
      ([_, values]) => values[layer] && values[layer] > 0,
    )
    if (lastValue) {
      lastTimestampForLayers[layer] = Number(lastValue[0])
    }
  }

  const expectedTo = getThroughputExpectedTimestamp({
    to: range[1],
    resolution,
  })
  const adjustedTo = isThroughputSynced({
    to: range[1],
    syncedUntil,
    pastDaySynced: false,
  })
    ? maxTimestamp
    : expectedTo

  const startTimestamp = getChartStartTimestamp({
    rangeStart: range[0],
    firstProjectTimestamp: firstTimestamp,
    dataStart: minTimestamp,
    resolution,
  })

  const timestamps = generateTimestamps(
    [startTimestamp, adjustedTo],
    resolution,
  )

  let total = 0
  const chart: Layer2sProjectDaThroughputChartPoint[] = timestamps.map(
    (timestamp) => {
      const posted = grouped[timestamp]
      if (posted) {
        total += Object.values(posted).reduce((sum, val) => sum + val, 0)
      }
      const getDaValue = (layer: string) => {
        const lastTimestamp = lastTimestampForLayers[layer]
        const isBefore = lastTimestamp && timestamp <= lastTimestamp
        return isBefore ? (grouped[timestamp]?.[layer] ?? 0) : null
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
  resolution: ChartResolution,
) {
  let minTimestamp = Number.POSITIVE_INFINITY
  let maxTimestamp = Number.NEGATIVE_INFINITY
  const result: Record<number, Record<string, number>> = {}

  const offset = UnixTime.toStartOf(UnixTime.now(), resolution)

  const fullySyncedRecords = records.filter((r) => r.timestamp < offset)

  for (const record of fullySyncedRecords) {
    const timestamp = UnixTime.toStartOf(record.timestamp, resolution)
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

function getMockLayer2sProjectDaThroughputChart({
  range,
}: Layer2sProjectDaThroughputChartParams): Layer2sProjectDaThroughputChart {
  const days = rangeToDays(range) ?? 730
  const to = UnixTime.toStartOf(UnixTime.now(), 'day')
  const from = range[0] ?? to - days * UnixTime.DAY

  const timestamps = generateTimestamps([from, to], 'day')

  let total = 0
  const chart: Layer2sProjectDaThroughputChartPoint[] = timestamps.map(
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
