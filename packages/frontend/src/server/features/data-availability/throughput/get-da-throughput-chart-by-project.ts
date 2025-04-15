import type { DataAvailabilityRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { z } from 'zod'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { rangeToDays } from '~/utils/range/range-to-days'
import { CostsTimeRange } from '../../scaling/costs/utils/range'
import { generateTimestamps } from '../../utils/generate-timestamps'
import { DaThroughputTimeRange } from './utils/range'

export type DaThroughputChartDataByChart = {
  chart: DaThroughputByProjectDataPoint[]
  range: [UnixTime | null, UnixTime]
}
export type DaThroughputByProjectDataPoint = [
  timestamp: number,
  values: Record<string, number>,
]

export const DaThroughputChartByProjectParams = z.object({
  range: DaThroughputTimeRange.or(CostsTimeRange),
  daLayer: z.string(),
})
export type DaThroughputChartByProjectParams = z.infer<
  typeof DaThroughputChartByProjectParams
>

export function getDaThroughputChartByProject(
  params: DaThroughputChartByProjectParams,
) {
  if (env.MOCK) {
    return getMockDaThroughputChartByProjectData(params)
  }

  return getCachedDaThroughputChartByProjectData(params)
}

const getCachedDaThroughputChartByProjectData = cache(
  async ({
    range,
    daLayer,
  }: DaThroughputChartByProjectParams): Promise<DaThroughputChartDataByChart> => {
    const db = getDb()
    const days = rangeToDays(range)
    const to = UnixTime.toStartOf(UnixTime.now(), 'day') - 1 * UnixTime.DAY
    const from = days ? to - days * UnixTime.DAY : null
    const throughput = await db.dataAvailability.getByDaLayersAndTimeRange(
      [daLayer],
      [from, to],
    )
    if (throughput.length === 0) {
      return {
        chart: [],
        range: [from, to],
      }
    }
    const { grouped, minTimestamp, maxTimestamp } =
      groupByTimestampAndProjectId(throughput)

    const timestamps = generateTimestamps([minTimestamp, maxTimestamp], 'daily')
    return {
      chart: timestamps.map((timestamp) => {
        return [timestamp, grouped[timestamp] ?? {}]
      }),
      range: [minTimestamp, maxTimestamp],
    }
  },
  ['da-throughput-chart-by-project-data'],
  { tags: ['hourly-data'], revalidate: UnixTime.HOUR },
)

function groupByTimestampAndProjectId(records: DataAvailabilityRecord[]) {
  let minTimestamp = Infinity
  let maxTimestamp = -Infinity
  const result: Record<number, Record<string, number>> = {}
  for (const record of records) {
    if (record.daLayer === record.projectId) {
      continue
    }
    const timestamp = record.timestamp
    const value = record.totalSize
    result[timestamp] = {
      ...result[timestamp],
      [record.projectId]: Number(value),
    }
    minTimestamp = Math.min(minTimestamp, timestamp)
    maxTimestamp = Math.max(maxTimestamp, timestamp)
  }
  return {
    grouped: Object.fromEntries(
      Object.entries(result).map(([timestamp, projects]) => [
        timestamp,
        Object.fromEntries(
          Object.entries(projects).sort(
            ([, valueA], [, valueB]) => valueB - valueA,
          ),
        ),
      ]),
    ),
    minTimestamp: UnixTime(minTimestamp),
    maxTimestamp: UnixTime(maxTimestamp),
  }
}

function getMockDaThroughputChartByProjectData({
  range,
}: DaThroughputChartByProjectParams): DaThroughputChartDataByChart {
  const days = rangeToDays(range) ?? 730
  const to = UnixTime.toStartOf(UnixTime.now(), 'day')
  const from = to - days * UnixTime.DAY

  const timestamps = generateTimestamps([from, to], 'daily')
  return {
    chart: timestamps.map((timestamp) => {
      const values = {
        base: Math.random() * 900_000_000 + 90_000_000,
        optimism: Math.random() * 900_000_000 + 90_000_000,
        arbitrum: Math.random() * 900_000_000 + 90_000_000,
        polygon: Math.random() * 900_000_000 + 90_000_000,
        zkSync: Math.random() * 900_000_000 + 90_000_000,
        zkSyncEra: Math.random() * 900_000_000 + 90_000_000,
        gnosis: Math.random() * 900_000_000 + 90_000_000,
        linea: Math.random() * 900_000_000 + 90_000_000,
      }

      return [timestamp, values]
    }),
    range: [from, to],
  }
}
