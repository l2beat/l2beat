import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { MIN_TIMESTAMPS } from '~/consts/minTimestamps'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getRangeWithMax } from '~/utils/range/range'
import { generateTimestamps } from '../../utils/generateTimestamps'
import { aggregateActivityRecords } from './utils/aggregateActivityRecords'
import { getActivityProjects } from './utils/getActivityProjects'
import { getFullySyncedActivityRange } from './utils/getFullySyncedActivityRange'
import { getActivitySyncWarning } from './utils/isActivitySynced'
import type { ActivityProjectFilter } from './utils/projectFilterUtils'
import { createActivityProjectsFilter } from './utils/projectFilterUtils'
import type { ActivityTimeRange } from './utils/range'

export type RecategorisedActivityChartData = {
  data: [
    timestamp: number,
    rollupsCount: number,
    validiumsAndOptimiumsCount: number,
    ethereumCount: number,
  ][]
  syncWarning: string | undefined
  syncedUntil: number
}

/**
 * A function that computes values for chart data of the activity over time.
 * @returns [timestamp, rollupsCount, validiumAndOptimiumsCount, othersCount, ethereumCount][] - all numbers
 */
export async function getRecategorisedActivityChart(
  filter: ActivityProjectFilter,
  range: ActivityTimeRange,
): Promise<RecategorisedActivityChartData> {
  if (env.MOCK) {
    return getMockRecategorisedActivityChart(filter, range)
  }

  const db = getDb()
  const projects = (await getActivityProjects()).filter(
    createActivityProjectsFilter(filter),
  )

  const rollups = projects
    .filter(
      (p) =>
        p.scalingInfo.type === 'ZK Rollup' ||
        p.scalingInfo.type === 'Optimistic Rollup',
    )
    .map((p) => p.id)
  const validiumsAndOptimiums = projects
    .filter(
      (p) =>
        p.scalingInfo.type === 'Validium' || p.scalingInfo.type === 'Optimium',
    )
    .map((p) => p.id)

  const adjustedRange = getFullySyncedActivityRange(range)
  const [rollupsEntries, validiumsAndOptimiumsEntries, ethereumEntries] =
    await Promise.all([
      await db.activity.getByProjectsAndTimeRange(rollups, adjustedRange),
      await db.activity.getByProjectsAndTimeRange(
        validiumsAndOptimiums,
        adjustedRange,
      ),
      await db.activity.getByProjectsAndTimeRange(
        [ProjectId.ETHEREUM],
        adjustedRange,
      ),
    ])

  const syncedUntil = adjustedRange[1]
  const syncWarning = getActivitySyncWarning(syncedUntil)

  const aggregatedRollupsEntries =
    aggregateActivityRecords(rollupsEntries) ?? {}
  const aggregatedValidiumsAndOptimiumsEntries =
    aggregateActivityRecords(validiumsAndOptimiumsEntries) ?? {}
  const aggregatedEthereumEntries =
    aggregateActivityRecords(ethereumEntries, true) ?? {}

  if (
    Object.values(aggregatedRollupsEntries).length === 0 &&
    Object.values(aggregatedValidiumsAndOptimiumsEntries).length === 0 &&
    Object.values(aggregatedEthereumEntries).length === 0
  ) {
    return { data: [], syncWarning, syncedUntil: syncedUntil }
  }

  const startTimestamp = Math.min(
    ...Object.keys(aggregatedRollupsEntries).map(Number),
    ...Object.keys(aggregatedValidiumsAndOptimiumsEntries).map(Number),
    ...Object.keys(aggregatedEthereumEntries).map(Number),
  )
  const timestamps = generateTimestamps(
    [UnixTime(startTimestamp), adjustedRange[1]],
    'daily',
  )

  const data: [number, number, number, number][] = timestamps.map(
    (timestamp) => {
      const rollupsEntry = aggregatedRollupsEntries[timestamp]
      const validiumsAndOptimiumsEntry =
        aggregatedValidiumsAndOptimiumsEntries[timestamp]
      const ethereumEntry = aggregatedEthereumEntries[timestamp]

      const rollupsCount = rollupsEntry?.uopsCount ?? 0
      const validiumsAndOptimiumsCount =
        validiumsAndOptimiumsEntry?.uopsCount ?? 0
      const ethereumCount = ethereumEntry?.ethereumUopsCount ?? 0

      return [
        +timestamp,
        rollupsCount,
        validiumsAndOptimiumsCount,
        ethereumCount,
      ]
    },
  )
  return {
    data,
    syncWarning,
    syncedUntil: syncedUntil,
  }
}

function getMockRecategorisedActivityChart(
  _: ActivityProjectFilter,
  timeRange: ActivityTimeRange,
): RecategorisedActivityChartData {
  const [from, to] = getRangeWithMax(timeRange, 'daily')
  const adjustedRange: [UnixTime, UnixTime] = [
    from ?? MIN_TIMESTAMPS.activity,
    to,
  ]
  const timestamps = generateTimestamps(adjustedRange, 'daily')

  return {
    data: timestamps.map((timestamp) => [+timestamp, 15000, 11000, 12000]),
    syncWarning: getActivitySyncWarning(adjustedRange[1]),
    syncedUntil: adjustedRange[1],
  }
}
