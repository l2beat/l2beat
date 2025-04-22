import type { Milestone } from '@l2beat/config'
import type { TabbedScalingEntries } from '~/app/(side-nav)/scaling/_utils/group-by-scaling-tabs'
import { ScalingCostsPage as NextCostsPage } from '~/app/(side-nav)/scaling/costs/_page'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import type { ScalingCostsEntry } from '~/server/features/scaling/costs/get-scaling-costs-entries'

interface Props extends AppLayoutProps {
  entries: TabbedScalingEntries<ScalingCostsEntry>
  milestones: Milestone[]
}

export function ScalingCostsPage(props: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <NextCostsPage entries={props.entries} milestones={props.milestones} />
      </SideNavLayout>
    </AppLayout>
  )
}
