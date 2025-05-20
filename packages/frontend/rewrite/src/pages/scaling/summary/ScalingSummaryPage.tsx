import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import type { TabbedScalingEntries } from '~/app/(side-nav)/scaling/_utils/group-by-scaling-tabs'
import { ScalingSummaryPage as NextSummaryPage } from '~/app/(side-nav)/scaling/summary/_page'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import type { ScalingSummaryEntry } from '~/server/features/scaling/summary/get-scaling-summary-entries'

interface Props extends AppLayoutProps {
  entries: TabbedScalingEntries<ScalingSummaryEntry>
  dehydratedState: DehydratedState
}
export function ScalingSummaryPage({
  entries,
  dehydratedState,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={dehydratedState}>
        <SideNavLayout>
          <NextSummaryPage entries={entries} />
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
