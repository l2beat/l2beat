import { AssetId } from '@l2beat/common'
import React from 'react'

import { Status } from '../Status'
import { Page } from './Page'
import { reactToHtml } from './reactToHtml'
import { StatusTable } from './StatusTable'

interface Token {
  assetId: AssetId
  balance: number | undefined
  usd: number | undefined
  eth: number | undefined
  status: Status
}

interface Report {
  projectName: string
  holderAddress: string
  tokens: Token[]
}

interface ReportsPageProps {
  reports: Report[]
}

export function ReportsPage({ reports }: ReportsPageProps) {
  return (
    <Page title="Reports">
      {reports.map((balance) => (
        <div>
          <h2>
            {balance.projectName} - {balance.holderAddress}
          </h2>
          <StatusTable
            columns={['Name', 'USD', 'ETH', 'Balance']}
            rows={balance.tokens.map(
              ({ assetId, balance, usd, eth, status }) => ({
                status,
                cells: [
                  assetId.toString(),
                  usd?.toString() ?? '-',
                  eth?.toString() ?? '-',
                  balance?.toString() ?? '-',
                ],
              }),
            )}
          />
        </div>
      ))}
    </Page>
  )
}

export function renderReportsPage(props: ReportsPageProps) {
  return reactToHtml(<ReportsPage {...props} />)
}
