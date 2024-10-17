import { Suspense } from 'react'
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
  type ScalingUpcomingEntry,
  getScalingUpcomingEntries,
} from '~/server/features/scaling/upcoming/get-scaling-upcoming-entries'
import { groupByMainCategories } from '~/utils/group-by-main-categories'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingFilterContextProvider } from '../_components/scaling-filter-context'
import { ScalingUpcomingTable } from './_components/table/scaling-upcoming-table'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/upcoming',
  },
})

export default function Page() {
  const entries = getScalingUpcomingEntries()
  return (
    <>
      <MainPageHeader>Upcoming</MainPageHeader>
      <Table entries={entries} />
    </>
  )
}

function Table({ entries }: { entries: ScalingUpcomingEntry[] }) {
  if (env.NEXT_PUBLIC_FEATURE_FLAG_RECATEGORISATION) {
    const { rollups, validiumsAndOptimiums } = groupByMainCategories(entries)
    return (
      <Suspense>
        <DirectoryTabs defaultValue="rollups">
          <DirectoryTabsList>
            <DirectoryTabsTrigger value="rollups">Rollups</DirectoryTabsTrigger>
            <DirectoryTabsTrigger value="validiums-and-optimiums">
              Validiums & Optimiums
            </DirectoryTabsTrigger>
          </DirectoryTabsList>
          <DirectoryTabsContent value="rollups">
            <ScalingFilterContextProvider>
              <ScalingUpcomingTable entries={rollups} />
            </ScalingFilterContextProvider>
          </DirectoryTabsContent>
          <DirectoryTabsContent value="validiums-and-optimiums">
            <ScalingFilterContextProvider>
              <ScalingUpcomingTable entries={validiumsAndOptimiums} />
            </ScalingFilterContextProvider>
          </DirectoryTabsContent>
        </DirectoryTabs>
      </Suspense>
    )
  }
  return (
    <MainPageCard>
      <ScalingFilterContextProvider>
        <ScalingUpcomingTable entries={entries} />
      </ScalingFilterContextProvider>
    </MainPageCard>
  )
}
