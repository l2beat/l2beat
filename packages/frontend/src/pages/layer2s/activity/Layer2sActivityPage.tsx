import type { Milestone } from '@l2beat/config'
import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { MainPageHeader } from '~/components/MainPageHeader'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { Layer2sActivityEntry } from '~/server/features/layer2s/activity/getLayer2sActivityEntries'
import { ActivityChartRangeContextProvider } from './components/ActivityChartRangeContext'
import { ActivityMetricContextProvider } from './components/ActivityMetricContext'
import { Layer2sActivityCard } from './components/Layer2sActivityCard'

interface Props extends AppLayoutProps {
  entries: Layer2sActivityEntry[]
  milestones: Milestone[]
  queryState: DehydratedState
}

export function Layer2sActivityPage({
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
                <Layer2sActivityCard
                  entries={entries}
                  milestones={milestones}
                />
              </ActivityMetricContextProvider>
            </ActivityChartRangeContextProvider>
          </TableFilterContextProvider>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
