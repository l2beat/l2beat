import { type Meta, type StoryObj } from '@storybook/react'

import { TvlBreakdownSummaryBox as TvlBreakdownSummaryBoxComponent } from './tvl-breakdown-summary-box'

const meta: Meta<typeof TvlBreakdownSummaryBoxComponent> = {
  component: TvlBreakdownSummaryBoxComponent,
}
export default meta
type Story = StoryObj<typeof TvlBreakdownSummaryBoxComponent>

const MOCK_DATA = {
  tvl: {
    value: 5470000000,
    change: 0.029,
  },
  canonical: {
    value: 2990000000,
    change: 0.0238,
  },
  external: {
    value: 2200000000,
    change: -0.1114,
  },
  native: {
    value: 280000000,
    change: 0.1249,
  },
}

export const Description: Story = {
  args: {
    ...MOCK_DATA,
  },
}
