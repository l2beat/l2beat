import { getLiquidStakingCharts } from './getLiquidStakingCharts'
import {
  type LiquidStakingStatsEntry,
  loadLiquidStakingEntries,
} from './getLiquidStakingEntries'
import { getLatestValuesRange } from './getLiquidStakingSummary'

export interface LiquidStakingOverview {
  entries: LiquidStakingStatsEntry[]
  /** ETH staked network-wide, absent when the range has no value. */
  ethStaked?: { value: number; timestamp: number }
}

/** The protocols' latest numbers, without the risk comparison. */
export async function getLiquidStakingOverview(): Promise<LiquidStakingOverview> {
  const { entries, charts } = await loadLiquidStakingEntries(() =>
    getLiquidStakingCharts({ range: getLatestValuesRange() }),
  )
  // The yield chart draws it in the background, so it is already read.
  const latest = charts.yield.findLast((point) => point.ethStaked != null)

  return {
    entries: entries.map(({ risks: _, ...entry }) => entry),
    ethStaked:
      latest?.ethStaked != null
        ? { value: latest.ethStaked, timestamp: latest.timestamp }
        : undefined,
  }
}
