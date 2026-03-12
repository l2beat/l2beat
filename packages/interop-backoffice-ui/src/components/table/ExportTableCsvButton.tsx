import type { RowData, Table } from '@tanstack/react-table'
import { DownloadIcon } from 'lucide-react'
import { Button } from '~/components/core/Button'

type CsvRowModel = 'sorted' | 'all' | 'filtered' | 'page'

function escapeCsvCell(value: string) {
  return `"${value.replaceAll('"', '""')}"`
}

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

function getRowsForModel<TData extends RowData>(
  table: Table<TData>,
  rowModel: CsvRowModel,
) {
  if (rowModel === 'all') {
    return table.getCoreRowModel().rows
  }
  if (rowModel === 'filtered') {
    return table.getFilteredRowModel().rows
  }
  if (rowModel === 'page') {
    return table.getPaginationRowModel().rows
  }
  return table.getSortedRowModel().rows
}

export function exportTableToCsv<TData extends RowData>(
  table: Table<TData>,
  options?: {
    filename?: string
    rowModel?: CsvRowModel
  },
) {
  const rowModel = options?.rowModel ?? 'sorted'
  const rows = getRowsForModel(table, rowModel)
  const columns = table
    .getVisibleLeafColumns()
    .filter((column) => column.getIsVisible())

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
      const customValue = column.columnDef.meta?.csvValue

      if (customValue) {
        return customValue({
          row,
          value,
        })
      }

      return stringifyCsvValue(value)
    }),
  )

  const csvContent = [
    headers.map((value) => escapeCsvCell(value)).join(','),
    ...csvRows.map((row) =>
      row.map((value) => escapeCsvCell(String(value))).join(','),
    ),
  ].join('\n')

  const blob = new Blob([csvContent], {
    type: 'text/csv;charset=utf-8;',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download =
    options?.filename ?? `table-export-${new Date().toISOString()}.csv`
  anchor.click()
  URL.revokeObjectURL(url)
}

interface ExportTableCsvButtonProps<TData extends RowData> {
  table: Table<TData>
  rowModel?: CsvRowModel
  filename?: string
  getFilename?: () => string
  disabled?: boolean
  label?: string
}

export function ExportTableCsvButton<TData extends RowData>({
  table,
  rowModel = 'sorted',
  filename,
  getFilename,
  disabled = false,
  label = 'Export CSV',
}: ExportTableCsvButtonProps<TData>) {
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={disabled}
      onClick={() => {
        const resolvedFilename = getFilename?.() ?? filename
        exportTableToCsv(table, {
          rowModel,
          filename: resolvedFilename,
        })
      }}
    >
      <DownloadIcon />
      {label}
    </Button>
  )
}
