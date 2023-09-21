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
  statuses: {
    groupName: string
    updaters: UpdaterStatus[]
  }[]
}

export function TvlStatusPage({
  statuses,
  latestSafeTimestamp,
}: StatusPageProps) {
  return (
    <Page title="TVL module status (24h)">
      <div className="card hint" style={{ margin: '8px', width: '358px' }}>
        <p>Latest safe timestamp</p>
        <p>
          <span style={{ fontWeight: 'bold' }}>UTC: </span>
          {latestSafeTimestamp
            .toDate()
            .toLocaleString('en-GB', { timeZone: 'UTC' })}
        </p>
        <p>
          <span style={{ fontWeight: 'bold' }}>CET: </span>
          {latestSafeTimestamp
            .toDate()
            .toLocaleString('en-GB', { timeZone: 'CET' })}
        </p>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {statuses.map((status, id) => (
          <div
            style={{
              margin: '8px',
              padding: '10px',
            }}
            key={id}
            className="card info"
          >
            <p style={{ fontWeight: 'bold' }}>
              {status.groupName.toUpperCase()}
            </p>
            {status.updaters.map((updater, id) => (
              <div key={id} style={{ marginLeft: '2px' }}>
                <a href={`tvl/${status.groupName}/${updater.updaterName}`}>
                  {updater.updaterName}
                </a>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    marginTop: '6px',
                  }}
                >
                  {updater.statuses.slice(0, 24).map((status, index) => (
                    <StatusSquare key={index} status={status} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Page>
  )
}

export function StatusSquare(props: { status: StatusPoint }): JSX.Element {
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
