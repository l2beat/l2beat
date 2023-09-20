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
  latestSafeTimestamp: UnixTime
  statuses: UpdaterStatus[]
}

export function TvlStatusPage({
  statuses,
  latestSafeTimestamp,
}: StatusPageProps) {
  return (
    <Page title="TVL module status (Last 24 hours)">
      <p>Latest safe timestamp: {latestSafeTimestamp.toDate().toISOString()}</p>
      {statuses.map((s, id) => (
        <div key={id}>
          <h4>{s.updaterName}</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {s.statuses.slice(0, 24).map((status, index) => (
              <Square key={index} status={status} />
            ))}
          </div>
        </div>
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

export function renderTvlStatusPage(props: StatusPageProps) {
  return reactToHtml(<TvlStatusPage {...props} />)
}
