import { MainPageHeader } from '~/components/main-page-header'
import { NewTableFilterContextProvider } from '~/components/table/filters/new-table-filter-context'
import { getScalingFinalityEntries } from '~/server/features/scaling/finality/get-scaling-finality-entries'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingFinalityTables } from './_components/scaling-finality-tables'
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
      <NewTableFilterContextProvider>
        <ScalingFinalityTables {...entries} />
      </NewTableFilterContextProvider>
      {/* <FinalityDiagramsSection className="mt-20" diagrams={finalityDiagrams} /> */}
    </>
  )
}
