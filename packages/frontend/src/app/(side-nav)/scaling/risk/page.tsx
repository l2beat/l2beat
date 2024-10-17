import { getDefaultMetadata } from '~/utils/metadata'

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
  type ScalingRiskEntry,
  getScalingRiskEntries,
} from '~/server/features/scaling/risks/get-scaling-risk-entries'
import { mapToRecategorisedEntries } from '~/utils/map-to-recategorised-entries'
import { ScalingFilterContextProvider } from '../_components/scaling-filter-context'
import { ScalingRiskTable } from './_components/table/scaling-risk-table'
import { ScalingRiskValidiumsAndOptimiumsTable } from './_components/table/scaling-risk-validiums-and-optimiums-table'
import { ScalingRiskRollupsTable } from './_components/table/scaling-summary-rollups-table'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/risk',
  },
})

export default async function Page() {
  const entries = await getScalingRiskEntries()

  return (
    <>
      <MainPageHeader>Risk Analysis</MainPageHeader>
      <Tables entries={entries} />
    </>
  )
}

async function Tables({ entries }: { entries: ScalingRiskEntry[] }) {
  if (env.NEXT_PUBLIC_FEATURE_FLAG_RECATEGORISATION) {
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
            <ScalingRiskRollupsTable entries={grouped.rollups} />
          </ScalingFilterContextProvider>
        </DirectoryTabsContent>
        <DirectoryTabsContent value="validiums-and-optimiums">
          <ScalingFilterContextProvider>
            <ScalingRiskValidiumsAndOptimiumsTable
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
        <ScalingRiskTable entries={entries} />
      </MainPageCard>
    </ScalingFilterContextProvider>
  )
}
