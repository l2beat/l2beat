import { Meta, StoryObj } from '@storybook/react'

import { StageBadge } from './StageBadge'

const meta: Meta<typeof StageBadge> = {
  component: StageBadge,
}
export default meta
type Story = StoryObj<typeof StageBadge>

export const Badge: Story = {
  args: {
    stage: 'Stage 0',
    big: false,
  },
  argTypes: {
    stage: {
      control: 'radio',
      options: ['Stage 0', 'Stage 1', 'Stage 2', undefined],
    },
    big: {
      control: 'radio',
      options: [true, false],
    },
    oneSize: {
      control: 'radio',
      options: [true, false],
    },
  },
}
