import type { TabbedScalingEntries } from '~/app/(side-nav)/scaling/_utils/group-by-scaling-tabs'
import { ScalingLivenessPage as NextLivenessPage } from '~/app/(side-nav)/scaling/liveness/_page'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import type { ScalingLivenessEntry } from '~/server/features/scaling/liveness/get-scaling-liveness-entries'

interface Props extends AppLayoutProps {
  entries: TabbedScalingEntries<ScalingLivenessEntry>
}

export function ScalingLivenessPage(props: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <NextLivenessPage entries={props.entries} />
      </SideNavLayout>
    </AppLayout>
  )
}
