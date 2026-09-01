import { assert, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ChartRange, rangeToResolution } from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/rangeToDays'
import { getActivityForProjectAndRange } from '../../layer2s/activity/getActivityForProjectAndRange'
import { generateTimestamps } from '../../utils/generateTimestamps'
import { getChartStartTimestamp } from '../../utils/getChartStartTimestamp'
import {
  groupByTimestampAndDaLayerId,
  sumGroupedDataPosted,
} from './getDaThroughputChart'
import { isThroughputSynced } from './isThroughputSynced'
import { THROUGHPUT_ENABLED_DA_LAYERS } from './utils/consts'
import { getThroughputExpectedTimestamp } from './utils/getThroughputExpectedTimestamp'

export type L2ProjectDaThroughputChart = {
  chart: L2ProjectDaThroughputChartPoint[]
  syncedUntil: UnixTime
  stats: {
    total: number
    avgPerDay: number
    postedPerUop: number
  }
}
type L2ProjectDaThroughputChartPoint = [
  timestamp: number,
  ethereum: number | null,
  celestia: number | null,
  avail: number | null,
  eigenda: number | null,
]

export const L2ProjectDaThroughputChartParams = v.object({
  range: ChartRange,
  projectId: v.string(),
})
export type L2ProjectDaThroughputChartParams = v.infer<
  typeof L2ProjectDaThroughputChartParams
>

export async function getL2ProjectDaThroughputChart({
  projectId,
  range,
}: L2ProjectDaThroughputChartParams): Promise<L2ProjectDaThroughputChart | null> {
  if (env.MOCK) {
    return getMockL2ProjectDaThroughputChart({ range, projectId })
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

  const { grouped, minTimestamp, maxTimestamp } = groupByTimestampAndDaLayerId(
    throughput,
    resolution,
  )
  const total = sumGroupedDataPosted(grouped)

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

  const chart: L2ProjectDaThroughputChartPoint[] = timestamps.map(
    (timestamp) => {
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

function getMockL2ProjectDaThroughputChart({
  range,
}: L2ProjectDaThroughputChartParams): L2ProjectDaThroughputChart {
  const days = rangeToDays(range) ?? 730
  const to = UnixTime.toStartOf(UnixTime.now(), 'day')
  const from = range[0] ?? to - days * UnixTime.DAY

  const timestamps = generateTimestamps([from, to], 'day')

  let total = 0
  const chart: L2ProjectDaThroughputChartPoint[] = timestamps.map(
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
