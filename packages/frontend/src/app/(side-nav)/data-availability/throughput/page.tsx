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
import { getDaThroughputEntries } from '~/server/features/data-availability/throughput/get-da-throughput-entries'
import { HydrateClient, api } from '~/trpc/server'
import { PublicSystemInfo } from '../_components/da-category-info'
import { DaThroughputPublicTable } from './_components/table/da-throughput-public-table'
import { IncludeScalingOnlyProvider } from './_context/da-throughput-context'

export default async function Page() {
  const [entries] = await Promise.all([
    getDaThroughputEntries(),
    api.da.chart.prefetch({ range: '30d', includeScalingOnly: false }),
  ])

  return (
    <HydrateClient>
      <MainPageHeader>Throughput</MainPageHeader>
      {/* 
        Negative margin is there to make the tabs align with the side nav
        Padding from directory tabs can not be removed because it is needed
        for the tabs to be sticky
      */}
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
    </HydrateClient>
  )
}
