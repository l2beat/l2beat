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
  toWeeklySparkline,
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

  const chart = mergeTvsParts(rollupValues, validiumAndOptimiumValues)
  return {
    chart: toWeeklySparkline(chart, {
      perDay: false,
      partLabels: TVS_PART_LABELS,
    }),
    value: getLatestValue(chart),
    change: computeSeriesChange(chart),
  }
}

async function getHomeActivityChart(
  range: ChartRange,
): Promise<HomeL2Charts['activity']> {
  const db = getDb()
  const projects = await getActivityProjects()

  // Rollups and validiums & optimiums, as for the value secured.
  const projectIds = projects
    .filter((p) => ACTIVITY_TYPES.has(p.scalingInfo.type))
    .map((p) => p.id)

  const adjustedRange = await getFullySyncedActivityRange(range)
  const entries = await db.activity.getSummedByTimestamp(
    projectIds,
    adjustedRange,
  )
  const chart = entries.map(
    (entry): HomeSeriesPoint => [
      entry.timestamp,
      countPerSecond(entry.uopsCount),
    ],
  )

  return {
    chart: toWeeklySparkline(chart, { perDay: false }),
    value: getLatestValue(chart),
    change: computeWeeklyAverageChange(chart),
  }
}

const TVS_PART_LABELS = ['Rollups', 'Validiums & Optimiums']

const ACTIVITY_TYPES = new Set<string | undefined>([
  'ZK Rollup',
  'Optimistic Rollup',
  'Validium',
  'Optimium',
])

/**
 * Rollups and validiums & optimiums by timestamp, with their total. A point
 * missing either part is null throughout: a total of one part would read as
 * a drop, and parts averaged over other days than the total would not add up.
 */
export function mergeTvsParts(
  rollups: { timestamp: number; value: number | null }[],
  vAndO: { timestamp: number; value: number | null }[],
): HomeSeriesPoint[] {
  const rollupsAt = new Map(rollups.map((p) => [p.timestamp, p.value]))
  const vAndOAt = new Map(vAndO.map((p) => [p.timestamp, p.value]))
  const timestamps = [...new Set([...rollupsAt.keys(), ...vAndOAt.keys()])]
  return timestamps
    .sort((a, b) => a - b)
    .map((timestamp) => {
      const rollup = rollupsAt.get(timestamp) ?? null
      const other = vAndOAt.get(timestamp) ?? null
      return rollup !== null && other !== null
        ? [timestamp, rollup + other, rollup, other]
        : [timestamp, null, null, null]
    })
}

function getMockHomeL2Charts(range: ChartRange): HomeL2Charts {
  const adjustedRange: [UnixTime, UnixTime] = [range[0] ?? 1590883200, range[1]]
  const timestamps = generateTimestamps(adjustedRange, 'day')

  return {
    tvs: {
      chart: toWeeklySparkline(
        timestamps.map((timestamp) => [+timestamp, 5000, 3000, 2000]),
        { perDay: false, partLabels: TVS_PART_LABELS },
      ),
      value: 5000,
      change: 0,
    },
    activity: {
      chart: toWeeklySparkline(
        timestamps.map((timestamp) => [+timestamp, countPerSecond(24000)]),
        { perDay: false },
      ),
      value: countPerSecond(24000),
      change: 0,
    },
  }
}
