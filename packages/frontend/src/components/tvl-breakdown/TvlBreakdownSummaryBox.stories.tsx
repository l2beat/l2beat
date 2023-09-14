import { Story } from '@storybook/react'
import React from 'react'

import { TvlBreakdownViewProps } from '../../pages/scaling-projects-tvl-breakdown/props/getTvlBreakdownView'
import { TvlBreakdownSummaryBox as TvlBreakdownSummaryBoxComponent } from './TvlBreakdownSummaryBox'

export default {
  title: 'Components/TVL Breakdown/TvlBreakdownSummaryBox',
}

const MOCK_DATA = {
  tvl: {
    value: '$5.47 B',
    change: '+ 2.9%',
  },
  cb: {
    value: '$2.99 B',
    change: '+ 2.38%',
  },
  eb: {
    value: '$2.2 B',
    change: '- 11.14%',
  },
  ntm: {
    value: '$280 M',
    change: '+ 12.49%',
  },
}

function Template(props: TvlBreakdownViewProps['tvlBreakdownSummary']) {
  return (
    <div className="p-4 leading-normal">
      <TvlBreakdownSummaryBoxComponent {...props} />
    </div>
  )
}

export const Description: Story<TvlBreakdownViewProps['tvlBreakdownSummary']> =
  Template.bind({})
Description.args = {
  ...MOCK_DATA,
}
