import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { ChartRange } from '~/utils/range/range'
import { generateTimestamps } from '../../utils/generateTimestamps'
import { getLiquidStakingProjects } from './getLiquidStakingProjects'

export const LiquidStakingChartsParams = v.object({
  range: ChartRange,
})

export type LiquidStakingChartsParams = v.infer<
  typeof LiquidStakingChartsParams
>

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
  const projectIds = (await getLiquidStakingProjects()).map(
    (project) => project.id,
  )
  if (env.MOCK) {
    return getMockLiquidStakingCharts(params, projectIds)
  }
  // The daily values are not indexed yet.
  return { yield: [], costOfExit: [] }
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
