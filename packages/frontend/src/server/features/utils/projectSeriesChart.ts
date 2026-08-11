import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { ChartRange, type ChartResolution } from '~/utils/range/range'
import { generateTimestamps } from './generateTimestamps'

/**
 * Shared input schema of the `detailedChartWithProjectsRanges` endpoints
 * keyed by plain project ids (activity, data posted).
 */
export const ProjectsChartParams = v.object({
  range: ChartRange,
  projects: v.array(v.string().transform((value) => value as ProjectId)),
})

export type ChartProjectRange = {
  projectId: ProjectId
  /** First timestamp with data, floored to the chart resolution. */
  sinceTimestamp: number
}

/**
 * Maps project ids to their {@link ChartProjectRange}, flooring each since
 * timestamp to the chart resolution and dropping projects without data.
 */
export function toProjectRanges(
  projectIds: ProjectId[],
  getSinceTimestamp: (projectId: ProjectId) => number | undefined,
  resolution: ChartResolution,
): ChartProjectRange[] {
  return projectIds.flatMap((projectId) => {
    const sinceTimestamp = getSinceTimestamp(projectId)
    return sinceTimestamp !== undefined
      ? [
          {
            projectId,
            sinceTimestamp: UnixTime.toStartOf(sinceTimestamp, resolution),
          },
        ]
      : []
  })
}

export function minSinceTimestamp(
  projectRanges: ChartProjectRange[],
): number | undefined {
  return projectRanges.length > 0
    ? Math.min(...projectRanges.map((p) => p.sinceTimestamp))
    : undefined
}

/**
 * The shared "has this project launched yet" gate: true from the project's
 * first data point on, false before it and for projects without data.
 */
export function sinceTimestampGate(
  projectRanges: ChartProjectRange[],
): (projectId: ProjectId, timestamp: number) => boolean {
  const sinceByProjectId = new Map(
    projectRanges.map((p) => [p.projectId, p.sinceTimestamp]),
  )
  return (projectId, timestamp) => {
    const sinceTimestamp = sinceByProjectId.get(projectId)
    return sinceTimestamp !== undefined && timestamp >= sinceTimestamp
  }
}

/**
 * Assembles the per-timestamp rows of a multi-project chart, applying the
 * shared zero/null convention: an absent bucket is `zero` where `fillZero`
 * holds (inside the project's active window) and `null` everywhere else
 * (pre-launch, past sync, or untracked), so clients can distinguish
 * "measured zero" from "no data".
 */
export function buildProjectSeriesChart<T>({
  timestamps,
  projectIds,
  getValue,
  fillZero,
  zero,
}: {
  timestamps: number[]
  projectIds: ProjectId[]
  /** The project's bucket at the timestamp, undefined when there is none. */
  getValue: (projectId: ProjectId, timestamp: number) => T | undefined
  /** Whether an absent bucket means `zero` rather than "no data". */
  fillZero: (projectId: ProjectId, timestamp: number) => boolean
  /** Shared read-only value emitted for every zero-filled bucket. */
  zero: T
}): [timestamp: number, projects: Record<string, T | null>][] {
  return timestamps.map((timestamp) => {
    const projectsForTimestamp: Record<string, T | null> = {}
    for (const projectId of projectIds) {
      projectsForTimestamp[projectId] =
        getValue(projectId, timestamp) ??
        (fillZero(projectId, timestamp) ? zero : null)
    }
    return [timestamp, projectsForTimestamp]
  })
}

/** The shared shape of the env.MOCK variants of these endpoints. */
export function getMockProjectSeriesChartData<T>({
  projectIds,
  range,
  resolution,
  defaultStart,
  value,
}: {
  projectIds: ProjectId[]
  range: ChartRange
  resolution: ChartResolution
  /** Chart start when the range is 'max' (null start). */
  defaultStart: number
  value: (index: number) => T
}): {
  chart: [timestamp: number, projects: Record<string, T | null>][]
  projects: ChartProjectRange[]
  syncedUntil: number
} {
  const timestamps = generateTimestamps(
    [range[0] ?? defaultStart, range[1]],
    resolution,
  )

  return {
    chart: timestamps.map((timestamp) => [
      timestamp,
      Object.fromEntries(
        projectIds.map((projectId, index) => [projectId, value(index)]),
      ),
    ]),
    projects: projectIds.map((projectId) => ({
      projectId,
      sinceTimestamp: timestamps[0] ?? 0,
    })),
    syncedUntil: timestamps[timestamps.length - 1] ?? 0,
  }
}
