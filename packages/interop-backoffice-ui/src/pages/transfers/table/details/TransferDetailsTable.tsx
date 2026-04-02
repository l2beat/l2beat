import { useMemo } from 'react'
import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import type { TransferDetailsRow } from '../../types'
import { createTransferDetailsColumns } from './columns'

interface TransferDetailsTableProps {
  data: TransferDetailsRow[]
  getExplorerUrl: (chain: string) => string | undefined
  enableCsvExport?: boolean
}

export function TransferDetailsTable({
  data,
  getExplorerUrl,
  enableCsvExport = false,
}: TransferDetailsTableProps) {
  const columns = useMemo(
    () =>
      createTransferDetailsColumns({
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
    getRowId: (row) => row.transferId,
    searchPlaceholder:
      'Search plugins, chains, hashes, bridge types, and token labels',
  })

  return (
    <TanStackTable
      table={table}
      pageSizeOption={pageSizeOption}
      onPageSizeOptionChange={setPageSizeOption}
      emptyMessage="No transfers found for the selected filters."
      enableCsvExport={enableCsvExport}
      getCsvFilename={() =>
        `interop-transfer-details-${new Date().toISOString()}.csv`
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
