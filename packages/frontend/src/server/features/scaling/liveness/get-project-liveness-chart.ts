import type { AggregatedLiveness2Record } from '@l2beat/database/dist/other/aggregated-liveness2/entity'
import {
  ProjectId,
  TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import { unstable_cache as cache } from 'next/cache'
import { env } from 'process'
import { z } from 'zod'
import { MIN_TIMESTAMPS } from '~/consts/min-timestamps'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { getRangeWithMax } from '~/utils/range/range'
import { generateTimestamps } from '../../utils/generate-timestamps'
import { LivenessChartTimeRange, rangeToResolution } from './utils/chart-range'

export type ProjectLivenessChartParams = z.infer<
  typeof ProjectLivenessChartParams
>
export const ProjectLivenessChartParams = z.object({
  range: LivenessChartTimeRange,
  subtype: TrackedTxsConfigSubtype,
  projectId: z.string(),
})

/**
 * A function that computes values for chart data of the liveness over time.
 * @returns [timestamp, min, avg, max][] - all numbers
 */
export async function getProjectLivenessChart(
  ...parameters: Parameters<typeof getCachedProjectLivenessChartData>
) {
  if (env.MOCK) {
    return getMockLivenessChart(...parameters)
  }
  return getCachedProjectLivenessChartData(...parameters)
}

export type ProjectLivenessChartData = Awaited<
  ReturnType<typeof getCachedProjectLivenessChartData>
>

export const getCachedProjectLivenessChartData = cache(
  async ({ range, subtype, projectId }: ProjectLivenessChartParams) => {
    const db = getDb()
    const target =
      UnixTime.toStartOf(UnixTime.now(), 'hour') - 2 * UnixTime.HOUR

    const resolution = rangeToResolution(range)
    const [from, to] = getRangeWithMax(range, resolution, {
      now: target,
    })

    const [livenessProject] = await ps.getProjects({
      ids: [ProjectId(projectId)],
      optional: ['livenessConfig'],
    })
    let effectiveSubtype = subtype
    if (livenessProject?.livenessConfig?.duplicateData.to === subtype) {
      effectiveSubtype = livenessProject.livenessConfig.duplicateData.from
    }

    const entries =
      await db.aggregatedLiveness.getByProjectAndSubtypeInTimeRange(
        ProjectId(projectId),
        effectiveSubtype,
        [from, to],
      )

    if (entries.length === 0) {
      return {
        data: [],
      }
    }

    const groupedByResolution = groupBy(entries, (e) =>
      UnixTime.toStartOf(
        e.timestamp,
        resolution === 'hourly'
          ? 'hour'
          : resolution === 'daily'
            ? 'day'
            : 'six hours',
      ),
    )

    const startTimestamp = Math.min(
      ...Object.keys(groupedByResolution).map(Number),
    )
    const timestamps = generateTimestamps([startTimestamp, to], resolution, {
      addTarget: true,
    })

    const data = timestamps.map((timestamp) => {
      const entry = groupedByResolution[timestamp]
      if (!entry) {
        return [+timestamp, null, null, null] as const
      }
      const { min, max, avg } = calculateLivenessStats(entry)
      return [+timestamp, min, avg, max] as const
    })
    return {
      data,
    }
  },
  ['liveness-chart-data'],
  {
    tags: ['hourly-data'],
    revalidate: UnixTime.HOUR,
  },
)

function calculateLivenessStats(entries: AggregatedLiveness2Record[]) {
  let min = Infinity
  let max = -Infinity
  let weightedSum = 0
  let totalCount = 0
  for (const entry of entries) {
    if (entry.min < min) min = entry.min
    if (entry.max > max) max = entry.max
    weightedSum += entry.avg * entry.numberOfRecords
    totalCount += entry.numberOfRecords
  }
  const avg = totalCount === 0 ? null : Math.round(weightedSum / totalCount)
  return { min, max, avg }
}

function getMockLivenessChart({
  range,
}: ProjectLivenessChartParams): ProjectLivenessChartData {
  const [from, to] = getRangeWithMax(range, 'daily')
  const adjustedRange: [UnixTime, UnixTime] = [
    from ?? MIN_TIMESTAMPS.liveness,
    to,
  ]
  const timestamps = generateTimestamps(adjustedRange, 'daily')

  return {
    data: timestamps.map((timestamp) => [+timestamp, 11, 13, 16]),
  }
}
