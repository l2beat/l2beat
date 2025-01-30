import type { Meta, StoryObj } from '@storybook/react'

import { TvsBreakdownSummaryBox as TvsBreakdownSummaryBoxComponent } from './tvs-breakdown-summary-box'

const meta: Meta<typeof TvsBreakdownSummaryBoxComponent> = {
  title: 'Components/Tvs Breakdown Summary Box',
  component: TvsBreakdownSummaryBoxComponent,
}
export default meta
type Story = StoryObj<typeof TvsBreakdownSummaryBoxComponent>

export const Default: Story = {
  args: {
    total: {
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
  },
}
