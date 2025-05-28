import type { Milestone } from '@l2beat/config'
import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import { MainPageHeader } from '~/components/main-page-header'
import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import { ScalingAssociatedTokensContextProvider } from '~/pages/scaling/components/scaling-associated-tokens-context'
import { ScalingTvsTabs } from '~/pages/scaling/tvs/components/scaling-tvs-tabs'
import type { TabbedScalingEntries } from '~/pages/scaling/utils/group-by-scaling-tabs'
import type { ScalingTvsEntry } from '~/server/features/scaling/tvs/get-scaling-tvs-entries'

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
            <ScalingAssociatedTokensContextProvider>
              <ScalingTvsTabs {...entries} milestones={milestones} />
            </ScalingAssociatedTokensContextProvider>
          </TableFilterContextProvider>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
