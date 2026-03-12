import { useMemo } from 'react'
import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import type { SummaryMessageDetailsRow } from '../types'
import { createMessageDetailsColumns } from './columns'

interface MessageDetailsTableProps {
  data: SummaryMessageDetailsRow[]
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

  const { table, pageSizeOption, setPageSizeOption } = useTanStackTable({
    data,
    columns,
    initialSorting: [{ id: 'timestamp', desc: true }],
    getRowId: (row) =>
      `${row.messageId}-${row.srcTxHash ?? 'src'}-${row.dstTxHash ?? 'dst'}`,
  })

  return (
    <TanStackTable
      table={table}
      pageSizeOption={pageSizeOption}
      onPageSizeOptionChange={setPageSizeOption}
      emptyMessage="No messages found for selected filters."
      enableCsvExport={enableCsvExport}
      getCsvFilename={() =>
        `interop-message-details-${new Date().toISOString()}.csv`
      }
      rowClassName="odd:bg-muted/20 hover:bg-muted/70"
    />
  )
}
