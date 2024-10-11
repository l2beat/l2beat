import { env } from 'process'
import { MainPageCard } from '~/components/main-page-card'
import { MainPageHeader } from '~/components/main-page-header'
import { getScalingFinalityEntries } from '~/server/features/scaling/finality/get-scaling-finality-entries'
import { type ScalingFinalityEntry } from '~/server/features/scaling/finality/types'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingFilterContextProvider } from '../_components/scaling-filter-context'
import { ScalingFinalityRollupsTable } from './_components/table/scaling-finality-rollups-table'
import { ScalingFinalityTable } from './_components/table/scaling-finality-table'
import { FinalityWarning } from './_components/warning'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/finality',
  },
})

export default async function Page() {
  const entries = await getScalingFinalityEntries()

  return (
    <>
      <MainPageHeader>Finality</MainPageHeader>
      <FinalityWarning />
      <MainPageCard>
        <ScalingFilterContextProvider>
          <Table entries={entries} />
        </ScalingFilterContextProvider>
      </MainPageCard>
      {/* <FinalityDiagramsSection className="mt-20" diagrams={finalityDiagrams} /> */}
    </>
  )
}

async function Table({ entries }: { entries: ScalingFinalityEntry[] }) {
  if (env.NEXT_PUBLIC_FEATURE_RECATEGORISATION) {
    return <ScalingFinalityRollupsTable projects={entries} />
  }
  return <ScalingFinalityTable projects={entries} />
}
