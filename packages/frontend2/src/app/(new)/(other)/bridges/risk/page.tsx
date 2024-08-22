import { SimplePageHeader } from '~/app/_components/simple-page-header'
import { getBridgeRiskEntries } from '~/server/features/bridges/get-bridge-risk-entries'
import { getDefaultMetadata } from '~/utils/get-default-metadata'
import { BridgesFilterContextProvider } from '../_components/bridges-filter-context'
import { BridgesMvpWarning } from '../_components/bridges-mvp-warning'
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
        <SimplePageHeader>Risk Analysis</SimplePageHeader>
        <BridgesMvpWarning />
        <BridgesRiskTables entries={entries} />
      </BridgesFilterContextProvider>
    </div>
  )
}
