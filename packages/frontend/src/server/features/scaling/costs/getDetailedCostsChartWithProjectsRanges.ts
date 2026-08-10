import type { Database } from '@l2beat/database'
import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import { getChartStartTimestamp } from '~/server/features/utils/getChartStartTimestamp'
import { ChartRange, rangeToResolution } from '~/utils/range/range'
import { getCostsExpectedTimestamp } from './utils/getCostsExpectedTimestamp'
import { isCostsSynced } from './utils/isCostsSynced'

export const CostsChartWithProjectsRangesDataParams = v.object({
  range: ChartRange,
  projects: v.array(
    v.object({
      projectId: v.string().transform((value) => value as ProjectId),
      sinceTimestamp: v.number(),
    }),
  ),
})

export type CostsChartWithProjectsRangesDataParams = v.infer<
  typeof CostsChartWithProjectsRangesDataParams
>

export type ProjectCostsChartDataPoint = [gas: number, eth: number, usd: number]

export type DetailedCostsChartWithProjectsRangesDataPoint = [
  timestamp: number,
  projects: Record<string, ProjectCostsChartDataPoint | null>,
]

export type CostsChartProjectRange = {
  projectId: ProjectId
  /** First timestamp with tracked costs, floored to the active resolution. */
  sinceTimestamp: number
}

export type DetailedCostsChartWithProjectsRangesData = {
  chart: DetailedCostsChartWithProjectsRangesDataPoint[]
  projects: CostsChartProjectRange[]
  syncedUntil: number
}

/**
 * @returns onchain costs chart data split by project id and timestamp,
 * mirroring the shape of `getDetailedTvsChartWithProjectsRanges`. Like the
 * TVS variant, each project's `sinceTimestamp` comes from its config so the
 * data gate here can't drift from the client's.
 */
export async function getDetailedCostsChartWithProjectsRanges({
  range,
  projects,
}: CostsChartWithProjectsRangesDataParams): Promise<DetailedCostsChartWithProjectsRangesData> {
  if (env.MOCK) {
    return getMockDetailedCostsChartWithProjectsRangesData({ range, projects })
  }

  if (projects.length === 0) {
    return { chart: [], projects: [], syncedUntil: UnixTime.now() }
  }

  const db = getDb()
  return await getCostsChartData(db.aggregatedL2Cost, projects, range)
}

/**
 * The unit behind the tRPC procedure, taking the repository so tests can
 * exercise it with mocked records.
 */
export async function getCostsChartData(
  repository: Database['aggregatedL2Cost'],
  projects: CostsChartWithProjectsRangesDataParams['projects'],
  range: ChartRange,
): Promise<DetailedCostsChartWithProjectsRangesData> {
  const resolution = rangeToResolution(range)

  // Round each project's `sinceTimestamp` down to the active resolution so
  // the `>= sinceTimestamp` gate aligns with the generated buckets. The
  // rounded values are returned to the client so its tooltip gate can't
  // drift from the data gate computed here.
  const projectRanges: CostsChartProjectRange[] = projects.map((project) => ({
    projectId: project.projectId,
    sinceTimestamp: UnixTime.toStartOf(project.sinceTimestamp, resolution),
  }))
  const projectIds = projectRanges.map((p) => p.projectId)

  const records = await repository.getByProjectsAndTimeRange(projectIds, range)

  // Dismiss the still-filling current bucket - charting its partial sum
  // would read as a costs drop (mirrors `getCostsChart`).
  const bucketCutoff = UnixTime.toStartOf(UnixTime.now(), resolution)
  const syncedRecords = records.filter((r) => r.timestamp < bucketCutoff)
  if (syncedRecords.length === 0) {
    return { chart: [], projects: projectRanges, syncedUntil: 0 }
  }

  const summedByProjectId = new Map<
    string,
    Map<number, ProjectCostsChartDataPoint>
  >()
  let dataStart = Number.POSITIVE_INFINITY
  let maxBucket = Number.NEGATIVE_INFINITY
  let syncedUntil = Number.NEGATIVE_INFINITY
  for (const record of syncedRecords) {
    syncedUntil = Math.max(syncedUntil, record.timestamp)
    const bucket = UnixTime.toStartOf(record.timestamp, resolution)
    dataStart = Math.min(dataStart, bucket)
    maxBucket = Math.max(maxBucket, bucket)

    let projectSums = summedByProjectId.get(record.projectId)
    if (!projectSums) {
      projectSums = new Map()
      summedByProjectId.set(record.projectId, projectSums)
    }
    const existing = projectSums.get(bucket)
    if (existing) {
      existing[0] += record.totalGas
      existing[1] += record.totalGasEth
      existing[2] += record.totalGasUsd
      continue
    }
    projectSums.set(bucket, [
      record.totalGas,
      record.totalGasEth,
      record.totalGasUsd,
    ])
  }

  const sinceByProjectId = new Map(
    projectRanges.map((p) => [p.projectId, p.sinceTimestamp]),
  )
  const firstProjectTimestamp = Math.min(
    ...projectRanges.map((p) => p.sinceTimestamp),
  )

  const adjustedTo = isCostsSynced({ to: range[1], syncedUntil })
    ? maxBucket
    : getCostsExpectedTimestamp(range[1], resolution)
  const startTimestamp = getChartStartTimestamp({
    rangeStart: range[0],
    firstProjectTimestamp,
    dataStart,
    resolution,
  })
  const timestamps = generateTimestamps(
    [startTimestamp, adjustedTo],
    resolution,
  )

  const chart: DetailedCostsChartWithProjectsRangesDataPoint[] = timestamps.map(
    (timestamp) => {
      const projectsForTimestamp: Record<
        string,
        ProjectCostsChartDataPoint | null
      > = {}

      for (const projectId of projectIds) {
        const values = summedByProjectId.get(projectId)?.get(timestamp)
        if (values) {
          projectsForTimestamp[projectId] = values
          continue
        }

        // Zero only inside the synced window and after the project's costs
        // tracking start; null marks buckets before tracking (or past the
        // synced window) so the client can distinguish "no costs" from
        // "no data".
        const sinceTimestamp = sinceByProjectId.get(projectId)
        projectsForTimestamp[projectId] =
          timestamp <= maxBucket &&
          sinceTimestamp !== undefined &&
          timestamp >= sinceTimestamp
            ? [0, 0, 0]
            : null
      }

      return [timestamp, projectsForTimestamp]
    },
  )

  return { chart, projects: projectRanges, syncedUntil }
}

function getMockDetailedCostsChartWithProjectsRangesData({
  range,
  projects,
}: CostsChartWithProjectsRangesDataParams): DetailedCostsChartWithProjectsRangesData {
  const resolution = rangeToResolution(range)
  const timestamps = generateTimestamps(
    [range[0] ?? 1573776000, range[1]],
    resolution,
  )

  return {
    chart: timestamps.map((timestamp) => [
      timestamp,
      Object.fromEntries(
        projects.map(({ projectId }, index) => [
          projectId,
          [1_000_000 * (index + 1), 10 * (index + 1), 30_000 * (index + 1)],
        ]),
      ),
    ]),
    projects: projects.map(({ projectId }) => ({
      projectId,
      sinceTimestamp: timestamps[0] ?? 0,
    })),
    syncedUntil: timestamps[timestamps.length - 1] ?? 0,
  }
}
