import { type Meta, type StoryObj } from '@storybook/react'
import { ValueLockedBreakdown } from './value-locked-breakdown'

const meta = {
  title: 'UI/Misc/Breakdown/Value Locked',
  component: ValueLockedBreakdown,
} satisfies Meta<typeof ValueLockedBreakdown>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    canonical: 100,
    external: 20,
    native: 25,
  },
}
