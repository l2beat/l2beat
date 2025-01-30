import { type Meta, type StoryObj } from '@storybook/react'
import { StageTooltip } from './stage-tooltip'

const meta = {
  title: 'Components/Tooltip/Stage',
  component: StageTooltip,
} satisfies Meta<typeof StageTooltip>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    stageConfig: {
      stage: 'Stage 1',
      missing: {
        nextStage: 'Stage 2',
        requirements: ['A requirement'],
      },
      message: undefined,
      summary: [],
    },
    isAppchain: false,
  },
}

export const Appchain: Story = {
  args: {
    stageConfig: {
      stage: 'Stage 1',
      missing: {
        nextStage: 'Stage 2',
        requirements: ['A requirement'],
      },
      message: undefined,
      summary: [],
    },
    isAppchain: true,
  },
}

export const WithWarning: Story = {
  args: {
    stageConfig: {
      stage: 'Stage 0',
      missing: {
        nextStage: 'Stage 1',
        requirements: ['A requirement'],
      },
      message: {
        type: 'warning',
        text: 'Warning text',
      },
      summary: [],
    },
    isAppchain: false,
  },
}

export const WithUnderReview: Story = {
  args: {
    stageConfig: {
      stage: 'Stage 0',
      missing: {
        nextStage: 'Stage 1',
        requirements: ['A requirement'],
      },
      message: {
        type: 'underReview',
        text: 'Under review text',
      },
      summary: [],
    },
    isAppchain: false,
  },
}
