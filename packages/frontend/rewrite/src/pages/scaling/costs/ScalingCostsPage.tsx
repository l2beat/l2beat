import type { Milestone } from '@l2beat/config'
import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import type { ScalingCostsEntry } from 'rewrite/src/server/features/scaling/costs/get-scaling-costs-entries'
import type { TabbedScalingEntries } from '~/app/(side-nav)/scaling/_utils/group-by-scaling-tabs'
import { ScalingCostsPage as NextCostsPage } from '~/app/(side-nav)/scaling/costs/_page'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'

interface Props extends AppLayoutProps {
  entries: TabbedScalingEntries<ScalingCostsEntry>
  milestones: Milestone[]
  queryState: DehydratedState
}

export function ScalingCostsPage({
  entries,
  milestones,
  queryState,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout>
          <NextCostsPage entries={entries} milestones={milestones} />
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
