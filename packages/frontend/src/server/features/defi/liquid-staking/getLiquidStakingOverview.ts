import { getTotalValueLockedByProject } from '../getDefiTotalValueLocked'
import {
  getLiquidStakingCostOfExitChart,
  getLiquidStakingYieldChart,
} from './getLiquidStakingCharts'
import {
  getLiquidStakingEntries,
  getLiquidStakingEntriesRange,
  type LiquidStakingStatsEntry,
} from './getLiquidStakingEntries'
import { getLiquidStakingProjects } from './getLiquidStakingProjects'

export interface LiquidStakingOverview {
  entries: LiquidStakingStatsEntry[]
  /** ETH staked network-wide, absent when the range has no value. */
  ethStaked?: { value: number; timestamp: number }
}

/** The protocols' latest numbers, without the risk comparison. */
export async function getLiquidStakingOverview(): Promise<LiquidStakingOverview> {
  const range = getLiquidStakingEntriesRange()
  const projects = await getLiquidStakingProjects()
  const [tvlByProject, yieldChart, costOfExit] = await Promise.all([
    getTotalValueLockedByProject(projects),
    getLiquidStakingYieldChart({ range }),
    getLiquidStakingCostOfExitChart({ range }),
  ])
  const entries = getLiquidStakingEntries(projects, tvlByProject, {
    yield: yieldChart,
    costOfExit,
  })
  const latest = yieldChart.findLast((point) => point.ethStaked != null)

  return {
    entries: entries.map(({ risks: _, ...entry }) => entry),
    ethStaked:
      latest?.ethStaked != null
        ? { value: latest.ethStaked, timestamp: latest.timestamp }
        : undefined,
  }
}
