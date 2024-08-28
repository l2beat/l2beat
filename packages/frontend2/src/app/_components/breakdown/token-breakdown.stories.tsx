import { type Meta, type StoryObj } from '@storybook/react'
import { TokenBreakdown } from './token-breakdown'

const meta = {
  component: TokenBreakdown,
} satisfies Meta<typeof TokenBreakdown>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    total: 100,
    associated: 20,
    ether: 25,
    stablecoin: 45,
  },
}
