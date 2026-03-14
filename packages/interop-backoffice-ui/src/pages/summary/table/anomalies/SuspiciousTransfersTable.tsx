import { useMemo } from 'react'
import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import type { SummaryAnomalySuspiciousTransferRow } from '../types'
import { createSuspiciousTransfersColumns } from './suspicious-columns'

interface SuspiciousTransfersTableProps {
  data: SummaryAnomalySuspiciousTransferRow[]
  getExplorerUrl: (chain: string) => string | undefined
  valueDiffThresholdPercent: number
  enableCsvExport?: boolean
}

export function SuspiciousTransfersTable({
  data,
  getExplorerUrl,
  valueDiffThresholdPercent,
  enableCsvExport = false,
}: SuspiciousTransfersTableProps) {
  const columns = useMemo(
    () =>
      createSuspiciousTransfersColumns({
        getExplorerUrl,
        valueDiffThresholdPercent,
      }),
    [getExplorerUrl, valueDiffThresholdPercent],
  )

  const { table, pageSizeOption, setPageSizeOption } = useTanStackTable({
    data,
    columns,
    initialSorting: [{ id: 'valueDifferencePercent', desc: true }],
    getRowId: (row) => `${row.transferId}:${row.srcTxHash}:${row.dstTxHash}`,
  })

  return (
    <TanStackTable
      table={table}
      pageSizeOption={pageSizeOption}
      onPageSizeOptionChange={setPageSizeOption}
      emptyMessage="No suspicious transfers found."
      enableCsvExport={enableCsvExport}
      getCsvFilename={() =>
        `interop-suspicious-transfers-${new Date().toISOString()}.csv`
      }
      rowClassName="odd:bg-muted/20 hover:bg-muted/70"
    />
  )
}
