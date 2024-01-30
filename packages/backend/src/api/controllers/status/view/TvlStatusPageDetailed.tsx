import { UnixTime } from '@l2beat/shared-pure'
import React from 'react'

import { Page } from './Page'
import { reactToHtml } from './reactToHtml'
import {
  getStatusIndicator,
  getSyncStatus,
  StatusSquare,
  UpdaterStatus,
} from './TvlStatusPage'

interface StatusPageProps {
  latestSafeTimestamp: UnixTime
  status: {
    groupName: string
    updater: UpdaterStatus | undefined
  }
}

export function TvlStatusPageDetailed({
  status,
  latestSafeTimestamp,
}: StatusPageProps) {
  if (status.updater === undefined) {
    return <p>Wrong path for detailed updater status</p>
  }

  const syncStatus = getSyncStatus(status.updater.statuses)

  return (
    <Page title="Detailed updater status">
      <div
        className={`card ${syncStatus === 'not synced' ? 'warn' : 'hint'}`}
        style={{ margin: '8px', width: '358px' }}
      >
        <p>Overview</p>
        <p>
          {status.groupName.toLocaleUpperCase()} {status.updater.updaterName}
        </p>
        <p>
          {getStatusIndicator(syncStatus)} {syncStatus}
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
        <div className="card info" style={{ margin: '8px', padding: '10px' }}>
          <p style={{ fontWeight: 'bold' }}>{status.groupName.toUpperCase()}</p>
          <p>
            <p>
              {status.updater.updaterName} {getStatusIndicator(syncStatus)}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {status.updater.statuses.map((status, index) => (
                <StatusSquare key={index} status={status} />
              ))}
            </div>
          </p>
        </div>
      </div>
    </Page>
  )
}

export function renderTvlStatusPageDetailed(props: StatusPageProps) {
  return reactToHtml(<TvlStatusPageDetailed {...props} />)
}
