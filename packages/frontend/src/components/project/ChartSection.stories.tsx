import { Story } from '@storybook/react'
import React, { useEffect } from 'react'

import { configureCharts } from '../chart/configure'
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
  const tokens = [
    'DAI',
    'ETH',
    'COMP',
    'WBTC',
    'USDT',
    'USDC',
    'AAVE',
    'YFI',
    'UNI',
  ].map((x) => ({ symbol: x, tvlEndpoint: '/' }))

  useEffect(() => {
    configureCharts()
  }, [])

  const activityEndpoint = hasActivity ? '/fakeActivity.json' : undefined

  return (
    <PageContent>
      <ChartSectionComponent
        id="chart"
        title="Chart"
        tvlEndpoint="/fakeTvl.json"
        activityEndpoint={activityEndpoint}
        tokens={tokens.slice(0, tokenCount)}
        hasActivity={hasActivity}
        type={type}
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
