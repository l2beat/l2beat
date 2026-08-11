import type { ActivityRecord, Database } from '@l2beat/database'
import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import { getChartStartTimestamp } from '~/server/features/utils/getChartStartTimestamp'
import {
  buildProjectSeriesChart,
  type ChartProjectRange,
  getMockProjectSeriesChartData,
  minSinceTimestamp,
  ProjectsChartParams,
  sinceTimestampGate,
  toProjectRanges,
} from '~/server/features/utils/projectSeriesChart'
import type { ChartRange } from '~/utils/range/range'
import { getFullySyncedActivityRange } from './utils/getFullySyncedActivityRange'

export const ActivityChartWithProjectsRangesDataParams = ProjectsChartParams

export type ActivityChartWithProjectsRangesDataParams = v.infer<
  typeof ActivityChartWithProjectsRangesDataParams
>

export type ProjectActivityChartDataPoint = [count: number, uopsCount: number]

export type DetailedActivityChartWithProjectsRangesDataPoint = [
  timestamp: number,
  projects: Record<string, ProjectActivityChartDataPoint | null>,
]

export type DetailedActivityChartWithProjectsRangesData = {
  chart: DetailedActivityChartWithProjectsRangesDataPoint[]
  projects: ChartProjectRange[]
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

  const projectRanges = toProjectRanges(
    projectIds,
    (projectId) => totals[projectId]?.sinceTimestamp,
    'day',
  )

  const syncedUntil = range[1]
  if (records.length === 0) {
    return { chart: [], projects: projectRanges, syncedUntil }
  }

  const recordsByProjectId = new Map<string, Map<number, ActivityRecord>>()
  let dataStart = Number.POSITIVE_INFINITY
  for (const record of records) {
    dataStart = Math.min(dataStart, record.timestamp)
    const projectRecords = recordsByProjectId.get(record.projectId) ?? new Map()
    projectRecords.set(record.timestamp, record)
    recordsByProjectId.set(record.projectId, projectRecords)
  }

  const startTimestamp = getChartStartTimestamp({
    rangeStart: range[0],
    firstProjectTimestamp: minSinceTimestamp(projectRanges),
    dataStart,
    resolution: 'day',
  })
  const timestamps = generateTimestamps([startTimestamp, range[1]], 'day')

  const chart = buildProjectSeriesChart<ProjectActivityChartDataPoint>({
    timestamps,
    projectIds,
    getValue: (projectId, timestamp) => {
      const record = recordsByProjectId.get(projectId)?.get(timestamp)
      return record
        ? [record.count, record.uopsCount ?? record.count]
        : undefined
    },
    // Zero only after the project's first record; null marks days before
    // launch (or projects without activity tracking) so the client can
    // distinguish "no activity" from "no data".
    fillZero: sinceTimestampGate(projectRanges),
    zero: [0, 0],
  })

  return { chart, projects: projectRanges, syncedUntil }
}

function getMockDetailedActivityChartWithProjectsRangesData({
  range,
  projects,
}: ActivityChartWithProjectsRangesDataParams): DetailedActivityChartWithProjectsRangesData {
  return getMockProjectSeriesChartData<ProjectActivityChartDataPoint>({
    projectIds: projects,
    range,
    resolution: 'day',
    defaultStart: 1590883200,
    value: (index) => [1_000_000 * (index + 1), 1_500_000 * (index + 1)],
  })
}
