import React, { useEffect } from 'react'

import { PageContent } from '../../components/PageContent'
import { Tooltip } from '../../components/Tooltip'
import { configureFilters } from '../../scripts/configureFilters'
import { configureTooltips } from '../../scripts/configureTooltips'
import { formatLargeNumber } from '../../utils'
import { BridgesTvlView } from '../bridges-tvl/BridgesTvlView'

export default {
  title: 'Pages/Bridges/TvlView',
}

export function TvlView() {
  useEffect(() => {
    configureTooltips()
    configureFilters()
  }, [])
  return (
    <>
      <PageContent>
        <BridgesTvlView
          items={[
            {
              name: 'Octagon',
              type: 'bridge',
              slug: 'polygon-pos',
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
              isVerified: true,
              bridgesMarketShare: '50.42%',
              combinedMarketShare: '20.89%',
              validatedBy: {
                value: 'Destination chain',
                description:
                  'Transfers need to be confirmed by 2/3 of Octagon PoS Validators stake.',
                sentiment: 'warning',
              },
              category: 'Token Bridge',
            },
            {
              name: 'Arbitrage',
              type: 'layer2',
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
              bridgesMarketShare: '0',
              combinedMarketShare: '20.89%',
              category: 'Optimistic Rollup',
            },
            {
              name: 'InsectHole',
              category: 'Token Bridge',
              type: 'bridge',
              slug: 'wormholev1',
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
              bridgesMarketShare: '50.42%',
              combinedMarketShare: '20.89%',
              isArchived: true,
              isVerified: false,
              validatedBy: {
                value: 'Third party',
                description: 'Random description',
                sentiment: 'bad',
              },
            },
            {
              name: 'zk.archived',
              type: 'layer2',
              slug: 'layer2financezk',
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
              bridgesMarketShare: '50.42%',
              combinedMarketShare: '20.89%',
              category: 'Optimistic Rollup',
              isArchived: true,
              isVerified: true,
            },
          ]}
        />
      </PageContent>
      <Tooltip />
    </>
  )
}
