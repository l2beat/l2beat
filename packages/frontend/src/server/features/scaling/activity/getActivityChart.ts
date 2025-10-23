import { assert, ProjectId, type UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getBucketValuesRange } from '~/utils/range/range'
import { generateTimestamps } from '../../utils/generateTimestamps'
import { getActivitySyncState } from '../../utils/syncState'
import { aggregateActivityRecords } from './utils/aggregateActivityRecords'
import { countPerSecond } from './utils/countPerSecond'
import { getActivityProjects } from './utils/getActivityProjects'
import { getFullySyncedActivityRange } from './utils/getFullySyncedActivityRange'
import {
  ActivityProjectFilter,
  createActivityProjectsFilter,
} from './utils/projectFilterUtils'
import { ActivityTimeRange } from './utils/range'
import {
  getActivityAdjustedTimestamp,
  getActivitySyncWarning,
} from './utils/syncStatus'

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
  stats:
    | {
        uops: {
          pastDayCount: number | null
          pastDaySum: number | null
          maxCount: {
            value: number
            timestamp: number
          }
        }
        tps: {
          pastDayCount: number | null
          pastDaySum: number | null
          maxCount: {
            value: number
            timestamp: number
          }
        }
      }
    | undefined
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
  const adjustedRange = await getFullySyncedActivityRange(range)

  const [entries, maxCounts] = await Promise.all([
    db.activity.getByProjectsAndTimeRange(projects, adjustedRange),
    db.activity.getMaxCountsForProjects(),
  ])

  // By default, we assume we're always synced...
  let syncedUntil = adjustedRange[1]
  let syncWarning = undefined

  // ...but if we are looking at a single project, we check the last day we have data for,
  // and use that as the cutoff.
  if (isSingleProject) {
    const projectId = projects[0]
    assert(projectId, 'Project ID is required')
    const syncMetadata = await db.syncMetadata.getByFeatureAndId(
      'activity',
      projectId,
    )

    if (!syncMetadata || syncMetadata.syncedUntil === null) {
      return {
        data: [],
        syncWarning,
        syncedUntil: adjustedRange[1],
        stats: undefined,
      }
    }

    const syncState = getActivitySyncState(syncMetadata, adjustedRange[1])

    syncedUntil = getActivityAdjustedTimestamp(syncState.syncedUntil)
    syncWarning = getActivitySyncWarning(syncState)
  }

  const aggregatedEntries = aggregateActivityRecords(entries)
  if (!aggregatedEntries || Object.values(aggregatedEntries).length === 0) {
    return { data: [], syncWarning, syncedUntil: syncedUntil, stats: undefined }
  }

  const startTimestamp = Math.min(...Object.keys(aggregatedEntries).map(Number))

  const timestamps = generateTimestamps(
    [startTimestamp, adjustedRange[1]],
    'daily',
  )

  const data: ActivityChartDataPoint[] = timestamps.map((timestamp) => {
    const isSynced = syncedUntil >= timestamp
    const fallbackValue = isSynced ? 0 : null

    const entry = aggregatedEntries[timestamp]
    if (!entry || !isSynced) {
      return [
        timestamp,
        null,
        entry?.ethereumCount ?? fallbackValue,
        null,
        entry?.ethereumUopsCount ?? fallbackValue,
      ]
    }

    return [
      timestamp,
      entry.count ?? fallbackValue,
      entry.ethereumCount ?? fallbackValue,
      entry.uopsCount ?? fallbackValue,
      entry.ethereumUopsCount ?? fallbackValue,
    ]
  })

  const stats = isSingleProject
    ? getActivityChartStats(projects, data, maxCounts)
    : undefined

  return {
    data,
    syncWarning,
    syncedUntil,
    stats,
  }
}

function getActivityChartStats(
  projects: ProjectId[],
  data: ActivityChartDataPoint[],
  maxCounts: Record<
    ProjectId,
    {
      uopsCount: number
      uopsTimestamp: number
      count: number
      countTimestamp: number
    }
  >,
): ActivityChartData['stats'] {
  const pastDaySumTps = data.at(-1)?.[1] ?? null
  const pastDaySumUops = data.at(-1)?.[3] ?? pastDaySumTps

  const [projectId] = projects.filter((p) => p !== ProjectId.ETHEREUM)
  const maxCount = projectId ? maxCounts[projectId] : undefined

  if (!maxCount) return undefined

  return {
    uops: {
      pastDaySum: pastDaySumUops,
      pastDayCount:
        pastDaySumUops !== null ? countPerSecond(pastDaySumUops) : null,
      maxCount: {
        value: countPerSecond(maxCount.uopsCount),
        timestamp: maxCount.uopsTimestamp,
      },
    },
    tps: {
      pastDaySum: pastDaySumTps,
      pastDayCount:
        pastDaySumTps !== null ? countPerSecond(pastDaySumTps) : null,
      maxCount: {
        value: countPerSecond(maxCount.count),
        timestamp: maxCount.countTimestamp,
      },
    },
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
    syncWarning: undefined,
    syncedUntil: adjustedRange[1],
    stats: undefined,
  }
}
