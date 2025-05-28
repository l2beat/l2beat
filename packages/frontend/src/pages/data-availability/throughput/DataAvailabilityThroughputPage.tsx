import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { DataAvailabilityThroughputPage as NextDataAvailabilityThroughputPage } from '~/app/(side-nav)/data-availability/throughput/_page'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import type { DaThroughputEntry } from '~/server/features/data-availability/throughput/get-da-throughput-entries'

interface Props extends AppLayoutProps {
  entries: DaThroughputEntry[]
  queryState: DehydratedState
}

export function DataAvailabilityThroughputPage({
  entries,
  queryState,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout>
          <NextDataAvailabilityThroughputPage entries={entries} />
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
