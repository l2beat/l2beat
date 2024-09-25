import { SimplePageHeader } from '~/components/simple-page-header'
import { getBridgesArchivedEntries } from '~/server/features/bridges/get-bridges-archived-entries'
import { BridgesFilterContextProvider } from '../_components/bridges-filter-context'
import { BridgesArchivedTable } from './_components/table/bridges-archived-table'

export default async function Page() {
  const entries = await getBridgesArchivedEntries()
  return (
    <BridgesFilterContextProvider>
      <SimplePageHeader className="!mt-0">Archived</SimplePageHeader>
      <BridgesArchivedTable entries={entries} />
    </BridgesFilterContextProvider>
  )
}
