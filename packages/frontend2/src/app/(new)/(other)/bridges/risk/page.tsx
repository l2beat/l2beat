import { BridgesMvpWarning } from '~/app/_components/bridges-mvp-warning'
import { SimplePageHeader } from '~/app/_components/simple-page-header'
import { getBridgeRiskEntries } from '~/server/features/bridges/get-bridge-risk-entries'
import { getDefaultMetadata } from '~/utils/get-default-metadata'
import { BridgesFilterContextProvider } from '../_components/bridges-filter-context'
import { BridgesRiskTables } from './_components/table/bridges-risks-tables'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/bridges/summary',
  },
})

export default async function Page() {
  const entries = await getBridgeRiskEntries()

  return (
    <BridgesFilterContextProvider>
      <div className="mb-8">
        <SimplePageHeader>Risk Analysis</SimplePageHeader>
        <BridgesMvpWarning />
        <BridgesRiskTables entries={entries} />
      </div>
    </BridgesFilterContextProvider>
  )
}
