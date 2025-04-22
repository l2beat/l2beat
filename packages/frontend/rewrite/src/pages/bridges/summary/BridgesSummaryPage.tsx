import type { TabbedBridgeEntries } from '~/app/(side-nav)/bridges/_utils/group-by-bridge-tabs'
import { BridgesSummaryPage as NextSummaryPage } from '~/app/(side-nav)/bridges/summary/_page'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import type { BridgesSummaryEntry } from '~/server/features/bridges/get-bridges-summary-entries'

interface Props extends AppLayoutProps {
  entries: TabbedBridgeEntries<BridgesSummaryEntry>
}

export function BridgesSummaryPage(props: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <NextSummaryPage entries={props.entries} />
      </SideNavLayout>
    </AppLayout>
  )
}
