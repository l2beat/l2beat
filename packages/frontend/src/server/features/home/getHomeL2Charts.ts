import type { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import type { ChartRange } from '~/utils/range/range'
import { getActivityProjects } from '../layer2s/activity/utils/getActivityProjects'
import { getFullySyncedActivityRange } from '../layer2s/activity/utils/getFullySyncedActivityRange'
import { getSummedTvsValues } from '../layer2s/tvs/utils/getSummedTvsValues'
import { getTvsProjects } from '../layer2s/tvs/utils/getTvsProjects'
import { createTvsProjectsFilter } from '../layer2s/tvs/utils/projectFilterUtils'
import {
  computeSeriesChange,
  computeWeeklyAverageChange,
} from './computeSeriesChange'

export interface HomeL2Charts {
  tvs: {
    /** [timestamp, rollups, validiumsAndOptimiums] */
    chart: [number, number | null, number | null][]
    change: number | undefined
  }
  activity: {
    /** [timestamp, rollupsUops, validiumsAndOptimiumsUops] */
    chart: [number, number | null, number | null][]
    change: number | undefined
  }
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

  const chart = mergeSeriesByTimestamp(rollupValues, validiumAndOptimiumValues)
  return { chart, change: computeSeriesChange(sumSeries(chart)) }
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
  )

  return { chart, change: computeWeeklyAverageChange(sumSeries(chart)) }
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
function sumSeries(
  chart: [number, number | null, number | null][],
): (number | null)[] {
  return chart.map(([_, rollups, vAndO]) =>
    rollups !== null || vAndO !== null ? (rollups ?? 0) + (vAndO ?? 0) : null,
  )
}

function getMockHomeL2Charts(range: ChartRange): HomeL2Charts {
  const adjustedRange: [UnixTime, UnixTime] = [range[0] ?? 1590883200, range[1]]
  const timestamps = generateTimestamps(adjustedRange, 'day')

  return {
    tvs: {
      chart: timestamps.map((timestamp) => [+timestamp, 3000, 2000]),
      change: 0,
    },
    activity: {
      chart: timestamps.map((timestamp) => [+timestamp, 14000, 10000]),
      change: 0,
    },
  }
}
