import type { Meta, StoryObj } from '@storybook/react'
import { TokenBreakdown } from './token-breakdown'

const meta = {
  title: 'Components/Breakdown',
  component: TokenBreakdown,
} satisfies Meta<typeof TokenBreakdown>
export default meta

type Story = StoryObj<typeof meta>

export const Token: Story = {
  args: {
    total: 100,
    associated: 20,
    ether: 25,
    stablecoin: 45,
  },
}
