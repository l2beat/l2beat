import { useMemo } from 'react'
import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import type { FinancialTransferRow } from '../types'
import { createFinancialTransfersColumns } from './columns'

interface FinancialTransfersTableProps {
  data: FinancialTransferRow[]
}

export function FinancialTransfersTable({
  data,
}: FinancialTransfersTableProps) {
  const columns = useMemo(() => createFinancialTransfersColumns(), [])

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
    getRowId: (row) => row.transferId,
    searchPlaceholder: 'Search chains, symbols, plugins, and transfer ids',
  })

  return (
    <TanStackTable
      table={table}
      pageSizeOption={pageSizeOption}
      onPageSizeOptionChange={setPageSizeOption}
      emptyMessage="No transfers match the filters"
      enableCsvExport
      getCsvFilename={() =>
        `interop-financial-transfers-${new Date().toISOString()}.csv`
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
