import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import type { SummaryMessagePairRow } from '../types'
import { messagePairsColumns } from './pairs-columns'

interface MessagePairsTableProps {
  data: SummaryMessagePairRow[]
  enableCsvExport?: boolean
}

export function MessagePairsTable({
  data,
  enableCsvExport = false,
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
      rowClassName="odd:bg-muted/20 hover:bg-muted/70"
    />
  )
}
