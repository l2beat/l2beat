import { UnixTime } from '@l2beat/shared-pure'
import React from 'react'

import { Page } from './Page'
import { reactToHtml } from './reactToHtml'
import { StatusSquare, UpdaterStatus } from './TvlStatusPage'

interface StatusPageProps {
  latestSafeTimestamp: UnixTime
  updater: UpdaterStatus
}

export function TvlStatusPageDetailed({
  updater,
  latestSafeTimestamp,
}: StatusPageProps) {
  return (
    <Page title="TVL module status (Last 24 hours)">
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
        <div className="card info" style={{ margin: '8px', padding: '10px' }}>
          <p>{updater.updaterName}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {Array(200).fill(
              updater.statuses.map((status, index) => (
                <StatusSquare key={index} status={status} />
              )),
            )}
          </div>
        </div>
      </div>
    </Page>
  )
}

export function renderTvlStatusPageDetailed(props: StatusPageProps) {
  return reactToHtml(<TvlStatusPageDetailed {...props} />)
}
