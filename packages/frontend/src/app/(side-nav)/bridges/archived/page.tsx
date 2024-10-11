import { MainPageCard } from '~/components/main-page-card'
import { MainPageHeader } from '~/components/main-page-header'
import { getBridgesArchivedEntries } from '~/server/features/bridges/get-bridges-archived-entries'
import { BridgesFilterContextProvider } from '../_components/bridges-filter-context'
import { BridgesMvpWarning } from '../_components/bridges-mvp-warning'
import { BridgesArchivedTable } from './_components/table/bridges-archived-table'

export default async function Page() {
  const entries = await getBridgesArchivedEntries()
  return (
    <BridgesFilterContextProvider>
      <MainPageHeader>Archived</MainPageHeader>
      <BridgesMvpWarning className="md:mb-3" sidebar />
      <MainPageCard>
        <BridgesArchivedTable entries={entries} />
      </MainPageCard>
    </BridgesFilterContextProvider>
  )
}
