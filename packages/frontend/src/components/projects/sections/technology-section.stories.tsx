import type { Meta, StoryObj } from '@storybook/react'
import { TechnologySection } from './technology-section'

const meta = {
  title: 'Components/Projects/Sections/Technology',
  component: TechnologySection,
  args: {
    id: 'technology',
    title: 'Technology',
    sectionOrder: '1',
    items: [
      {
        id: 'foo',
        name: 'Some aspect of technology',
        description:
          'Ultimately, Optimism will use interactive fraud proofs to enforce state correctness. This feature is currently in development and the system permits invalid state roots.',
        risks: [
          {
            isCritical: true,
            text: 'Funds can be stolen if an invalid state root is submitted to the system.',
          },
        ],
        references: [
          {
            title: 'Introducing EVM Equivalence',
            url: '#',
          },
        ],
        isIncomplete: false,
        isUnderReview: false,
        isUnderReviewHidden: false,
      },
      {
        id: 'bar',
        name: 'Other considerations',
        description:
          "Sometimes I truly don't know what do I want to write inside descriptions like these.",
        risks: [],
        references: [],
        isIncomplete: true,
        isUnderReview: false,
        isUnderReviewHidden: false,
      },
      {
        id: 'bar',
        name: 'Other considerations under review',
        description: 'Sometimes the section is under review',
        risks: [],
        references: [],
        isIncomplete: false,
        isUnderReview: true,
        isUnderReviewHidden: false,
      },
    ],
  },
} satisfies Meta<typeof TechnologySection>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
