import type { PluginStatus } from './types'
import { getDistanceFromNow, getResyncFrom } from './utils'

function escapeCsvCell(value: string) {
  return `"${value.replaceAll('"', '""')}"`
}

export function exportPluginStatusesToCsv(
  rows: PluginStatus[],
  filename = `plugin-statuses-${new Date().toISOString()}.csv`,
) {
  const headers = [
    'Plugin',
    'Chain',
    'Sync mode',
    'Distance from now',
    'To block',
    'Last error',
    'Resync from',
  ]
  const csvRows = rows.map((row) => [
    row.pluginName,
    row.chain,
    row.syncMode ?? '?',
    getDistanceFromNow(row.toTimestamp),
    row.toBlock ?? 'n/a',
    row.lastError ?? '',
    getResyncFrom(row.resyncRequestedFrom),
  ])

  const csvContent = [
    headers.map(escapeCsvCell).join(','),
    ...csvRows.map((row) => row.map((value) => escapeCsvCell(value)).join(',')),
  ].join('\n')

  const blob = new Blob([csvContent], {
    type: 'text/csv;charset=utf-8;',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
