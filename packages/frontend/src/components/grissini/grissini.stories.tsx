import { type Meta, type StoryObj } from '@storybook/react'
import { Grissini } from './grissini'

const meta = {
  title: 'Components/Grissini',
  component: Grissini,
} satisfies Meta<typeof Grissini>
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
