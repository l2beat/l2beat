import type { Milestone } from '@l2beat/config'
import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { MainPageHeader } from '~/components/MainPageHeader'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { TabbedScalingEntries } from '~/pages/scaling/utils/groupByScalingTabs'
import type { ScalingActivityEntry } from '~/server/features/scaling/activity/getScalingActivityEntries'
import { ActivityMetricContextProvider } from './components/ActivityMetricContext'
import { ActivityTimeRangeContextProvider } from './components/ActivityTimeRangeContext'
import { ScalingActivityTabs } from './components/ScalingActivityTabs'

interface Props extends AppLayoutProps {
  entries: TabbedScalingEntries<ScalingActivityEntry>
  milestones: Milestone[]
  queryState: DehydratedState
}

export function ScalingActivityPage({
  entries,
  milestones,
  queryState,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout>
          <TableFilterContextProvider>
            <ActivityTimeRangeContextProvider>
              <ActivityMetricContextProvider>
                <MainPageHeader>Activity</MainPageHeader>
                <ScalingActivityTabs {...entries} milestones={milestones} />
              </ActivityMetricContextProvider>
            </ActivityTimeRangeContextProvider>
          </TableFilterContextProvider>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
