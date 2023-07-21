import { ChainId, UnixTime } from '@l2beat/shared-pure'
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
  chainId: ChainId
}

export function BalancesPage({ balances, chainId }: BalancesPageProps) {
  return (
    <Page title={`Balances [chainId: ${chainId.toString()}]`}>
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
