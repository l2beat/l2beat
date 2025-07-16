import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { BridgesTvsChart } from '~/components/chart/tvs/BridgesTvsChart'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { TabbedBridgeEntries } from '~/pages/bridges/utils/groupByBridgeTabs'
import type { BridgesSummaryEntry } from '~/server/features/bridges/getBridgesSummaryEntries'
import { BridgesHeader } from '../components/BridgesHeader'
import { BridgesSummaryTables } from './components/BridgesSummaryTables'

interface Props extends AppLayoutProps {
  entries: TabbedBridgeEntries<BridgesSummaryEntry>
  queryState: DehydratedState
}

export function BridgesSummaryPage({ entries, queryState, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout>
          <TableFilterContextProvider>
            <BridgesHeader>Summary</BridgesHeader>
            <PrimaryCard>
              <BridgesTvsChart />
            </PrimaryCard>
            <BridgesSummaryTables {...entries} />
          </TableFilterContextProvider>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
