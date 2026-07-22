import type { Milestone } from '@l2beat/config'
import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { MainPageHeader } from '~/components/MainPageHeader'
import { TvsDisplayControlsContextProvider } from '~/components/table/display/contexts/TvsDisplayControlsContext'

import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { Layer2sTvsTabs } from '~/pages/layer2s/tvs/components/Layer2sTvsTabs'
import type { TabbedLayer2sEntries } from '~/pages/layer2s/utils/groupByLayer2sTabs'
import type { Layer2sTvsEntry } from '~/server/features/layer2s/tvs/getLayer2sTvsEntries'
import { Layer2sTvsTimeRangeContextProvider } from './components/Layer2sTvsTimeRangeContext'

interface Props extends AppLayoutProps {
  entries: TabbedLayer2sEntries<Layer2sTvsEntry>
  milestones: Milestone[]
  queryState: DehydratedState
}

export function Layer2sTvsPage({
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
              <Layer2sTvsTimeRangeContextProvider>
                <Layer2sTvsTabs {...entries} milestones={milestones} />
              </Layer2sTvsTimeRangeContextProvider>
            </TvsDisplayControlsContextProvider>
          </TableFilterContextProvider>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
