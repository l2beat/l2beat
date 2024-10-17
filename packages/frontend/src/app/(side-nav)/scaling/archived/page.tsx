import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { MainPageCard } from '~/components/main-page-card'
import { MainPageHeader } from '~/components/main-page-header'
import { env } from '~/env'
import {
  type ScalingArchivedEntry,
  getScalingArchivedEntries,
} from '~/server/features/scaling/archived/get-scaling-archived-entries'
import { groupByMainCategories } from '~/utils/group-by-main-categories'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingFilterContextProvider } from '../_components/scaling-filter-context'
import { ScalingArchivedTable } from './_components/table/scaling-archived-table'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/archived',
  },
})

export default async function Page() {
  const entries = await getScalingArchivedEntries()
  return (
    <>
      <MainPageHeader>Archived</MainPageHeader>
      <Table entries={entries} />
    </>
  )
}

function Table({ entries }: { entries: ScalingArchivedEntry[] }) {
  if (env.NEXT_PUBLIC_FEATURE_FLAG_RECATEGORISATION) {
    const { rollups, validiumsAndOptimiums } = groupByMainCategories(entries)
    return (
      <DirectoryTabs defaultValue="rollups">
        <DirectoryTabsList>
          <DirectoryTabsTrigger value="rollups">Rollups</DirectoryTabsTrigger>
          <DirectoryTabsTrigger value="validiums-and-optimiums">
            Validiums & Optimiums
          </DirectoryTabsTrigger>
        </DirectoryTabsList>
        <DirectoryTabsContent value="rollups">
          <ScalingFilterContextProvider>
            <ScalingArchivedTable entries={rollups} />
          </ScalingFilterContextProvider>
        </DirectoryTabsContent>
        <DirectoryTabsContent value="validiums-and-optimiums">
          <ScalingFilterContextProvider>
            <ScalingArchivedTable entries={validiumsAndOptimiums} />
          </ScalingFilterContextProvider>
        </DirectoryTabsContent>
      </DirectoryTabs>
    )
  }
  return (
    <MainPageCard>
      <ScalingFilterContextProvider>
        <ScalingArchivedTable entries={entries} />
      </ScalingFilterContextProvider>
    </MainPageCard>
  )
}
