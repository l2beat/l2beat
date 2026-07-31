import type { ActivityRecord, Database } from '@l2beat/database'
import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import { getChartStartTimestamp } from '~/server/features/utils/getChartStartTimestamp'
import { ChartRange } from '~/utils/range/range'
import { getFullySyncedActivityRange } from './utils/getFullySyncedActivityRange'

export const ActivityChartWithProjectsRangesDataParams = v.object({
  range: ChartRange,
  projects: v.array(v.string().transform((value) => value as ProjectId)),
})

export type ActivityChartWithProjectsRangesDataParams = v.infer<
  typeof ActivityChartWithProjectsRangesDataParams
>

export type ProjectActivityChartDataPoint = [count: number, uopsCount: number]

export type DetailedActivityChartWithProjectsRangesDataPoint = [
  timestamp: number,
  projects: Record<string, ProjectActivityChartDataPoint | null>,
]

export type ActivityChartProjectRange = {
  projectId: ProjectId
  /** First day with activity data, floored to the day resolution. */
  sinceTimestamp: number
}

export type DetailedActivityChartWithProjectsRangesData = {
  chart: DetailedActivityChartWithProjectsRangesDataPoint[]
  projects: ActivityChartProjectRange[]
  syncedUntil: number
}

/**
 * @returns activity chart data split by project id and timestamp, mirroring
 * the shape of `getDetailedTvsChartWithProjectsRanges`
 */
export async function getDetailedActivityChartWithProjectsRanges({
  range,
  projects,
}: ActivityChartWithProjectsRangesDataParams): Promise<DetailedActivityChartWithProjectsRangesData> {
  if (env.MOCK) {
    return getMockDetailedActivityChartWithProjectsRangesData({
      range,
      projects,
    })
  }

  if (projects.length === 0) {
    return { chart: [], projects: [], syncedUntil: UnixTime.now() }
  }

  const db = getDb()
  const adjustedRange = await getFullySyncedActivityRange(range)
  return getActivityChartData(db.activity, projects, adjustedRange)
}

/**
 * The unit behind the tRPC procedure, taking the repository so tests can
 * exercise it with mocked records. `range` is already clamped to fully
 * synced days, so every generated timestamp is treated as synced.
 */
export async function getActivityChartData(
  repository: Database['activity'],
  projectIds: ProjectId[],
  range: ChartRange,
): Promise<DetailedActivityChartWithProjectsRangesData> {
  const [records, totals] = await Promise.all([
    repository.getByProjectsAndTimeRange(projectIds, range),
    repository.getActivityTotalsForProjects(projectIds),
  ])

  const projectRanges: ActivityChartProjectRange[] = projectIds.flatMap(
    (projectId) => {
      const sinceTimestamp = totals[projectId]?.sinceTimestamp
      return sinceTimestamp !== undefined
        ? [
            {
              projectId,
              sinceTimestamp: UnixTime.toStartOf(sinceTimestamp, 'day'),
            },
          ]
        : []
    },
  )

  const syncedUntil = range[1]
  if (records.length === 0) {
    return { chart: [], projects: projectRanges, syncedUntil }
  }

  const recordsByProjectId = new Map<string, Map<number, ActivityRecord>>()
  let dataStart = Number.POSITIVE_INFINITY
  for (const record of records) {
    dataStart = Math.min(dataStart, record.timestamp)
    const projectRecords = recordsByProjectId.get(record.projectId)
    if (projectRecords) {
      projectRecords.set(record.timestamp, record)
      continue
    }
    recordsByProjectId.set(
      record.projectId,
      new Map([[record.timestamp, record]]),
    )
  }

  const sinceByProjectId = new Map(
    projectRanges.map((p) => [p.projectId, p.sinceTimestamp]),
  )
  const firstProjectTimestamp =
    projectRanges.length > 0
      ? Math.min(...projectRanges.map((p) => p.sinceTimestamp))
      : undefined

  const startTimestamp = getChartStartTimestamp({
    rangeStart: range[0],
    firstProjectTimestamp,
    dataStart,
    resolution: 'day',
  })
  const timestamps = generateTimestamps([startTimestamp, range[1]], 'day')

  const chart: DetailedActivityChartWithProjectsRangesDataPoint[] =
    timestamps.map((timestamp) => {
      const projectsForTimestamp: Record<
        string,
        ProjectActivityChartDataPoint | null
      > = {}

      for (const projectId of projectIds) {
        const record = recordsByProjectId.get(projectId)?.get(timestamp)
        if (record) {
          projectsForTimestamp[projectId] = [
            record.count,
            record.uopsCount ?? record.count,
          ]
          continue
        }

        // Zero only after the project's first record; null marks days before
        // launch (or projects without activity tracking) so the client can
        // distinguish "no activity" from "no data".
        const sinceTimestamp = sinceByProjectId.get(projectId)
        projectsForTimestamp[projectId] =
          sinceTimestamp !== undefined && timestamp >= sinceTimestamp
            ? [0, 0]
            : null
      }

      return [timestamp, projectsForTimestamp]
    })

  return { chart, projects: projectRanges, syncedUntil }
}

function getMockDetailedActivityChartWithProjectsRangesData({
  range,
  projects,
}: ActivityChartWithProjectsRangesDataParams): DetailedActivityChartWithProjectsRangesData {
  const timestamps = generateTimestamps(
    [range[0] ?? 1590883200, range[1]],
    'day',
  )

  return {
    chart: timestamps.map((timestamp) => [
      timestamp,
      Object.fromEntries(
        projects.map((projectId, index) => [
          projectId,
          [1_000_000 * (index + 1), 1_500_000 * (index + 1)],
        ]),
      ),
    ]),
    projects: projects.map((projectId) => ({
      projectId,
      sinceTimestamp: timestamps[0] ?? 0,
    })),
    syncedUntil: timestamps[timestamps.length - 1] ?? 0,
  }
}
