import type { Milestone } from '@l2beat/config'
import type { TabbedScalingEntries } from '~/app/(side-nav)/scaling/_utils/group-by-scaling-tabs'
import { ActivityPage as NextActivityPage } from '~/app/(side-nav)/scaling/activity/_page'
import type { SideNavLayoutProps } from '~/app/(side-nav)/side-nav-layout'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import type { ScalingActivityEntry } from '~/server/features/scaling/activity/get-scaling-activity-entries'

interface Props extends AppLayoutProps, SideNavLayoutProps {
  entries: TabbedScalingEntries<ScalingActivityEntry>
  milestones: Milestone[]
}

export function ActivityPage(props: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout
        showHiringBadge={props.showHiringBadge}
        ecosystemsEnabled={props.ecosystemsEnabled}
      >
        <NextActivityPage
          entries={props.entries}
          milestones={props.milestones}
        />
      </SideNavLayout>
    </AppLayout>
  )
}
