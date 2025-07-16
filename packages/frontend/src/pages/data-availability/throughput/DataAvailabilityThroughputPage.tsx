import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { CountBadge } from '~/components/badge/CountBadge'
import { DaThroughputChart } from '~/components/chart/data-availability/DaThroughputChart'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/DirectoryTabs'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { DaThroughputEntry } from '~/server/features/data-availability/throughput/getDaThroughputEntries'
import { PublicSystemInfo } from '../components/DaCategoryInfo'
import { IncludeScalingOnlyProvider } from './components/DaThroughputContext'
import { DaThroughputPublicTable } from './components/table/DaThroughputPublicTable'

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
          <div className="lg:-mt-4 flex flex-col gap-6">
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
