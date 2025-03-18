import { getScalingFinalityEntries } from '~/server/features/scaling/finality/get-scaling-finality-entries'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingFilterContextProvider } from '../_components/scaling-filter-context'
import { FinalityHeader } from './_components/finality-header'
import { ScalingFinalityTables } from './_components/scaling-finality-tables'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/finality',
  },
})

export default async function Page() {
  const entries = await getScalingFinalityEntries()

  return (
    <>
      <FinalityHeader />
      <ScalingFilterContextProvider>
        <ScalingFinalityTables {...entries} />
      </ScalingFilterContextProvider>
      {/* <FinalityDiagramsSection className="mt-20" diagrams={finalityDiagrams} /> */}
    </>
  )
}
