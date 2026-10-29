import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ChartRange } from '~/utils/range/range'
import { generateTimestamps } from '../../utils/generateTimestamps'
import {
  computeLiquidStakingCharts,
  computeLiquidStakingStats,
  type LiquidStakingChartInputs,
  type LiquidStakingStats,
  YIELD_WINDOW_DAYS,
} from './computeLiquidStakingCharts'
import {
  getLiquidStakingProjects,
  type LiquidStakingProject,
} from './getLiquidStakingProjects'

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

/**
 * Yields are annualised fractions over the previous 30 days. Cost of exit is
 * in days of yield, by the cheaper of the queue and the market.
 */
export async function getLiquidStakingCharts(
  params: LiquidStakingChartsParams,
): Promise<LiquidStakingCharts> {
  const projects = await getLiquidStakingProjects()
  if (env.MOCK) {
    return getMockLiquidStakingCharts(
      params,
      projects.map((project) => project.id),
    )
  }

  const to = UnixTime.toStartOf(UnixTime(params.range[1]), 'day')
  const from = Math.max(params.range[0] ?? FIRST_DAY, FIRST_DAY)
  return computeLiquidStakingCharts(
    await getInputs(projects, UnixTime(from), to),
  )
}

/** How far back the stats look for a day that has each value. */
const STATS_DAYS = 7

/** Each project's latest yield, cost of exit and its parts, by project id. */
export async function getLiquidStakingStats(
  projects: LiquidStakingProject[],
): Promise<Map<string, LiquidStakingStats>> {
  if (env.MOCK) {
    return new Map(projects.map((project) => [project.id, getMockStats()]))
  }
  const to = UnixTime.toStartOf(UnixTime.now(), 'day')
  return computeLiquidStakingStats(
    await getInputs(projects, UnixTime(to - STATS_DAYS * UnixTime.DAY), to),
  )
}

async function getInputs(
  projects: LiquidStakingProject[],
  from: UnixTime,
  to: UnixTime,
): Promise<LiquidStakingChartInputs> {
  // The first day's yields look back a window; its discount, a week.
  const lookback = UnixTime(from - YIELD_WINDOW_DAYS * UnixTime.DAY)
  const priceIds = [
    'ethereum',
    ...projects.map((p) => p.liquidStakingConfig.priceId),
  ]

  const db = getDb()
  const [snapshots, network, prices] = await Promise.all([
    db.liquidStakingSnapshot.getByProjectsInRange(
      projects.map((p) => p.id),
      lookback,
      // Up to now, so requests made by the chart's end find when they were
      // finalized, even when that came after the end.
      UnixTime.now(),
    ),
    db.ethereumStakingDaily.getInRange(lookback, to),
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

  return {
    days: generateTimestamps([from, to], 'day'),
    projects: projects.map((p) => ({
      id: p.id,
      type: p.liquidStakingConfig.contracts.type,
      priceId: p.liquidStakingConfig.priceId,
    })),
    snapshots,
    network,
    prices: new Map(prices),
  }
}

function getMockLiquidStakingCharts(
  params: LiquidStakingChartsParams,
  projectIds: string[],
): LiquidStakingCharts {
  const to = UnixTime.toStartOf(UnixTime.now(), 'day')
  const from = params.range[0] ?? to - 1000 * UnixTime.DAY
  const timestamps = generateTimestamps([from, to], 'day')

  const yields = projectIds.map(() => randomWalk(timestamps.length, 0.03, 0.4))
  const network = randomWalk(timestamps.length, 0.032, 0.2)
  const ethStaked = randomWalk(timestamps.length, 34_000_000, 0.05)
  const costOfExit = projectIds.map(() => randomWalk(timestamps.length, 3, 1))

  return {
    yield: timestamps.map((timestamp, i) => ({
      timestamp,
      projects: byProject(projectIds, yields, i),
      network: network[i] ?? null,
      ethStaked: ethStaked[i] ?? null,
    })),
    costOfExit: timestamps.map((timestamp, i) => ({
      timestamp,
      projects: byProject(projectIds, costOfExit, i),
    })),
  }
}

function getMockStats(): LiquidStakingStats {
  const discount = (Math.random() - 0.3) * 0.004
  const queueWait = Math.random() * 6
  const annualYield = 0.025 + Math.random() * 0.01
  return {
    yield: annualYield,
    costOfExit: Math.min(
      queueWait,
      (Math.max(0, discount) * 365) / annualYield,
    ),
    queueWait,
    marketDiscount: discount,
  }
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
