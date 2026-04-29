import { useMemo } from 'react'
import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import type { MessageDetailsRow } from '../../types'
import { createMessageDetailsColumns } from './columns'

interface MessageDetailsTableProps {
  data: MessageDetailsRow[]
  getExplorerUrl: (chain: string) => string | undefined
  enableCsvExport?: boolean
}

export function MessageDetailsTable({
  data,
  getExplorerUrl,
  enableCsvExport = false,
}: MessageDetailsTableProps) {
  const columns = useMemo(
    () =>
      createMessageDetailsColumns({
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
    getRowId: (row) =>
      `${row.plugin}:${row.messageId}:${row.timestamp}:${row.srcTxHash ?? ''}:${row.dstTxHash ?? ''}`,
    searchPlaceholder:
      'Search plugins, apps, chains, hashes, and message identifiers',
  })

  return (
    <TanStackTable
      table={table}
      pageSizeOption={pageSizeOption}
      onPageSizeOptionChange={setPageSizeOption}
      emptyMessage="No messages found for the selected filters."
      enableCsvExport={enableCsvExport}
      getCsvFilename={() =>
        `interop-message-details-${new Date().toISOString()}.csv`
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
