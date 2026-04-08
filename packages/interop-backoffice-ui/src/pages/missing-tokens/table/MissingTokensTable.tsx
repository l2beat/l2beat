import { useMemo } from 'react'
import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import type { MissingTokenRow } from '../types'
import { createMissingTokensColumns } from './columns'

interface MissingTokensTableProps {
  data: MissingTokenRow[]
  getExplorerUrl: (chain: string) => string | undefined
  enableCsvExport?: boolean
}

export function MissingTokensTable({
  data,
  getExplorerUrl,
  enableCsvExport = false,
}: MissingTokensTableProps) {
  const columns = useMemo(
    () =>
      createMissingTokensColumns({
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
    initialSorting: [{ id: 'count', desc: true }],
    getRowId: (row) => `${row.chain}:${row.tokenAddress}`,
    searchPlaceholder: 'Search chains, addresses, and plugins',
  })

  return (
    <TanStackTable
      table={table}
      pageSizeOption={pageSizeOption}
      onPageSizeOptionChange={setPageSizeOption}
      emptyMessage="No missing tokens found."
      enableCsvExport={enableCsvExport}
      getCsvFilename={() =>
        `interop-missing-tokens-${new Date().toISOString()}.csv`
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
