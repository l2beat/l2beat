import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import { getBridgesArchivedEntries } from '~/server/features/bridges/get-bridges-archived-entries'
import { getDefaultMetadata } from '~/utils/metadata'
import { BridgesHeader } from '../_components/bridges-header'
import { BridgesArchivedTables } from './_components/bridges-archived-tables'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/bridges/archived',
  },
})

export default async function Page() {
  const entries = await getBridgesArchivedEntries()
  return (
    <TableFilterContextProvider>
      <BridgesHeader>Archived</BridgesHeader>
      <BridgesArchivedTables {...entries} />
    </TableFilterContextProvider>
  )
}
