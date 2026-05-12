import { useMemo } from 'react'
import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import type { AggregatedAnomalyRow } from '../types'
import { createAggregatedAnomalyColumns } from './aggregated-columns'

interface AggregatedTransferAnomaliesTableProps {
  data: AggregatedAnomalyRow[]
  enableCsvExport?: boolean
}

export function AggregatedTransferAnomaliesTable({
  data,
  enableCsvExport = false,
}: AggregatedTransferAnomaliesTableProps) {
  const columns = useMemo(() => createAggregatedAnomalyColumns(), [])

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
    getRowId: (row) => row.id,
    searchPlaceholder: 'Search aggregate IDs, days, and alerts',
  })

  return (
    <TanStackTable
      table={table}
      pageSizeOption={pageSizeOption}
      onPageSizeOptionChange={setPageSizeOption}
      emptyMessage="No aggregated transfer anomalies found."
      enableVirtualization={false}
      enableCsvExport={enableCsvExport}
      getCsvFilename={() =>
        `interop-aggregated-transfer-anomalies-${new Date().toISOString()}.csv`
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
