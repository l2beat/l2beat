import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import { eventsColumns } from './columns'
import type { SummaryEventRow } from './types'

interface EventsTableProps {
  data: SummaryEventRow[]
  enableCsvExport?: boolean
}

export function EventsTable({
  data,
  enableCsvExport = false,
}: EventsTableProps) {
  const { table, pageSizeOption, setPageSizeOption } = useTanStackTable({
    data,
    columns: eventsColumns,
    initialSorting: [{ id: 'type', desc: false }],
    getRowId: (row) => `${row.type}-${row.direction ?? ''}`,
  })

  return (
    <TanStackTable
      table={table}
      pageSizeOption={pageSizeOption}
      onPageSizeOptionChange={setPageSizeOption}
      emptyMessage="No events found."
      enableCsvExport={enableCsvExport}
      getCsvFilename={() => `interop-events-${new Date().toISOString()}.csv`}
    />
  )
}
