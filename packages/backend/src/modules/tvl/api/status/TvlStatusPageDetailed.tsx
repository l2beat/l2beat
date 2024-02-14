import { UnixTime } from '@l2beat/shared-pure'
import React from 'react'

import { Page } from '../../../status/Page'
import { reactToHtml } from '../../../status/reactToHtml'
import {
  getStatusIndicator,
  getSyncStatus,
  StatusPoint,
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
            <Periodical
              title="Hourly"
              points={status.updater.statuses.filter(
                (point, i, points) =>
                  i === 0 ||
                  points[i - 1].timestamp
                    .add(-1, 'hours')
                    .equals(point.timestamp),
              )}
            />
            <Periodical
              title="Six-hourly"
              points={status.updater.statuses.filter((point) =>
                point.timestamp.isFull('six hours'),
              )}
            />
            <Periodical
              title="Daily"
              points={status.updater.statuses.filter((point) =>
                point.timestamp.isFull('day'),
              )}
            />
          </p>
        </div>
      </div>
    </Page>
  )
}

function Periodical(props: { title: string; points: StatusPoint[] }) {
  if (props.points.length === 0) return null

  const min = props.points[0].timestamp
  const max = props.points[props.points.length - 1].timestamp
  return (
    <>
      <p>
        {props.title}: {min.toDate().toISOString()} -{' '}
        {max.toDate().toISOString()}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {props.points.map((status, index) => (
          <StatusSquare key={index} status={status} />
        ))}
      </div>
    </>
  )
}

export function renderTvlStatusPageDetailed(props: StatusPageProps) {
  return reactToHtml(<TvlStatusPageDetailed {...props} />)
}
