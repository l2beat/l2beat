import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import type { TransferPairRow } from '../types'
import { transferPairsColumns } from './pairs-columns'

interface TransferPairsTableProps {
  data: TransferPairRow[]
  enableCsvExport?: boolean
  onPairClick?: (row: TransferPairRow) => void
}

export function TransferPairsTable({
  data,
  enableCsvExport = false,
  onPairClick,
}: TransferPairsTableProps) {
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
    columns: transferPairsColumns,
    initialSorting: [{ id: 'count', desc: true }],
    getRowId: (row) => `${row.srcChain}:${row.dstChain}`,
    searchPlaceholder: 'Search source and destination chains',
  })

  return (
    <TanStackTable
      table={table}
      pageSizeOption={pageSizeOption}
      onPageSizeOptionChange={setPageSizeOption}
      emptyMessage="No chain pairs found."
      enableCsvExport={enableCsvExport}
      getCsvFilename={() =>
        `interop-transfer-chain-pairs-${new Date().toISOString()}.csv`
      }
      onRowClick={onPairClick ? (row) => onPairClick(row.original) : undefined}
      rowClassName={
        onPairClick
          ? 'odd:bg-muted/20 hover:bg-muted/70 cursor-pointer'
          : 'odd:bg-muted/20 hover:bg-muted/70'
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
