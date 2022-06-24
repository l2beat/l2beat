import { AssetId } from '@l2beat/common'
import React from 'react'

import { Status } from '../Status'
import { Page } from './Page'
import { reactToHtml } from './reactToHtml'
import { StatusTable } from './StatusTable'

interface Price {
  assetId: AssetId
  priceUsd: number | undefined
  status: Status
}

interface PricesPageProps {
  prices: Price[]
}

export function PricesPage({ prices }: PricesPageProps) {
  return (
    <Page title="Prices">
      <StatusTable
        columns={['Name', 'Latest value']}
        rows={prices.map((price) => ({
          status: price.status,
          cells: [
            price.assetId.toString(),
            price.priceUsd?.toString() ?? '-',
          ],
        }))}
      />
    </Page>
  )
}

export function renderPricesPage(props: PricesPageProps) {
  return reactToHtml(<PricesPage {...props} />)
}
