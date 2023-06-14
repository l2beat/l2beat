import { AssetId, UnixTime } from '@l2beat/shared-pure'
import React from 'react'

import { Page } from './Page'
import { reactToHtml } from './reactToHtml'
import { StatusTable } from './StatusTable'

interface Price {
  assetId: AssetId
  timestamp: UnixTime | undefined
  isSynced: boolean
}

interface PricesPageProps {
  prices: Price[]
}

export function PricesPage({ prices }: PricesPageProps) {
  return (
    <Page title="Prices">
      <StatusTable
        columns={['Name', 'Latest timestamp', 'Date']}
        rows={prices.map(({ isSynced, assetId, timestamp }) => ({
          isSynced: isSynced,
          cells: [
            assetId.toString(),
            timestamp?.toString() ?? '-',
            timestamp?.toDate().toLocaleString('pl') ?? '-',
          ],
        }))}
      />
    </Page>
  )
}

export function renderPricesPage(props: PricesPageProps) {
  return reactToHtml(<PricesPage {...props} />)
}
