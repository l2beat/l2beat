import { Story } from '@storybook/react'
import React, { useEffect } from 'react'

import { configureCharts } from '../../scripts/charts'
import { TokenControl } from '../chart/TokenControls'
import { PageContent } from '../PageContent'
import { ChartSection as ChartSectionComponent } from './ChartSection'

export default {
  title: 'Components/Project/ChartSection',
}

interface TemplateProps {
  tokenCount: number
  hasActivity?: boolean
  type?: 'activity' | 'tvl'
  isUpcoming?: boolean
}

function Template({
  tokenCount,
  hasActivity,
  type,
  isUpcoming,
}: TemplateProps) {
  const tokens: TokenControl[] = [
    'DAI',
    'ETH',
    'COMP',
    'WBTC',
    'USDT',
    'USDC',
    'AAVE',
    'YFI',
    'UNI',
  ].map((x) => ({
    address: '0xabac',
    name: x,
    info: {
      type: 'EBV',
      assetId: '0xabac',
      chainId: 12,
      projectId: 'arbitrum',
      symbol: x,
    },
    iconUrl:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
  }))

  useEffect(() => {
    configureCharts()
  }, [])

  return (
    <PageContent>
      <ChartSectionComponent
        id="chart"
        title="Chart"
        settingsId="storybook"
        tokens={tokens.slice(0, tokenCount)}
        hasActivity={hasActivity}
        initialType={
          type === 'tvl'
            ? { type: 'storybook-fake-tvl' }
            : { type: 'storybook-fake-activity' }
        }
        isUpcoming={isUpcoming}
      />
    </PageContent>
  )
}

export const WithoutActivity: Story<TemplateProps> = Template.bind({})
WithoutActivity.args = {
  hasActivity: false,
}

export const WithActivity: Story<TemplateProps> = Template.bind({})
WithActivity.args = {
  hasActivity: true,
}
