import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import type { ChainsSummaryRow } from '../types'
import { chainsSummaryColumns } from './columns'

interface ChainsSummaryTableProps {
  data: ChainsSummaryRow[]
}

export function ChainsSummaryTable({ data }: ChainsSummaryTableProps) {
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
    columns: chainsSummaryColumns,
    initialSorting: [{ id: 'name', desc: false }],
    getRowId: (row) => row.id,
    searchPlaceholder: 'Search chains',
  })

  return (
    <TanStackTable
      table={table}
      pageSizeOption={pageSizeOption}
      onPageSizeOptionChange={setPageSizeOption}
      emptyMessage="No enabled interop chains found."
      fillHeight
      enableCsvExport
      getCsvFilename={() =>
        `interop-chains-summary-${new Date().toISOString()}.csv`
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
