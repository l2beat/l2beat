import {
  ProjectId,
  TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import { z } from 'zod'
import { unstable_cache as cache } from 'next/cache'
import { LivenessChartTimeRange } from './utils/chart-range'
import { env } from 'process'
import { MIN_TIMESTAMPS } from '~/consts/min-timestamps'
import { getDb } from '~/server/database'
import { getRangeWithMax } from '~/utils/range/range'
import { generateTimestamps } from '../../utils/generate-timestamps'
import { getFullySyncedLivenessRange } from './utils/get-fully-synced-liveness-range'
import type { AggregatedLiveness2Record } from '@l2beat/database/dist/other/aggregated-liveness2/entity'

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
    const entries =
      await db.aggregatedLiveness2.getByProjectAndSubtypeInTimeRange(
        ProjectId(projectId),
        subtype,
        adjustedRange,
      )

    const groupedByDay = new Map<number, AggregatedLiveness2Record>(
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
