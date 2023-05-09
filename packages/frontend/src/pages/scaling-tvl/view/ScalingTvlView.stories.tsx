import React, { useEffect } from 'react'

import { Meta, StoryObj } from '@storybook/react'
import { PageContent } from '../../../components/PageContent'
import { Tooltip } from '../../../components/Tooltip'
import { configureTabNavigations } from '../../../scripts/configureTabNavigations'
import { configureTooltips } from '../../../scripts/configureTooltips'
import { formatLargeNumber } from '../../../utils'
import { click } from '../../../utils/storybook/click'
import { ScalingTvlView, ScalingTvlViewEntry } from './ScalingTvlView'

const meta = {
  title: 'Pages/Scaling/TvlView',
  component: ScalingTvlView,
} satisfies Meta<typeof ScalingTvlView>
export default meta

type Story = StoryObj<typeof ScalingTvlView>

const items: ScalingTvlViewEntry[] = [
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
]

function Template() {
  useEffect(() => {
    configureTooltips()
    configureTabNavigations()
  }, [])
  return (
    <>
      <PageContent>
        <ScalingTvlView maturityEnabled={true} items={items} />
      </PageContent>
      <Tooltip />
    </>
  )
}

export const Active: Story = {
  render: () => {
    useEffect(() => {
      click('.TabNavigationTab#active')
    }, [])
    return <Template />
  },
}

export const Upcoming: Story = {
  render: () => {
    useEffect(() => {
      click('.TabNavigationTab#upcoming')
    }, [])
    return <Template />
  },
}
export const Archived: Story = {
  render: () => {
    useEffect(() => {
      click('.TabNavigationTab#archived')
    }, [])
    return <Template />
  },
}
