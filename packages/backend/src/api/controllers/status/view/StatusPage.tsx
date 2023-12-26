import { UnixTime } from '@l2beat/shared-pure'
import React from 'react'

import { Page } from './Page'
import { reactToHtml } from './reactToHtml'
import { StatusTable } from './StatusTable'

interface Status {
  timestamp: UnixTime
  isSynced: boolean
}

interface StatusPageProps {
  statuses: Status[]
  title: string
}

export function StatusPage({ statuses, title }: StatusPageProps) {
  return (
    <Page title={title}>
      <StatusTable
        columns={['Timestamp', 'Date']}
        rows={statuses.map(({ isSynced, timestamp }) => ({
          isSynced,
          cells: [
            timestamp.toString(),
            timestamp.toDate().toLocaleString('pl'),
          ],
        }))}
      />
    </Page>
  )
}

export function renderStatusPage(props: StatusPageProps) {
  return reactToHtml(<StatusPage {...props} />)
}
