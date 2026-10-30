import type { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import type { ChartRange } from '~/utils/range/range'
import { countPerSecond } from '../layer2s/activity/utils/countPerSecond'
import { getActivityProjects } from '../layer2s/activity/utils/getActivityProjects'
import { getFullySyncedActivityRange } from '../layer2s/activity/utils/getFullySyncedActivityRange'
import { getSummedTvsValues } from '../layer2s/tvs/utils/getSummedTvsValues'
import { getTvsProjects } from '../layer2s/tvs/utils/getTvsProjects'
import { createTvsProjectsFilter } from '../layer2s/tvs/utils/projectFilterUtils'
import {
  computeSeriesChange,
  computeWeeklyAverageChange,
  EMPTY_HOME_KPI,
  getLatestValue,
  type HomeKpi,
  type HomeSeriesPoint,
} from './homeSeries'

export interface HomeL2Charts {
  /** Each point breaks down into rollups and validiums & optimiums. */
  tvs: HomeKpi
  /** UOPS. */
  activity: HomeKpi
}

export const EMPTY_HOME_L2_CHARTS: HomeL2Charts = {
  tvs: EMPTY_HOME_KPI,
  activity: EMPTY_HOME_KPI,
}

export async function getHomeL2Charts(
  range: ChartRange,
): Promise<HomeL2Charts> {
  if (env.MOCK) {
    return getMockHomeL2Charts(range)
  }

  const [tvs, activity] = await Promise.all([
    getHomeTvsChart(range),
    getHomeActivityChart(range),
  ])

  return { tvs, activity }
}

async function getHomeTvsChart(
  range: ChartRange,
): Promise<HomeL2Charts['tvs']> {
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

  const chart = mergeSeriesByTimestamp(
    rollupValues,
    validiumAndOptimiumValues,
  ).map(
    ([timestamp, rollups, vAndO]): HomeSeriesPoint => [
      timestamp,
      sum(rollups, vAndO),
      rollups,
      vAndO,
    ],
  )
  return {
    chart,
    value: getLatestValue(chart),
    change: computeSeriesChange(chart),
  }
}

async function getHomeActivityChart(
  range: ChartRange,
): Promise<HomeL2Charts['activity']> {
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
  ).map(([timestamp, rollups, vAndO]): HomeSeriesPoint => {
    const count = sum(rollups, vAndO)
    return [timestamp, count !== null ? countPerSecond(count) : null]
  })

  return {
    chart,
    value: getLatestValue(chart),
    change: computeWeeklyAverageChange(chart),
  }
}

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

/** Rollups and validiums & optimiums together; null where neither has data. */
function sum(rollups: number | null, vAndO: number | null): number | null {
  return rollups !== null || vAndO !== null
    ? (rollups ?? 0) + (vAndO ?? 0)
    : null
}

function getMockHomeL2Charts(range: ChartRange): HomeL2Charts {
  const adjustedRange: [UnixTime, UnixTime] = [range[0] ?? 1590883200, range[1]]
  const timestamps = generateTimestamps(adjustedRange, 'day')

  return {
    tvs: {
      chart: timestamps.map((timestamp) => [+timestamp, 5000, 3000, 2000]),
      value: 5000,
      change: 0,
    },
    activity: {
      chart: timestamps.map((timestamp) => [+timestamp, countPerSecond(24000)]),
      value: countPerSecond(24000),
      change: 0,
    },
  }
}
