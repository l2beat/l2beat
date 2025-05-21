import type { Milestone } from '@l2beat/config'
import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import type { TabbedScalingEntries } from '~/app/(side-nav)/scaling/_utils/group-by-scaling-tabs'
import { ActivityPage as NextActivityPage } from '~/app/(side-nav)/scaling/activity/_page'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import type { ScalingActivityEntry } from '~/server/features/scaling/activity/get-scaling-activity-entries'

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
          <NextActivityPage entries={entries} milestones={milestones} />
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
