import type { ProjectsSummedDataAvailabilityRecord } from '@l2beat/database'
import { assert, type ProjectId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { rangeToDays } from '~/utils/range/rangeToDays'
import { CostsTimeRange } from '../../scaling/costs/utils/range'
import { generateTimestamps } from '../../utils/generateTimestamps'
import { isThroughputSynced } from './isThroughputSynced'
import { getThroughputExpectedTimestamp } from './utils/getThroughputExpectedTimestamp'
import {
  DaThroughputTimeRange,
  getThroughputRange,
  rangeToResolution,
} from './utils/range'

type ProjectDaThroughputChart = {
  chart: ProjectDaThroughputChartPoint[]
  range: [UnixTime | null, UnixTime]
  syncedUntil: UnixTime
}
export type ProjectDaThroughputChartPoint = [
  timestamp: number,
  value: number | null,
]

export const ProjectDaThroughputChartParams = v.object({
  range: v.union([
    v.object({
      type: v.union([DaThroughputTimeRange, CostsTimeRange]),
    }),
    v.object({
      type: v.literal('custom'),
      from: v.number(),
      to: v.number(),
    }),
  ]),
  includeScalingOnly: v.boolean(),
  projectId: v.string(),
})
export type ProjectDaThroughputChartParams = v.infer<
  typeof ProjectDaThroughputChartParams
>

export async function getProjectDaThroughputChart(
  params: ProjectDaThroughputChartParams,
): Promise<ProjectDaThroughputChart | undefined> {
  if (env.MOCK) {
    return getMockProjectDaThroughputChart(params)
  }
  const resolution = rangeToResolution(params.range)

  const data = await getProjectDaThroughputChartData(params)
  if (!data) {
    return undefined
  }
  const { grouped, from, to, maxTimestamp, syncedUntil } = data

  const timestamps = generateTimestamps([from, to], resolution)

  return {
    chart: timestamps.map((timestamp) => {
      const posted =
        timestamp <= maxTimestamp ? (grouped[timestamp] ?? 0) : null
      return [timestamp, posted]
    }),
    range: [from, maxTimestamp],
    syncedUntil,
  }
}

export async function getProjectDaThroughputChartData(
  params: ProjectDaThroughputChartParams,
) {
  const db = getDb()
  const resolution = rangeToResolution(params.range)
  const range = getThroughputRange(params.range)

  const daLayer = await ps.getProject({
    id: params.projectId as ProjectId,
    select: ['daLayer'],
  })
  const sovereignProjectsIds =
    daLayer?.daLayer.sovereignProjectsTrackingConfig?.map((c) => c.projectId)

  const throughput = await (params.includeScalingOnly
    ? db.dataAvailability.getSummedProjectsByDaLayersAndTimeRange(
        [params.projectId],
        range,
        sovereignProjectsIds,
      )
    : db.dataAvailability.getByProjectIdsAndTimeRange(
        [params.projectId],
        range,
      ))

  if (throughput.length === 0) {
    return undefined
  }

  const syncedUntil = throughput.at(-1)?.timestamp
  assert(syncedUntil, 'syncedUntil is undefined')

  const { grouped, minTimestamp, maxTimestamp } = groupByTimestampAndProjectId(
    throughput,
    resolution,
  )

  const expectedTo = getThroughputExpectedTimestamp(
    resolution,
    params.range.type === 'custom' ? params.range.to : undefined,
  )

  const adjustedTo = isThroughputSynced(syncedUntil, false)
    ? maxTimestamp
    : expectedTo

  return {
    grouped,
    from: minTimestamp,
    to: adjustedTo,
    maxTimestamp,
    syncedUntil,
  }
}

function groupByTimestampAndProjectId(
  records: ProjectsSummedDataAvailabilityRecord[],
  resolution: 'hourly' | 'sixHourly' | 'daily',
) {
  let minTimestamp = Number.POSITIVE_INFINITY
  let maxTimestamp = Number.NEGATIVE_INFINITY
  const result: Record<number, number> = {}

  const offset = UnixTime.toStartOf(
    UnixTime.now(),
    resolution === 'daily'
      ? 'day'
      : resolution === 'sixHourly'
        ? 'six hours'
        : 'hour',
  )
  const fullySyncedRecords = records.filter((r) => r.timestamp < offset)

  for (const record of fullySyncedRecords) {
    const timestamp = UnixTime.toStartOf(
      record.timestamp,
      resolution === 'daily'
        ? 'day'
        : resolution === 'sixHourly'
          ? 'six hours'
          : 'hour',
    )
    const value = record.totalSize
    if (!result[timestamp]) {
      result[timestamp] = Number(value)
    } else {
      result[timestamp] += Number(value)
    }
    minTimestamp = Math.min(minTimestamp, timestamp)
    maxTimestamp = Math.max(maxTimestamp, timestamp)
  }

  return {
    grouped: result,
    minTimestamp: UnixTime(minTimestamp),
    maxTimestamp: UnixTime(maxTimestamp),
  }
}

function getMockProjectDaThroughputChart({
  range,
  projectId,
}: ProjectDaThroughputChartParams): ProjectDaThroughputChart {
  const days = rangeToDays(range) ?? 730
  const to = UnixTime.toStartOf(UnixTime.now(), 'day')
  const from = to - days * UnixTime.DAY

  if (!['ethereum', 'celestia', 'avail', 'eigenda'].includes(projectId)) {
    return {
      chart: [],
      range: [from, to],
      syncedUntil: UnixTime.now(),
    }
  }

  const timestamps = generateTimestamps([from, to], 'daily')
  return {
    chart: timestamps.map((timestamp) => {
      const throughputValue = Math.random() * 900_000_000 + 90_000_000

      return [timestamp, Math.round(throughputValue)]
    }),
    range: [from, to],
    syncedUntil: UnixTime.now(),
  }
}
