import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ChartRange } from '~/utils/range/range'
import { generateTimestamps } from '../../utils/generateTimestamps'
import {
  computeCostOfExitChart,
  computeYieldChart,
  getLastChartDay,
  YIELD_WINDOW_DAYS,
} from './computeLiquidStakingCharts'
import { getLiquidStakingProjects } from './getLiquidStakingProjects'

export const LiquidStakingChartsParams = v.object({
  range: ChartRange,
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
  const projects = await getLiquidStakingProjects()
  const projectIds = projects.map((project) => project.id)
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

/** In days of yield, by the cheapest route. */
export async function getLiquidStakingCostOfExitChart(
  params: LiquidStakingChartsParams,
): Promise<LiquidStakingCostOfExitPoint[]> {
  const projects = await getLiquidStakingProjects()
  const projectIds = projects.map((project) => project.id)
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
  return { days: generateTimestamps([from, to], 'day'), from, to, lookback }
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
