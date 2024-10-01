import { MainPageCard } from '~/components/main-page-card'
import { MainPageHeader } from '~/components/main-page-header'
import { getScalingFinalityEntries } from '~/server/features/scaling/finality/get-scaling-finality-entries'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingFilterContextProvider } from '../_components/scaling-filter-context'
import { ScalingFinalityTable } from './_components/table/scaling-finality-table'
import { FinalityWarning } from './_components/warning'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/finality',
  },
})

export default async function Page() {
  const projects = await getScalingFinalityEntries()

  return (
    <ScalingFilterContextProvider>
      <MainPageHeader>Finality</MainPageHeader>
      <FinalityWarning />
      <MainPageCard>
        <ScalingFinalityTable projects={projects} />
      </MainPageCard>
      {/* <FinalityDiagramsSection className="mt-20" diagrams={finalityDiagrams} /> */}
    </ScalingFilterContextProvider>
  )
}
