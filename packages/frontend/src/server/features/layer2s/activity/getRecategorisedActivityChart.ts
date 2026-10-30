import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import type { ChartRange } from '~/utils/range/range'
import { generateTimestamps } from '../../utils/generateTimestamps'
import { aggregateActivityRecords } from './utils/aggregateActivityRecords'
import { getActivityProjects } from './utils/getActivityProjects'
import {
  type ActivityResolution,
  getActivityResolution,
} from './utils/getActivityResolution'
import { getFullySyncedActivityRange } from './utils/getFullySyncedActivityRange'
import { getHourlyActivityRecords } from './utils/getHourlyActivityRecords'
import type { ActivityProjectFilter } from './utils/projectFilterUtils'
import { createActivityProjectsFilter } from './utils/projectFilterUtils'

export type RecategorisedActivityChartData = {
  data: [
    timestamp: number,
    rollupsUopsCount: number | null,
    validiumsAndOptimiumsUopsCount: number | null,
    othersUopsCount: number | null,
    ethereumUopsCount: number | null,
    rollupsTxCount: number | null,
    validiumsAndOptimiumsTxCount: number | null,
    othersTxCount: number | null,
    ethereumTxCount: number | null,
  ][]
  syncWarning: string | undefined
  syncedUntil: number
  resolution: ActivityResolution
  /** Names of the projects active in the range that are indexed per day, so the hours leave them out */
  withoutHours: string[]
  /** Projects the hours leave out as they are too far behind, with the end of their last full hour */
  behind: { name: string; syncedUntil: number }[]
}

/**
 * A function that computes values for chart data of the activity over time.
 * @returns [timestamp, rollupsTxCount, validiumsAndOptimiumsTxCount, othersTxCount, ethereumTxCount, rollupsUopsCount, validiumsAndOptimiumsUopsCount, othersUopsCount, ethereumUopsCount][] - all numbers
 */
export async function getRecategorisedActivityChart(
  filter: ActivityProjectFilter,
  range: ChartRange,
  /** Lets the shortest ranges read hours. Callers that read days leave it out */
  hourly?: boolean,
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

  const adjustedRange = await getFullySyncedActivityRange(range)
  const resolution = hourly ? getActivityResolution(range) : 'day'
  // Hours are synced past midnight, unlike the day they belong to
  const hours =
    resolution === 'hour'
      ? await getHourlyActivityRecords(
          [...rollups, ...validiumsAndOptimiums, ...others, ProjectId.ETHEREUM],
          range,
        )
      : undefined
  const end = hours?.window.end ?? adjustedRange[1]
  const getEntries = (projectIds: ProjectId[]) => {
    if (!hours) {
      return db.activity.getByProjectsAndTimeRange(projectIds, adjustedRange)
    }
    const ids = new Set(projectIds)
    return hours.records.filter((r) => ids.has(r.projectId))
  }
  const [
    rollupsEntries,
    validiumsAndOptimiumsEntries,
    othersEntries,
    ethereumEntries,
  ] = await Promise.all([
    getEntries(rollups),
    getEntries(validiumsAndOptimiums),
    getEntries(others),
    getEntries([ProjectId.ETHEREUM]),
  ])

  const aggregatedRollupsEntries =
    aggregateActivityRecords(rollupsEntries) ?? {}
  const aggregatedValidiumsAndOptimiumsEntries =
    aggregateActivityRecords(validiumsAndOptimiumsEntries) ?? {}
  const aggregatedOthersEntries = aggregateActivityRecords(othersEntries) ?? {}
  const aggregatedEthereumEntries =
    aggregateActivityRecords(ethereumEntries, { forEthereum: true }) ?? {}

  if (
    Object.values(aggregatedRollupsEntries).length === 0 &&
    Object.values(aggregatedValidiumsAndOptimiumsEntries).length === 0 &&
    Object.values(aggregatedOthersEntries).length === 0 &&
    Object.values(aggregatedEthereumEntries).length === 0
  ) {
    return {
      data: [],
      syncWarning: undefined,
      syncedUntil: end,
      resolution,
      withoutHours: [],
      behind: [],
    }
  }

  const startTimestamp = Math.min(
    ...Object.keys(aggregatedRollupsEntries).map(Number),
    ...Object.keys(aggregatedValidiumsAndOptimiumsEntries).map(Number),
    ...Object.keys(aggregatedOthersEntries).map(Number),
    ...Object.keys(aggregatedEthereumEntries).map(Number),
  )
  const timestamps = generateTimestamps(
    [UnixTime(startTimestamp), end],
    resolution,
  )

  const data: RecategorisedActivityChartData['data'] = timestamps.map(
    (timestamp) => {
      const rollupsEntry = aggregatedRollupsEntries[timestamp]
      const validiumsAndOptimiumsEntry =
        aggregatedValidiumsAndOptimiumsEntries[timestamp]
      const othersEntry = aggregatedOthersEntries[timestamp]
      const ethereumEntry = aggregatedEthereumEntries[timestamp]

      const rollupsTxCount = rollupsEntry?.count ?? null
      const validiumsAndOptimiumsTxCount =
        validiumsAndOptimiumsEntry?.count ?? null
      const othersTxCount = othersEntry?.count ?? null
      const ethereumTxCount = ethereumEntry?.ethereumCount ?? null

      const rollupsUopsCount = rollupsEntry?.uopsCount ?? rollupsTxCount
      const validiumsAndOptimiumsUopsCount =
        validiumsAndOptimiumsEntry?.uopsCount ?? validiumsAndOptimiumsTxCount
      const othersUopsCount = othersEntry?.uopsCount ?? othersTxCount
      const ethereumUopsCount =
        ethereumEntry?.ethereumUopsCount ?? ethereumTxCount

      return [
        +timestamp,
        rollupsUopsCount,
        validiumsAndOptimiumsUopsCount,
        othersUopsCount,
        ethereumUopsCount,
        rollupsTxCount,
        validiumsAndOptimiumsTxCount,
        othersTxCount,
        ethereumTxCount,
      ]
    },
  )
  const withoutHours = hours
    ? await getActiveProjectsWithoutHours(
        projects,
        hours.withHours,
        adjustedRange,
      )
    : []
  const names = new Map<string, string>(projects.map((p) => [p.id, p.name]))
  names.set(ProjectId.ETHEREUM, 'Ethereum')

  return {
    data,
    syncWarning: undefined,
    syncedUntil: end,
    resolution,
    withoutHours: withoutHours.map((p) => p.name),
    behind:
      hours?.window.behind.map((p) => ({
        name: names.get(p.id) ?? p.id,
        syncedUntil: p.syncedUntil,
      })) ?? [],
  }
}

async function getActiveProjectsWithoutHours<T extends { id: ProjectId }>(
  projects: T[],
  withHours: Set<ProjectId>,
  range: ChartRange,
): Promise<T[]> {
  const candidates = projects.filter((p) => !withHours.has(p.id))
  const days = await getDb().activity.getByProjectsAndTimeRange(
    candidates.map((p) => p.id),
    range,
  )
  const active = new Set(
    days.filter((e) => e.count > 0).map((e) => e.projectId),
  )
  return candidates.filter((p) => active.has(p.id))
}

function getMockRecategorisedActivityChart(
  _: ActivityProjectFilter,
  range: ChartRange,
): RecategorisedActivityChartData {
  const adjustedRange: [UnixTime, UnixTime] = [range[0] ?? 1590883200, range[1]]
  const timestamps = generateTimestamps(adjustedRange, 'day')

  return {
    data: timestamps.map((timestamp) => [
      +timestamp,
      15000,
      11000,
      12000,
      10000,
      14000,
      10000,
      11000,
      9000,
    ]),
    syncWarning: undefined,
    syncedUntil: adjustedRange[1],
    resolution: 'day',
    withoutHours: [],
    behind: [],
  }
}
