import type { TabbedScalingEntries } from '~/app/(side-nav)/scaling/_utils/group-by-scaling-tabs'
import { ScalingArchivedPage as NextArchivedPage } from '~/app/(side-nav)/scaling/archived/_page'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import type { ScalingArchivedEntry } from '~/server/features/scaling/archived/get-scaling-archived-entries'

interface Props extends AppLayoutProps {
  entries: TabbedScalingEntries<ScalingArchivedEntry>
}

export function ScalingArchivedPage({ entries, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <NextArchivedPage entries={entries} />
      </SideNavLayout>
    </AppLayout>
  )
}
