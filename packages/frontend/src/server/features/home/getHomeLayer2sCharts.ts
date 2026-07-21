import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import type { ChartRange } from '~/utils/range/range'
import { getActivityProjects } from '../layer2s/activity/utils/getActivityProjects'
import { getFullySyncedActivityRange } from '../layer2s/activity/utils/getFullySyncedActivityRange'
import { getSummedTvsValues } from '../layer2s/tvs/utils/getSummedTvsValues'
import { getTvsProjects } from '../layer2s/tvs/utils/getTvsProjects'
import { createTvsProjectsFilter } from '../layer2s/tvs/utils/projectFilterUtils'
import { computeSeriesChange } from './computeSeriesChange'

export interface HomeLayer2sCharts {
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
 * Purpose-built data for HomeLayer2sCard. Unlike the recategorised chart
 * procedures it fetches only the two series the card renders (no "others",
 * no ethereum) and pushes the activity aggregation into SQL.
 */
export async function getHomeLayer2sCharts(
  range: ChartRange,
): Promise<HomeLayer2sCharts> {
  if (env.MOCK) {
    return getMockHomeLayer2sCharts(range)
  }

  const [tvs, activity] = await Promise.all([
    getHomeTvsChart(range),
    getHomeActivityChart(range),
  ])

  return { tvs, activity }
}

async function getHomeTvsChart(
  range: ChartRange,
): Promise<HomeLayer2sCharts['tvs']> {
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

  const byTimestamp = new Map<number, [number | null, number | null]>()
  for (const value of rollupValues) {
    byTimestamp.set(value.timestamp, [value.value, null])
  }
  for (const value of validiumAndOptimiumValues) {
    const entry = byTimestamp.get(value.timestamp)
    if (entry) {
      entry[1] = value.value
    } else {
      byTimestamp.set(value.timestamp, [null, value.value])
    }
  }

  const chart: [number, number | null, number | null][] = [
    ...byTimestamp.entries(),
  ]
    .sort(([a], [b]) => a - b)
    .map(([timestamp, [rollupsValue, vAndOValue]]) => [
      timestamp,
      rollupsValue,
      vAndOValue,
    ])

  const syncedUntil =
    chart.findLast(([_, r, v]) => r !== null || v !== null)?.[0] ??
    UnixTime.now()

  return { chart, syncedUntil, change: computeSummedSeriesChange(chart) }
}

async function getHomeActivityChart(
  range: ChartRange,
): Promise<HomeLayer2sCharts['activity']> {
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

  const byTimestamp = new Map<number, [number | null, number | null]>()
  for (const entry of rollupEntries) {
    byTimestamp.set(entry.timestamp, [entry.uopsCount, null])
  }
  for (const entry of validiumAndOptimiumEntries) {
    const existing = byTimestamp.get(entry.timestamp)
    if (existing) {
      existing[1] = entry.uopsCount
    } else {
      byTimestamp.set(entry.timestamp, [null, entry.uopsCount])
    }
  }

  const chart: [number, number | null, number | null][] = [
    ...byTimestamp.entries(),
  ]
    .sort(([a], [b]) => a - b)
    .map(([timestamp, [rollupsUops, vAndOUops]]) => [
      timestamp,
      rollupsUops,
      vAndOUops,
    ])

  return {
    chart,
    syncedUntil: adjustedRange[1],
    change: computeSummedSeriesChange(chart),
  }
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

function getMockHomeLayer2sCharts(range: ChartRange): HomeLayer2sCharts {
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
