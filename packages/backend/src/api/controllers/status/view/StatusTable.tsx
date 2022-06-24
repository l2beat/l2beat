import { UnixTime } from '@l2beat/common'
import React from 'react'

import { Status } from '../Status'

interface Row {
  cells: string[]
  status: Status
}

interface StatusTableProps {
  columns: string[]
  rows: Row[]
}

export function StatusTable(props: StatusTableProps) {
  return (
    <table>
      <thead>
        <tr>
          {props.columns.map((column) => (
            <th>{column}</th>
          ))}
          <th>Timestamp</th>
          <th>Date</th>
          <th>Sync</th>
        </tr>
      </thead>
      <tbody>
        {props.rows.map(({ cells, status }, i) => (
          <tr key={i} style={{ color: status.isSynced ? undefined : 'red' }}>
            {cells.map((cell) => (
              <td>{cell}</td>
            ))}
            <td>{status.timestamp?.toNumber() ?? '-'}</td>
            <td>{status.timestamp?.toDate().toISOString() ?? '-'}</td>
            <td>{getSyncStatus(status.timestamp)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const SECONDS_PER_HOUR = 60 * 60
function getSyncStatus(timestamp: UnixTime | undefined): string {
  if (timestamp === undefined) {
    return 'No data'
  }
  const now = UnixTime.now().add(-1, 'hours').toStartOf('hour').toNumber()

  const diff = now - timestamp.toNumber()

  if (diff === 0) {
    return 'Up to date'
  }

  const hours = diff / SECONDS_PER_HOUR
  const days = Math.floor(diff / (24 * SECONDS_PER_HOUR))

  if (hours > 0 && hours < 24) {
    return `Out of sync for ${diff / SECONDS_PER_HOUR} hour(s)`
  }

  if (days >= 1) {
    return `Out of sync for ${days} day(s)`
  }

  return 'We are in the future'
}
