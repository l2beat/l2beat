import { useMemo } from 'react'
import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import type { SummaryMissingTokenRow } from '../types'
import { createMissingTokensColumns } from './columns'

interface MissingTokensTableProps {
  data: SummaryMissingTokenRow[]
  getExplorerUrl: (chain: string) => string | undefined
  enableCsvExport?: boolean
}

export function MissingTokensTable({
  data,
  getExplorerUrl,
  enableCsvExport = false,
}: MissingTokensTableProps) {
  const columns = useMemo(
    () =>
      createMissingTokensColumns({
        getExplorerUrl,
      }),
    [getExplorerUrl],
  )

  const { table, pageSizeOption, setPageSizeOption } = useTanStackTable({
    data,
    columns,
    initialSorting: [{ id: 'count', desc: true }],
    getRowId: (row) => `${row.chain}:${row.tokenAddress}`,
  })

  return (
    <TanStackTable
      table={table}
      pageSizeOption={pageSizeOption}
      onPageSizeOptionChange={setPageSizeOption}
      emptyMessage="No missing tokens found."
      enableCsvExport={enableCsvExport}
      getCsvFilename={() =>
        `interop-missing-tokens-${new Date().toISOString()}.csv`
      }
      rowClassName="odd:bg-muted/20 hover:bg-muted/70"
    />
  )
}
