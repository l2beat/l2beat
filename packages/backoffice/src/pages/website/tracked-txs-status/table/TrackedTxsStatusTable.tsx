import type { Row } from '@tanstack/react-table'
import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import type { TrackedTxsStatusRow } from '../types'
import { trackedTxsStatusColumns } from './columns'

interface TrackedTxsStatusTableProps {
  data: TrackedTxsStatusRow[]
  enableCsvExport?: boolean
}

export function TrackedTxsStatusTable({
  data,
  enableCsvExport = false,
}: TrackedTxsStatusTableProps) {
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
    columns: trackedTxsStatusColumns,
    initialSorting: [
      { id: 'status', desc: false },
      { id: 'latestTimestamp', desc: false },
      { id: 'projectId', desc: false },
    ],
    initialPageSizeOption: 'all',
    getRowId: (row) => `${row.projectId}:${row.subtype}`,
    searchPlaceholder: 'Search projects, subtypes, and formulas',
  })

  return (
    <TanStackTable
      table={table}
      pageSizeOption={pageSizeOption}
      onPageSizeOptionChange={setPageSizeOption}
      emptyMessage="No active liveness tracked tx configs found."
      enableCsvExport={enableCsvExport}
      getCsvFilename={() =>
        `tracked-txs-status-${new Date().toISOString()}.csv`
      }
      rowClassName={getRowClassName}
      totalRowsCount={totalRowsCount}
      filteredRowsCount={filteredRowsCount}
      searchValue={isSearchEnabled ? searchValue : undefined}
      onSearchValueChange={isSearchEnabled ? setSearchValue : undefined}
      searchPlaceholder={searchPlaceholder}
      isSearchPending={isSearchPending}
    />
  )
}

function getRowClassName(row: Row<TrackedTxsStatusRow>) {
  if (row.original.status === 'fresh') {
    return undefined
  }
  return 'bg-red-50/80 text-red-950 odd:bg-red-50/80 hover:bg-red-50 odd:hover:bg-red-50 dark:bg-red-950/20 dark:text-red-100 dark:odd:bg-red-950/20 dark:hover:bg-red-950/30 dark:odd:hover:bg-red-950/30'
}
