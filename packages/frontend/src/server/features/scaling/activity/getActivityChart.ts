import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { MIN_TIMESTAMPS } from '~/consts/minTimestamps'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getRangeWithMax } from '~/utils/range/range'
import { generateTimestamps } from '../../utils/generateTimestamps'
import { aggregateActivityRecords } from './utils/aggregateActivityRecords'
import { getActivityProjects } from './utils/getActivityProjects'
import { getFullySyncedActivityRange } from './utils/getFullySyncedActivityRange'
import { getActivitySyncWarning } from './utils/isActivitySynced'
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

export type ActivityChartData = {
  data: [
    timestamp: number,
    projectsTxCount: number | null,
    ethereumTxCount: number | null,
    projectsUopsCount: number | null,
    ethereumUopsCount: number | null,
  ][]
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
  const timestamps = generateTimestamps(
    [UnixTime(startTimestamp), adjustedRange[1]],
    'daily',
  )

  const data: [
    number,
    number | null,
    number | null,
    number | null,
    number | null,
  ][] = timestamps.map((timestamp) => {
    const entry = aggregatedEntries[timestamp]
    if (!entry) {
      return [timestamp, null, null, null, null]
    }
    return [
      timestamp,
      entry.count,
      entry.ethereumCount,
      entry.uopsCount,
      entry.ethereumUopsCount,
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
  const [from, to] = getRangeWithMax(range, 'daily')
  const adjustedRange: [UnixTime, UnixTime] = [
    range.type === 'custom' ? range.from : (from ?? MIN_TIMESTAMPS.activity),
    range.type === 'custom' ? range.to : to,
  ]
  const timestamps = generateTimestamps(adjustedRange, 'daily')

  return {
    data: timestamps.map((timestamp) => [+timestamp, 15, 11, 16, 12]),
    syncWarning: getActivitySyncWarning(adjustedRange[1]),
    syncedUntil: adjustedRange[1],
  }
}
