import type { Milestone } from '@l2beat/config'
import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { MainPageHeader } from '~/components/MainPageHeader'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { ScalingAssociatedTokensContextProvider } from '~/pages/scaling/components/ScalingAssociatedTokensContext'
import { ScalingTvsTabs } from '~/pages/scaling/tvs/components/ScalingTvsTabs'
import type { TabbedScalingEntries } from '~/pages/scaling/utils/groupByScalingTabs'
import type { ScalingTvsEntry } from '~/server/features/scaling/tvs/getScalingTvsEntries'
import { ScalingRwaRestrictedTokensContextProvider } from '../components/ScalingRwaRestrictedTokensContext'

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
            <ScalingRwaRestrictedTokensContextProvider>
              <ScalingAssociatedTokensContextProvider>
                <ScalingTvsTabs {...entries} milestones={milestones} />
              </ScalingAssociatedTokensContextProvider>
            </ScalingRwaRestrictedTokensContextProvider>
          </TableFilterContextProvider>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
