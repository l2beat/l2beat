import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { DataAvailabilityProjectPage as NextDataAvailabilityProjectPage } from '~/app/(top-nav)/data-availability/projects/[layer]/[bridge]/_page'
import { AppLayout, type AppLayoutProps } from '~/layouts/app-layout.tsx'
import { TopNavLayout } from '~/layouts/top-nav-layout'
import type {
  DaProjectPageEntry,
  EthereumDaProjectPageEntry,
} from '~/server/features/data-availability/project/get-da-project-entry'

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
