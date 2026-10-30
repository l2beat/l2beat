import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ChartRange } from '~/utils/range/range'
import { generateTimestamps } from '../../utils/generateTimestamps'
import {
  computeCostOfExitChart,
  computeYieldChart,
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
  costOfExit: LiquidStakingChartPoint[]
}

export interface LiquidStakingChartPoint {
  timestamp: number
  /** By project id, null on days without data. */
  projects: Record<string, number | null>
}

export interface LiquidStakingYieldPoint extends LiquidStakingChartPoint {
  /** Annualised return of all Ethereum validators, before protocol fees. */
  network: number | null
  /** ETH staked network-wide. */
  ethStaked: number | null
}

/** Annualised fractions over the previous 30 days. */
export async function getLiquidStakingYieldChart(
  params: LiquidStakingChartsParams,
): Promise<LiquidStakingYieldPoint[]> {
  const projects = await getLiquidStakingProjects()
  const projectIds = projects.map((project) => project.id)
  if (env.MOCK) {
    const days = getMockDays(params)
    const yields = projectIds.map(() => randomWalk(days.length, 0.03, 0.4))
    const network = randomWalk(days.length, 0.032, 0.2)
    const ethStaked = randomWalk(days.length, 34_000_000, 0.05)
    return days.map((timestamp, i) => ({
      timestamp,
      projects: byProject(projectIds, yields, i),
      network: network[i] ?? null,
      ethStaked: ethStaked[i] ?? null,
    }))
  }
  const { from, to, lookback } = getDays(params)
  const db = getDb()
  const [snapshots, network] = await Promise.all([
    db.liquidStakingSnapshot.getDayStartsByProjectsInRange(
      projectIds,
      lookback,
      to,
    ),
    db.ethereumStakingDaily.getInRange(lookback, to),
  ])
  return computeYieldChart({
    days: generateTimestamps([from, to], 'day'),
    projectIds,
    snapshots,
    network,
  })
}

/** In days of yield, by the cheaper of the queue and the market. */
export async function getLiquidStakingCostOfExitChart(
  params: LiquidStakingChartsParams,
): Promise<LiquidStakingChartPoint[]> {
  const projects = await getLiquidStakingProjects()
  const projectIds = projects.map((project) => project.id)
  if (env.MOCK) {
    const days = getMockDays(params)
    const costOfExit = projectIds.map(() => randomWalk(days.length, 3, 1))
    return days.map((timestamp, i) => ({
      timestamp,
      projects: byProject(projectIds, costOfExit, i),
    }))
  }
  const { from, to, lookback } = getDays(params)
  const priceIds = ['ethereum', ...projects.map((p) => p.liquidStaking.priceId)]
  const db = getDb()
  const [snapshots, prices] = await Promise.all([
    db.liquidStakingSnapshot.getByProjectsInRange(
      projects.map((p) => p.id),
      lookback,
      // Up to now, so requests made by the chart's end find when they were
      // finalized, even when that came after the end.
      UnixTime.now(),
    ),
    Promise.all(
      priceIds.map(async (priceId) => {
        const records = await db.tvsPrice.getPricesInRangeByPriceId(
          priceId,
          lookback,
          to,
        )
        return [
          priceId,
          new Map(records.map((r) => [r.timestamp, r.priceUsd])),
        ] as const
      }),
    ),
  ])
  return computeCostOfExitChart({
    days: generateTimestamps([from, to], 'day'),
    projects: projects.map((p) => ({
      id: p.id,
      type: p.liquidStaking.contracts.type,
      priceId: p.liquidStaking.priceId,
    })),
    snapshots,
    prices: new Map(prices),
  })
}

/**
 * The chart's first and last day, and how far back the first day's values
 * look: its yield a window, its discount a week.
 */
function getDays(params: LiquidStakingChartsParams) {
  const to = UnixTime.toStartOf(UnixTime(params.range[1]), 'day')
  const from = UnixTime(Math.max(params.range[0] ?? FIRST_DAY, FIRST_DAY))
  const lookback = UnixTime(from - YIELD_WINDOW_DAYS * UnixTime.DAY)
  return { from, to, lookback }
}

function getMockDays(params: LiquidStakingChartsParams) {
  const to = UnixTime.toStartOf(UnixTime(params.range[1]), 'day')
  const from = params.range[0] ?? to - 1000 * UnixTime.DAY
  return generateTimestamps([from, to], 'day')
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
