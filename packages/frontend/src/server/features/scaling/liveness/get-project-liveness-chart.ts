import type { AggregatedLivenessRecord } from '@l2beat/database'
import {
  ProjectId,
  TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { env } from 'process'
import { z } from 'zod'
import { MIN_TIMESTAMPS } from '~/consts/min-timestamps'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { getRangeWithMax } from '~/utils/range/range'
import { generateTimestamps } from '../../utils/generate-timestamps'
import { LivenessChartTimeRange } from './utils/chart-range'
import { getFullySyncedLivenessRange } from './utils/get-fully-synced-liveness-range'

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
    const adjustedRange = getFullySyncedLivenessRange(range)

    const [livenessProject] = await ps.getProjects({
      ids: [ProjectId(projectId)],
      optional: ['livenessConfig'],
    })
    if (livenessProject?.livenessConfig?.duplicateData.to === subtype) {
      subtype = livenessProject.livenessConfig.duplicateData.from
    }

    const entries =
      await db.aggregatedLiveness.getByProjectAndSubtypeInTimeRange(
        ProjectId(projectId),
        subtype,
        adjustedRange,
      )

    if (entries.length === 0) {
      return {
        data: [],
      }
    }

    const groupedByDay = new Map<number, AggregatedLivenessRecord>(
      entries.map((e) => [e.timestamp, e]),
    )

    const startTimestamp = Math.min(...entries.map((e) => e.timestamp))
    const timestamps = generateTimestamps(
      [UnixTime(startTimestamp), adjustedRange[1]],
      'daily',
    )

    const data = timestamps.map((timestamp) => {
      const entry = groupedByDay.get(timestamp)
      if (!entry) {
        return [+timestamp, null, null, null] as const
      }
      return [+timestamp, entry.min, entry.avg, entry.max] as const
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
