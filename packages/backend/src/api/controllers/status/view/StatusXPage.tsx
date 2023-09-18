import { UnixTime } from '@l2beat/shared-pure'
import React from 'react'

import { Page } from './Page'
import { reactToHtml } from './reactToHtml'

export interface StatusPoint {
  timestamp: UnixTime
  status: 'synced' | 'syncing' | 'notSynced'
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
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {s.statuses.map((status) => (
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  background: 'red',
                  marginRight: '5px',
                  marginBottom: '5px',
                }}
              />
            ))}
          </div>
        </>
      ))}
    </Page>
  )
}

export function renderStatusXPage(props: StatusPageProps) {
  return reactToHtml(<StatusXPage {...props} />)
}
