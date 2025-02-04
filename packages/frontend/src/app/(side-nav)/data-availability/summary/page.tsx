import { CountBadge } from '~/components/badge/count-badge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { MainPageHeader } from '~/components/main-page-header'
import { getDaSummaryEntries } from '~/server/features/data-availability/summary/get-da-summary-entries'
import { getDefaultMetadata } from '~/utils/metadata'
import {
  CustomSystemInfo,
  PublicSystemInfo,
} from '../_components/da-category-info'
import { groupBySystem } from '../_utils/group-by-system'
import { DaSummaryCustomTable } from './_components/table/da-summary-custom-table'
import { DaSummaryPublicTable } from './_components/table/da-summary-public-table'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/data-availability/summary',
  },
})

export default async function Page() {
  const entries = await getDaSummaryEntries()
  const { publicSystems, customSystems } = groupBySystem(entries)

  return (
    <div>
      <MainPageHeader>Summary</MainPageHeader>
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
            <DirectoryTabsTrigger value="custom">
              Custom <CountBadge>{customSystems.length}</CountBadge>
            </DirectoryTabsTrigger>
          </DirectoryTabsList>
          <DirectoryTabsContent value="public">
            <PublicSystemInfo />
            <DaSummaryPublicTable items={publicSystems} />
          </DirectoryTabsContent>
          <DirectoryTabsContent value="custom">
            <CustomSystemInfo />
            <DaSummaryCustomTable items={customSystems} />
          </DirectoryTabsContent>
        </DirectoryTabs>
      </div>
    </div>
  )
}
