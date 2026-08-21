import type { Milestone } from '@l2beat/config'
import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { MainPageHeader } from '~/components/MainPageHeader'
import { TvsDisplayControlsContextProvider } from '~/components/table/display/contexts/TvsDisplayControlsContext'

import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { L2TvsTabs } from '~/pages/layer2s/tvs/components/L2TvsTabs'
import type { TabbedL2Entries } from '~/pages/layer2s/utils/groupByL2Tabs'
import type { L2TvsEntry } from '~/server/features/layer2s/tvs/getL2TvsEntries'
import { L2TvsTimeRangeContextProvider } from './components/L2TvsTimeRangeContext'

interface Props extends AppLayoutProps {
  entries: TabbedL2Entries<L2TvsEntry>
  milestones: Milestone[]
  queryState: DehydratedState
}

export function L2TvsPage({
  entries,
  milestones,
  queryState,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout>
          <MainPageHeader>Value Secured</MainPageHeader>
          <TableFilterContextProvider>
            <TvsDisplayControlsContextProvider
              initialValues={{
                excludeAssociatedTokens: false,
                excludeRwaRestrictedTokens: true,
              }}
            >
              <L2TvsTimeRangeContextProvider>
                <L2TvsTabs {...entries} milestones={milestones} />
              </L2TvsTimeRangeContextProvider>
            </TvsDisplayControlsContextProvider>
          </TableFilterContextProvider>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
