import React, { useEffect } from 'react'

import { PageContent } from '../../../components/PageContent'
import { Tooltip } from '../../../components/Tooltip'
import { configureTooltips } from '../../../scripts/configureTooltips'
import { formatLargeNumber } from '../../../utils'
import { ScalingTvlView } from './ScalingTvlView'

export default {
  title: 'Pages/Scaling/TvlView',
}

export function TvlView() {
  useEffect(() => {
    configureTooltips()
  }, [])
  return (
    <>
      <PageContent>
        <ScalingTvlView
          ratingEnabled={true}
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
              technology: 'Optimistic Rollup',
              isVerified: false,
              ratingEntry: {
                category: {
                  score: 'B',
                  requirements: ['There is an existing fraud proof system'],
                },
                modifier: {
                  score: '-',
                  items: ['Validators are behind a whitelist'],
                },
                thingsToImprove: {
                  improvedScore: 'A',
                  requirements: ['There should be no instant upgradeability'],
                },
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
              technology: 'Optimistic Rollup',
              isVerified: true,
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
              technology: 'Optimistic Rollup',
              isVerified: false,
            },
            {
              name: 'zk.download',
              provider: 'zkSync',
              slug: 'zksync-lite',
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
              technology: 'Optimistic Rollup',
              isVerified: true,
            },
          ]}
        />
      </PageContent>
      <Tooltip />
    </>
  )
}
