import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ChartRange } from '~/utils/range/range'
import { generateTimestamps } from '../../utils/generateTimestamps'
import {
  computeCostOfExitChart,
  computeTvlChart,
  computeYieldChart,
  getLastChartDay,
  trimLeadingIncomplete,
  YIELD_WINDOW_DAYS,
} from './computeLiquidStakingCharts'
import { getLiquidStakingProjects } from './getLiquidStakingProjects'
import { getTvlInEthAt, type TvlInEthProject } from './getTvlInEthAt'
import { type TvlBreakdown, toBreakdown } from './liquidStakingTvlBreakdown'

export const LiquidStakingChartsParams = v.object({
  range: ChartRange,
  /** Only this project's line, for its own page. */
  projectId: v.string().optional(),
})

export type LiquidStakingChartsParams = v.infer<
  typeof LiquidStakingChartsParams
>

/**
 * The indexers start at 2024-01-01, so this is the first day with a full
 * window behind it.
 */
const FIRST_DAY =
  UnixTime.fromDate(new Date('2024-01-01T00:00:00Z')) +
  YIELD_WINDOW_DAYS * UnixTime.DAY

/** Both charts, for the latest values a page shows next to them. */
export interface LiquidStakingCharts {
  yield: LiquidStakingYieldPoint[]
  costOfExit: LiquidStakingCostOfExitPoint[]
}

export interface LiquidStakingChartPoint {
  timestamp: number
  /** By project id, null on days without data. */
  projects: Record<string, number | null>
}

export interface LiquidStakingCostOfExitPoint extends LiquidStakingChartPoint {
  /** Projects whose value counts requests still queued, at an estimated wait. */
  estimated: string[]
}

export interface LiquidStakingYieldPoint extends LiquidStakingChartPoint {
  /** Annualised return of all Ethereum validators, before protocol fees. */
  network: number | null
  /** ETH staked network-wide. */
  ethStaked: number | null
  /** The same, at that day's ETH price. */
  ethStakedUsd: number | null
}

export async function getLiquidStakingCharts(
  params: LiquidStakingChartsParams,
): Promise<LiquidStakingCharts> {
  const [yieldChart, costOfExit] = await Promise.all([
    getLiquidStakingYieldChart(params),
    getLiquidStakingCostOfExitChart(params),
  ])
  return { yield: yieldChart, costOfExit }
}

/** Annualised fractions over the previous 30 days. */
export async function getLiquidStakingYieldChart(
  params: LiquidStakingChartsParams,
): Promise<LiquidStakingYieldPoint[]> {
  const projectIds = (await getProjects(params)).map((project) => project.id)
  if (env.MOCK) {
    const days = getDays(params, 'started').days
    const yields = projectIds.map(() => randomWalk(days.length, 0.03, 0.4))
    const network = randomWalk(days.length, 0.032, 0.2)
    const ethStaked = randomWalk(days.length, 34_000_000, 0.05)
    const ethPrice = randomWalk(days.length, 3_000, 0.3)
    return days.map((timestamp, i) => ({
      timestamp,
      projects: byProject(projectIds, yields, i),
      network: network[i] ?? null,
      ethStaked: ethStaked[i] ?? null,
      ethStakedUsd: (ethStaked[i] ?? 0) * (ethPrice[i] ?? 0),
    }))
  }
  const { days, from, to, lookback } = getDays(params, 'started')
  const db = getDb()
  const [snapshots, network, ethPrices] = await Promise.all([
    db.liquidStakingSnapshot.getDayStartsByProjectsInRange(
      projectIds,
      lookback,
      to,
    ),
    db.ethereumStakingDaily.getInRange(lookback, to),
    db.tvsPrice.getPricesInRangeByPriceId('ethereum', from, to),
  ])
  return computeYieldChart({
    days,
    projectIds,
    snapshots,
    network,
    ethPrices: new Map(ethPrices.map((p) => [p.timestamp, p.priceUsd])),
  })
}

/**
 * Each day split into the protocols' TVL in ETH at their own rates, the rest
 * of the stake and the rest of the supply, each as the day started.
 */
export async function getLiquidStakingTvlChart(
  params: LiquidStakingChartsParams,
): Promise<TvlBreakdown[]> {
  const projects = await getProjects(params)
  const projectIds = projects.map((project) => project.id)
  // A day's stake is indexed once the day ends.
  const { days, from, to } = getDays(params, 'ended')
  if (env.MOCK) {
    const tvl = projects.map((_, i) =>
      randomWalk(days.length, 9_000_000 / 2 ** i, 0.15),
    )
    const ethStaked = randomWalk(days.length, 34_000_000, 0.05)
    const ethPrice = randomWalk(days.length, 3_000, 0.3)
    return days.map((timestamp, i) =>
      toBreakdown({
        timestamp,
        projects: byProject(projectIds, tvl, i),
        staked: ethStaked[i] ?? null,
        supply: 120_000_000 + i * 1_000,
        ethPrice: ethPrice[i] ?? null,
      }),
    )
  }
  const db = getDb()
  const [network, ethSupplies, ethPrices, tvlByProject] = await Promise.all([
    db.ethereumStakingDaily.getInRange(from, to),
    db.ethereumSupplyDaily.getInRange(from, to),
    db.tvsPrice.getPricesInRangeByPriceId('ethereum', from, to),
    Promise.all(
      projects.map(
        async (project) =>
          [project.id, await getTvlSince(project, days)] as const,
      ),
    ),
  ])
  const points = computeTvlChart({
    days,
    tvlByProject: new Map(tvlByProject),
    network,
    ethSupplies: new Map(ethSupplies.map((s) => [s.timestamp, s.supply])),
    ethPrices: new Map(ethPrices.map((p) => [p.timestamp, p.priceUsd])),
  })
  // Only MAX reaches the days before every protocol has data; on a shorter
  // range a leading gap is real and shows as such.
  return params.range[0] === null ? trimLeadingIncomplete(points) : points
}

/**
 * Zero where it has no value before the contracts the indexer reads were
 * deployed, so a protocol that launched later doesn't leave the days before it
 * without Others.
 */
async function getTvlSince(
  project: TvlInEthProject,
  days: UnixTime[],
): Promise<(number | null)[]> {
  const tvl = await getTvlInEthAt(project, days)
  const since = project.liquidStaking.tracking?.sinceTimestamp
  return since === undefined
    ? tvl
    : tvl.map((value, i) => ((days[i] ?? 0) < since ? (value ?? 0) : value))
}

/** In days of yield, by the cheapest route. */
export async function getLiquidStakingCostOfExitChart(
  params: LiquidStakingChartsParams,
): Promise<LiquidStakingCostOfExitPoint[]> {
  const projectIds = (await getProjects(params)).map((project) => project.id)
  if (env.MOCK) {
    const days = getDays(params, 'ended').days
    const costOfExit = projectIds.map(() => randomWalk(days.length, 3, 1))
    return days.map((timestamp, i) => ({
      timestamp,
      projects: byProject(projectIds, costOfExit, i),
      estimated: i === days.length - 1 ? projectIds : [],
    }))
  }
  const { days, lookback } = getDays(params, 'ended')
  const snapshots = await getDb().liquidStakingSnapshot.getByProjectsInRange(
    projectIds,
    lookback,
    // Up to now, so requests made by the chart's end find when they were
    // finalized, even when that came after the end, and the estimate for
    // requests still queued starts from the latest counters.
    UnixTime.now(),
  )
  return computeCostOfExitChart({ days, projectIds, snapshots })
}

/** The tracked ones, as only they have chart values. */
async function getProjects(params: LiquidStakingChartsParams) {
  const projects = await getLiquidStakingProjects()
  return projects.filter(
    (project) =>
      project.liquidStaking.tracking !== undefined &&
      (params.projectId === undefined || project.id === params.projectId),
  )
}

/**
 * The chart's days, its last one, and how far back the first day's values
 * look: a yield window.
 */
function getDays(
  params: LiquidStakingChartsParams,
  lastDay: 'started' | 'ended',
) {
  const to = getLastChartDay(params.range[1], lastDay)
  const from = UnixTime(Math.max(params.range[0] ?? FIRST_DAY, FIRST_DAY))
  const lookback = UnixTime(from - YIELD_WINDOW_DAYS * UnixTime.DAY)
  // generateTimestamps counts backwards from `from` when `to` is before it.
  const days = to < from ? [] : generateTimestamps([from, to], 'day')
  return { days, from, to, lookback }
}

function byProject(projectIds: string[], series: number[][], index: number) {
  return Object.fromEntries(
    projectIds.map((id, j) => [id, series[j]?.[index] ?? null]),
  )
}

/** Wanders around `mean` by up to `spread` of it, so mock lines look plausible. */
function randomWalk(length: number, mean: number, spread: number): number[] {
  const values: number[] = []
  let value = mean
  for (let i = 0; i < length; i++) {
    value += (Math.random() - 0.5) * mean * spread * 0.1
    value = Math.min(mean * (1 + spread), Math.max(mean * (1 - spread), value))
    values.push(value)
  }
  return values
}
