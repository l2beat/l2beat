import type {
  Project,
  ProjectLiquidStaking,
  ProjectLiquidStakingRisks,
} from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import {
  type CostOfExitDescription,
  getCostOfExitDescription,
} from '~/pages/defi/liquid-staking/costOfExitDescription'
import { type ChartRange, optionToRange } from '~/utils/range/range'
import { getTotalValueLockedByProject } from '../getDefiTotalValueLocked'
import {
  getLiquidStakingCharts,
  type LiquidStakingChartPoint,
  type LiquidStakingCharts,
} from './getLiquidStakingCharts'

export interface LiquidStakingSummary {
  risks: ProjectLiquidStakingRisks
  totalValueLockedUsd?: number
  yield?: LiquidStakingLatestValue
  costOfExit?: LiquidStakingLatestValue
}

export interface ProjectLiquidStakingSummary extends LiquidStakingSummary {
  costOfExitDescription: CostOfExitDescription
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

/** The shortest chart range that holds every latest value. */
export function getLatestValuesRange(): ChartRange {
  return optionToRange('30d')
}

/** The project's row of the liquid staking page, with the latest chart values. */
export async function getLiquidStakingSummary(
  project: Pick<Project<'defiInfo'>, 'id' | 'defiInfo'>,
  liquidStaking: ProjectLiquidStaking,
): Promise<ProjectLiquidStakingSummary> {
  const [tvlByProject, charts] = await Promise.all([
    getTotalValueLockedByProject([project]),
    getLiquidStakingCharts({
      range: getLatestValuesRange(),
      projectId: project.id,
    }),
  ])
  return {
    ...buildLiquidStakingSummary(
      project.id,
      liquidStaking.risks,
      tvlByProject.get(project.id),
      charts,
    ),
    costOfExitDescription: getCostOfExitDescription(liquidStaking),
  }
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
