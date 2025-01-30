import type { Meta, StoryObj } from '@storybook/react'
import { CostsBreakdown } from './costs-breakdown'

const meta = {
  title: 'Components/Breakdown',
  component: CostsBreakdown,
} satisfies Meta<typeof CostsBreakdown>
export default meta

type Story = StoryObj<typeof meta>

export const Costs: Story = {
  args: {
    blobs: 10,
    calldata: 20,
    compute: 25,
    overhead: 45,
  },
}
