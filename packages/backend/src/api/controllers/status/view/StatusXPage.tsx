import { UnixTime } from '@l2beat/shared-pure'
import React from 'react'

import { Page } from './Page'
import { reactToHtml } from './reactToHtml'

export interface StatusPoint {
  timestamp: UnixTime
  status: 'synced' | 'notSynced' | 'notApplicable'
}

export interface UpdaterStatus {
  updaterName: string
  statuses: StatusPoint[]
}

interface StatusPageProps {
  statuses: UpdaterStatus[]
}

export function StatusXPage({ statuses }: StatusPageProps) {
  return (
    <Page title="StatusX">
      {statuses.map((s) => (
        <>
          <h2>{s.updaterName}</h2>
          <h3>Last 24 hours:</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {s.statuses.slice(0, 24).map((status) => (
              <Square status={status} />
            ))}
          </div>
        </>
      ))}
    </Page>
  )
}

function Square(props: { status: StatusPoint }): JSX.Element {
  return (
    <div
      data-tooltip={getTooltip(props.status)}
      style={{
        width: '10px',
        height: '10px',
        background: getColor(props.status),
        margin: '2px',
        border: 0,
      }}
    />
  )
}

function getColor(status: StatusPoint): string {
  switch (status.status) {
    case 'synced':
      return '#2ECC71'
    case 'notSynced':
      return '#E74C3C'
    case 'notApplicable':
      return 'gray'
  }
}

function getTooltip(status: StatusPoint): string {
  return status.timestamp.toDate().toISOString() + ' (UTC)'
}

export function renderStatusXPage(props: StatusPageProps) {
  return reactToHtml(<StatusXPage {...props} />)
}
