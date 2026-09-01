import type { RowData, Table } from '@tanstack/react-table'
import { DownloadIcon } from 'lucide-react'
import { Button } from '~/components/core/Button'
import { useExportTableCsv } from './hooks/useExportTableCsv'

interface ExportTableCsvButtonProps<TData extends RowData> {
  table: Table<TData>
  filename?: string
  getFilename?: () => string
  disabled?: boolean
  label?: string
}

export function ExportTableCsvButton<TData extends RowData>({
  table,
  filename,
  getFilename,
  disabled = false,
  label = 'Export CSV',
}: ExportTableCsvButtonProps<TData>) {
  const exportTableCsv = useExportTableCsv(table)

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={disabled}
      onClick={() => {
        const resolvedFilename = getFilename?.() ?? filename
        exportTableCsv({
          filename: resolvedFilename,
        })
      }}
    >
      <DownloadIcon />
      {label}
    </Button>
  )
}
