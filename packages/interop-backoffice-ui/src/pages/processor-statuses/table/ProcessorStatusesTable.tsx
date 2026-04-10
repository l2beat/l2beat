import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import type { ProcessorStatusRow } from '../types'
import { processorStatusColumns } from './columns'

interface ProcessorStatusesTableProps {
  data: ProcessorStatusRow[]
  enableCsvExport?: boolean
}

export function ProcessorStatusesTable({
  data,
  enableCsvExport = false,
}: ProcessorStatusesTableProps) {
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
    columns: processorStatusColumns,
    initialSorting: [{ id: 'chain', desc: false }],
    initialPageSizeOption: 'all',
    getRowId: (row) => row.chain,
    searchPlaceholder: 'Search chains',
  })

  return (
    <TanStackTable
      table={table}
      pageSizeOption={pageSizeOption}
      onPageSizeOptionChange={setPageSizeOption}
      emptyMessage="No processor statuses found."
      enableCsvExport={enableCsvExport}
      getCsvFilename={() =>
        `interop-processor-statuses-${new Date().toISOString()}.csv`
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
