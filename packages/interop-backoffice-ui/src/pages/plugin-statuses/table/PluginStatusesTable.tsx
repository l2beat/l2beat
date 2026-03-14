import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import { pluginStatusesColumns } from './columns'
import type { PluginStatus } from './types'

interface PluginStatusesTableProps {
  data: PluginStatus[]
  enableCsvExport?: boolean
}

export function PluginStatusesTable({
  data,
  enableCsvExport = false,
}: PluginStatusesTableProps) {
  const { table, pageSizeOption, setPageSizeOption } = useTanStackTable({
    data,
    columns: pluginStatusesColumns,
    getRowId: (row) => `${row.pluginName}-${row.chain}`,
  })

  return (
    <TanStackTable
      table={table}
      pageSizeOption={pageSizeOption}
      onPageSizeOptionChange={setPageSizeOption}
      emptyMessage="No plugin statuses found."
      enableCsvExport={enableCsvExport}
      getCsvFilename={() => `plugin-statuses-${new Date().toISOString()}.csv`}
    />
  )
}
