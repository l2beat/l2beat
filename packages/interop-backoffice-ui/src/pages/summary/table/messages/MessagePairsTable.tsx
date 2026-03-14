import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import type { SummaryMessagePairRow } from '../types'
import { messagePairsColumns } from './pairs-columns'

interface MessagePairsTableProps {
  data: SummaryMessagePairRow[]
  enableCsvExport?: boolean
  onPairClick?: (row: SummaryMessagePairRow) => void
}

export function MessagePairsTable({
  data,
  enableCsvExport = false,
  onPairClick,
}: MessagePairsTableProps) {
  const { table, pageSizeOption, setPageSizeOption } = useTanStackTable({
    data,
    columns: messagePairsColumns,
    initialSorting: [{ id: 'count', desc: true }],
    getRowId: (row) => `${row.srcChain}-${row.dstChain}`,
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
      onRowClick={onPairClick ? (row) => onPairClick(row.original) : undefined}
      rowClassName={
        onPairClick
          ? 'odd:bg-muted/20 hover:bg-muted/70 cursor-pointer'
          : 'odd:bg-muted/20 hover:bg-muted/70'
      }
    />
  )
}
