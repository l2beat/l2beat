import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import type { ChartRange } from '~/utils/range/range'
import { getActivityProjects } from '../scaling/activity/utils/getActivityProjects'
import { getFullySyncedActivityRange } from '../scaling/activity/utils/getFullySyncedActivityRange'
import { getSummedTvsValues } from '../scaling/tvs/utils/getSummedTvsValues'
import { getTvsProjects } from '../scaling/tvs/utils/getTvsProjects'
import { createTvsProjectsFilter } from '../scaling/tvs/utils/projectFilterUtils'
import { computeSeriesChange } from './computeSeriesChange'

export interface HomeScalingCharts {
  /** [timestamp, rollups, validiumsAndOptimiums] */
  tvs: {
    chart: [number, number | null, number | null][]
    syncedUntil: number
    /** Relative change of the summed series over the chart range. */
    change: number | undefined
  }
  /** [timestamp, rollupsUopsCount, validiumsAndOptimiumsUopsCount] */
  activity: {
    chart: [number, number | null, number | null][]
    syncedUntil: number
    /** Relative change of the summed series over the chart range. */
    change: number | undefined
  }
}

/**
 * Purpose-built data for HomeScalingCard. Unlike the recategorised chart
 * procedures it fetches only the two series the card renders (no "others",
 * no ethereum) and pushes the activity aggregation into SQL.
 */
export async function getHomeScalingCharts(
  range: ChartRange,
): Promise<HomeScalingCharts> {
  if (env.MOCK) {
    return getMockHomeScalingCharts(range)
  }

  const [tvs, activity] = await Promise.all([
    getHomeTvsChart(range),
    getHomeActivityChart(range),
  ])

  return { tvs, activity }
}

async function getHomeTvsChart(
  range: ChartRange,
): Promise<HomeScalingCharts['tvs']> {
  const tvsProjects = await getTvsProjects(
    createTvsProjectsFilter({ type: 'layer2' }),
    { withoutArchived: true },
  )

  const rollups = tvsProjects
    .filter((p) => p.category === 'rollups')
    .map((p) => p.projectId)
  const validiumsAndOptimiums = tvsProjects
    .filter((p) => p.category === 'validiumsAndOptimiums')
    .map((p) => p.projectId)

  const options = {
    forSummary: true,
    excludeAssociatedTokens: false,
    excludeRwaRestrictedTokens: true,
  }
  const [rollupValues, validiumAndOptimiumValues] = await Promise.all([
    getSummedTvsValues(rollups, range, options),
    getSummedTvsValues(validiumsAndOptimiums, range, options),
  ])

  const chart = mergeSeriesByTimestamp(rollupValues, validiumAndOptimiumValues)

  const syncedUntil =
    chart.findLast(([_, r, v]) => r !== null || v !== null)?.[0] ??
    UnixTime.now()

  return { chart, syncedUntil, change: computeSummedSeriesChange(chart) }
}

async function getHomeActivityChart(
  range: ChartRange,
): Promise<HomeScalingCharts['activity']> {
  const db = getDb()
  const projects = await getActivityProjects()

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

  const adjustedRange = await getFullySyncedActivityRange(range)
  const [rollupEntries, validiumAndOptimiumEntries] = await Promise.all([
    db.activity.getSummedByTimestamp(rollups, adjustedRange),
    db.activity.getSummedByTimestamp(validiumsAndOptimiums, adjustedRange),
  ])

  const toSeries = (entries: { timestamp: number; uopsCount: number }[]) =>
    entries.map((entry) => ({
      timestamp: entry.timestamp,
      value: entry.uopsCount,
    }))
  const chart = mergeSeriesByTimestamp(
    toSeries(rollupEntries),
    toSeries(validiumAndOptimiumEntries),
  )

  return {
    chart,
    syncedUntil: adjustedRange[1],
    change: computeSummedSeriesChange(chart),
  }
}

/**
 * Zip two per-timestamp series into [timestamp, a, b] rows sorted by
 * timestamp. A timestamp present in only one series gets null for the other.
 */
export function mergeSeriesByTimestamp(
  seriesA: { timestamp: number; value: number | null }[],
  seriesB: { timestamp: number; value: number | null }[],
): [number, number | null, number | null][] {
  const byTimestamp = new Map<number, [number | null, number | null]>()
  for (const { timestamp, value } of seriesA) {
    byTimestamp.set(timestamp, [value, null])
  }
  for (const { timestamp, value } of seriesB) {
    const entry = byTimestamp.get(timestamp)
    if (entry) {
      entry[1] = value
    } else {
      byTimestamp.set(timestamp, [null, value])
    }
  }
  return [...byTimestamp.entries()]
    .sort(([a], [b]) => a - b)
    .map(([timestamp, [a, b]]) => [timestamp, a, b])
}

function computeSummedSeriesChange(
  chart: [number, number | null, number | null][],
): number | undefined {
  return computeSeriesChange(
    chart.map(([_, rollups, vAndO]) =>
      rollups !== null || vAndO !== null ? (rollups ?? 0) + (vAndO ?? 0) : null,
    ),
  )
}

function getMockHomeScalingCharts(range: ChartRange): HomeScalingCharts {
  const adjustedRange: [UnixTime, UnixTime] = [range[0] ?? 1590883200, range[1]]
  const timestamps = generateTimestamps(adjustedRange, 'day')

  return {
    tvs: {
      chart: timestamps.map((timestamp) => [+timestamp, 3000, 2000]),
      syncedUntil: adjustedRange[1],
      change: 0,
    },
    activity: {
      chart: timestamps.map((timestamp) => [+timestamp, 14000, 10000]),
      syncedUntil: adjustedRange[1],
      change: 0,
    },
  }
}
