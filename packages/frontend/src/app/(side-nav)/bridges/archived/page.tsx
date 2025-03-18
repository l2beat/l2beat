import { MainPageHeader } from '~/components/main-page-header'
import { PrimaryCard } from '~/components/primary-card/primary-card'
import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
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
    <TableFilterContextProvider>
      <MainPageHeader>Archived</MainPageHeader>
      <BridgesMvpWarning className="md:mb-3" sidebar />
      <PrimaryCard>
        <BridgesArchivedTable entries={entries} />
      </PrimaryCard>
    </TableFilterContextProvider>
  )
}
