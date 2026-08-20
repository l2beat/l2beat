import type { Milestone } from '@l2beat/config'
import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { MainPageHeader } from '~/components/MainPageHeader'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { L2ActivityEntry } from '~/server/features/layer2s/activity/getL2ActivityEntries'
import { ActivityChartRangeContextProvider } from './components/ActivityChartRangeContext'
import { ActivityMetricContextProvider } from './components/ActivityMetricContext'
import { L2ActivityCard } from './components/L2ActivityCard'

interface Props extends AppLayoutProps {
  entries: L2ActivityEntry[]
  milestones: Milestone[]
  queryState: DehydratedState
}

export function L2ActivityPage({
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
            <ActivityChartRangeContextProvider>
              <ActivityMetricContextProvider>
                <MainPageHeader>Activity</MainPageHeader>
                <L2ActivityCard entries={entries} milestones={milestones} />
              </ActivityMetricContextProvider>
            </ActivityChartRangeContextProvider>
          </TableFilterContextProvider>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
