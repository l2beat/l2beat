import type { Project } from '@l2beat/config'
import type { DataAvailabilityRecord } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import partition from 'lodash/partition'
import { z } from 'zod'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { getRangeWithMax } from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/range-to-days'
import { generateTimestamps } from '../../utils/generate-timestamps'
import { DaThroughputTimeRange } from './utils/range'

export type DaThroughputChartDataByChart = [
  timestamp: number,
  values: Record<string, number>,
][]

export const DaThroughputChartByProjectParams = z.object({
  range: DaThroughputTimeRange,
  daLayer: z.string(),
})
export type DaThroughputChartByProjectParams = z.infer<
  typeof DaThroughputChartByProjectParams
>

export async function getDaThroughputChartByProject(
  ...parameters: Parameters<typeof getDaThroughputChartByProjectData>
) {
  if (env.MOCK) {
    return getMockDaThroughputChartByProjectData(...parameters)
  }
  return getDaThroughputChartByProjectData(...parameters)
}

const getDaThroughputChartByProjectData = async (
  params: DaThroughputChartByProjectParams,
): Promise<DaThroughputChartDataByChart> => {
  const db = getDb()
  const [from, to] = getRangeWithMax(params.range, 'daily')
  const [throughput, allProjects] = await Promise.all([
    db.dataAvailability2.getByDaLayersAndTimeRange(
      [params.daLayer],
      [from, to],
    ),
    ps.getProjects({}),
  ])
  if (throughput.length === 0) {
    return []
  }
  const { grouped, minTimestamp, maxTimestamp } = groupByTimestampAndProjectId(
    throughput,
    allProjects,
  )

  const timestamps = generateTimestamps([minTimestamp, maxTimestamp], 'daily')
  return timestamps.map((timestamp) => [timestamp, grouped[timestamp] ?? {}])
}

function groupByTimestampAndProjectId(
  records: DataAvailabilityRecord[],
  allProjects: Project[],
) {
  let minTimestamp = Infinity
  let maxTimestamp = -Infinity
  const result: Record<number, Record<string, number>> = {}
  const [daLayerRecords, projectRecords] = partition(
    records,
    (r) => r.daLayer === r.projectId,
  )

  for (const record of projectRecords) {
    const timestamp = UnixTime.toStartOf(record.timestamp, 'day')
    const value = record.totalSize
    const project = allProjects.find((p) => p.id === record.projectId)
    assert(project, `Project ${record.projectId} not found`)
    const currentValue = result[timestamp]?.[project.name]

    result[timestamp] = {
      ...result[timestamp],
      [project.name]: currentValue
        ? currentValue + Number(value)
        : Number(value),
    }
    minTimestamp = Math.min(minTimestamp, timestamp)
    maxTimestamp = Math.max(maxTimestamp, timestamp)
  }

  // Add the difference between the total size and the sum of the other projects as 'Unknown'
  const summedByDayDay: DataAvailabilityRecord[] = Object.entries(
    groupBy(daLayerRecords, (r) => UnixTime.toStartOf(r.timestamp, 'day')),
  ).map(([day, records]) => {
    const daLayer = records[0]?.daLayer
    assert(daLayer, 'DaLayer not found')
    return {
      timestamp: Number(day),
      totalSize: records.reduce((acc, r) => acc + BigInt(r.totalSize), 0n),
      projectId: daLayer,
      daLayer,
    }
  })

  for (const record of summedByDayDay) {
    const timestamp = UnixTime.toStartOf(record.timestamp, 'day')
    const value = record.totalSize
    const restSummed = Object.values(result[timestamp] ?? {}).reduce(
      (acc, curr) => acc + curr,
      0,
    )

    result[timestamp] = {
      ...result[timestamp],
      ['Unknown']: Number(value) - restSummed,
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
  return timestamps.map((timestamp) => {
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
  })
}
