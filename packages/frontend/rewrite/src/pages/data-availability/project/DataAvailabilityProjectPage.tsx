import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import type {
  DaProjectPageEntry,
  EthereumDaProjectPageEntry,
} from 'rewrite/src/server/features/data-availability/project/get-da-project-entry'
import { DataAvailabilityProjectPage as NextDataAvailabilityProjectPage } from '~/app/(top-nav)/data-availability/projects/[layer]/[bridge]/_page'
import { TopNavLayout } from '~/app/(top-nav)/top-nav-layout'
import { AppLayout, type AppLayoutProps } from '~/app/_layout'

interface Props extends AppLayoutProps {
  projectEntry: DaProjectPageEntry | EthereumDaProjectPageEntry
  queryState: DehydratedState
}

export function DataAvailabilityProjectPage({
  projectEntry,
  queryState,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <TopNavLayout>
          <NextDataAvailabilityProjectPage projectEntry={projectEntry} />
        </TopNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
