import { formatLargeNumber } from '@l2beat/shared'
import React, { useEffect } from 'react'

import { PageContent } from '../../../components/PageContent'
import { Tooltip } from '../../../components/Tooltip'
import { configureFilters } from '../../../scripts/configureFilters'
import { configureTooltips } from '../../../scripts/configureTooltips'
import { ScalingTvlView } from './ScalingTvlView'

export default {
  title: 'Pages/Scaling/TvlView',
}

export function TvlView() {
  useEffect(() => {
    configureTooltips()
    configureFilters()
  }, [])
  return (
    <>
      <PageContent>
        <ScalingTvlView
          maturityEnabled={true}
          items={[
            {
              name: 'Forktimism',
              provider: 'Optimism',
              slug: 'optimism',
              riskValues: {
                stateValidation: {
                  value: 'Fraud proofs',
                  sentiment: undefined,
                },
                validatorFailure: {
                  value: 'No mechanism',
                  sentiment: 'bad',
                },
                upgradeability: {
                  value: 'Yes',
                  sentiment: 'bad',
                },
                sequencerFailure: {
                  value: 'Transact using L1',
                  sentiment: undefined,
                },
                dataAvailability: {
                  value: 'Optimistic',
                  sentiment: 'warning',
                },
              },
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
              maturityEntry: {
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
              riskValues: {
                stateValidation: {
                  value: 'Fraud proofs',
                  sentiment: undefined,
                },
                validatorFailure: {
                  value: 'No mechanism',
                  sentiment: 'bad',
                },
                upgradeability: {
                  value: 'Yes',
                  sentiment: 'bad',
                },
                sequencerFailure: {
                  value: 'Transact using L1',
                  sentiment: undefined,
                },
                dataAvailability: {
                  value: 'Optimistic',
                  sentiment: 'warning',
                },
              },
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
              riskValues: {
                stateValidation: {
                  value: 'Fraud proofs',
                  sentiment: undefined,
                },
                validatorFailure: {
                  value: 'No mechanism',
                  sentiment: 'bad',
                },
                upgradeability: {
                  value: 'Yes',
                  sentiment: 'bad',
                },
                sequencerFailure: {
                  value: 'Transact using L1',
                  sentiment: undefined,
                },
                dataAvailability: {
                  value: 'Optimistic',
                  sentiment: 'warning',
                },
              },
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
              riskValues: {
                stateValidation: {
                  value: 'Fraud proofs',
                  sentiment: undefined,
                },
                validatorFailure: {
                  value: 'No mechanism',
                  sentiment: 'bad',
                },
                upgradeability: {
                  value: 'Yes',
                  sentiment: 'bad',
                },
                sequencerFailure: {
                  value: 'Transact using L1',
                  sentiment: undefined,
                },
                dataAvailability: {
                  value: 'Optimistic',
                  sentiment: 'warning',
                },
              },
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
              name: 'zk.archived',
              provider: 'StarkEx',
              slug: 'layer2financezk',
              tvl: formatLargeNumber(2_740_000_000),
              riskValues: {
                stateValidation: {
                  value: 'Fraud proofs',
                  sentiment: undefined,
                },
                validatorFailure: {
                  value: 'No mechanism',
                  sentiment: 'bad',
                },
                upgradeability: {
                  value: 'Yes',
                  sentiment: 'bad',
                },
                sequencerFailure: {
                  value: 'Transact using L1',
                  sentiment: undefined,
                },
                dataAvailability: {
                  value: 'Optimistic',
                  sentiment: 'warning',
                },
              },
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
