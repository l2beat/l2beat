import { UnixTime } from '@l2beat/types'
import React from 'react'

import { Page } from './Page'
import { reactToHtml } from './reactToHtml'
import { StatusTable } from './StatusTable'

interface Report {
  timestamp: UnixTime
  isSynced: boolean
}

interface ReportsPageProps {
  reports: Report[]
}

export function ReportsPage({ reports }: ReportsPageProps) {
  return (
    <Page title="Reports">
      <StatusTable
        columns={['Timestamp', 'Date']}
        rows={reports.map(({ isSynced, timestamp }) => ({
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

export function renderReportsPage(props: ReportsPageProps) {
  return reactToHtml(<ReportsPage {...props} />)
}
