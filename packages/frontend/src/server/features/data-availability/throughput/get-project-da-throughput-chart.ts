import type { DataAvailabilityRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { z } from 'zod'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { rangeToDays } from '~/utils/range/range-to-days'
import { generateTimestamps } from '../../utils/generate-timestamps'
import { DaThroughputTimeRange } from './utils/range'

// [timestamp, value]
export type ProjectDaThroughputDataPoint = [number, number]

export const ProjectDaThroughputChartParams = z.object({
  range: DaThroughputTimeRange,
  projectId: z.string(),
})
export type ProjectDaThroughputChartParams = z.infer<
  typeof ProjectDaThroughputChartParams
>

export function getProjectDaThroughputChart(
  params: ProjectDaThroughputChartParams,
) {
  if (env.MOCK) {
    return getMockProjectDaThroughputChartData(params)
  }

  return getCachedProjectDaThroughputChartData(params)
}

const getCachedProjectDaThroughputChartData = cache(
  async ({
    range,
    projectId,
  }: ProjectDaThroughputChartParams): Promise<
    ProjectDaThroughputDataPoint[]
  > => {
    const db = getDb()
    const days = rangeToDays(range)
    const to = UnixTime.now().toStartOf('day').add(-1, 'days')
    const from = days ? to.add(-days, 'days') : null
    const throughput = await db.dataAvailability.getByProjectIdsAndTimeRange(
      [projectId],
      [from, to],
    )
    if (throughput.length === 0) {
      return []
    }
    const { grouped, minTimestamp, maxTimestamp } =
      groupByTimestampAndProjectId(throughput)

    const timestamps = generateTimestamps([minTimestamp, maxTimestamp], 'daily')
    return timestamps.map((timestamp) => {
      return [timestamp.toNumber(), grouped[timestamp.toNumber()] ?? 0]
    })
  },
  ['project-da-throughput-chart-data'],
  { tags: ['hourly-data'], revalidate: UnixTime.HOUR },
)

function groupByTimestampAndProjectId(records: DataAvailabilityRecord[]) {
  let minTimestamp = Infinity
  let maxTimestamp = -Infinity
  const result: Record<number, number> = {}
  for (const record of records) {
    const timestamp = record.timestamp.toNumber()
    const value = record.totalSize
    if (!result[timestamp]) {
      result[timestamp] = Number(value)
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

function getMockProjectDaThroughputChartData({
  range,
}: ProjectDaThroughputChartParams): ProjectDaThroughputDataPoint[] {
  const days = rangeToDays(range) ?? 730
  const to = UnixTime.now().toStartOf('day')
  const from = to.add(-days, 'days')

  const timestamps = generateTimestamps([from, to], 'daily')
  return timestamps.map((timestamp) => {
    // Generate random but somewhat realistic values
    const throughputValue = Math.random() * 900_000_000 + 90_000_000

    return [timestamp.toNumber(), Math.round(throughputValue)]
  })
}
