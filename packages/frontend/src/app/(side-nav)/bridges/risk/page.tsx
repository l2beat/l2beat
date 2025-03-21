import { PrimaryCard } from '~/components/primary-card/primary-card'
import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import { getBridgeRiskEntries } from '~/server/features/bridges/get-bridges-risk-entries'
import { getDefaultMetadata } from '~/utils/metadata'
import { BridgesHeader } from '../_components/bridges-header'
import { BridgesRiskTable } from './_components/table/bridges-risks-table'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/bridges/risk',
  },
})

export default async function Page() {
  const entries = await getBridgeRiskEntries()

  return (
    <>
      <TableFilterContextProvider>
        <BridgesHeader>Risk Analysis</BridgesHeader>
        <PrimaryCard>
          <BridgesRiskTable entries={entries} />
        </PrimaryCard>
      </TableFilterContextProvider>
    </>
  )
}
