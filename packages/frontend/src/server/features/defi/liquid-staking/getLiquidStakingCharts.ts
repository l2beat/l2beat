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
  const projectIds = await getProjectIds()
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
  // The daily values are not indexed yet.
  return []
}

/** In days of yield, by the cheaper of the queue and the market. */
export async function getLiquidStakingCostOfExitChart(
  params: LiquidStakingChartsParams,
): Promise<LiquidStakingChartPoint[]> {
  const projectIds = await getProjectIds()
  if (env.MOCK) {
    const days = getMockDays(params)
    const costOfExit = projectIds.map(() => randomWalk(days.length, 3, 1))
    return days.map((timestamp, i) => ({
      timestamp,
      projects: byProject(projectIds, costOfExit, i),
    }))
  }
  // The daily values are not indexed yet.
  return []
}

async function getProjectIds() {
  return (await getLiquidStakingProjects()).map((project) => project.id)
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
