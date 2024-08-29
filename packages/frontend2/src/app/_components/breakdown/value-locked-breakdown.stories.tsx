import { type Meta, type StoryObj } from '@storybook/react'
import { ValueLockedBreakdown } from './value-locked-breakdown'

const meta = {
  title: 'Components/Breakdown',
  component: ValueLockedBreakdown,
} satisfies Meta<typeof ValueLockedBreakdown>
export default meta

type Story = StoryObj<typeof meta>

export const ValueLocked: Story = {
  args: {
    canonical: 100,
    external: 20,
    native: 25,
  },
}
