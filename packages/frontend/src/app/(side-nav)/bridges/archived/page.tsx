import { MainPageHeader } from '~/components/main-page-header'
import { PrimaryCard } from '~/components/primary-card'
import { NewTableFilterContextProvider } from '~/components/table/filters/new-table-filter-context'
import { getBridgesArchivedEntries } from '~/server/features/bridges/get-bridges-archived-entries'
import { getDefaultMetadata } from '~/utils/metadata'
import { BridgesMvpWarning } from '../_components/bridges-mvp-warning'
import { BridgesArchivedTable } from './_components/table/bridges-archived-table'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/bridges/archived',
  },
})

export default async function Page() {
  const entries = await getBridgesArchivedEntries()
  return (
    <NewTableFilterContextProvider>
      <MainPageHeader>Archived</MainPageHeader>
      <BridgesMvpWarning className="md:mb-3" sidebar />
      <PrimaryCard>
        <BridgesArchivedTable entries={entries} />
      </PrimaryCard>
    </NewTableFilterContextProvider>
  )
}
