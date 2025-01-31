import type { Meta, StoryObj } from '@storybook/react'
import { StageSection } from './stage-section'

const meta = {
  title: 'Components/Projects/Sections/Stage',
  component: StageSection,
  args: {
    title: 'Rollup stage',
    id: 'stage',
    sectionOrder: '1',
    icon: '/icons/arbitrum.png',
    name: 'Arbitrum One',
    type: 'Optimistic Rollup',
  },
} satisfies Meta<typeof StageSection>
export default meta

type Story = StoryObj<typeof StageSection>

export const Primary: Story = {
  args: {
    stageConfig: {
      stage: 'Stage 1',
      message: undefined,
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
    },
  },
}

export const WithWarningIcon: Story = {
  args: {
    stageConfig: {
      stage: 'Stage 0',
      message: {
        type: 'warning',
        text: 'Eu proident velit nostrud veniam. Et aliquip magna deserunt exercitation cillum dolore elit fugiat. Esse mollit aute aliqua Lorem enim fugiat et ipsum. Non ut nulla cillum ipsum pariatur ut aliqua veniam quis dolore excepteur quis excepteur et.x',
      },
      missing: {
        nextStage: 'Stage 1',
        requirements: ['B requirement'],
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
              satisfied: false,
              description: 'AA requirement',
            },
          ],
        },
        {
          stage: 'Stage 1',
          requirements: [
            {
              satisfied: false,
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
    },
  },
}

export const WithUnderReviewIcon: Story = {
  args: {
    stageConfig: {
      stage: 'Stage 0',
      message: {
        type: 'underReview',
        text: 'Eu proident velit nostrud veniam. Et aliquip magna deserunt exercitation cillum dolore elit fugiat. Esse mollit aute aliqua Lorem enim fugiat et ipsum. Non ut nulla cillum ipsum pariatur ut aliqua veniam quis dolore excepteur quis excepteur et.x',
      },
      missing: {
        nextStage: 'Stage 1',
        requirements: ['B requirement'],
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
              satisfied: 'UnderReview',
              description: 'AA requirement',
            },
          ],
        },
        {
          stage: 'Stage 1',
          requirements: [
            {
              satisfied: false,
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
    },
  },
}

export const UnderReview: Story = {
  args: { stageConfig: { stage: 'UnderReview' } },
}
