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
import type { DaThroughputEntry } from '~/server/features/data-availability/throughput/get-da-throughput-entries'
import { PublicSystemInfo } from '../_components/da-category-info'
import { DaThroughputPublicTable } from './_components/table/da-throughput-public-table'
import { IncludeScalingOnlyProvider } from './_context/da-throughput-context'

interface Props {
  entries: DaThroughputEntry[]
}

export function DataAvailabilityThroughputPage({ entries }: Props) {
  return (
    <>
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
    </>
  )
}
