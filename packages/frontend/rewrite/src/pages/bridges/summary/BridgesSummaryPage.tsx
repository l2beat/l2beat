import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import type { BridgesSummaryEntry } from 'rewrite/src/server/features/bridges/get-bridges-summary-entries'
import type { TabbedBridgeEntries } from '~/app/(side-nav)/bridges/_utils/group-by-bridge-tabs'
import { BridgesSummaryPage as NextSummaryPage } from '~/app/(side-nav)/bridges/summary/_page'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'

interface Props extends AppLayoutProps {
  entries: TabbedBridgeEntries<BridgesSummaryEntry>
  queryState: DehydratedState
}

export function BridgesSummaryPage({ entries, queryState, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout>
          <NextSummaryPage entries={entries} />
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
