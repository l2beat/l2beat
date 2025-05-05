import type { TabbedBridgeEntries } from '~/app/(side-nav)/bridges/_utils/group-by-bridge-tabs'
import { BridgesArchivedPage as NextArchivedPage } from '~/app/(side-nav)/bridges/archived/_page'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import type { BridgesArchivedEntry } from '~/server/features/bridges/get-bridges-archived-entries'

interface Props extends AppLayoutProps {
  entries: TabbedBridgeEntries<BridgesArchivedEntry>
}

export function BridgesArchivedPage(props: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <NextArchivedPage entries={props.entries} />
      </SideNavLayout>
    </AppLayout>
  )
}
