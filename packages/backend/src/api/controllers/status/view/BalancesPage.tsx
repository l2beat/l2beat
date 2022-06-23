import { AssetId } from '@l2beat/common'
import React from 'react'

import { Status } from '../Status'
import { Page } from './Page'
import { reactToHtml } from './reactToHtml'
import { StatusTable } from './StatusTable'

interface Token {
  assetId: AssetId
  balance: number | undefined
  status: Status
}

interface Balance {
  projectName: string
  holderAddress: string
  tokens: Token[]
}

interface BalancesPageProps {
  balances: Balance[]
}

export function BalancesPage({ balances }: BalancesPageProps) {
  return (
    <Page title="Balances">
      {balances.map((balance) => (
        <div>
          <h2>
            {balance.holderAddress} - {balance.holderAddress}
          </h2>
          <StatusTable
            columns={['Asset', 'Balance']}
            rows={balance.tokens.map((token) => ({
              status: token.status,
              cells: [
                token.assetId.toString(),
                token.balance?.toString() ?? '-',
              ],
            }))}
          />
        </div>
      ))}
    </Page>
  )
}

export function renderBalancesPage(props: BalancesPageProps) {
  return reactToHtml(<BalancesPage {...props} />)
}
