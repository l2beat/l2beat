import { CountBadge } from '~/components/badge/count-badge'
import { DaThroughputChart } from '~/components/chart/data-availability/da-throughput-chart'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { MainPageHeader } from '~/components/main-page-header'
import { PrimaryCard } from '~/components/primary-card'
import { getDaThroughputEntries } from '~/server/features/data-availability/throughput/get-da-throughput-entries'
import { PublicSystemInfo } from '../_components/da-category-info'
import { groupBySystem } from '../_utils/group-by-system'
import { DaThroughputPublicTable } from './_components/table/da-throuput-public-table'

export default async function Page() {
  const entries = await getDaThroughputEntries()
  const { publicSystems } = groupBySystem(entries)

  return (
    <div>
      <MainPageHeader>Throughput</MainPageHeader>
      <div className="flex flex-col gap-6">
        <PrimaryCard>
          <DaThroughputChart />
        </PrimaryCard>
        <DirectoryTabs defaultValue="public">
          <DirectoryTabsList>
            <DirectoryTabsTrigger value="public">
              Public <CountBadge>{publicSystems.length}</CountBadge>
            </DirectoryTabsTrigger>
          </DirectoryTabsList>
          <DirectoryTabsContent value="public">
            <PublicSystemInfo />
            <DaThroughputPublicTable items={publicSystems} />
          </DirectoryTabsContent>
        </DirectoryTabs>
      </div>
    </div>
  )
}
