import { useMemo } from 'react'
import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import type { EventDetailsRow } from '../../types'
import { createEventDetailsColumns } from './columns'

interface EventDetailsTableProps {
  data: EventDetailsRow[]
  getExplorerUrl: (chain: string) => string | undefined
  enableCsvExport?: boolean
}

export function EventDetailsTable({
  data,
  getExplorerUrl,
  enableCsvExport = false,
}: EventDetailsTableProps) {
  const columns = useMemo(
    () =>
      createEventDetailsColumns({
        getExplorerUrl,
      }),
    [getExplorerUrl],
  )

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
    columns,
    initialSorting: [{ id: 'timestamp', desc: true }],
    getRowId: (row) => `${row.chain}-${row.txHash}-${row.logIndex}`,
    searchPlaceholder: 'Search plugins, chains, tx hashes, and args',
  })

  return (
    <TanStackTable
      table={table}
      pageSizeOption={pageSizeOption}
      onPageSizeOptionChange={setPageSizeOption}
      emptyMessage="No events found for the selected filters."
      enableCsvExport={enableCsvExport}
      getCsvFilename={() =>
        `interop-event-details-${new Date().toISOString()}.csv`
      }
      totalRowsCount={totalRowsCount}
      filteredRowsCount={filteredRowsCount}
      searchValue={isSearchEnabled ? searchValue : undefined}
      onSearchValueChange={isSearchEnabled ? setSearchValue : undefined}
      searchPlaceholder={searchPlaceholder}
      isSearchPending={isSearchPending}
    />
  )
}
