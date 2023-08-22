import { Story } from '@storybook/react'
import React from 'react'
import {
  SummaryBox as SummaryBoxComponent,
  SummaryBoxProps,
} from './SummaryBox'

export default {
  title: 'Components/TVL Breakdown/SummaryBox',
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

function Template(props: SummaryBoxProps) {
  return (
    <div className="p-4 leading-normal">
      <SummaryBoxComponent {...props} />
    </div>
  )
}

export const Description: Story<SummaryBoxProps> = Template.bind({})
Description.args = {
  ...MOCK_DATA,
}
