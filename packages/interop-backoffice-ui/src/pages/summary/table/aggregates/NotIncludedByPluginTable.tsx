import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import type { SummaryAggregateNotIncludedByPluginRow } from '../types'
import { notIncludedByPluginColumns } from './not-included-columns'

interface NotIncludedByPluginTableProps {
  data: SummaryAggregateNotIncludedByPluginRow[]
  enableCsvExport?: boolean
}

export function NotIncludedByPluginTable({
  data,
  enableCsvExport = false,
}: NotIncludedByPluginTableProps) {
  const { table, pageSizeOption, setPageSizeOption } = useTanStackTable({
    data,
    columns: notIncludedByPluginColumns,
    initialSorting: [{ id: 'totalValueUsd', desc: true }],
    getRowId: (row) => `${row.plugin}:${row.bridgeType}`,
  })

  return (
    <TanStackTable
      table={table}
      pageSizeOption={pageSizeOption}
      onPageSizeOptionChange={setPageSizeOption}
      emptyMessage="No uncovered aggregate rows found."
      enableCsvExport={enableCsvExport}
      getCsvFilename={() =>
        `interop-aggregates-not-included-${new Date().toISOString()}.csv`
      }
      rowClassName="odd:bg-muted/20 hover:bg-muted/70"
    />
  )
}
