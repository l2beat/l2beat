import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { CountBadge } from '~/components/badge/count-badge'
import { DaThroughputChart } from '~/components/chart/data-availability/da-throughput-chart'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { MainPageHeader } from '~/components/main-page-header'
import type { AppLayoutProps } from '~/layouts/app-layout.tsx'
import { AppLayout } from '~/layouts/app-layout.tsx'
import { SideNavLayout } from '~/layouts/side-nav-layout'
import type { DaThroughputEntry } from '~/server/features/data-availability/throughput/get-da-throughput-entries'
import { PublicSystemInfo } from '../components/da-category-info'
import { IncludeScalingOnlyProvider } from './components/da-throughput-context'
import { DaThroughputPublicTable } from './components/table/da-throughput-public-table'

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
          <MainPageHeader>Throughput</MainPageHeader>
          <div className="flex flex-col gap-6 lg:-mt-4">
            <IncludeScalingOnlyProvider>
              <DirectoryTabs defaultValue="public">
                <DirectoryTabsList>
                  <DirectoryTabsTrigger value="public">
                    Public <CountBadge>{entries.length}</CountBadge>
                  </DirectoryTabsTrigger>
                </DirectoryTabsList>
                <DirectoryTabsContent value="public" className="pt-4 sm:pt-3">
                  <PublicSystemInfo />
                  <DaThroughputChart />
                  <HorizontalSeparator className="my-5" />
                  <DaThroughputPublicTable items={entries} />
                </DirectoryTabsContent>
              </DirectoryTabs>
            </IncludeScalingOnlyProvider>
          </div>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
