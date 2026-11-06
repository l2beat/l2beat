import type { Milestone } from '@l2beat/config'
import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { MainPageHeader } from '~/components/MainPageHeader'
import {
  type BadgeLookup,
  BadgeLookupProvider,
} from '~/components/projects/BadgeLookup'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { HeartbeatStrip } from '~/pages/heartbeat/components/HeartbeatStrip'
import type { HeartbeatProject } from '~/server/features/heartbeat/getHeartbeatProjects'
import type { L2ActivityEntry } from '~/server/features/layer2s/activity/getL2ActivityEntries'
import { ActivityChartRangeContextProvider } from './components/ActivityChartRangeContext'
import {
  ActivityMetricContextProvider,
  useActivityMetricContext,
} from './components/ActivityMetricContext'
import { L2ActivityCard } from './components/L2ActivityCard'

interface Props extends AppLayoutProps {
  badgeLookup: BadgeLookup
  entries: L2ActivityEntry[]
  milestones: Milestone[]
  queryState: DehydratedState
  /** Only while the live page is on */
  heartbeatProjects: HeartbeatProject[] | undefined
}

export function L2ActivityPage({
  entries,
  milestones,
  queryState,
  badgeLookup,
  heartbeatProjects,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <BadgeLookupProvider lookup={badgeLookup}>
        <HydrationBoundary state={queryState}>
          <SideNavLayout>
            <TableFilterContextProvider>
              <ActivityChartRangeContextProvider>
                <ActivityMetricContextProvider>
                  <MainPageHeader>Activity</MainPageHeader>
                  {heartbeatProjects && (
                    <LiveStrip projects={heartbeatProjects} />
                  )}
                  <L2ActivityCard entries={entries} milestones={milestones} />
                </ActivityMetricContextProvider>
              </ActivityChartRangeContextProvider>
            </TableFilterContextProvider>
          </SideNavLayout>
        </HydrationBoundary>
      </BadgeLookupProvider>
    </AppLayout>
  )
}

/** Follows the chart's metric */
function LiveStrip({ projects }: { projects: HeartbeatProject[] }) {
  const { metric } = useActivityMetricContext()
  return <HeartbeatStrip projects={projects} metric={metric} />
}
