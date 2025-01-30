import type { Meta, StoryObj } from '@storybook/react'
import { GrissiniIcon } from './grissini-icon'

const meta = {
  title: 'Components/GrissiniIcon',
  component: GrissiniIcon,
} satisfies Meta<typeof GrissiniIcon>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    values: [
      {
        name: '',
        sentiment: 'good',
        value: '',
        description: undefined,
        warning: undefined,
      },
      {
        name: '',
        sentiment: 'good',
        value: '',
        description: undefined,
        warning: undefined,
      },
      {
        name: '',
        sentiment: 'good',
        value: '',
        description: undefined,
        warning: undefined,
      },
    ],
  },
}

export const Colors: Story = {
  args: {
    values: [
      {
        name: '',
        sentiment: 'good',
        value: '',
        description: undefined,
        warning: undefined,
      },
      {
        name: '',
        sentiment: 'warning',
        value: '',
        description: undefined,
        warning: undefined,
      },
      {
        name: '',
        sentiment: 'neutral',
        value: '',
        description: undefined,
        warning: undefined,
      },
      {
        name: '',
        sentiment: 'bad',
        value: '',
        description: undefined,
        warning: undefined,
      },
    ],
  },
}

export const Italian: Story = {
  args: {
    values: [
      {
        name: '',
        sentiment: 'good',
        value: '',
        description: undefined,
        warning: undefined,
      },
      {
        name: '',
        sentiment: 'neutral',
        value: '',
        description: undefined,
        warning: undefined,
      },
      {
        name: '',
        sentiment: 'bad',
        value: '',
        description: undefined,
        warning: undefined,
      },
    ],
  },
}

export const NoBridge: Story = {
  args: {
    values: [
      {
        name: '',
        sentiment: 'good',
        value: '',
        description: undefined,
        warning: undefined,
      },
      {
        name: '',
        sentiment: 'good',
        value: '',
        description: undefined,
        warning: undefined,
      },
      {
        name: '',
        sentiment: 'good',
        value: '',
        description: undefined,
        warning: undefined,
      },
    ],
    hasNoBridge: true,
  },
}
