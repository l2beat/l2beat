import type { Meta, StoryObj } from '@storybook/react'
import { ValueSecuredBreakdown } from './value-secured-breakdown'

const meta = {
  title: 'Components/Breakdown',
  component: ValueSecuredBreakdown,
} satisfies Meta<typeof ValueSecuredBreakdown>
export default meta

type Story = StoryObj<typeof meta>

export const ValueSecured: Story = {
  args: {
    canonical: 100,
    external: 20,
    native: 25,
  },
}
