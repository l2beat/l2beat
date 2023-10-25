import { StageConfig } from '@l2beat/config'
import { Meta, StoryObj } from '@storybook/react'

import { StageSection as StageSectionComponent } from './StageSection'

const meta: Meta<typeof StageSectionComponent> = {
  component: StageSectionComponent,
  args: {
    title: 'Rollup stage',
    id: 'stage',
    icon: '/icons/arbitrum.png',
    name: 'Arbitrum One',
    type: 'Optimistic Rollup',
  },
}
export default meta
type Story = StoryObj<typeof StageSectionComponent>

const item: StageConfig = {
  stage: 'Stage 1',
  missing: {
    nextStage: 'Stage 2',
    requirements: ['C requirement'],
  },
  summary: [
    {
      stage: 'Stage 0',
      requirements: [
        {
          satisfied: true,
          description: 'A requirement',
        },
        {
          satisfied: true,
          description: 'AA requirement',
        },
      ],
    },
    {
      stage: 'Stage 1',
      requirements: [
        {
          satisfied: true,
          description: 'B requirement',
        },
        {
          satisfied: true,
          description: 'BB requirement',
        },
      ],
    },
    {
      stage: 'Stage 2',
      requirements: [
        {
          satisfied: false,
          description: 'C requirement',
        },
      ],
    },
  ],
}

export const StageSection: Story = {
  args: {
    stage: item,
  },
}

export const StageSectionUnderReview: Story = {
  args: { stage: { stage: 'UnderReview' } },
}
