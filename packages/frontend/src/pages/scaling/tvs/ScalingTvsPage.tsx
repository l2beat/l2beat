import type { Milestone } from '@l2beat/config'
import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { MainPageHeader } from '~/components/MainPageHeader'
import { TvsDisplayControlsContextProvider } from '~/components/table/display/contexts/TvsDisplayControlsContext'

import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { ScalingTvsTabs } from '~/pages/scaling/tvs/components/ScalingTvsTabs'
import type { TabbedScalingEntries } from '~/pages/scaling/utils/groupByScalingTabs'
import type { ScalingTvsEntry } from '~/server/features/scaling/tvs/getScalingTvsEntries'

interface Props extends AppLayoutProps {
  entries: TabbedScalingEntries<ScalingTvsEntry>
  milestones: Milestone[]
  queryState: DehydratedState
}

export function ScalingTvsPage({
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
              <ScalingTvsTabs {...entries} milestones={milestones} />
            </TvsDisplayControlsContextProvider>
          </TableFilterContextProvider>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
