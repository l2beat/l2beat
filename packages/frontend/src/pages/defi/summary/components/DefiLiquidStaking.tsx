import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import type { DefiLiquidStakingCharts as DefiLiquidStakingChartsData } from '~/server/features/defi/liquidStakingCharts/getDefiLiquidStakingCharts'
import { DefiLiquidStakingCharts } from './charts/DefiLiquidStakingCharts'
import {
  type DefiLiquidStakingRiskEntry,
  DefiLiquidStakingRiskTable,
} from './DefiLiquidStakingRiskTable'
import { LiquidStakingRisksInfo } from './DefiTabsInfo'

/**
 * The liquid staking view: the charts first, headed like the charts of the
 * other summary pages, then the risk comparison table.
 */
export function DefiLiquidStaking({
  entries,
  charts,
}: {
  entries: DefiLiquidStakingRiskEntry[]
  charts: DefiLiquidStakingChartsData | undefined
}) {
  return (
    <>
      {charts && (
        <>
          <DefiLiquidStakingCharts charts={charts} />
          <HorizontalSeparator className="my-5" />
        </>
      )}
      <h2 className="mb-1 font-bold text-xl md:text-2xl">Risk comparison</h2>
      <LiquidStakingRisksInfo />
      <DefiLiquidStakingRiskTable entries={entries} />
    </>
  )
}
