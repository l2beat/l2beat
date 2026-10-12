import type { Project } from '@l2beat/config'
import type { DataAvailabilityRecord } from '@l2beat/database'
import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import partition from 'lodash/partition'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { type ChartResolution, rangeToResolution } from '~/utils/range/range'
import { getChartStartTimestamp } from '../../utils/getChartStartTimestamp'
import type { ProjectDaThroughputChartParams } from './getProjectDaThroughputChart'
import { isThroughputSynced } from './isThroughputSynced'
import { getThroughputExpectedTimestamp } from './utils/getThroughputExpectedTimestamp'
import { sumByResolutionAndProject } from './utils/sumByResolutionAndProject'

export type DaThroughputChartDataPoint = [
  timestamp: number,
  values: Record<string, number> | null,
]

export async function getDaThroughputChartByProjectData({
  range,
  projectId,
  includeL2Only,
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

  const [throughput, firstTimestamp] = await Promise.all([
    db.dataAvailability.getByDaLayersAndTimeRange(
      [projectId],
      range,
      includeL2Only ? sovereignProjectIds : undefined,
    ),
    db.dataAvailability.getFirstTimestampByDaLayers(
      [projectId],
      includeL2Only ? sovereignProjectIds : undefined,
    ),
  ])

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
    includeL2Only,
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

  const from = getChartStartTimestamp({
    rangeStart: range[0],
    firstProjectTimestamp: firstTimestamp,
    dataStart: minTimestamp,
    resolution,
  })

  return {
    daLayer,
    grouped,
    from,
    to: adjustedTo,
    syncedUntil,
  }
}

function groupByTimestampAndProjectId(
  records: DataAvailabilityRecord[],
  allProjects: Project[],
  resolution: ChartResolution,
  sovereignProjects: Map<ProjectId, string>,
  includeL2Only: boolean,
) {
  let minTimestamp = Number.POSITIVE_INFINITY
  let maxTimestamp = Number.NEGATIVE_INFINITY
  const result: Record<number, Record<string, number>> = {}

  const offset = UnixTime.toStartOf(UnixTime.now(), resolution)
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

  if (!includeL2Only) {
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
