import { type Meta, type StoryObj } from '@storybook/react'
import { onlyDesktopModes } from '~/../.storybook/modes'
import { StageBadge } from './stage-badge'

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
      <StageBadge stage="Stage 0" isAppchain={false} />
      <StageBadge stage="Stage 1" isAppchain={false} />
      <StageBadge stage="Stage 2" isAppchain={false} />
      <StageBadge stage="UnderReview" isAppchain={false} />
      <StageBadge stage="NotApplicable" isAppchain={false} />
      <StageBadge stage="Stage 0" isAppchain={true} />
      <StageBadge stage="Stage 1" isAppchain={true} />
      <StageBadge stage="Stage 2" isAppchain={true} />
      <StageBadge stage="UnderReview" isAppchain={true} />
      <StageBadge stage="NotApplicable" isAppchain={true} />
    </div>
  ),
}
