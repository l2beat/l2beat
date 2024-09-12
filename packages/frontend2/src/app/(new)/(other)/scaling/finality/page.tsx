import { SimplePageHeader } from '~/components/simple-page-header'
import { getScalingFinalityEntries } from '~/server/features/scaling/finality/get-scaling-finality-entries'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingFilterContextProvider } from '../../_components/scaling-filter-context'
import { FinalityDiagramsSection } from './_components/diagram-section'
import { ScalingFinalityTable } from './_components/table/scaling-finality-table'
import { FinalityWarning } from './_components/warning'
import { finalityDiagrams } from './_utils/finality-diagrams'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/finality',
  },
})

export default async function Page() {
  const projects = await getScalingFinalityEntries()

  return (
    <ScalingFilterContextProvider>
      <SimplePageHeader>Finality</SimplePageHeader>
      <FinalityWarning />
      <ScalingFinalityTable projects={projects} />
      <FinalityDiagramsSection className="mt-20" diagrams={finalityDiagrams} />
    </ScalingFilterContextProvider>
  )
}
