import { AssetId, UnixTime } from '@l2beat/common'
import React from 'react'

import { Page } from './Page'
import { reactToHtml } from './reactToHtml'
import { StatusTable } from './StatusTable'

interface Price {
  assetId: AssetId
  priceUsd: number | undefined
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
        columns={['Name', 'Value', 'Timestamp', 'Date']}
        rows={prices.map((price) => ({
          isSynced: price.isSynced,
          cells: [
            price.assetId.toString(),
            price.priceUsd?.toString() ?? '-',
            price.timestamp?.toString() ?? '-',
            price.timestamp?.toDate().toLocaleString('pl') ?? '-'
          ],
        }))}
      />
    </Page>
  )
}

export function renderPricesPage(props: PricesPageProps) {
  return reactToHtml(<PricesPage {...props} />)
}
