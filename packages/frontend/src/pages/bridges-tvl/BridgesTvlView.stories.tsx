import { Meta, StoryObj } from '@storybook/react'
import React, { useEffect } from 'react'

import { PageContent } from '../../components/PageContent'
import { Tooltip } from '../../components/Tooltip'
import { configureTabs } from '../../scripts/configureTabs'
import { configureTooltips } from '../../scripts/configureTooltips'
import { formatLargeNumber } from '../../utils'
import { click } from '../../utils/storybook/click'
import { BridgesTvlView } from './BridgesTvlView'
import { BridgesTvlViewEntry } from './types'

const meta = {
  title: 'Pages/Bridges/TvlView',
} satisfies Meta<typeof BridgesTvlView>
export default meta

type Story = StoryObj<typeof BridgesTvlView>

const items: BridgesTvlViewEntry[] = [
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
    type: 'bridge',
    name: 'Sollet',
    slug: 'sollet',
    warning:
      'Sollet Bridge becomes deprecated on Oct 31, 2022. Users are encouraged to use Wormhole instead.',
    isArchived: true,
    isVerified: true,
    tvl: '$2.41 K',
    tvlBreakdown: {
      empty: false,
      associated: 0.000004132880369644821,
      ether: 0.9764715120556121,
      stable: 0.02247460345012853,
      other: 0.0010497516138897843,
      label:
        'SRM – 0.00%<br>Ether – 97.65%<br>Stablecoins – 2.25%<br>Other – 0.10%',
      warning: undefined,
      warningSeverity: 'warning',
    },
    oneDayChange: '-0.20%',
    sevenDayChange: '-1.33%',
    bridgesMarketShare: '0.00%',
    combinedMarketShare: '0.00%',
    validatedBy: {
      value: 'Third Party',
      description: 'Withdrawals need to be signed by an EOA account.',
      sentiment: 'bad',
    },
    category: 'Token Bridge',
  },
]

function Template() {
  useEffect(() => {
    configureTooltips()
    configureTabs()
  }, [])
  return (
    <>
      <PageContent>
        <BridgesTvlView items={items} />
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

export const Archived: Story = {
  render: () => {
    useEffect(() => {
      click('.TabNavigationTab#archived')
    }, [])
    return <Template />
  },
}
