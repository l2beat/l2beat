import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import type { KnownAppsRow } from '../types'
import { knownAppsColumns } from './columns'

interface KnownAppsTableProps {
  data: KnownAppsRow[]
  enableCsvExport?: boolean
}

export function KnownAppsTable({
  data,
  enableCsvExport = false,
}: KnownAppsTableProps) {
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
    columns: knownAppsColumns,
    initialSorting: [{ id: 'plugin', desc: false }],
    getRowId: (row) => row.plugin,
    searchPlaceholder: 'Search plugins and app names',
  })

  return (
    <TanStackTable
      table={table}
      pageSizeOption={pageSizeOption}
      onPageSizeOptionChange={setPageSizeOption}
      emptyMessage="No known apps found."
      enableCsvExport={enableCsvExport}
      getCsvFilename={() =>
        `interop-known-apps-${new Date().toISOString()}.csv`
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
