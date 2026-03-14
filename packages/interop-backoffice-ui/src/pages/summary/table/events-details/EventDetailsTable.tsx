import { useMemo } from 'react'
import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import type { SummaryEventDetailsRow } from '../types'
import { createEventDetailsColumns } from './columns'

interface EventDetailsTableProps {
  data: SummaryEventDetailsRow[]
  getExplorerUrl: (chain: string) => string | undefined
  enableCsvExport?: boolean
}

export function EventDetailsTable({
  data,
  getExplorerUrl,
  enableCsvExport = false,
}: EventDetailsTableProps) {
  const columns = useMemo(
    () =>
      createEventDetailsColumns({
        getExplorerUrl,
      }),
    [getExplorerUrl],
  )

  const { table, pageSizeOption, setPageSizeOption } = useTanStackTable({
    data,
    columns,
    initialSorting: [{ id: 'timestamp', desc: true }],
    getRowId: (row) => `${row.chain}-${row.txHash}-${row.logIndex}`,
  })

  return (
    <TanStackTable
      table={table}
      pageSizeOption={pageSizeOption}
      onPageSizeOptionChange={setPageSizeOption}
      emptyMessage="No events found for selected filters."
      enableCsvExport={enableCsvExport}
      getCsvFilename={() =>
        `interop-event-details-${new Date().toISOString()}.csv`
      }
      rowClassName="odd:bg-muted/20 hover:bg-muted/70"
    />
  )
}
