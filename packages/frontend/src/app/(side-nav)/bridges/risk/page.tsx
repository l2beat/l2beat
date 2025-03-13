import { MainPageHeader } from '~/components/main-page-header'
import { PrimaryCard } from '~/components/primary-card'
import { NewTableFilterContextProvider } from '~/components/table/filters/new-table-filter-context'
import { getBridgeRiskEntries } from '~/server/features/bridges/get-bridges-risk-entries'
import { getDefaultMetadata } from '~/utils/metadata'
import { BridgesMvpWarning } from '../_components/bridges-mvp-warning'
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
      <NewTableFilterContextProvider>
        <MainPageHeader>Risk Analysis</MainPageHeader>
        <BridgesMvpWarning className="md:mb-3" sidebar />
        <PrimaryCard>
          <BridgesRiskTable entries={entries} />
        </PrimaryCard>
      </NewTableFilterContextProvider>
    </>
  )
}
