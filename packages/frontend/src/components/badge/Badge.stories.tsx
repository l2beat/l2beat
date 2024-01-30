import { Meta, StoryObj } from '@storybook/react'

import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  component: Badge,
  args: {
    children: 'Badge',
  },
}
export default meta
type Story = StoryObj<typeof Badge>

export const Error: Story = {
  args: {
    type: 'error',
  },
}

export const Warning: Story = {
  args: {
    type: 'warning',
  },
}

export const BrightYellow: Story = {
  args: {
    type: 'brightYellow',
  },
}

export const Purple: Story = {
  args: {
    type: 'purple',
  },
}

export const Gray: Story = {
  args: {
    type: 'gray',
  },
}
