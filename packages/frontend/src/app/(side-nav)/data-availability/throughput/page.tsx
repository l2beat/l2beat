import { CountBadge } from '~/components/badge/count-badge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { MainPageHeader } from '~/components/main-page-header'
import { getDaThroughputEntries } from '~/server/features/data-availability/throughput/get-da-throughput-entries'
import { PublicSystemInfo } from '../_components/da-category-info'
import { groupBySystem } from '../_utils/group-by-system'
import { DaThroughputPublicTable } from './_components/table/da-throuput-public-table'

export default async function Page() {
  const entries = await getDaThroughputEntries()
  const { publicSystems } = groupBySystem(entries)

  return (
    <div>
      <MainPageHeader>DABEAT Throughput</MainPageHeader>
      {/* 
        Negative margin is there to make the tabs align with the side nav
        Padding from directory tabs can not be removed because it is needed
        for the tabs to be sticky
      */}
      <div className="flex flex-col gap-6 lg:-mt-4">
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
