import { useMemo } from 'react'
import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import type { TransferPairRow } from '../types'
import { buildTransferDetailsPath } from '../utils'
import { createTransferPairsColumns } from './pairs-columns'

interface TransferPairsTableProps {
  data: TransferPairRow[]
  plugin: string
  type: string
  enableCsvExport?: boolean
}

export function TransferPairsTable({
  data,
  plugin,
  type,
  enableCsvExport = false,
}: TransferPairsTableProps) {
  const getDetailsPath = useMemo(
    () => (pair: TransferPairRow) =>
      buildTransferDetailsPath({
        type,
        plugin,
        srcChain: pair.srcChain,
        dstChain: pair.dstChain,
      }),
    [plugin, type],
  )
  const columns = useMemo(
    () =>
      createTransferPairsColumns({
        getDetailsPath,
      }),
    [getDetailsPath],
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
      totalRowsCount={totalRowsCount}
      filteredRowsCount={filteredRowsCount}
      searchValue={isSearchEnabled ? searchValue : undefined}
      onSearchValueChange={isSearchEnabled ? setSearchValue : undefined}
      searchPlaceholder={searchPlaceholder}
      isSearchPending={isSearchPending}
    />
  )
}
