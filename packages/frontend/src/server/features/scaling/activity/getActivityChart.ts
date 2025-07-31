import { ProjectId, type UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getBucketValuesRange } from '~/utils/range/range'
import { generateTimestamps } from '../../utils/generateTimestamps'
import { aggregateActivityRecords } from './utils/aggregateActivityRecords'
import { getActivityProjects } from './utils/getActivityProjects'
import { getFullySyncedActivityRange } from './utils/getFullySyncedActivityRange'
import {
  getActivitySyncWarning,
  isActivitySynced,
} from './utils/isActivitySynced'
import {
  ActivityProjectFilter,
  createActivityProjectsFilter,
} from './utils/projectFilterUtils'
import { ActivityTimeRange } from './utils/range'

export type ActivityChartParams = v.infer<typeof ActivityChartParams>
export const ActivityChartParams = v.object({
  filter: ActivityProjectFilter,
  range: v.union([
    v.object({
      type: ActivityTimeRange,
    }),
    v.object({
      type: v.literal('custom'),
      from: v.number(),
      to: v.number(),
    }),
  ]),
})

type ActivityChartDataPoint = [
  timestamp: number,
  projectsTxCount: number | null,
  ethereumTxCount: number | null,
  projectsUopsCount: number | null,
  ethereumUopsCount: number | null,
]

export type ActivityChartData = {
  data: ActivityChartDataPoint[]
  syncWarning: string | undefined
  syncedUntil: UnixTime
}

/**
 * A function that computes values for chart data of the activity over time.
 * @returns [timestamp, projectsTxCount, ethereumTxCount, projectsUopsCount, ethereumUopsCount][] - all numbers
 */
export async function getActivityChart({
  filter,
  range,
}: ActivityChartParams): Promise<ActivityChartData> {
  if (env.MOCK) {
    return getMockActivityChart({ filter, range })
  }

  const db = getDb()
  const projects = (await getActivityProjects())
    .filter(createActivityProjectsFilter(filter))
    .map((p) => p.id)
    .concat(ProjectId.ETHEREUM)
  const isSingleProject = projects.length === 2 // Ethereum + 1 other project
  const adjustedRange = getFullySyncedActivityRange(range)
  const entries = await db.activity.getByProjectsAndTimeRange(
    projects,
    adjustedRange,
  )

  // By default, we assume we're always synced...
  let syncedUntil = adjustedRange[1]
  let syncWarning = getActivitySyncWarning(syncedUntil)

  // ...but if we are looking at a single project, we check the last day we have data for,
  // and use that as the cutoff.
  if (isSingleProject) {
    const lastProjectEntry = entries.findLast(
      (entry) => entry.projectId !== ProjectId.ETHEREUM,
    )
    if (lastProjectEntry) {
      syncedUntil = lastProjectEntry.timestamp
      syncWarning = getActivitySyncWarning(syncedUntil)
    }
  }

  const aggregatedEntries = aggregateActivityRecords(entries)
  if (!aggregatedEntries || Object.values(aggregatedEntries).length === 0) {
    return { data: [], syncWarning, syncedUntil: syncedUntil }
  }

  const startTimestamp = Math.min(...Object.keys(aggregatedEntries).map(Number))
  const endTimestamp = isActivitySynced(syncedUntil)
    ? syncedUntil
    : adjustedRange[1]

  const timestamps = generateTimestamps([startTimestamp, endTimestamp], 'daily')

  const data: ActivityChartDataPoint[] = timestamps.map((timestamp) => {
    const isSynced = syncedUntil >= timestamp
    const fallbackValue = isSynced ? 0 : null

    const entry = aggregatedEntries[timestamp]
    if (!entry) {
      return [timestamp, null, null, null, null]
    }

    return [
      timestamp,
      entry.count ?? fallbackValue,
      entry.ethereumCount ?? fallbackValue,
      entry.uopsCount ?? fallbackValue,
      entry.ethereumUopsCount ?? fallbackValue,
    ]
  })
  return {
    data,
    syncWarning,
    syncedUntil,
  }
}

function getMockActivityChart({
  range,
}: ActivityChartParams): ActivityChartData {
  const [from, to] = getBucketValuesRange(range, 'daily')
  const adjustedRange: [UnixTime, UnixTime] = [
    range.type === 'custom' ? range.from : (from ?? 1590883200),
    range.type === 'custom' ? range.to : to,
  ]
  const timestamps = generateTimestamps(adjustedRange, 'daily')

  return {
    data: timestamps.map((timestamp) => [+timestamp, 15, 11, 16, 12]),
    syncWarning: getActivitySyncWarning(adjustedRange[1]),
    syncedUntil: adjustedRange[1],
  }
}
