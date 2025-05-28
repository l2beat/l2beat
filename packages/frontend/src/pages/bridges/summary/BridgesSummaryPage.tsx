import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import { BridgesTvsChart } from '~/components/chart/tvs/bridges-tvs-chart'
import { PrimaryCard } from '~/components/primary-card/primary-card'
import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import type { TabbedBridgeEntries } from '~/pages/bridges/utils/group-by-bridge-tabs'
import type { BridgesSummaryEntry } from '~/server/features/bridges/get-bridges-summary-entries'
import { BridgesHeader } from '../components/bridges-header'
import { BridgesSummaryTables } from './components/bridges-summary-tables'

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
