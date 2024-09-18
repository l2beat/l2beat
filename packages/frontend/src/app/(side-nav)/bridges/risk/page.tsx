import { SimplePageHeader } from '~/components/simple-page-header'
import { getBridgeRiskEntries } from '~/server/features/bridges/get-bridges-risk-entries'
import { getDefaultMetadata } from '~/utils/metadata'
import { BridgesFilterContextProvider } from '../_components/bridges-filter-context'
import { BridgesRiskTable } from './_components/table/bridges-risks-table'

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
        <BridgesRiskTable entries={entries} />
      </BridgesFilterContextProvider>
    </div>
  )
}
