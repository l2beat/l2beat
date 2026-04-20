import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import type { EventStatsRow } from '../types'
import { eventStatsColumns } from './columns'

interface EventsTableProps {
  data: EventStatsRow[]
  enableCsvExport?: boolean
}

export function EventsTable({
  data,
  enableCsvExport = false,
}: EventsTableProps) {
  const {
    filteredRowsCount,
    isSearchEnabled,
    isSearchPending,
    pageSizeOption,
    searchPlaceholder,
    searchValue,
    setPageSizeOption,
    setSearchValue,
    table,
    totalRowsCount,
  } = useTanStackTable({
    data,
    columns: eventStatsColumns,
    initialSorting: [{ id: 'type', desc: false }],
    getRowId: (row) => `${row.type}-${row.direction ?? ''}`,
    searchPlaceholder: 'Search event types or directions',
  })

  return (
    <TanStackTable
      table={table}
      pageSizeOption={pageSizeOption}
      onPageSizeOptionChange={setPageSizeOption}
      emptyMessage="No events found."
      enableCsvExport={enableCsvExport}
      getCsvFilename={() => `interop-events-${new Date().toISOString()}.csv`}
      totalRowsCount={totalRowsCount}
      filteredRowsCount={filteredRowsCount}
      searchValue={isSearchEnabled ? searchValue : undefined}
      onSearchValueChange={isSearchEnabled ? setSearchValue : undefined}
      searchPlaceholder={searchPlaceholder}
      isSearchPending={isSearchPending}
    />
  )
}
