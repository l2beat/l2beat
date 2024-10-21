import { type Meta, type StoryObj } from '@storybook/react'
import { GrisiniDetails } from './grisini-details'

const meta = {
  title: 'Components/GrisiniDetails',
  component: GrisiniDetails,
} satisfies Meta<typeof GrisiniDetails>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: [
      {
        name: 'Economic security',
        sentiment: 'good',
        value: 'Staked assets',
        description: undefined,
        warning: undefined,
      },
      {
        name: 'Fraud detection',
        sentiment: 'warning',
        value: 'DAS with no reconstruction',
        description: undefined,
        warning: undefined,
      },
    ],
  },
}
