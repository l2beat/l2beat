import type { Milestone } from '@l2beat/config'
import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import { MainPageHeader } from '~/components/main-page-header'
import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import type { TabbedScalingEntries } from '~/pages/scaling/utils/group-by-scaling-tabs'
import type { ScalingActivityEntry } from '~/server/features/scaling/activity/get-scaling-activity-entries'
import { ActivityMetricContextProvider } from './components/activity-metric-context'
import { ActivityTimeRangeContextProvider } from './components/activity-time-range-context'
import { ScalingActivityTabs } from './components/scaling-activity-tabs'

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
