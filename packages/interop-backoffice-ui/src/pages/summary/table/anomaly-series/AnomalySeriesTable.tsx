import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import type { SummaryAnomalySeriesPoint } from '../types'
import { anomalySeriesColumns } from './columns'

interface AnomalySeriesTableProps {
  data: SummaryAnomalySeriesPoint[]
  enableCsvExport?: boolean
}

export function AnomalySeriesTable({
  data,
  enableCsvExport = false,
}: AnomalySeriesTableProps) {
  const { table, pageSizeOption, setPageSizeOption } = useTanStackTable({
    data,
    columns: anomalySeriesColumns,
    initialSorting: [{ id: 'timestamp', desc: true }],
    getRowId: (row) => `${row.timestamp}:${row.transferCount}`,
  })

  return (
    <TanStackTable
      table={table}
      pageSizeOption={pageSizeOption}
      onPageSizeOptionChange={setPageSizeOption}
      emptyMessage="No daily anomaly points found."
      enableCsvExport={enableCsvExport}
      getCsvFilename={() =>
        `interop-anomaly-series-${new Date().toISOString()}.csv`
      }
      rowClassName="odd:bg-muted/20 hover:bg-muted/70"
    />
  )
}
