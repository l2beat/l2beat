import { getLiquidStakingCharts } from './getLiquidStakingCharts'
import {
  type LiquidStakingStatsEntry,
  loadLiquidStakingEntries,
} from './getLiquidStakingEntries'
import {
  getLatestEthStaked,
  getLatestValuesRange,
  type LiquidStakingEthStaked,
} from './getLiquidStakingSummary'

export interface LiquidStakingOverview {
  entries: LiquidStakingStatsEntry[]
  /** ETH staked network-wide, absent when the latest is too old to show. */
  ethStaked?: LiquidStakingEthStaked
}

/** The protocols' latest numbers, without the risk comparison. */
export async function getLiquidStakingOverview(): Promise<LiquidStakingOverview> {
  const { entries, charts } = await loadLiquidStakingEntries(() =>
    getLiquidStakingCharts({ range: getLatestValuesRange() }),
  )
  return {
    entries: entries.map(({ risks: _, ...entry }) => entry),
    // The yield chart draws it in the background, so it is already read.
    ethStaked: getLatestEthStaked(charts.yield),
  }
}
