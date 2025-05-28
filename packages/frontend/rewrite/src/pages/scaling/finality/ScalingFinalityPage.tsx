import type { ScalingFinalityEntry } from 'rewrite/src/server/features/scaling/finality/get-scaling-finality-entries'
import type { TabbedScalingEntries } from '~/app/(side-nav)/scaling/_utils/group-by-scaling-tabs'
import { ScalingFinalityPage as NextFinalityPage } from '~/app/(side-nav)/scaling/finality/_page'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'

interface Props extends AppLayoutProps {
  entries: TabbedScalingEntries<ScalingFinalityEntry>
}

export function ScalingFinalityPage({ entries, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <NextFinalityPage entries={entries} />
      </SideNavLayout>
    </AppLayout>
  )
}
