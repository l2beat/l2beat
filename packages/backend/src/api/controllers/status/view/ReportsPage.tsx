import { ChainId, UnixTime, ValueType } from '@l2beat/shared-pure'
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
  chainId: ChainId
  valueType: ValueType
}

export function ReportsPage({ reports, chainId, valueType }: ReportsPageProps) {
  return (
    <Page
      title={`Reports [chainId: ${chainId.toString()}] [valueType: ${valueType.toString()}]`}
    >
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
