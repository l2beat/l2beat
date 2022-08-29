import React, { useEffect } from 'react'

import { Page } from '../../../components/Page'
import { Tooltip } from '../../../components/Tooltip'
import { FinancialView as FinancialViewComponent } from '../../../pages/tvl/view/FinancialView'
import { configureTooltips } from '../../../scripts/configureTooltips'
import { formatLargeNumber } from '../../../utils'

export default {
  title: 'Pages/Home/FinancialView',
}

export function FinancialView() {
  useEffect(() => {
    configureTooltips()
  }, [])
  return (
    <>
      <Page>
        <FinancialViewComponent
          items={[
            {
              name: 'Forktimism',
              provider: 'Optimism',
              slug: 'optimism',
              tvl: formatLargeNumber(2_740_000_000),
              tvlBreakdown: {
                warning: 'Some random warning',
                warningSeverity: 'warning',
                label: 'The tooltip label',
                empty: false,
                associated: 0.4,
                ether: 0.2,
                stable: 0.2,
                other: 0.2,
              },
              oneDayChange: '+3.45%',
              sevenDayChange: '-54.2%',
              marketShare: '50.42%',
              purpose: 'Universal',
              technology: {
                abbreviation: 'ORU',
                name: 'Optimistic Rollup',
              },
            },
            {
              name: 'Arbitrage',
              slug: 'arbitrum',
              tvl: formatLargeNumber(2_740_000_000),
              tvlBreakdown: {
                warning: 'Some random warning',
                warningSeverity: 'warning',
                label: 'The tooltip label',
                empty: false,
                associated: 0.4,
                ether: 0.2,
                stable: 0.2,
                other: 0.2,
              },
              oneDayChange: '+3.45%',
              sevenDayChange: '-54.2%',
              marketShare: '50.42%',
              purpose: 'Universal',
              technology: {
                abbreviation: 'ORU',
                name: 'Optimistic Rollup',
              },
            },
            {
              name: 'StorkCommerce',
              provider: 'StarkEx',
              slug: 'starknet',
              tvl: formatLargeNumber(2_740_000_000),
              tvlBreakdown: {
                warning: 'Some random warning',
                warningSeverity: 'warning',
                label: 'The tooltip label',
                empty: false,
                associated: 0.4,
                ether: 0.2,
                stable: 0.2,
                other: 0.2,
              },
              oneDayChange: '+3.45%',
              sevenDayChange: '-54.2%',
              marketShare: '50.42%',
              purpose: 'Universal',
              technology: {
                abbreviation: 'ORU',
                name: 'Optimistic Rollup',
              },
            },
            {
              name: 'zk.download',
              provider: 'zkSync',
              slug: 'zksync',
              tvl: formatLargeNumber(2_740_000_000),
              tvlBreakdown: {
                warning: 'Some random warning',
                warningSeverity: 'warning',
                label: 'The tooltip label',
                empty: false,
                associated: 0.4,
                ether: 0.2,
                stable: 0.2,
                other: 0.2,
              },
              oneDayChange: '+3.45%',
              sevenDayChange: '-54.2%',
              marketShare: '50.42%',
              purpose: 'Universal',
              technology: {
                abbreviation: 'ORU',
                name: 'Optimistic Rollup',
              },
            },
          ]}
        />
      </Page>
      <Tooltip />
    </>
  )
}
