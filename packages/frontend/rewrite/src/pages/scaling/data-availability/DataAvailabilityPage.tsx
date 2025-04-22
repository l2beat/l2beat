import type { TabbedScalingEntries } from '~/app/(side-nav)/scaling/_utils/group-by-scaling-tabs'
import { ScalingDaPage as NextDaPage } from '~/app/(side-nav)/scaling/data-availability/_page'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import type { ScalingDaEntry } from '~/server/features/scaling/data-availability/get-scaling-da-entries'

interface Props extends AppLayoutProps {
  entries: TabbedScalingEntries<ScalingDaEntry>
}

export function DataAvailabilityPage(props: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <NextDaPage entries={props.entries} />
      </SideNavLayout>
    </AppLayout>
  )
}
