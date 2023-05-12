import { Meta, StoryObj } from '@storybook/react'
import React, { useEffect } from 'react'

import { PageContent } from '../../../components/PageContent'
import { Tooltip } from '../../../components/Tooltip'
import { configureTabs } from '../../../scripts/configureTabs'
import { configureTooltips } from '../../../scripts/configureTooltips'
import { formatLargeNumber } from '../../../utils'
import { click } from '../../../utils/storybook/click'
import { ScalingTvlView } from './ScalingTvlView'

const meta = {
  title: 'Pages/Scaling/TvlView',
  component: ScalingTvlView,
  args: {
    items: [
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
      {
        name: 'zk.archived.unverfied',
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
        isVerified: false,
      },
      {
        name: 'zk.upcoming',
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
        isUpcoming: true,
        isVerified: true,
      },
    ],
  },
  decorators: [
    (Story) => (
      <>
        <PageContent>
          <Story />
        </PageContent>
        <Tooltip />
      </>
    ),
  ],
} satisfies Meta<typeof ScalingTvlView>
export default meta

type Story = StoryObj<typeof ScalingTvlView>

export const Active: Story = {
  decorators: [
    (Story) => {
      useEffect(() => {
        configureTooltips()
        configureTabs()
        click('.TabsItem#active')
      }, [])
      return <Story />
    },
  ],
}

export const Upcoming: Story = {
  decorators: [
    (Story) => {
      useEffect(() => {
        configureTooltips()
        configureTabs()
        click('.TabsItem#upcoming')
      }, [])
      return <Story />
    },
  ],
}

export const Archived: Story = {
  decorators: [
    (Story) => {
      useEffect(() => {
        configureTooltips()
        configureTabs()
        click('.TabsItem#archived')
      }, [])
      return <Story />
    },
  ],
}
