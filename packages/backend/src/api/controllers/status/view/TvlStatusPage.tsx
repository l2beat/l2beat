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
  aggregatedStatus: SyncStatus
}

export function TvlStatusPage({
  statuses,
  latestSafeTimestamp,
  aggregatedStatus,
}: StatusPageProps) {
  return (
    <Page title="TVL module status (24h)">
      <div
        className={`card ${
          aggregatedStatus === 'not synced' ? 'warn' : 'hint'
        }`}
        style={{ margin: '8px', width: '358px' }}
      >
        <p>Overview</p>
        <p>
          {getStatusIndicator(aggregatedStatus)} {aggregatedStatus}
        </p>
        <hr />
        <p style={{ fontWeight: 'bold' }}>Target timestamp:</p>
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
              width: '358px',
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
                </a>{' '}
                {getStatusIndicator(getSyncStatus(updater.statuses))}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    marginTop: '8px',
                    marginBottom: '8px',
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

export type SyncStatus = 'synced' | 'not synced' | 'syncing'

export function getSyncStatus(statuses: StatusPoint[]): SyncStatus {
  if (
    statuses.every((s) => s.status === 'synced' || s.status === 'notApplicable')
  ) {
    return 'synced'
  } else if (statuses.slice(0, 24).some((s) => s.status === 'notSynced')) {
    return 'not synced'
  } else if (statuses.slice(24).some((s) => s.status === 'notSynced')) {
    return 'syncing'
  }

  throw new Error('Programmer error: logic should not reach here')
}

export function getStatusIndicator(status: SyncStatus): string {
  switch (status) {
    case 'synced':
      return '✅'
    case 'not synced':
      return '❌'
    case 'syncing':
      return '🌕'
  }
}
