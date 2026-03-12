import { useMemo } from 'react'
import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import type { SummaryTransferDetailsRow } from '../types'
import { createTransferDetailsColumns } from './columns'

interface TransferDetailsTableProps {
  data: SummaryTransferDetailsRow[]
  getExplorerUrl: (chain: string) => string | undefined
  enableCsvExport?: boolean
}

export function TransferDetailsTable({
  data,
  getExplorerUrl,
  enableCsvExport = false,
}: TransferDetailsTableProps) {
  const columns = useMemo(
    () =>
      createTransferDetailsColumns({
        getExplorerUrl,
      }),
    [getExplorerUrl],
  )

  const { table, pageSizeOption, setPageSizeOption } = useTanStackTable({
    data,
    columns,
    initialSorting: [{ id: 'timestamp', desc: true }],
    getRowId: (row) => row.transferId,
  })

  return (
    <TanStackTable
      table={table}
      pageSizeOption={pageSizeOption}
      onPageSizeOptionChange={setPageSizeOption}
      emptyMessage="No transfers found for selected filters."
      enableCsvExport={enableCsvExport}
      getCsvFilename={() =>
        `interop-transfer-details-${new Date().toISOString()}.csv`
      }
      rowClassName="odd:bg-muted/20 hover:bg-muted/70"
    />
  )
}
