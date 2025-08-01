import type { Project } from '@l2beat/config'
import type { DataAvailabilityRecord } from '@l2beat/database'
import { assert, type ProjectId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import partition from 'lodash/partition'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { rangeToDays } from '~/utils/range/rangeToDays'
import { generateTimestamps } from '../../utils/generateTimestamps'
import { isThroughputSynced } from './isThroughputSynced'
import { getThroughputExpectedTimestamp } from './utils/getThroughputExpectedTimestamp'
import {
  DaThroughputTimeRange,
  getThroughputRange,
  rangeToResolution,
} from './utils/range'
import { sumByResolutionAndProject } from './utils/sumByResolutionAndProject'

type DaThroughputChartDataPoint = [
  timestamp: number,
  values: Record<string, number> | null,
]

export type DaThroughputChartDataByChart = {
  chart: DaThroughputChartDataPoint[]
  syncedUntil: number
}

export const DaThroughputChartByProjectParams = v.object({
  range: DaThroughputTimeRange,
  daLayer: v.string(),
})
export type DaThroughputChartByProjectParams = v.infer<
  typeof DaThroughputChartByProjectParams
>

export async function getDaThroughputChartByProject(
  ...parameters: Parameters<typeof getDaThroughputChartByProjectData>
) {
  if (env.MOCK) {
    return getMockDaThroughputChartByProjectData(...parameters)
  }
  return await getDaThroughputChartByProjectData(...parameters)
}

const getDaThroughputChartByProjectData = async (
  params: DaThroughputChartByProjectParams,
): Promise<DaThroughputChartDataByChart> => {
  const db = getDb()
  const resolution = rangeToResolution({ type: params.range })
  const range = getThroughputRange({ type: params.range })
  const [throughput, allProjects, daLayer] = await Promise.all([
    db.dataAvailability.getByDaLayersAndTimeRange([params.daLayer], range),
    ps.getProjects({}),
    ps.getProject({
      id: params.daLayer as ProjectId,
      select: ['daLayer'],
    }),
  ])
  if (throughput.length === 0) {
    return {
      chart: [],
      syncedUntil: UnixTime.now(),
    }
  }

  const syncedUntil = throughput.at(-1)?.timestamp
  assert(syncedUntil, 'syncedUntil is undefined')

  const sovereignProjects = new Map(
    daLayer?.daLayer.sovereignProjectsTrackingConfig?.map((p) => [
      p.projectId,
      p.name,
    ]) ?? [],
  )

  const { grouped, minTimestamp, maxTimestamp } = groupByTimestampAndProjectId(
    throughput,
    allProjects,
    resolution,
    sovereignProjects,
  )

  const expectedTo = getThroughputExpectedTimestamp(resolution)

  const adjustedTo = isThroughputSynced(syncedUntil, false)
    ? maxTimestamp
    : expectedTo

  const timestamps = generateTimestamps([minTimestamp, adjustedTo], resolution)

  const chart: DaThroughputChartDataPoint[] = []
  for (const timestamp of timestamps) {
    const values = grouped[timestamp] ?? null
    chart.push([timestamp, values])
  }

  return {
    chart,
    syncedUntil,
  }
}

function groupByTimestampAndProjectId(
  records: DataAvailabilityRecord[],
  allProjects: Project[],
  resolution: 'hourly' | 'sixHourly' | 'daily',
  sovereignProjects: Map<ProjectId, string>,
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

  const [daLayerRecords, projectRecords] = partition(
    fullySyncedRecords,
    (r) => r.daLayer === r.projectId,
  )

  const summedProjectsByDay = sumByResolutionAndProject(
    projectRecords,
    resolution,
  )

  for (const record of summedProjectsByDay) {
    const timestamp = record.timestamp
    const value = record.totalSize

    const projectName =
      allProjects.find((p) => p.id === record.projectId)?.name ??
      sovereignProjects.get(record.projectId as ProjectId)
    assert(projectName, `Project ${record.projectId} not found`)

    result[timestamp] = {
      ...result[timestamp],
      [projectName]: Number(value),
    }
    minTimestamp = Math.min(minTimestamp, timestamp)
    maxTimestamp = Math.max(maxTimestamp, timestamp)
  }

  // Add the difference between the total size and the sum of the other projects as 'Unknown'
  const summedDaLayerByDay = sumByResolutionAndProject(
    daLayerRecords,
    resolution,
  )
  for (const record of summedDaLayerByDay) {
    const timestamp = record.timestamp
    const value = record.totalSize
    const restSummed = Object.values(result[timestamp] ?? {}).reduce(
      (acc, curr) => acc + curr,
      0,
    )

    if (result[timestamp]) {
      result[timestamp]['Unknown'] = Number(value) - restSummed
    } else {
      result[timestamp] = {
        ['Unknown']: Number(value) - restSummed,
      }
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
  const days = rangeToDays({ type: range }) ?? 730
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
    syncedUntil: to,
  }
}
