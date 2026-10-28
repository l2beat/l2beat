import type { Project, ProjectLiquidStakingRisks } from '@l2beat/config'
import { optionToRange } from '~/utils/range/range'
import { getTotalValueLockedByProject } from '../getDefiTotalValueLocked'
import {
  getLiquidStakingCharts,
  type LiquidStakingChartPoint,
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
  const [tvlByProject, charts] = await Promise.all([
    getTotalValueLockedByProject([project]),
    getLiquidStakingCharts({ range: optionToRange('30d') }),
  ])

  return {
    risks,
    totalValueLockedUsd: tvlByProject.get(project.id),
    yield: getLatestValue(charts.yield, project.id),
    costOfExit: getLatestValue(charts.costOfExit, project.id),
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
