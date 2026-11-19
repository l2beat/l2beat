import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { ChartRange } from '~/utils/range/range'
import { generateTimestamps } from '../../utils/generateTimestamps'
import { getLastChartDay } from './computeLiquidStakingCharts'
import { getEthPricesAt } from './getEthPricesAt'
import { getEthStakedAt } from './getEthStakedAt'
import { randomWalk } from './getLiquidStakingCharts'
import { getLiquidStakingProjects } from './getLiquidStakingProjects'
import { getTvlInEthAt } from './getTvlInEthAt'

export const LiquidStakingTvlChartParams = v.object({
  range: ChartRange,
})

export type LiquidStakingTvlChartParams = v.infer<
  typeof LiquidStakingTvlChartParams
>

/** The TVS and staking indexers both start here. */
const FIRST_DAY = UnixTime.fromDate(new Date('2024-01-01T00:00:00Z'))

export interface LiquidStakingTvlPoint {
  timestamp: number
  /**
   * By project id, the ETH its tokens stand for at its own rate; null on
   * days without data.
   */
  projects: Record<string, number | null>
  /** ETH staked network-wide, as the day started. */
  ethStaked: number | null
  /** ETH's USD price, as TVS valued it then. */
  ethPrice: number | null
}

/**
 * A point per day: each protocol's TVL in ETH, and the ETH staked by every
 * active validator, so the page can show what the protocols do not hold.
 */
export async function getLiquidStakingTvlChart(
  params: LiquidStakingTvlChartParams,
): Promise<LiquidStakingTvlPoint[]> {
  const to = getLastChartDay(params.range[1], 'started')
  const from = UnixTime(Math.max(params.range[0] ?? FIRST_DAY, FIRST_DAY))
  const days = generateTimestamps([from, to], 'day')

  const projects = await getLiquidStakingProjects()
  if (env.MOCK) return getMockChart(days, projects)

  const [ethStaked, ethPrices, ...tvlByProject] = await Promise.all([
    getEthStakedAt(days),
    getEthPricesAt(days),
    ...projects.map((project) => getTvlInEthAt(project, days)),
  ])

  return days.map((timestamp, i) => ({
    timestamp,
    projects: Object.fromEntries(
      projects.map((project, j) => [project.id, tvlByProject[j]?.[i] ?? null]),
    ),
    ethStaked: ethStaked[i] ?? null,
    ethPrice: ethPrices[i] ?? null,
  }))
}

/** Shares that fall with each project, so the mock stack looks like the real one. */
function getMockChart(
  days: number[],
  projects: { id: string }[],
): LiquidStakingTvlPoint[] {
  const ethStaked = randomWalk(days.length, 34_000_000, 0.05)
  const ethPrice = randomWalk(days.length, 3_000, 0.3)
  const tvl = projects.map((_, i) =>
    randomWalk(days.length, 9_000_000 / 2 ** i, 0.15),
  )
  return days.map((timestamp, i) => ({
    timestamp,
    projects: Object.fromEntries(
      projects.map((project, j) => [project.id, tvl[j]?.[i] ?? null]),
    ),
    ethStaked: ethStaked[i] ?? null,
    ethPrice: ethPrice[i] ?? null,
  }))
}
