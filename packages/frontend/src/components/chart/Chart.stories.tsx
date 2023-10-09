import { Story } from '@storybook/react'
import React, { useEffect } from 'react'

import { configureCharts } from '../../scripts/charts'
import { PageContent } from '../PageContent'
import { Chart as ChartComponent } from './Chart'
import { TokenControl } from './TokenControls'

export default {
  title: 'Components/Chart',
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
      <ChartComponent
        settingsId="storybook"
        tokens={tokens.slice(0, tokenCount)}
        hasActivity={hasActivity}
        initialType={
          type === 'tvl'
            ? { type: 'storybook-fake-tvl' }
            : { type: 'storybook-fake-activity' }
        }
        isUpcoming={isUpcoming}
        tvlBreakdownHref="/"
      />
    </PageContent>
  )
}

export const NoTokens: Story<TemplateProps> = Template.bind({})
NoTokens.args = {
  tokenCount: 0,
}

export const FewTokens: Story<TemplateProps> = Template.bind({})
FewTokens.args = {
  tokenCount: 3,
}

export const ManyTokens: Story<TemplateProps> = Template.bind({})
ManyTokens.args = {
  tokenCount: 10,
}

export const WithActivity: Story<TemplateProps> = Template.bind({})
WithActivity.args = {
  tokenCount: 0,
  hasActivity: true,
  type: 'activity',
}

export const UpcomingChart: Story<TemplateProps> = Template.bind({})
UpcomingChart.args = {
  isUpcoming: true,
}
