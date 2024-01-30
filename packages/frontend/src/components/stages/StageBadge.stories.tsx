import { Meta, StoryObj } from '@storybook/react'

import { onlyDesktopModes } from '../../../.storybook/modes'
import { StageBadge } from './StageBadge'

const meta: Meta<typeof StageBadge> = {
  component: StageBadge,
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
  parameters: {
    chromatic: {
      modes: onlyDesktopModes,
    },
  },
}
export default meta
type Story = StoryObj<typeof StageBadge>

export const Stage0: Story = {}
export const Stage1: Story = {
  args: {
    stage: 'Stage 1',
  },
}
export const Stage2: Story = {
  args: {
    stage: 'Stage 2',
  },
}
export const WithWarningIcon: Story = {
  args: {
    icon: 'warning',
  },
}

export const WithUnderReviewIcon: Story = {
  args: {
    icon: 'underReview',
  },
}
