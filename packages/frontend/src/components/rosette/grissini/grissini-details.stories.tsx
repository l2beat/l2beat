import type { Meta, StoryObj } from '@storybook/react'
import { GrissiniDetails } from './grissini-details'

const meta = {
  title: 'Components/GrissiniDetails',
  component: GrissiniDetails,
} satisfies Meta<typeof GrissiniDetails>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    values: [
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
