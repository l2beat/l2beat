import { SimplePageHeader } from '~/app/_components/simple-page-header'
import { getBridgeRiskEntries } from '~/server/features/bridges/get-bridge-risk-entries'
import { getLatestTvlUsd } from '~/server/features/tvl/get-latest-tvl-usd'
import { getDefaultMetadata } from '~/utils/get-default-metadata'
import { BridgesMvpWarning } from '../_components/bridges-mvp-warning'
import { BridgesRiskTables } from './_components/table/bridges-risks-tables'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/bridges/summary',
  },
})

export default async function Page() {
  const tvl = await getLatestTvlUsd({ type: 'bridge' })
  const entries = await getBridgeRiskEntries(tvl)
  return (
    <div className="mb-8">
      <SimplePageHeader>Risk Analysis</SimplePageHeader>
      <BridgesMvpWarning />
      <BridgesRiskTables items={entries} />
    </div>
  )
}
