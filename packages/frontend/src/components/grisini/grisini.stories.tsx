import { type Meta, type StoryObj } from '@storybook/react'
import { Grisini } from './grisini'

const meta = {
  title: 'Components/Grisini',
  component: Grisini,
} satisfies Meta<typeof Grisini>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: [
      { sentiment: 'good' },
      { sentiment: 'good' },
      { sentiment: 'good' },
    ],
  },
}

export const Colors: Story = {
  args: {
    items: [
      { sentiment: 'good' },
      { sentiment: 'warning' },
      { sentiment: 'neutral' },
      { sentiment: 'bad' },
    ],
  },
}

export const Italian: Story = {
  args: {
    items: [
      { sentiment: 'good' },
      { sentiment: 'neutral' },
      { sentiment: 'bad' },
    ],
  },
}
