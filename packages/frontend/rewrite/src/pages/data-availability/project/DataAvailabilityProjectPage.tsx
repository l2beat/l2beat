import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { DataAvailabilityProjectPage as NextDataAvailabilityProjectPage } from '~/app/(top-nav)/data-availability/projects/[layer]/[bridge]/_page'
import { TopNavLayout } from '~/app/(top-nav)/top-nav-layout'
import { AppLayout, type AppLayoutProps } from '~/app/_layout'
import type {
  DaProjectPageEntry,
  EthereumDaProjectPageEntry,
} from '~/server/features/data-availability/project/get-da-project-entry'

interface Props extends AppLayoutProps {
  projectEntry: DaProjectPageEntry | EthereumDaProjectPageEntry
  dehydratedState: DehydratedState
}

export function DataAvailabilityProjectPage({
  projectEntry,
  dehydratedState,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={dehydratedState}>
        <TopNavLayout>
          <NextDataAvailabilityProjectPage projectEntry={projectEntry} />
        </TopNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
