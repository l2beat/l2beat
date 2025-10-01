import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getBucketValuesRange } from '~/utils/range/range'
import { generateTimestamps } from '../../utils/generateTimestamps'
import { aggregateActivityRecords } from './utils/aggregateActivityRecords'
import { getActivityProjects } from './utils/getActivityProjects'
import { getFullySyncedActivityRange } from './utils/getFullySyncedActivityRange'
import type { ActivityProjectFilter } from './utils/projectFilterUtils'
import { createActivityProjectsFilter } from './utils/projectFilterUtils'
import type { ActivityTimeRange } from './utils/range'

export type RecategorisedActivityChartData = {
  data: [
    timestamp: number,
    rollupsCount: number | null,
    validiumsAndOptimiumsCount: number | null,
    othersCount: number | null,
    ethereumCount: number | null,
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

  const others = projects
    .filter((p) => p.scalingInfo.type === 'Other')
    .map((p) => p.id)

  const adjustedRange = await getFullySyncedActivityRange({ type: range })
  const [
    rollupsEntries,
    validiumsAndOptimiumsEntries,
    othersEntries,
    ethereumEntries,
  ] = await Promise.all([
    await db.activity.getByProjectsAndTimeRange(rollups, adjustedRange),
    await db.activity.getByProjectsAndTimeRange(
      validiumsAndOptimiums,
      adjustedRange,
    ),
    await db.activity.getByProjectsAndTimeRange(others, adjustedRange),
    await db.activity.getByProjectsAndTimeRange(
      [ProjectId.ETHEREUM],
      adjustedRange,
    ),
  ])

  const aggregatedRollupsEntries =
    aggregateActivityRecords(rollupsEntries) ?? {}
  const aggregatedValidiumsAndOptimiumsEntries =
    aggregateActivityRecords(validiumsAndOptimiumsEntries) ?? {}
  const aggregatedOthersEntries = aggregateActivityRecords(othersEntries) ?? {}
  const aggregatedEthereumEntries =
    aggregateActivityRecords(ethereumEntries, true) ?? {}

  if (
    Object.values(aggregatedRollupsEntries).length === 0 &&
    Object.values(aggregatedValidiumsAndOptimiumsEntries).length === 0 &&
    Object.values(aggregatedOthersEntries).length === 0 &&
    Object.values(aggregatedEthereumEntries).length === 0
  ) {
    return { data: [], syncWarning: undefined, syncedUntil: adjustedRange[1] }
  }

  const startTimestamp = Math.min(
    ...Object.keys(aggregatedRollupsEntries).map(Number),
    ...Object.keys(aggregatedValidiumsAndOptimiumsEntries).map(Number),
    ...Object.keys(aggregatedOthersEntries).map(Number),
    ...Object.keys(aggregatedEthereumEntries).map(Number),
  )
  const timestamps = generateTimestamps(
    [UnixTime(startTimestamp), adjustedRange[1]],
    'daily',
  )

  const data: RecategorisedActivityChartData['data'] = timestamps.map(
    (timestamp) => {
      const rollupsEntry = aggregatedRollupsEntries[timestamp]
      const validiumsAndOptimiumsEntry =
        aggregatedValidiumsAndOptimiumsEntries[timestamp]
      const othersEntry = aggregatedOthersEntries[timestamp]
      const ethereumEntry = aggregatedEthereumEntries[timestamp]

      const rollupsCount = rollupsEntry?.uopsCount ?? null
      const validiumsAndOptimiumsCount =
        validiumsAndOptimiumsEntry?.uopsCount ?? null
      const othersCount = othersEntry?.uopsCount ?? null
      const ethereumCount = ethereumEntry?.ethereumUopsCount ?? null

      return [
        +timestamp,
        rollupsCount,
        validiumsAndOptimiumsCount,
        othersCount,
        ethereumCount,
      ]
    },
  )
  return {
    data,
    syncWarning: undefined,
    syncedUntil: adjustedRange[1],
  }
}

function getMockRecategorisedActivityChart(
  _: ActivityProjectFilter,
  timeRange: ActivityTimeRange,
): RecategorisedActivityChartData {
  const [from, to] = getBucketValuesRange({ type: timeRange }, 'daily')
  const adjustedRange: [UnixTime, UnixTime] = [from ?? 1590883200, to]
  const timestamps = generateTimestamps(adjustedRange, 'daily')

  return {
    data: timestamps.map((timestamp) => [
      +timestamp,
      15000,
      11000,
      12000,
      10000,
    ]),
    syncWarning: undefined,
    syncedUntil: adjustedRange[1],
  }
}
