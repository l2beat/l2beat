import { useMemo } from 'react'
import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import type { NotIncludedTransferRow } from '../types'
import { createNotIncludedTransferColumns } from './not-included-transfer-columns'

interface NotIncludedTransfersTableProps {
  data: NotIncludedTransferRow[]
  getExplorerUrl: (chain: string) => string | undefined
  enableCsvExport?: boolean
}

export function NotIncludedTransfersTable({
  data,
  getExplorerUrl,
  enableCsvExport = false,
}: NotIncludedTransfersTableProps) {
  const columns = useMemo(
    () =>
      createNotIncludedTransferColumns({
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
    initialPageSizeOption: '25',
    getRowId: (row) => row.transferId,
    searchPlaceholder:
      'Search plugins, types, chains, hashes, bridge types, and token labels',
  })

  return (
    <TanStackTable
      table={table}
      pageSizeOption={pageSizeOption}
      onPageSizeOptionChange={setPageSizeOption}
      emptyMessage="All latest transfers are covered by configured aggregates."
      enableCsvExport={enableCsvExport}
      getCsvFilename={() =>
        `interop-aggregate-missing-transfers-${new Date().toISOString()}.csv`
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
