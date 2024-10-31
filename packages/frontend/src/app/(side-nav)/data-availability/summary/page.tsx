import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { MainPageHeader } from '~/components/main-page-header'
import { getDaSummaryEntries } from '~/server/features/data-availability/summary/get-da-summary-entries'
import { groupBySystem } from '../_utils/group-by-system'
import { DaSummaryCustomTable } from './_components/table/da-summary-custom-table'
import { DaSummaryPublicTable } from './_components/table/da-summary-public-table'
import { getDefaultMetadata } from '~/utils/metadata'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/data-availability/summary',
  },
})

export default async function Page() {
  const items = await getDaSummaryEntries()
  const { publicSystems, customSystems } = groupBySystem(items)

  return (
    <div>
      <MainPageHeader>Summary</MainPageHeader>
      <div className="flex flex-col gap-6">
        <DirectoryTabs defaultValue="public">
          <DirectoryTabsList>
            <DirectoryTabsTrigger value="public">Public</DirectoryTabsTrigger>
            <DirectoryTabsTrigger value="custom">Custom</DirectoryTabsTrigger>
          </DirectoryTabsList>
          <DirectoryTabsContent value="public">
            <DaSummaryPublicTable items={publicSystems} />
          </DirectoryTabsContent>
          <DirectoryTabsContent value="custom">
            <DaSummaryCustomTable items={customSystems} />
          </DirectoryTabsContent>
        </DirectoryTabs>
      </div>
    </div>
  )
}
