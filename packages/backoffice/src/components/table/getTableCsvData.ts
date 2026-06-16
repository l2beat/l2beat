import type { RowData, Table } from '@tanstack/react-table'
import type { CsvExportData } from '~/hooks/useExportCsv'

function stringifyCsvValue(value: unknown) {
  if (value === undefined || value === null) {
    return ''
  }
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint'
  ) {
    return String(value)
  }
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

export function getTableCsvData<TData extends RowData>(
  table: Table<TData>,
): CsvExportData {
  const rows = table.getRowModel().rows
  const columns = table
    .getVisibleLeafColumns()
    .filter(
      (column) =>
        column.getIsVisible() && column.columnDef.meta?.excludeFromCsv !== true,
    )

  const headers = columns.map((column) => {
    return (
      column.columnDef.meta?.csvHeader ??
      (typeof column.columnDef.header === 'string'
        ? column.columnDef.header
        : column.id)
    )
  })

  const csvRows = rows.map((row) =>
    columns.map((column) => {
      const value = row.getValue(column.id)
      const customValue = column.columnDef.meta?.getCsvValue

      if (customValue) {
        return customValue({
          row,
          value,
        })
      }

      return stringifyCsvValue(value)
    }),
  )

  return {
    headers,
    rows: csvRows,
  }
}
