import type { TabbedScalingEntries } from '~/pages/scaling/utils/group-by-scaling-tabs'
import { ScalingLivenessPage as NextLivenessPage } from '~/app/(side-nav)/scaling/liveness/_page'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import type { ScalingLivenessEntry } from '~/server/features/scaling/liveness/get-scaling-liveness-entries'

interface Props extends AppLayoutProps {
  entries: TabbedScalingEntries<ScalingLivenessEntry>
}

export function ScalingLivenessPage({ entries, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <NextLivenessPage entries={entries} />
      </SideNavLayout>
    </AppLayout>
  )
}
