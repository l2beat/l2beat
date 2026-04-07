import { useCallback } from 'react'

export interface CsvExportData {
  headers: string[]
  rows: string[][]
}

interface ExportCsvOptions {
  filename?: string
}

function escapeCsvCell(value: string) {
  return `"${value.replaceAll('"', '""')}"`
}

export function useExportCsv() {
  return useCallback((data: CsvExportData, options?: ExportCsvOptions) => {
    const csvContent = [
      data.headers.map((value) => escapeCsvCell(value)).join(','),
      ...data.rows.map((row) =>
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
      options?.filename ?? `export-${new Date().toISOString()}.csv`
    anchor.click()
    URL.revokeObjectURL(url)
  }, [])
}
