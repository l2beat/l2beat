import type { Project, ProjectLiquidStakingRisks } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { optionToRange } from '~/utils/range/range'
import { getTotalValueLockedByProject } from '../getDefiTotalValueLocked'
import {
  getLiquidStakingCostOfExitChart,
  getLiquidStakingYieldChart,
  type LiquidStakingChartPoint,
  type LiquidStakingCharts,
} from './getLiquidStakingCharts'

export interface LiquidStakingSummary {
  risks: ProjectLiquidStakingRisks
  totalValueLockedUsd?: number
  yield?: LiquidStakingLatestValue
  costOfExit?: LiquidStakingLatestValue
}

export interface LiquidStakingLatestValue {
  value: number
  timestamp: number
  /** It counts requests still queued, at an estimated wait. */
  estimated: boolean
}

/**
 * A value older than this shows as no data. Every page applies it, whatever
 * range of the charts it read.
 */
const LATEST_VALUE_MAX_AGE_DAYS = 30

/** The project's row of the liquid staking page, with the latest chart values. */
export async function getLiquidStakingSummary(
  project: Pick<Project<'defiInfo'>, 'id' | 'defiInfo'>,
  risks: ProjectLiquidStakingRisks,
): Promise<LiquidStakingSummary> {
  // As far back as a latest value may be.
  const range = optionToRange('30d')
  const [tvlByProject, yieldChart, costOfExit] = await Promise.all([
    getTotalValueLockedByProject([project]),
    getLiquidStakingYieldChart({ range }),
    getLiquidStakingCostOfExitChart({ range }),
  ])
  return buildLiquidStakingSummary(
    project.id,
    risks,
    tvlByProject.get(project.id),
    { yield: yieldChart, costOfExit },
  )
}

/** A project's risks and TVL, with its latest values from the charts. */
export function buildLiquidStakingSummary(
  projectId: string,
  risks: ProjectLiquidStakingRisks,
  totalValueLockedUsd: number | undefined,
  charts: LiquidStakingCharts,
): LiquidStakingSummary {
  return {
    risks,
    totalValueLockedUsd,
    yield: getLatestValue(charts.yield, projectId, () => false),
    costOfExit: getLatestValue(charts.costOfExit, projectId, (point) =>
      point.estimated.includes(projectId),
    ),
  }
}

function getLatestValue<T extends LiquidStakingChartPoint>(
  points: T[],
  projectId: string,
  isEstimated: (point: T) => boolean,
): LiquidStakingLatestValue | undefined {
  const latest = points.findLast((point) => point.projects[projectId] != null)
  const value = latest?.projects[projectId]
  const oldest = UnixTime.now() - LATEST_VALUE_MAX_AGE_DAYS * UnixTime.DAY
  return latest && value != null && latest.timestamp >= oldest
    ? {
        value,
        timestamp: latest.timestamp,
        estimated: isEstimated(latest),
      }
    : undefined
}
