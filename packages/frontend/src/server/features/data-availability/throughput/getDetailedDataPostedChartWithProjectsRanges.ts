import type { Database } from '@l2beat/database'
import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import { getChartStartTimestamp } from '~/server/features/utils/getChartStartTimestamp'
import { ChartRange } from '~/utils/range/range'

export const DataPostedChartWithProjectsRangesDataParams = v.object({
  range: ChartRange,
  projects: v.array(v.string().transform((value) => value as ProjectId)),
})

export type DataPostedChartWithProjectsRangesDataParams = v.infer<
  typeof DataPostedChartWithProjectsRangesDataParams
>

export type DetailedDataPostedChartWithProjectsRangesDataPoint = [
  timestamp: number,
  /** Bytes posted per day per project, summed across DA layers. */
  projects: Record<string, number | null>,
]

export type DataPostedChartProjectRange = {
  projectId: ProjectId
  /** First day with data-posted data, floored to the day resolution. */
  sinceTimestamp: number
}

export type DetailedDataPostedChartWithProjectsRangesData = {
  chart: DetailedDataPostedChartWithProjectsRangesDataPoint[]
  projects: DataPostedChartProjectRange[]
  syncedUntil: number
}

/**
 * @returns data-posted chart data split by project id and timestamp,
 * mirroring the shape of `getDetailedActivityChartWithProjectsRanges`.
 * Each series sums the project's bytes across every DA layer it posts to,
 * so projects on different layers are comparable on one chart.
 */
export async function getDetailedDataPostedChartWithProjectsRanges({
  range,
  projects,
}: DataPostedChartWithProjectsRangesDataParams): Promise<DetailedDataPostedChartWithProjectsRangesData> {
  if (env.MOCK) {
    return getMockDetailedDataPostedChartWithProjectsRangesData({
      range,
      projects,
    })
  }

  if (projects.length === 0) {
    return { chart: [], projects: [], syncedUntil: UnixTime.now() }
  }

  const db = getDb()
  // DA records are hourly and the current day is still being written, so
  // clamp the range to full UTC days to avoid a misleading partial bucket.
  const adjustedRange: ChartRange = [
    range[0],
    Math.min(range[1], UnixTime.toStartOf(UnixTime.now(), 'day')),
  ]
  return await getDataPostedChartData(
    db.dataAvailability,
    projects,
    adjustedRange,
  )
}

/**
 * The unit behind the tRPC procedure, taking the repository so tests can
 * exercise it with mocked records. `range` is already clamped to full days,
 * so every generated timestamp is a complete daily bucket.
 */
export async function getDataPostedChartData(
  repository: Database['dataAvailability'],
  projectIds: ProjectId[],
  range: ChartRange,
): Promise<DetailedDataPostedChartWithProjectsRangesData> {
  const [records, firstTimestamps] = await Promise.all([
    repository.getByProjectIdsAndTimeRange(projectIds, range),
    repository.getFirstTimestampsByProjectIds(projectIds),
  ])

  const projectRanges: DataPostedChartProjectRange[] = projectIds.flatMap(
    (projectId) => {
      const sinceTimestamp = firstTimestamps[projectId]
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

  if (records.length === 0) {
    return { chart: [], projects: projectRanges, syncedUntil: range[1] }
  }

  // Sum the hourly per-layer, per-configuration records into daily
  // per-project buckets.
  const bytesByProjectId = new Map<string, Map<number, number>>()
  let dataStart = Number.POSITIVE_INFINITY
  let dataEnd = Number.NEGATIVE_INFINITY
  for (const record of records) {
    const timestamp = UnixTime.toStartOf(record.timestamp, 'day')
    dataStart = Math.min(dataStart, timestamp)
    dataEnd = Math.max(dataEnd, timestamp)
    const buckets = bytesByProjectId.get(record.projectId) ?? new Map()
    buckets.set(
      timestamp,
      (buckets.get(timestamp) ?? 0) + Number(record.totalSize),
    )
    bytesByProjectId.set(record.projectId, buckets)
  }

  // A missing trailing bucket is ambiguous: the project may have stopped
  // posting or its tracking may have ended. Mirror the single-project chart
  // and cut each series after its last non-zero day instead of dropping to
  // an endless zero tail.
  const lastNonzeroByProjectId = new Map<string, number>()
  for (const [projectId, buckets] of bytesByProjectId) {
    for (const [timestamp, bytes] of buckets) {
      if (bytes > 0) {
        const last = lastNonzeroByProjectId.get(projectId)
        if (last === undefined || timestamp > last) {
          lastNonzeroByProjectId.set(projectId, timestamp)
        }
      }
    }
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
  const timestamps = generateTimestamps([startTimestamp, dataEnd], 'day')

  const chart: DetailedDataPostedChartWithProjectsRangesDataPoint[] =
    timestamps.map((timestamp) => {
      const projectsForTimestamp: Record<string, number | null> = {}

      for (const projectId of projectIds) {
        // Zero only between the project's first record and its last non-zero
        // day; null everywhere else so the client can distinguish "posted
        // nothing" from "no data" (pre-launch, stopped, or untracked).
        const sinceTimestamp = sinceByProjectId.get(projectId)
        const lastNonzero = lastNonzeroByProjectId.get(projectId)
        const isActive =
          sinceTimestamp !== undefined &&
          timestamp >= sinceTimestamp &&
          lastNonzero !== undefined &&
          timestamp <= lastNonzero
        projectsForTimestamp[projectId] = isActive
          ? (bytesByProjectId.get(projectId)?.get(timestamp) ?? 0)
          : null
      }

      return [timestamp, projectsForTimestamp]
    })

  return { chart, projects: projectRanges, syncedUntil: dataEnd }
}

function getMockDetailedDataPostedChartWithProjectsRangesData({
  range,
  projects,
}: DataPostedChartWithProjectsRangesDataParams): DetailedDataPostedChartWithProjectsRangesData {
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
          100_000_000 * (index + 1),
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
