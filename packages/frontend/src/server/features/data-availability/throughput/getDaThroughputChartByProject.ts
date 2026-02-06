import type { Project } from '@l2beat/config'
import type { DataAvailabilityRecord } from '@l2beat/database'
import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { partition } from 'es-toolkit/compat'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import type { ChartResolution } from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/rangeToDays'
import { generateTimestamps } from '../../utils/generateTimestamps'
import type { ProjectDaThroughputChartParams } from './getProjectDaThroughputChart'
import { isThroughputSynced } from './isThroughputSynced'
import { getThroughputExpectedTimestamp } from './utils/getThroughputExpectedTimestamp'
import { rangeToResolution } from './utils/range'
import { sumByResolutionAndProject } from './utils/sumByResolutionAndProject'

export type DaThroughputChartDataPoint = [
  timestamp: number,
  values: Record<string, number> | null,
]

export type DaThroughputChartDataByChart = {
  chart: DaThroughputChartDataPoint[]
  syncedUntil: number
  sovereignProjects: string[]
}

export async function getDaThroughputChartByProject(
  params: ProjectDaThroughputChartParams,
) {
  if (env.MOCK) {
    return getMockDaThroughputChartByProject(params)
  }

  const data = await getDaThroughputChartByProjectData(params)
  if (!data) {
    return undefined
  }
  const resolution = rangeToResolution(params.range)

  const { grouped, from, to, syncedUntil, daLayer } = data

  const timestamps = generateTimestamps([from, to], resolution)

  const chart: DaThroughputChartDataPoint[] = []
  for (const timestamp of timestamps) {
    const values = grouped[timestamp] ?? null
    chart.push([timestamp, values])
  }

  return {
    chart,
    syncedUntil,
    sovereignProjects:
      daLayer?.daLayer.sovereignProjectsTrackingConfig?.map((p) => p.name) ??
      [],
  }
}

export async function getDaThroughputChartByProjectData({
  range,
  projectId,
  includeScalingOnly,
}: ProjectDaThroughputChartParams) {
  const db = getDb()

  const resolution = rangeToResolution(range)
  const [allProjects, daLayer] = await Promise.all([
    ps.getProjects({}),
    ps.getProject({
      id: ProjectId(projectId),
      select: ['daLayer'],
    }),
  ])

  const sovereignProjectIds =
    daLayer?.daLayer.sovereignProjectsTrackingConfig?.map((p) => p.projectId)

  const throughput = await db.dataAvailability.getByDaLayersAndTimeRange(
    [projectId],
    range,
    includeScalingOnly ? sovereignProjectIds : undefined,
  )

  if (throughput.length === 0) {
    return undefined
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
    includeScalingOnly,
  )

  const expectedTo = getThroughputExpectedTimestamp({
    to: range[1],
    resolution,
  })

  const adjustedTo = isThroughputSynced({
    syncedUntil,
    pastDaySynced: false,
    to: range[1],
  })
    ? maxTimestamp
    : expectedTo

  return {
    daLayer,
    grouped,
    from: minTimestamp,
    to: adjustedTo,
    syncedUntil,
  }
}

function groupByTimestampAndProjectId(
  records: DataAvailabilityRecord[],
  allProjects: Project[],
  resolution: ChartResolution,
  sovereignProjects: Map<ProjectId, string>,
  includeScalingOnly: boolean,
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

    if (result[timestamp]) {
      result[timestamp][projectName] = Number(value)
    } else {
      result[timestamp] = {
        [projectName]: Number(value),
      }
    }

    minTimestamp = Math.min(minTimestamp, timestamp)
    maxTimestamp = Math.max(maxTimestamp, timestamp)
  }

  if (!includeScalingOnly) {
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

async function getMockDaThroughputChartByProject({
  range,
}: ProjectDaThroughputChartParams): Promise<DaThroughputChartDataByChart> {
  const days = rangeToDays(range) ?? 730
  const to = UnixTime.toStartOf(UnixTime.now(), 'day')
  const from = range[0] ?? to - days * UnixTime.DAY

  const timestamps = generateTimestamps([from, to], 'daily')
  const value = () => Math.random() * 900_000_000 + 90_000_000

  const projects = (await ps.getProjects({ where: ['isScaling'] }))
    .map((p) => p.name)
    .slice(0, 50)

  return {
    chart: timestamps.map((timestamp) => [
      timestamp,
      Object.fromEntries(projects.map((p) => [p, value()])),
    ]),
    syncedUntil: to,
    sovereignProjects: [],
  }
}
