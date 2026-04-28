import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import type { PluginStatusRow } from '../types'
import { pluginStatusColumns } from './columns'

interface PluginStatusesTableProps {
  data: PluginStatusRow[]
  enableCsvExport?: boolean
}

export function PluginStatusesTable({
  data,
  enableCsvExport = false,
}: PluginStatusesTableProps) {
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
    columns: pluginStatusColumns,
    initialSorting: [
      { id: 'pluginName', desc: false },
      { id: 'chain', desc: false },
    ],
    getRowId: (row) => `${row.pluginName}:${row.chain}`,
    searchPlaceholder: 'Search plugins, chains, sync modes, and errors',
  })

  return (
    <TanStackTable
      table={table}
      pageSizeOption={pageSizeOption}
      onPageSizeOptionChange={setPageSizeOption}
      emptyMessage="No plugin statuses found."
      enableCsvExport={enableCsvExport}
      getCsvFilename={() =>
        `interop-plugin-statuses-${new Date().toISOString()}.csv`
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
