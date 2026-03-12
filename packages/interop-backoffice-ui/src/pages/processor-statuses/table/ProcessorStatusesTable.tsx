import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import { processorStatusesColumns } from './columns'
import type { ProcessorStatusRow } from './types'

interface ProcessorStatusesTableProps {
  data: ProcessorStatusRow[]
  enableCsvExport?: boolean
}

export function ProcessorStatusesTable({
  data,
  enableCsvExport = false,
}: ProcessorStatusesTableProps) {
  const { table, pageSizeOption, setPageSizeOption } = useTanStackTable({
    data,
    columns: processorStatusesColumns,
    initialSorting: [{ id: 'distanceFromNow', desc: true }],
    getRowId: (row) => row.chain,
  })

  return (
    <TanStackTable
      table={table}
      pageSizeOption={pageSizeOption}
      onPageSizeOptionChange={setPageSizeOption}
      emptyMessage="No processor statuses found."
      enableCsvExport={enableCsvExport}
      getCsvFilename={() =>
        `processor-statuses-${new Date().toISOString()}.csv`
      }
      rowClassName="odd:bg-muted/20 hover:bg-muted/70"
    />
  )
}
