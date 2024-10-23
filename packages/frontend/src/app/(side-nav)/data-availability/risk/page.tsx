import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { MainPageHeader } from '~/components/main-page-header'
import { getDaRiskEntries } from '~/server/features/data-availability/risks/get-da-risk-entries'
import { groupBySystem } from '../_utils/group-by-system'
import { DaRiskTable } from './_components/table/da-risk-table'

export default async function Page() {
  const items = await getDaRiskEntries()
  const { publicSystems, customSystems } = groupBySystem(items)

  return (
    <div>
      <MainPageHeader>Risk Analysis</MainPageHeader>
      <div className="flex flex-col gap-6">
        <DirectoryTabs defaultValue="public">
          <DirectoryTabsList>
            <DirectoryTabsTrigger value="public">Public</DirectoryTabsTrigger>
            <DirectoryTabsTrigger value="custom">Custom</DirectoryTabsTrigger>
          </DirectoryTabsList>
          <DirectoryTabsContent value="public">
            <DaRiskTable items={publicSystems} />
          </DirectoryTabsContent>
          <DirectoryTabsContent value="custom">
            <DaRiskTable items={customSystems} />
          </DirectoryTabsContent>
        </DirectoryTabs>
      </div>
    </div>
  )
}
