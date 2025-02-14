import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { MIN_TIMESTAMPS } from '~/consts/min-timestamps'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getRangeWithMax } from '~/utils/range/range'
import { generateTimestamps } from '../../utils/generate-timestamps'
import { isProjectOther } from '../utils/is-project-other'
import { aggregateActivityRecords } from './utils/aggregate-activity-records'
import { getActivityProjects } from './utils/get-activity-projects'
import { getFullySyncedActivityRange } from './utils/get-fully-synced-activity-range'
import { getActivitySyncWarning } from './utils/is-activity-synced'
import type { ActivityProjectFilter } from './utils/project-filter-utils'
import { createActivityProjectsFilter } from './utils/project-filter-utils'
import type { ActivityTimeRange } from './utils/range'

/**
 * A function that computes values for chart data of the activity over time.
 * @returns [timestamp, rollupsCount, validiumAndOptimiumsCount, othersCount, ethereumCount][] - all numbers
 */
export function getRecategorisedActivityChart(
  ...parameters: Parameters<typeof getCachedRecategorisedActivityChartData>
) {
  if (env.MOCK) {
    return getMockRecategorisedActivityChart(...parameters)
  }
  return getCachedRecategorisedActivityChartData(...parameters)
}

export type RecategorisedActivityChartData = Awaited<
  ReturnType<typeof getCachedRecategorisedActivityChartData>
>

export const getCachedRecategorisedActivityChartData = cache(
  async (
    filter: ActivityProjectFilter,
    range: ActivityTimeRange,
    previewRecategorisation: boolean,
  ) => {
    const db = getDb()
    const projects = getActivityProjects().filter(
      createActivityProjectsFilter(filter, previewRecategorisation),
    )

    const rollups = projects
      .filter(
        (p) =>
          (p.display.category === 'ZK Rollup' ||
            p.display.category === 'Optimistic Rollup') &&
          !isProjectOther(p, previewRecategorisation),
      )
      .map((p) => p.id)
    const validiumsAndOptimiums = projects
      .filter(
        (p) =>
          (p.display.category === 'Validium' ||
            p.display.category === 'Optimium') &&
          !isProjectOther(p, previewRecategorisation),
      )
      .map((p) => p.id)
    const others = projects
      .filter((p) => isProjectOther(p, previewRecategorisation))
      .map((p) => p.id)

    const adjustedRange = getFullySyncedActivityRange(range)
    const [
      rollupsEntries,
      validiumsAndOptimiumsEntries,
      othersEntires,
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

    const syncedUntil = adjustedRange[1]
    const syncWarning = getActivitySyncWarning(syncedUntil)

    const aggregatedRollupsEntries =
      aggregateActivityRecords(rollupsEntries) ?? {}
    const aggregatedValidiumsAndOptimiumsEntries =
      aggregateActivityRecords(validiumsAndOptimiumsEntries) ?? {}
    const aggregatedOthersEntries =
      aggregateActivityRecords(othersEntires) ?? {}
    const aggregatedEthereumEntries =
      aggregateActivityRecords(ethereumEntries, true) ?? {}

    if (
      Object.values(aggregatedRollupsEntries).length === 0 &&
      Object.values(aggregatedValidiumsAndOptimiumsEntries).length === 0 &&
      Object.values(aggregatedOthersEntries).length === 0 &&
      Object.values(aggregatedEthereumEntries).length === 0
    ) {
      return { data: [], syncWarning, syncedUntil: syncedUntil.toNumber() }
    }

    const startTimestamp = Math.min(
      ...Object.keys(aggregatedRollupsEntries).map(Number),
      ...Object.keys(aggregatedValidiumsAndOptimiumsEntries).map(Number),
      ...Object.keys(aggregatedOthersEntries).map(Number),
      ...Object.keys(aggregatedEthereumEntries).map(Number),
    )
    const timestamps = generateTimestamps(
      [new UnixTime(startTimestamp), adjustedRange[1]],
      'daily',
    )

    const data: [number, number, number, number, number][] = timestamps.map(
      (timestamp) => {
        const rollupsEntry = aggregatedRollupsEntries[timestamp.toNumber()]
        const validiumsAndOptimiumsEntry =
          aggregatedValidiumsAndOptimiumsEntries[timestamp.toNumber()]
        const othersEntry = aggregatedOthersEntries[timestamp.toNumber()]
        const ethereumEntry = aggregatedEthereumEntries[timestamp.toNumber()]

        const rollupsCount = rollupsEntry?.uopsCount ?? 0
        const validiumsAndOptimiumsCount =
          validiumsAndOptimiumsEntry?.uopsCount ?? 0
        const othersCount = othersEntry?.uopsCount ?? 0
        const ethereumCount = ethereumEntry?.ethereumUopsCount ?? 0

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
      syncWarning,
      syncedUntil: syncedUntil.toNumber(),
    }
  },
  ['recategorised-activity-chart-data'],
  {
    tags: ['hourly-data'],
    revalidate: UnixTime.HOUR,
  },
)

function getMockRecategorisedActivityChart(
  _: ActivityProjectFilter,
  timeRange: ActivityTimeRange,
  __: boolean,
): RecategorisedActivityChartData {
  const [from, to] = getRangeWithMax(timeRange, 'daily')
  const adjustedRange: [UnixTime, UnixTime] = [
    from ?? MIN_TIMESTAMPS.activity,
    to,
  ]
  const timestamps = generateTimestamps(adjustedRange, 'daily')

  return {
    data: timestamps.map((timestamp) => [
      +timestamp,
      15000,
      11000,
      9000,
      12000,
    ]),
    syncWarning: getActivitySyncWarning(adjustedRange[1]),
    syncedUntil: adjustedRange[1].toNumber(),
  }
}
