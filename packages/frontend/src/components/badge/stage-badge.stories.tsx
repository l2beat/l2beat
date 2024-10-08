import { type Meta, type StoryObj } from '@storybook/react'
import { StageBadge } from './stage-badge'
import { onlyDesktopModes } from '.storybook/modes'

const meta = {
  title: 'Atoms/Badge',
  component: StageBadge,
  parameters: {
    chromatic: {
      modes: onlyDesktopModes,
    },
  },
} satisfies Meta<typeof StageBadge>
export default meta

type Story = StoryObj<typeof StageBadge>

export const Stages: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <StageBadge stage="Stage 0" />
      <StageBadge stage="Stage 1" />
      <StageBadge stage="Stage 2" />
      <StageBadge stage="UnderReview" />
      <StageBadge stage="NotApplicable" />
    </div>
  ),
}
