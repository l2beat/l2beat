import { MainPageCard } from '~/components/main-page-card'
import { SimplePageHeader } from '~/components/simple-page-header'
import { getBridgesArchivedEntries } from '~/server/features/bridges/get-bridges-archived-entries'
import { BridgesFilterContextProvider } from '../_components/bridges-filter-context'
import { BridgesMvpWarning } from '../_components/bridges-mvp-warning'
import { BridgesArchivedTable } from './_components/table/bridges-archived-table'

export default async function Page() {
  const entries = await getBridgesArchivedEntries()
  return (
    <BridgesFilterContextProvider>
      <SimplePageHeader>Archived</SimplePageHeader>
      <BridgesMvpWarning />
      <MainPageCard>
        <BridgesArchivedTable entries={entries} />
      </MainPageCard>
    </BridgesFilterContextProvider>
  )
}
