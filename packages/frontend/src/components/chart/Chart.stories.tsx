import { Story } from '@storybook/react'
import React, { useEffect } from 'react'

import { PageContent } from '../PageContent'
import { Chart as ChartComponent } from './Chart'
import { configureChart } from './configure'

export default {
  title: 'Components/Chart',
}

interface TemplateProps {
  tokenCount: number
}

function Template({ tokenCount }: TemplateProps) {
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
  ].map((x) => ({ symbol: x, endpoint: '/' }))

  useEffect(() => {
    configureChart()
  }, [])

  return (
    <PageContent>
      <ChartComponent
        endpoint="/fakeTvl.json"
        tokens={tokens.slice(0, tokenCount)}
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
