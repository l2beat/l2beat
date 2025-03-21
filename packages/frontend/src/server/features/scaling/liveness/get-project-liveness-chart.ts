import type { IndexerConfigurationRecord } from '@l2beat/database'
import type { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { z } from 'zod'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { getRange } from '~/utils/range/range'
import { generateTimestamps } from '../../utils/generate-timestamps'
import { calculate30DayRollingStats } from './utils/calculate-30day-rolling-stats'
import { calculateIntervals } from './utils/calculate-intervals'
import { LivenessProjectTimeRange, rangeToResolution } from './utils/range'

export const LivenessProjectChartParams = z.object({
  range: LivenessProjectTimeRange,
  projectId: z.string(),
})
export type LivenessProjectChartParams = z.infer<
  typeof LivenessProjectChartParams
>

/**
 * A function that computes values for chart data of the costs over time.
 * @returns [timestamp, overheadGas, overheadEth, overheadUsd, calldataGas, calldataEth, calldataUsd, computeGas, computeEth, computeUsd, blobsGas, blobsEth, blobsUsd][] - all numbers
 */
export function getLivenessProjectChart(
  ...parameters: Parameters<typeof getCachedLivenessProjectChartData>
) {
  if (env.MOCK) {
    return getMockLivenessProjectChartData(...parameters)
  }
  return getCachedLivenessProjectChartData(...parameters)
}

export type LivenessProjectChartData = Awaited<
  ReturnType<typeof getCachedLivenessProjectChartData>
>

export const getCachedLivenessProjectChartData = cache(
  async ({ range: projectId }: LivenessProjectChartParams) => {
    const db = getDb()
    const [project] = await ps.getProjects({
      ids: [ProjectId(projectId)],
      select: ['trackedTxsConfig', 'scalingInfo', 'statuses'],
      optional: ['isArchived'],
      whereNot: ['isUpcoming'],
    })
    if (!project) {
      return []
    }

    const configurationIds = await db.indexerConfiguration.getByIndexerId(
      'tracked_txs_indexer',
    )

    const to = UnixTime.toStartOf(UnixTime.now(), 'hour')
    const from = to - 30 * UnixTime.DAY

    const relevantConfigs = getRelevantConfigs(
      configurationIds,
      projectId,
      'batchSubmissions',
      from - 30 * UnixTime.DAY,
      to,
    )

    const records = await db.liveness.getByConfigurationIdWithinTimeRange(
      relevantConfigs.map((c) => c.id),
      from - 30 * UnixTime.DAY,
      to,
    )
    const intervals = calculateIntervals(records.map((r) => r.timestamp))

    const lastIndex = intervals.findIndex(
      (interval) => interval.timestamp <= from,
    )
    console.log('lastIndex', lastIndex)
    console.log('intervals', intervals.length)

    const { means, stdDeviations } = calculate30DayRollingStats(
      intervals,
      0,
      lastIndex,
      to,
    )

    const currentRange = intervals.slice(0, lastIndex)

    const chart = currentRange.map((interval) => {
      const point = UnixTime.toStartOf(interval.timestamp, 'minute')
      const mean = means.get(point)
      const stdDev = stdDeviations.get(point)

      assert(mean !== undefined, 'Mean should not be undefined')
      assert(stdDev !== undefined, 'StdDev should not be undefined')

      const z = (interval.duration - mean) / stdDev
      const isAnomaly = z >= 15 && interval.duration > mean

      return [
        interval.timestamp,
        interval.duration,
        mean,
        15 * stdDev + mean,
        isAnomaly ? interval.duration : null,
      ] as const
    })

    return chart.reverse()
  },
  ['liveness-chart-data'],
  {
    tags: ['hourly-data'],
    revalidate: UnixTime.HOUR,
  },
)

function getMockLivenessProjectChartData({
  range: timeRange,
}: LivenessProjectChartParams): LivenessProjectChartData {
  const resolution = rangeToResolution(timeRange)
  const range = getRange(timeRange === 'max' ? '1y' : timeRange, resolution)

  const timestamps = generateTimestamps(range, resolution)

  return timestamps.map(
    (timestamp) =>
      [
        timestamp,
        20000, // duration
        10000, // mean
        15000, // threshold (mean + 15*stdDev)
        null, // anomaly (null if not an anomaly)
      ] as const,
  )
}

function getRelevantConfigs(
  configurationIds: IndexerConfigurationRecord[],
  projectId: string,
  subtype: TrackedTxsConfigSubtype,
  from: UnixTime,
  to: UnixTime,
) {
  const parsed = configurationIds.map((c) => ({
    ...c,
    properties: JSON.parse(c.properties) as {
      subtype: TrackedTxsConfigSubtype
      projectId: string
    },
  }))

  return parsed.filter(
    (c) =>
      c.properties.projectId === projectId &&
      c.properties.subtype === subtype &&
      c.minHeight <= to &&
      (!c.maxHeight || c.maxHeight >= from),
  )
}
