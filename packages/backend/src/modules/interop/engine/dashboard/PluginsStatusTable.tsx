import React from 'react'
import type { PluginSyncStatus } from '../sync/InteropSyncersManager'

function formatDistanceFromNow(timestamp: number): string {
  const nowMs = Date.now()
  const timestampMs = timestamp * 1000
  const diffMs = Math.max(0, nowMs - timestampMs)
  if (diffMs < 60_000) {
    return '<1m'
  }

  const totalMinutes = Math.ceil(diffMs / 60_000)
  const days = Math.floor(totalMinutes / 1440)
  const hours = Math.floor((totalMinutes % 1440) / 60)
  const minutes = totalMinutes % 60
  const parts: string[] = []

  if (days) {
    parts.push(`${days}d`)
  }
  if (hours) {
    parts.push(`${hours}h`)
  }
  if (minutes || parts.length === 0) {
    parts.push(`${minutes}m`)
  }

  return parts.join(' ')
}

export function PluginsStatusTable(props: {
  pluginSyncStatuses: PluginSyncStatus[]
  tableId?: string
  className?: string
}) {
  const rows = props.pluginSyncStatuses
  return (
    <table id={props.tableId} className={props.className}>
      <caption>Plugins status</caption>
      <thead>
        <tr>
          <th>plugin</th>
          <th>chain</th>
          <th>sync mode</th>
          <th>distance from now</th>
          <th>toBlock</th>
          <th>last error</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={`${row.pluginName}-${row.chain}`}>
            <td>{row.pluginName}</td>
            <td>{row.chain}</td>
            <td>{row.syncMode ?? '?'}</td>
            <td>
              {row.toTimestamp !== undefined
                ? formatDistanceFromNow(row.toTimestamp)
                : 'n/a'}
            </td>
            <td>{row.toBlock ?? 'n/a'}</td>
            <td>{row.lastError ?? ''}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
