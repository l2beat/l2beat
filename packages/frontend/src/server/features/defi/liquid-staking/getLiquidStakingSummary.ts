import type { Project, ProjectLiquidStakingRisks } from '@l2beat/config'
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
}

/** The project's row of the liquid staking page, with the latest chart values. */
export async function getLiquidStakingSummary(
  project: Pick<Project<'defiInfo'>, 'id' | 'defiInfo'>,
  risks: ProjectLiquidStakingRisks,
): Promise<LiquidStakingSummary> {
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
    yield: getLatestValue(charts.yield, projectId),
    costOfExit: getLatestValue(charts.costOfExit, projectId),
  }
}

function getLatestValue(
  points: LiquidStakingChartPoint[],
  projectId: string,
): LiquidStakingLatestValue | undefined {
  const latest = points.findLast((point) => point.projects[projectId] != null)
  const value = latest?.projects[projectId]
  return latest && value != null
    ? { value, timestamp: latest.timestamp }
    : undefined
}
