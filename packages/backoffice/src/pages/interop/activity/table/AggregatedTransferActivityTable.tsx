import { useMemo } from 'react'
import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import type { AggregatedActivityRow } from '../types'
import { createAggregatedActivityColumns } from './aggregated-columns'

interface AggregatedTransferActivityTableProps {
  data: AggregatedActivityRow[]
  enableCsvExport?: boolean
}

export function AggregatedTransferActivityTable({
  data,
  enableCsvExport = false,
}: AggregatedTransferActivityTableProps) {
  const columns = useMemo(() => createAggregatedActivityColumns(), [])

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
    getRowId: (row) =>
      `${row.id}::${row.bridgeType}::${row.srcChain}::${row.dstChain}`,
    searchPlaceholder: 'Search aggregate IDs, days, and alerts',
  })

  return (
    <TanStackTable
      table={table}
      pageSizeOption={pageSizeOption}
      onPageSizeOptionChange={setPageSizeOption}
      emptyMessage="No aggregated transfer activity found."
      fillHeight
      enableVirtualization={false}
      enableCsvExport={enableCsvExport}
      getCsvFilename={() =>
        `interop-aggregated-transfer-activity-${new Date().toISOString()}.csv`
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
