import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import type { SummaryAnomalyRow } from '../types'
import { anomaliesColumns } from './columns'

interface AnomaliesTableProps {
  data: SummaryAnomalyRow[]
  enableCsvExport?: boolean
}

export function AnomaliesTable({
  data,
  enableCsvExport = false,
}: AnomaliesTableProps) {
  const { table, pageSizeOption, setPageSizeOption } = useTanStackTable({
    data,
    columns: anomaliesColumns,
    initialSorting: [{ id: 'timestamp', desc: true }],
    getRowId: (row) => `${row.id}:${row.timestamp}`,
  })

  return (
    <TanStackTable
      table={table}
      pageSizeOption={pageSizeOption}
      onPageSizeOptionChange={setPageSizeOption}
      emptyMessage="No anomalies found."
      enableCsvExport={enableCsvExport}
      getCsvFilename={() => `interop-anomalies-${new Date().toISOString()}.csv`}
      rowClassName="odd:bg-muted/20 hover:bg-muted/70"
    />
  )
}
