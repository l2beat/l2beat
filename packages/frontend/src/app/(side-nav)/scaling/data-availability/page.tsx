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
  type ScalingDataAvailabilityEntry,
  getScalingDaEntries,
} from '~/server/features/scaling/data-availability/get-scaling-da-entries'
import { mapToRecategorisedEntries } from '~/utils/map-to-recategorised-entries'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingFilterContextProvider } from '../_components/scaling-filter-context'
import { ScalingDaRollupsTable } from './_components/table/scaling-da-rollups-table'
import { ScalingDataAvailabilityTable } from './_components/table/scaling-da-table'
import { ScalingDaValidiumsAndOptimiumsTable } from './_components/table/scaling-da-validiums-and-optimiums-table'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/data-availability',
  },
})

export default async function Page() {
  const entries = await getScalingDaEntries()

  return (
    <>
      <MainPageHeader>Data Availability</MainPageHeader>
      <Tables entries={entries} />
    </>
  )
}

async function Tables({
  entries,
}: { entries: ScalingDataAvailabilityEntry[] }) {
  if (env.NEXT_PUBLIC_FEATURE_RECATEGORISATION) {
    const grouped = await mapToRecategorisedEntries(entries)
    return (
      <DirectoryTabs className="mt-6" defaultValue="rollups">
        <DirectoryTabsList>
          <DirectoryTabsTrigger value="rollups">Rollups</DirectoryTabsTrigger>
          <DirectoryTabsTrigger value="validiums-and-optimiums">
            Validiums & Optimiums
          </DirectoryTabsTrigger>
        </DirectoryTabsList>
        <DirectoryTabsContent value="rollups">
          <ScalingFilterContextProvider>
            <ScalingDaRollupsTable entries={grouped.rollups} />
          </ScalingFilterContextProvider>
        </DirectoryTabsContent>
        <DirectoryTabsContent value="validiums-and-optimiums">
          <ScalingFilterContextProvider>
            <ScalingDaValidiumsAndOptimiumsTable
              entries={grouped.validiumsAndOptimiums}
            />
          </ScalingFilterContextProvider>
        </DirectoryTabsContent>
      </DirectoryTabs>
    )
  }

  return (
    <ScalingFilterContextProvider>
      <MainPageCard>
        <ScalingDataAvailabilityTable entries={entries} />
      </MainPageCard>
    </ScalingFilterContextProvider>
  )
}
