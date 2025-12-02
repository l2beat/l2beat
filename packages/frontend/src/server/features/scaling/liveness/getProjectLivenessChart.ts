import type { AggregatedLivenessRecord } from '@l2beat/database'
import {
  assert,
  ProjectId,
  TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import groupBy from 'lodash/groupBy'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { ChartRange } from '~/utils/range/range'
import { generateTimestamps } from '../../utils/generateTimestamps'
import { isLivenessSynced } from './utils/isLivenessSynced'
import { rangeToResolution } from './utils/range'

export type ProjectLivenessChartParams = v.infer<
  typeof ProjectLivenessChartParams
>
export const ProjectLivenessChartParams = v.object({
  range: ChartRange,
  subtype: TrackedTxsConfigSubtype,
  projectId: v.string(),
})

type ProjectLivenessChartData = {
  data: [number, number | null, number | null, number | null][]
  stats:
    | Partial<
        Record<'stateUpdates' | 'batchSubmissions' | 'proofSubmissions', number>
      >
    | undefined
}

/**
 * A function that computes values for chart data of the liveness over time.
 * @returns [timestamp, min, avg, max][] - all numbers
 */
export async function getProjectLivenessChart({
  range,
  subtype,
  projectId,
}: ProjectLivenessChartParams): Promise<ProjectLivenessChartData> {
  if (env.MOCK) {
    return getMockProjectLivenessChartData({ range, subtype, projectId })
  }
  const db = getDb()
  const resolution = rangeToResolution(range)

  const [livenessProject] = await ps.getProjects({
    ids: [ProjectId(projectId)],
    optional: ['livenessConfig'],
  })
  const livenessConfig = livenessProject?.livenessConfig
  let effectiveSubtype = subtype
  if (livenessConfig?.duplicateData.to === subtype) {
    effectiveSubtype = livenessConfig.duplicateData.from
  }
  const [chartEntries, subtypeAverages] = await Promise.all([
    db.aggregatedLiveness.getByProjectAndSubtypeInTimeRange(
      ProjectId(projectId),
      effectiveSubtype,
      range,
    ),
    db.aggregatedLiveness.getAvgByProjectAndTimeRange(
      ProjectId(projectId),
      range,
    ),
  ])

  const stats = Object.fromEntries(
    subtypeAverages.map(({ subtype, avg }) => [subtype, avg]),
  ) as Partial<Record<TrackedTxsConfigSubtype, number>>

  if (chartEntries.length === 0) {
    return {
      data: [],
      stats: undefined,
    }
  }

  if (livenessConfig?.duplicateData.to) {
    const { from, to } = livenessConfig.duplicateData
    stats[to] = stats[from]
  }

  const syncedUntil = chartEntries.at(-1)?.timestamp
  assert(syncedUntil, 'No syncedUntil found')

  const groupedByResolution = groupBy(chartEntries, (e) =>
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
  const lastTimestamp = Math.max(
    ...Object.keys(groupedByResolution).map(Number),
  )

  const adjustedTo = isLivenessSynced(syncedUntil) ? lastTimestamp : range[1]

  const timestamps = generateTimestamps(
    [startTimestamp, adjustedTo],
    resolution,
  )

  const data: [number, number | null, number | null, number | null][] =
    timestamps.map((timestamp) => {
      const records = groupedByResolution[timestamp]
      if (!records) {
        return [timestamp, null, null, null]
      }
      const { min, max, avg } = calculateLivenessStats(records)
      return [timestamp, min, avg, max]
    })

  return {
    data,
    stats,
  }
}

function calculateLivenessStats(entries: AggregatedLivenessRecord[]) {
  let min = Number.POSITIVE_INFINITY
  let max = Number.NEGATIVE_INFINITY
  let weightedSum = 0
  let totalCount = 0
  for (const entry of entries) {
    if (entry.min < min) min = entry.min
    if (entry.max > max) max = entry.max
    weightedSum += entry.avg * entry.numberOfRecords
    totalCount += entry.numberOfRecords
  }
  const avg = totalCount === 0 ? null : Math.round(weightedSum / totalCount)
  return {
    min: min === Number.POSITIVE_INFINITY ? null : min,
    max: max === Number.NEGATIVE_INFINITY ? null : max,
    avg,
  }
}

function getMockProjectLivenessChartData({
  range,
}: ProjectLivenessChartParams): ProjectLivenessChartData {
  const adjustedRange: [UnixTime, UnixTime] = [
    range[0] ?? UnixTime.fromDate(new Date('2023-05-01T00:00:00Z')),
    range[1],
  ]
  const timestamps = generateTimestamps(adjustedRange, 'daily')

  return {
    data: timestamps.map((timestamp, i) => {
      const base = Math.sin(i * 0.1) * 5
      return [
        +timestamp,
        Math.round(10 + base),
        Math.round(13 + base),
        Math.round(16 + base),
      ]
    }),
    stats: {
      batchSubmissions: 10000,
      proofSubmissions: 1000,
      stateUpdates: 10,
    },
  }
}
