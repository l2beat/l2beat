import type { RowData, Table } from '@tanstack/react-table'
import { useCallback } from 'react'
import { useExportCsv } from '~/hooks/useExportCsv'
import { getTableCsvData } from '../getTableCsvData'

interface ExportTableCsvOptions {
  filename?: string
}

export function useExportTableCsv<TData extends RowData>(table: Table<TData>) {
  const exportCsv = useExportCsv()

  return useCallback(
    (options?: ExportTableCsvOptions) => {
      exportCsv(getTableCsvData(table), {
        filename:
          options?.filename ?? `table-export-${new Date().toISOString()}.csv`,
      })
    },
    [exportCsv, table],
  )
}
