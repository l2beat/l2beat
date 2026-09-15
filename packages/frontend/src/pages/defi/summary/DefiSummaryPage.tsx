import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { DefiSummaryEntry } from '~/server/features/defi/getDefiSummaryEntries'
import type { DefiLiquidStakingCharts } from '~/server/features/defi/liquidStakingCharts/getDefiLiquidStakingCharts'
import { DefiSummaryTables } from './components/DefiSummaryTables'

interface Props extends AppLayoutProps {
  entries: DefiSummaryEntry[]
  liquidStakingCharts?: DefiLiquidStakingCharts
}

export function DefiSummaryPage({
  entries,
  liquidStakingCharts,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader description="Overview of DeFi protocols tracked by L2BEAT.">
          DeFi
        </MainPageHeader>
        <DefiSummaryTables
          entries={entries}
          liquidStakingCharts={liquidStakingCharts}
        />
      </SideNavLayout>
    </AppLayout>
  )
}
