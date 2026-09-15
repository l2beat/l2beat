import { CountBadge } from '~/components/badge/CountBadge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/DirectoryTabs'
import type { DefiSummaryEntry } from '~/server/features/defi/getDefiSummaryEntries'
import type { DefiLiquidStakingCharts as DefiLiquidStakingChartsData } from '~/server/features/defi/liquidStakingCharts/getDefiLiquidStakingCharts'
import { DefiLiquidStakingCharts } from './charts/DefiLiquidStakingCharts'
import {
  type DefiLiquidStakingRiskEntry,
  DefiLiquidStakingRiskTable,
} from './DefiLiquidStakingRiskTable'
import { DefiSummaryTable } from './DefiSummaryTable'
import { LiquidStakingChartsInfo, LiquidStakingRisksInfo } from './DefiTabsInfo'

export function DefiSummaryTables({
  entries,
  liquidStakingCharts,
}: {
  entries: DefiSummaryEntry[]
  liquidStakingCharts?: DefiLiquidStakingChartsData
}) {
  const liquidStakingEntries = entries.filter(isLiquidStakingRiskEntry)

  return (
    <DirectoryTabs defaultValue="protocols">
      <DirectoryTabsList>
        <DirectoryTabsTrigger value="protocols">
          Protocols <CountBadge>{entries.length}</CountBadge>
        </DirectoryTabsTrigger>
        <DirectoryTabsTrigger value="liquidStaking">
          Liquid staking risks{' '}
          <CountBadge>{liquidStakingEntries.length}</CountBadge>
        </DirectoryTabsTrigger>
        {liquidStakingCharts && (
          <DirectoryTabsTrigger value="liquidStakingCharts">
            Liquid staking charts{' '}
            <CountBadge>{liquidStakingCharts.projects.length}</CountBadge>
          </DirectoryTabsTrigger>
        )}
      </DirectoryTabsList>
      <DirectoryTabsContent value="protocols">
        <DefiSummaryTable entries={entries} />
      </DirectoryTabsContent>
      <DirectoryTabsContent value="liquidStaking">
        <LiquidStakingRisksInfo />
        <DefiLiquidStakingRiskTable entries={liquidStakingEntries} />
      </DirectoryTabsContent>
      {liquidStakingCharts && (
        <DirectoryTabsContent value="liquidStakingCharts">
          <LiquidStakingChartsInfo
            fromDate={liquidStakingCharts.fromDate}
            asOf={liquidStakingCharts.asOf}
            headBlock={liquidStakingCharts.headBlock}
          />
          <DefiLiquidStakingCharts charts={liquidStakingCharts} />
        </DirectoryTabsContent>
      )}
    </DirectoryTabs>
  )
}

function isLiquidStakingRiskEntry(
  entry: DefiSummaryEntry,
): entry is DefiLiquidStakingRiskEntry {
  return entry.liquidStaking !== undefined
}
