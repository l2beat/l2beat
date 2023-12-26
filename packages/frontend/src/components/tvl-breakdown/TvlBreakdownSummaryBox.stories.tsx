import { Meta, StoryObj } from '@storybook/react'

import { TvlBreakdownSummaryBox as TvlBreakdownSummaryBoxComponent } from './TvlBreakdownSummaryBox'

const meta: Meta<typeof TvlBreakdownSummaryBoxComponent> = {
  component: TvlBreakdownSummaryBoxComponent,
}
export default meta
type Story = StoryObj<typeof TvlBreakdownSummaryBoxComponent>

const MOCK_DATA = {
  tvl: {
    value: '$5.47 B',
    change: '+ 2.9%',
  },
  canonical: {
    value: '$2.99 B',
    change: '+ 2.38%',
  },
  external: {
    value: '$2.2 B',
    change: '- 11.14%',
  },
  native: {
    value: '$280 M',
    change: '+ 12.49%',
  },
}

export const Description: Story = {
  args: {
    ...MOCK_DATA,
  },
}
