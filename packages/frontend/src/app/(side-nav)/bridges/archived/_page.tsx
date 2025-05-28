import type { BridgesArchivedEntry } from 'rewrite/src/server/features/bridges/get-bridges-archived-entries'
import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import { BridgesHeader } from '../_components/bridges-header'
import type { TabbedBridgeEntries } from '../_utils/group-by-bridge-tabs'
import { BridgesArchivedTables } from './_components/bridges-archived-tables'

interface Props {
  entries: TabbedBridgeEntries<BridgesArchivedEntry>
}

export function BridgesArchivedPage({ entries }: Props) {
  return (
    <TableFilterContextProvider>
      <BridgesHeader>Archived</BridgesHeader>
      <BridgesArchivedTables {...entries} />
    </TableFilterContextProvider>
  )
}
