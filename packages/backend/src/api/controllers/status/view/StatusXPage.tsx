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
              <Square color={getColor(status)} />
            ))}
          </div>
          <h3>Days:</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {s.statuses.map((status) => (
              <Square color={getColor(status)} />
            ))}
          </div>
        </>
      ))}
    </Page>
  )
}

function Square(props: { color: string }): JSX.Element {
  return (
    <div
      data-tooltip="note"
      style={{
        // width: '5px',
        // height: '5px',
        background: props.color,
        marginRight: '15px',
        marginBottom: '15px',
      }}
    />
  )
}

function getColor(status: StatusPoint): string {
  switch (status.status) {
    case 'synced':
      return 'green'
    case 'notSynced':
      return 'red'
    case 'notApplicable':
      return 'gray'
  }
}

export function renderStatusXPage(props: StatusPageProps) {
  return reactToHtml(<StatusXPage {...props} />)
}
