import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { getDaRiskEntries } from '~/server/features/data-availability/risks/get-da-risk-entries'
import { groupBySystem } from '../_utils/group-by-system'
import { DaTable } from '../summary/_components/table/da/da-table'

export default async function Page() {
  const items = await getDaRiskEntries()
  const { publicSystems, customSystems } = groupBySystem(items)

  return (
    <div>
      <h1 className="my-5 ml-6 text-3xl font-bold max-lg:hidden">
        Risk Analysis
      </h1>
      <div className="flex flex-col gap-6">
        <DirectoryTabs defaultValue="public">
          <DirectoryTabsList>
            <DirectoryTabsTrigger value="public">Public</DirectoryTabsTrigger>
            <DirectoryTabsTrigger value="custom">Custom</DirectoryTabsTrigger>
          </DirectoryTabsList>
          <DirectoryTabsContent value="public">
            <DaTable items={publicSystems} />
          </DirectoryTabsContent>
          <DirectoryTabsContent value="custom">
            <DaTable items={customSystems} excludeBridge />
          </DirectoryTabsContent>
        </DirectoryTabs>
      </div>
    </div>
  )
}
