import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import type { NotIncludedByPluginRow } from '../types'
import { notIncludedByPluginColumns } from './not-included-columns'

interface NotIncludedByPluginTableProps {
  data: NotIncludedByPluginRow[]
  enableCsvExport?: boolean
}

export function NotIncludedByPluginTable({
  data,
  enableCsvExport = false,
}: NotIncludedByPluginTableProps) {
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
    columns: notIncludedByPluginColumns,
    initialSorting: [{ id: 'totalValueUsd', desc: true }],
    initialPageSizeOption: '25',
    getRowId: (row) => `${row.plugin}-${row.bridgeType}`,
    searchPlaceholder: 'Search plugins and bridge types',
  })

  return (
    <TanStackTable
      table={table}
      pageSizeOption={pageSizeOption}
      onPageSizeOptionChange={setPageSizeOption}
      emptyMessage="All latest transfers are covered by configured aggregates."
      enableCsvExport={enableCsvExport}
      getCsvFilename={() =>
        `interop-aggregate-gaps-by-plugin-${new Date().toISOString()}.csv`
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
