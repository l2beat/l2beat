import { type Meta, type StoryObj } from '@storybook/react'
import { onlyDesktopModes } from '~/../.storybook/modes'
import { StageBadge } from './stage-badge'

const meta = {
  title: 'UI/Atoms/Badge/Stage',
  component: StageBadge,
  args: {
    stage: 'Stage 0',
    big: false,
  },
  parameters: {
    chromatic: {
      modes: onlyDesktopModes,
    },
  },
} satisfies Meta<typeof StageBadge>
export default meta

type Story = StoryObj<typeof meta>

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
