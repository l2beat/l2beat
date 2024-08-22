import { SimplePageHeader } from '~/app/_components/simple-page-header'
import { getBridgeRiskEntries } from '~/server/features/bridges/get-bridge-risk-entries'
import { getDefaultMetadata } from '~/utils/get-default-metadata'
import { BridgesFilterContextProvider } from '../_components/bridges-filter-context'
import { BridgesRiskTables } from './_components/table/bridges-risks-tables'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/bridges/risk',
  },
})

export default async function Page() {
  const entries = await getBridgeRiskEntries()

  return (
    <div className="mb-8">
      <BridgesFilterContextProvider>
        <SimplePageHeader className="!mt-0 mb-4">
          Risk Analysis
        </SimplePageHeader>
        <BridgesRiskTables entries={entries} />
      </BridgesFilterContextProvider>
    </div>
  )
}
