import type { TabbedScalingEntries } from '~/app/(side-nav)/scaling/_utils/group-by-scaling-tabs'
import { ScalingUpcomingPage as NextUpcomingPage } from '~/app/(side-nav)/scaling/upcoming/_page'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import type { ScalingUpcomingEntry } from '~/server/features/scaling/upcoming/get-scaling-upcoming-entries'

interface Props extends AppLayoutProps {
  entries: TabbedScalingEntries<ScalingUpcomingEntry>
}

export function ScalingUpcomingPage({ entries, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <NextUpcomingPage entries={entries} />
      </SideNavLayout>
    </AppLayout>
  )
}
