import type { DataAvailabilityRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { z } from 'zod'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getRangeWithMax } from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/rangeToDays'
import { CostsTimeRange } from '../../scaling/costs/utils/range'
import { generateTimestamps } from '../../utils/generateTimestamps'
import { DaThroughputTimeRange } from './utils/range'

export type ProjectDaThroughputChartData = {
  chart: ProjectDaThroughputDataPoint[]
  range: [UnixTime | null, UnixTime]
}
export type ProjectDaThroughputDataPoint = [timestamp: number, value: number]

export const ProjectDaThroughputChartParams = z.object({
  range: DaThroughputTimeRange.or(CostsTimeRange),
  projectId: z.string(),
})
export type ProjectDaThroughputChartParams = z.infer<
  typeof ProjectDaThroughputChartParams
>

export async function getProjectDaThroughputChart(
  params: ProjectDaThroughputChartParams,
): Promise<ProjectDaThroughputChartData | undefined> {
  if (env.MOCK) {
    return getMockProjectDaThroughputChartData(params)
  }

  const db = getDb()
  const [from, to] = getRangeWithMax(params.range, 'daily')
  const throughput = await db.dataAvailability2.getByProjectIdsAndTimeRange(
    [params.projectId],
    [from, to],
  )
  if (throughput.length === 0) {
    return undefined
  }
  const { grouped, minTimestamp, maxTimestamp } =
    groupByTimestampAndProjectId(throughput)

  const timestamps = generateTimestamps([minTimestamp, maxTimestamp], 'daily')
  return {
    chart: timestamps.map((timestamp) => {
      return [timestamp, grouped[timestamp] ?? 0]
    }),
    range: [minTimestamp, maxTimestamp],
  }
}

function groupByTimestampAndProjectId(records: DataAvailabilityRecord[]) {
  let minTimestamp = Infinity
  let maxTimestamp = -Infinity
  const result: Record<number, number> = {}
  for (const record of records) {
    const timestamp = UnixTime.toStartOf(record.timestamp, 'day')
    const value = record.totalSize
    if (!result[timestamp]) {
      result[timestamp] = Number(value)
    } else {
      result[timestamp] += Number(value)
    }
    minTimestamp = Math.min(minTimestamp, timestamp)
    maxTimestamp = Math.max(maxTimestamp, timestamp)
  }
  return {
    grouped: result,
    minTimestamp: UnixTime(minTimestamp),
    maxTimestamp: UnixTime(maxTimestamp),
  }
}

function getMockProjectDaThroughputChartData({
  range,
  projectId,
}: ProjectDaThroughputChartParams): ProjectDaThroughputChartData {
  const days = rangeToDays(range) ?? 730
  const to = UnixTime.toStartOf(UnixTime.now(), 'day')
  const from = to - days * UnixTime.DAY

  if (!['ethereum', 'celestia', 'avail'].includes(projectId)) {
    return {
      chart: [],
      range: [from, to],
    }
  }

  const timestamps = generateTimestamps([from, to], 'daily')
  return {
    chart: timestamps.map((timestamp) => {
      const throughputValue = Math.random() * 900_000_000 + 90_000_000

      return [timestamp, Math.round(throughputValue)]
    }),
    range: [from, to],
  }
}
