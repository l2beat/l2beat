import { CountBadge } from '~/components/badge/CountBadge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/DirectoryTabs'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { DefiSummaryEntry } from '~/server/features/defi/getDefiSummaryEntries'
import type { DefiLiquidStakingCharts } from '~/server/features/defi/liquidStakingCharts/getDefiLiquidStakingCharts'
import { DefiLiquidStaking } from './DefiLiquidStaking'
import type { DefiLiquidStakingRiskEntry } from './DefiLiquidStakingRiskTable'
import { DefiSummaryTable } from './DefiSummaryTable'

export function DefiSummaryTables({
  entries,
  liquidStakingCharts,
  showAllProtocols,
}: {
  entries: DefiSummaryEntry[]
  liquidStakingCharts?: DefiLiquidStakingCharts
  /**
   * False while the summary is limited to liquid staking, see
   * DEFI_SUMMARY_CATEGORIES. The page is then the liquid staking view alone.
   */
  showAllProtocols: boolean
}) {
  const liquidStaking = (
    <DefiLiquidStaking
      entries={entries.filter(isLiquidStakingRiskEntry)}
      charts={liquidStakingCharts}
    />
  )

  if (!showAllProtocols) {
    return <PrimaryCard className="md:mt-4">{liquidStaking}</PrimaryCard>
  }

  return (
    <DirectoryTabs defaultValue="protocols">
      <DirectoryTabsList>
        <DirectoryTabsTrigger value="protocols">
          Protocols <CountBadge>{entries.length}</CountBadge>
        </DirectoryTabsTrigger>
        <DirectoryTabsTrigger value="liquidStaking">
          Liquid staking
        </DirectoryTabsTrigger>
      </DirectoryTabsList>
      <DirectoryTabsContent value="protocols">
        <DefiSummaryTable entries={entries} />
      </DirectoryTabsContent>
      <DirectoryTabsContent value="liquidStaking">
        {liquidStaking}
      </DirectoryTabsContent>
    </DirectoryTabs>
  )
}

function isLiquidStakingRiskEntry(
  entry: DefiSummaryEntry,
): entry is DefiLiquidStakingRiskEntry {
  return entry.liquidStaking !== undefined
}
