import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { DEFI_SUMMARY_TITLE } from '~/server/features/defi/defiSummaryVisibility'
import type { DefiSummaryEntry } from '~/server/features/defi/getDefiSummaryEntries'
import type { DefiLiquidStakingCharts } from '~/server/features/defi/liquidStakingCharts/getDefiLiquidStakingCharts'
import { DefiSummaryTables } from './components/DefiSummaryTables'

interface Props extends AppLayoutProps {
  entries: DefiSummaryEntry[]
  liquidStakingCharts?: DefiLiquidStakingCharts
  showAllProtocols: boolean
  description: string
}

export function DefiSummaryPage({
  entries,
  liquidStakingCharts,
  showAllProtocols,
  description,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader description={description}>
          {DEFI_SUMMARY_TITLE}
        </MainPageHeader>
        <DefiSummaryTables
          entries={entries}
          liquidStakingCharts={liquidStakingCharts}
          showAllProtocols={showAllProtocols}
        />
      </SideNavLayout>
    </AppLayout>
  )
}
