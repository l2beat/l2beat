import { useMemo } from 'react'
import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import type { MessagePairRow } from '../types'
import { buildMessageDetailsPath } from '../utils'
import { createMessagePairsColumns } from './pairs-columns'

interface MessagePairsTableProps {
  data: MessagePairRow[]
  plugin: string
  type: string
  enableCsvExport?: boolean
}

export function MessagePairsTable({
  data,
  plugin,
  type,
  enableCsvExport = false,
}: MessagePairsTableProps) {
  const getDetailsPath = useMemo(
    () => (pair: MessagePairRow) =>
      buildMessageDetailsPath({
        plugin,
        type,
        srcChain: pair.srcChain,
        dstChain: pair.dstChain,
      }),
    [plugin, type],
  )
  const columns = useMemo(
    () =>
      createMessagePairsColumns({
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
        `interop-message-chain-pairs-${new Date().toISOString()}.csv`
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
