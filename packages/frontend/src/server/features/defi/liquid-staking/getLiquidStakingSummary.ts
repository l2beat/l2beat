import type { Project, ProjectLiquidStakingRisks } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { type ChartRange, optionToRange } from '~/utils/range/range'
import { getLatestTotalValueLocked } from '../getDefiTotalValueLocked'
import {
  getLiquidStakingCharts,
  type LiquidStakingChartPoint,
  type LiquidStakingCharts,
  type LiquidStakingYieldPoint,
} from './getLiquidStakingCharts'
import { getTvlInEthAt, type TvlInEthProject } from './getTvlInEthAt'

export interface LiquidStakingSummary {
  risks: ProjectLiquidStakingRisks
  totalValueLockedUsd?: number
  /** The TVL in ETH at the protocol's rate, as a fraction of the ETH staked network-wide. */
  stakedEthShare?: LiquidStakingStakedEthShare
  yield?: LiquidStakingLatestValue
  costOfExit?: LiquidStakingLatestValue
}

export interface LiquidStakingLatestValue {
  value: number
  timestamp: number
  /** It counts requests still queued, at an estimated wait. */
  estimated: boolean
}

export interface LiquidStakingStakedEthShare {
  value: number
  /** The day of the ETH staked it is a fraction of. */
  timestamp: number
}

/** A project's latest TVL, also in ETH at the protocol's rate. */
export interface LiquidStakingTvl {
  valueUsd: number
  valueEth?: number
}

type LiquidStakingTvlProject = TvlInEthProject &
  Pick<Project<'defiInfo'>, 'defiInfo'>

/**
 * A value older than this shows as no data. Every page applies it, whatever
 * range of the charts it read.
 */
const LATEST_VALUE_MAX_AGE_DAYS = 30

/** The shortest chart range that holds every latest value. */
export function getLatestValuesRange(): ChartRange {
  return optionToRange('30d')
}

/** The project's row of the liquid staking page, with the latest chart values. */
export async function getLiquidStakingSummary(
  project: LiquidStakingTvlProject,
): Promise<LiquidStakingSummary> {
  const [tvlByProject, charts] = await Promise.all([
    getLiquidStakingTvl([project]),
    getLiquidStakingCharts({ range: getLatestValuesRange() }),
  ])
  return buildLiquidStakingSummary(
    project.id,
    project.liquidStaking.risks,
    tvlByProject.get(project.id),
    charts,
  )
}

/** The latest TVL of each project, in USD and in ETH. */
export async function getLiquidStakingTvl(
  projects: LiquidStakingTvlProject[],
): Promise<Map<string, LiquidStakingTvl>> {
  const latest = await getLatestTotalValueLocked(projects)
  return new Map(
    await Promise.all(
      projects.flatMap((project) => {
        const tvl = latest.get(project.id)
        if (!tvl) return []
        return getTvlInEthAt(project, [tvl.timestamp]).then(
          ([valueEth]): [string, LiquidStakingTvl] => [
            project.id,
            { valueUsd: tvl.valueUsd, valueEth: valueEth ?? undefined },
          ],
        )
      }),
    ),
  )
}

/** A project's risks and TVL, with its latest values from the charts. */
export function buildLiquidStakingSummary(
  projectId: string,
  risks: ProjectLiquidStakingRisks,
  tvl: LiquidStakingTvl | undefined,
  charts: LiquidStakingCharts,
): LiquidStakingSummary {
  return {
    risks,
    totalValueLockedUsd: tvl?.valueUsd,
    stakedEthShare: getStakedEthShare(tvl?.valueEth, charts.yield),
    yield: getLatestValue(charts.yield, projectId, () => false),
    costOfExit: getLatestValue(charts.costOfExit, projectId, (point) =>
      point.estimated.includes(projectId),
    ),
  }
}

function getStakedEthShare(
  valueEth: number | undefined,
  points: LiquidStakingYieldPoint[],
): LiquidStakingStakedEthShare | undefined {
  const latest = points.findLast((point) => point.ethStaked != null)
  if (
    valueEth === undefined ||
    !latest?.ethStaked ||
    latest.timestamp < getOldestLatestValue()
  ) {
    return undefined
  }
  return { value: valueEth / latest.ethStaked, timestamp: latest.timestamp }
}

function getOldestLatestValue() {
  return UnixTime.now() - LATEST_VALUE_MAX_AGE_DAYS * UnixTime.DAY
}

function getLatestValue<T extends LiquidStakingChartPoint>(
  points: T[],
  projectId: string,
  isEstimated: (point: T) => boolean,
): LiquidStakingLatestValue | undefined {
  const latest = points.findLast((point) => point.projects[projectId] != null)
  const value = latest?.projects[projectId]
  return latest && value != null && latest.timestamp >= getOldestLatestValue()
    ? {
        value,
        timestamp: latest.timestamp,
        estimated: isEstimated(latest),
      }
    : undefined
}
