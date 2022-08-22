import { UnixTime } from '@l2beat/types'
import React from 'react'

import { Page } from './Page'
import { reactToHtml } from './reactToHtml'
import { StatusTable } from './StatusTable'

interface Balance {
  timestamp: UnixTime
  isSynced: boolean
}

interface BalancesPageProps {
  balances: Balance[]
}

export function BalancesPage({ balances }: BalancesPageProps) {
  return (
    <Page title="Balances">
      <StatusTable
        columns={['Timestamp', 'Date']}
        rows={balances.map(({ isSynced, timestamp }) => ({
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

export function renderBalancesPage(props: BalancesPageProps) {
  return reactToHtml(<BalancesPage {...props} />)
}
