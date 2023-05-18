import { EthereumAddress } from '@l2beat/shared'
import React from 'react'

import { ReportPerEscrowPerToken } from '../../../../core/reports/createReports'
import { Page } from './Page'
import { reactToHtml } from './reactToHtml'

interface EscrowPageProps {
  escrow: EthereumAddress
  reports: ReportPerEscrowPerToken[]
}

function EscrowPage({ reports, escrow }: EscrowPageProps) {
  return (
    <Page title={escrow.toString()}>
      <table>
        <thead>
          <tr>
            <th>token</th>
            <th>balanceUSD</th>
            <th>balance</th>
            <th>price</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(({ asset, balance, price, balanceUsd }) => (
            <tr key={asset.toString()}>
              <td>{asset.toString()}</td>
              <td>{balanceUsd.toString()}</td>
              <td>{balance.toString()}</td>
              <td>{price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Page>
  )
}

export function renderEscrowPage(
  reports: ReportPerEscrowPerToken[],
  escrow: EthereumAddress,
) {
  return reactToHtml(
    <EscrowPage
      reports={reports.sort((a, b) => {
        return a.balanceUsd - b.balanceUsd > 0n ? -1 : 1
      })}
      escrow={escrow}
    />,
  )
}
