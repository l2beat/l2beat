import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import type { DefiLiquidStakingCharts as DefiLiquidStakingChartsData } from '~/server/features/defi/liquidStakingCharts/getDefiLiquidStakingCharts'
import {
  getExitCost,
  getLiquidStakingMetrics,
  getLiquidStakingSeries,
} from '~/server/features/defi/liquidStakingCharts/liquidStakingMetrics'
import { DefiLiquidStakingCharts } from './charts/DefiLiquidStakingCharts'
import {
  type DefiLiquidStakingRiskEntry,
  DefiLiquidStakingRiskTable,
} from './DefiLiquidStakingRiskTable'
import { LiquidStakingRisksInfo } from './DefiTabsInfo'

/**
 * The liquid staking view: the charts first, headed like the charts of the
 * other summary pages, then the risk comparison table, whose metric columns
 * are the end of the chart lines.
 */
export function DefiLiquidStaking({
  entries,
  charts,
}: {
  entries: DefiLiquidStakingRiskEntry[]
  charts: DefiLiquidStakingChartsData | undefined
}) {
  const metrics = charts ? getLatestMetrics(charts) : {}
  const rows = entries.map((entry) => ({
    ...entry,
    metrics: metrics[entry.id],
  }))
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
      <DefiLiquidStakingRiskTable entries={rows} />
    </>
  )
}

function getLatestMetrics(charts: DefiLiquidStakingChartsData) {
  const apr = getLiquidStakingSeries(charts, 'apr30')
  const premium = getLiquidStakingSeries(charts, 'premium')
  const exitDays = getLiquidStakingSeries(charts, 'exitDays')
  return getLiquidStakingMetrics(
    charts.asOf,
    apr,
    getExitCost(exitDays, premium, apr),
  )
}
