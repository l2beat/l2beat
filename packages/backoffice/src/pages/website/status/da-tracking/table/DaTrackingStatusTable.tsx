import type { Row } from '@tanstack/react-table'
import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import type { DaTrackingStatusRow } from '../types'
import { daTrackingStatusColumns } from './columns'

interface DaTrackingStatusTableProps {
  data: DaTrackingStatusRow[]
  enableCsvExport?: boolean
  className?: string
  scrollViewportClassName?: string
}

export function DaTrackingStatusTable({
  data,
  enableCsvExport = false,
  className,
  scrollViewportClassName,
}: DaTrackingStatusTableProps) {
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
    columns: daTrackingStatusColumns,
    initialSorting: [
      { id: 'status', desc: false },
      { id: 'latestTimestamp', desc: false },
      { id: 'projectId', desc: false },
      { id: 'daLayer', desc: false },
      { id: 'type', desc: false },
      { id: 'configId', desc: false },
    ],
    initialColumnFilters: [
      { id: 'status', value: ['stale', 'missing', 'fresh'] },
    ],
    initialPageSizeOption: 'all',
    getRowId: (row) => row.configId,
    searchPlaceholder: 'Search projects, config IDs, DA layers, and details',
  })

  return (
    <TanStackTable
      table={table}
      pageSizeOption={pageSizeOption}
      onPageSizeOptionChange={setPageSizeOption}
      emptyMessage="No active DA tracking configs found."
      className={className}
      scrollViewportClassName={scrollViewportClassName}
      enableCsvExport={enableCsvExport}
      getCsvFilename={() =>
        `da-tracking-status-${new Date().toISOString()}.csv`
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

function getRowClassName(row: Row<DaTrackingStatusRow>) {
  if (row.original.status === 'fresh') {
    return undefined
  }
  if (row.original.status === 'missing') {
    return 'bg-yellow-50/80 text-yellow-950 odd:bg-yellow-50/80 hover:bg-yellow-50 odd:hover:bg-yellow-50 dark:bg-yellow-950/20 dark:text-yellow-100 dark:odd:bg-yellow-950/20 dark:hover:bg-yellow-950/30 dark:odd:hover:bg-yellow-950/30'
  }
  return 'bg-red-50/80 text-red-950 odd:bg-red-50/80 hover:bg-red-50 odd:hover:bg-red-50 dark:bg-red-950/20 dark:text-red-100 dark:odd:bg-red-950/20 dark:hover:bg-red-950/30 dark:odd:hover:bg-red-950/30'
}
