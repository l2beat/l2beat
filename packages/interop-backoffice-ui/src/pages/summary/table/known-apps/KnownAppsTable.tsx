import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import type { SummaryKnownAppsRow } from '../types'
import { knownAppsColumns } from './columns'

interface KnownAppsTableProps {
  data: SummaryKnownAppsRow[]
  enableCsvExport?: boolean
}

export function KnownAppsTable({
  data,
  enableCsvExport = false,
}: KnownAppsTableProps) {
  const { table, pageSizeOption, setPageSizeOption } = useTanStackTable({
    data,
    columns: knownAppsColumns,
    initialSorting: [{ id: 'appsCount', desc: true }],
    getRowId: (row) => row.plugin,
  })

  return (
    <TanStackTable
      table={table}
      pageSizeOption={pageSizeOption}
      onPageSizeOptionChange={setPageSizeOption}
      emptyMessage="No known apps found."
      enableCsvExport={enableCsvExport}
      getCsvFilename={() =>
        `interop-known-apps-${new Date().toISOString()}.csv`
      }
      rowClassName="odd:bg-muted/20 hover:bg-muted/70"
    />
  )
}
