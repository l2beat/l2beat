import type { DataAvailabilityRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { z } from 'zod'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { rangeToDays } from '~/utils/range/range-to-days'
import { generateTimestamps } from '../../utils/generate-timestamps'
import { DaThroughputTimeRange } from './utils/range'

export type DaThroughputDataPoint = [
  timestamp: number,
  ethereum: number,
  celestia: number,
  avail: number,
]

export const DaThroughputChartParams = z.object({
  range: DaThroughputTimeRange,
})
export type DaThroughputChartParams = z.infer<typeof DaThroughputChartParams>

export function getDaThroughputChart(params: DaThroughputChartParams) {
  if (env.MOCK) {
    return getMockDaThroughputChartData(params)
  }

  return getCachedDaThroughputChartData(params)
}

const getCachedDaThroughputChartData = cache(
  async ({
    range,
  }: DaThroughputChartParams): Promise<DaThroughputDataPoint[]> => {
    const db = getDb()
    const days = rangeToDays(range)
    const to = UnixTime.now().toStartOf('day').add(-1, 'days')
    const from = days ? to.add(-days, 'days') : null
    const throughput = await db.dataAvailability.getByProjectIdsAndTimeRange(
      ['ethereum', 'celestia', 'avail'],
      [from, to],
    )
    if (throughput.length === 0) {
      return []
    }
    const { grouped, minTimestamp, maxTimestamp } =
      groupByTimestampAndProjectId(throughput)

    const timestamps = generateTimestamps([minTimestamp, maxTimestamp], 'daily')
    return timestamps.map((timestamp) => {
      const timestampValues = grouped[timestamp.toNumber()]
      return [
        timestamp.toNumber(),
        timestampValues?.ethereum ?? 0,
        timestampValues?.celestia ?? 0,
        timestampValues?.avail ?? 0,
      ]
    })
  },
  ['da-throughput-chart-data'],
  { tags: ['hourly-data'], revalidate: UnixTime.HOUR },
)

function groupByTimestampAndProjectId(records: DataAvailabilityRecord[]) {
  let minTimestamp = Infinity
  let maxTimestamp = -Infinity
  const result: Record<number, Record<string, number>> = {}
  for (const record of records) {
    const timestamp = record.timestamp.toNumber()
    const projectId = record.projectId
    const value = record.totalSize
    if (!result[timestamp]) {
      result[timestamp] = {}
    }
    if (!result[timestamp][projectId]) {
      result[timestamp][projectId] = Number(value)
    }
    minTimestamp = Math.min(minTimestamp, timestamp)
    maxTimestamp = Math.max(maxTimestamp, timestamp)
  }

  return {
    grouped: result,
    minTimestamp: new UnixTime(minTimestamp),
    maxTimestamp: new UnixTime(maxTimestamp),
  }
}

function getMockDaThroughputChartData({
  range,
}: DaThroughputChartParams): DaThroughputDataPoint[] {
  const days = rangeToDays(range) ?? 730
  const to = UnixTime.now().toStartOf('day')
  const from = to.add(-days, 'days')

  const timestamps = generateTimestamps([from, to], 'daily')
  return timestamps.map((timestamp) => {
    // Generate random but somewhat realistic values
    const ethereum = Math.random() * 900_000_000 + 90_000_000
    const celestia = ethereum * Math.max(21 * Math.random(), 1)
    const avail = ethereum * 1.5 * Math.random()

    return [
      timestamp.toNumber(),
      Math.round(ethereum),
      Math.round(celestia),
      Math.round(avail),
    ]
  })
}
