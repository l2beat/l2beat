import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import type { SummaryTransferPairRow } from '../types'
import { transferPairsColumns } from './pairs-columns'

interface TransferPairsTableProps {
  data: SummaryTransferPairRow[]
  enableCsvExport?: boolean
}

export function TransferPairsTable({
  data,
  enableCsvExport = false,
}: TransferPairsTableProps) {
  const { table, pageSizeOption, setPageSizeOption } = useTanStackTable({
    data,
    columns: transferPairsColumns,
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
        `interop-transfer-chain-pairs-${new Date().toISOString()}.csv`
      }
      rowClassName="odd:bg-muted/20 hover:bg-muted/70"
    />
  )
}
