import type { Milestone } from '@l2beat/config'
import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import type { TabbedScalingEntries } from '~/app/(side-nav)/scaling/_utils/group-by-scaling-tabs'
import { ScalingTvsPage as NextTvsPage } from '~/app/(side-nav)/scaling/tvs/_page'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import type { ScalingTvsEntry } from '~/server/features/scaling/tvs/get-scaling-tvs-entries'

interface Props extends AppLayoutProps {
  entries: TabbedScalingEntries<ScalingTvsEntry>
  milestones: Milestone[]
  dehydratedState: DehydratedState
}

export function ScalingTvsPage({
  entries,
  milestones,
  dehydratedState,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={dehydratedState}>
        <SideNavLayout>
          <NextTvsPage entries={entries} milestones={milestones} />
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
