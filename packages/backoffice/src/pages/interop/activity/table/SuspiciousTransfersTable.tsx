import { useMemo } from 'react'
import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import type { SuspiciousTransferRow } from '../types'
import { createSuspiciousTransfersColumns } from './columns'

interface SuspiciousTransfersTableProps {
  data: SuspiciousTransferRow[]
  getExplorerUrl: (chain: string) => string | undefined
  valueDiffThresholdPercent: number
  enableCsvExport?: boolean
  highlightTransferId?: string
}

export function SuspiciousTransfersTable({
  data,
  getExplorerUrl,
  valueDiffThresholdPercent,
  enableCsvExport = false,
  highlightTransferId,
}: SuspiciousTransfersTableProps) {
  const columns = useMemo(
    () =>
      createSuspiciousTransfersColumns({
        getExplorerUrl,
        valueDiffThresholdPercent,
      }),
    [getExplorerUrl, valueDiffThresholdPercent],
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
    initialSorting: [
      { id: 'valueDifferencePercent', desc: true },
      { id: 'timestamp', desc: true },
    ],
    getRowId: (row: SuspiciousTransferRow) => row.transferId,
    searchPlaceholder:
      'Search transfer IDs, plugins, types, chains, tokens, and hashes',
  })

  return (
    <TanStackTable
      table={table}
      pageSizeOption={pageSizeOption}
      onPageSizeOptionChange={setPageSizeOption}
      emptyMessage="No suspicious transfers found for the current thresholds."
      fillHeight
      enableCsvExport={enableCsvExport}
      getCsvFilename={() =>
        `interop-suspicious-transfers-${new Date().toISOString()}.csv`
      }
      totalRowsCount={totalRowsCount}
      filteredRowsCount={filteredRowsCount}
      searchValue={isSearchEnabled ? searchValue : undefined}
      onSearchValueChange={isSearchEnabled ? setSearchValue : undefined}
      searchPlaceholder={searchPlaceholder}
      isSearchPending={isSearchPending}
      scrollToRowId={highlightTransferId}
      rowClassName={(row) =>
        row.id === highlightTransferId
          ? '!bg-blue-100 dark:!bg-blue-900/40'
          : undefined
      }
    />
  )
}
