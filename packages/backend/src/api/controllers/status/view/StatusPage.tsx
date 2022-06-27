import { UnixTime } from '@l2beat/common'
import React from 'react'

import { Status } from '../Status'
import { Page } from './Page'
import { reactToHtml } from './renderHtml'

export interface StatusPageProps {
  title: string
  statuses: Status[]
}

export function renderStatusPage(props: StatusPageProps) {
  return reactToHtml(<StatusPage {...props} />)
}

export function StatusPage({ title, statuses }: StatusPageProps) {
  return (
    <Page title={title}>
      <h1>{title}</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Timestamp</th>
            <th>Date</th>
            <th>Latest value</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {statuses.map((status, i) => (
            <tr key={i} style={{ color: status.isSynced ? undefined : 'red' }}>
              <td>{status.name}</td>
              <td>{status.timestamp?.toNumber() ?? '-'}</td>
              <td>{status.timestamp?.toDate().toISOString() ?? '-'}</td>
              <td>{status.value ?? '-'}</td>
              <td>{getSyncStatus(status.timestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Page>
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
